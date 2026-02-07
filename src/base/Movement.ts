import { BaseScene } from '@/base/BaseScene';
import { Enemy } from '@/base/Enemy';
import { Obstacle } from '@/base/Obstacle';
import { POSITION_CONFIG, getObstacleCoords } from '@/base/utils';
import { Boss } from '@/controllers/enemies/Boss';
import { ILevel, TMovementParams, TMovementType, TObstacleType } from '@/types';

export class Movement extends BaseScene {
  isMoving: boolean;
  left: number;
  moveDirection: 'right' | 'left';
  moveSpeed: number;

  isJumping: boolean;
  bottom: number;
  jumpDirection: 'up' | 'down';

  level: ILevel;
  score: (value: number) => void;

  width: number;
  height: number;

  type: TMovementType;

  private bottomBaseline: number;
  private initialBottomBaseline: number;
  private dieCallback: (() => void) | undefined;
  private isEnemy: boolean;

  constructor(
    level: ILevel,
    score: (value: number) => void,
    type: TMovementType,
    params: TMovementParams,
    die?: () => void,
  ) {
    super(level.nextLevel);

    this.level = level;
    this.bottom = params.bottom;
    this.isMoving = false;
    this.left = params.left;
    this.isJumping = params.isJumping ?? false;
    this.jumpDirection = params.jumpDirection ?? 'up';
    this.moveDirection = params.moveDirection;
    this.bottomBaseline = params.isJumping ? 0 : params.bottom;
    this.initialBottomBaseline = 0;
    this.score = score;
    this.moveSpeed = params.speed;
    this.width = params.width;
    this.height = params.height;
    this.type = type;
    this.dieCallback = die;
    this.isEnemy = ['bug', 'task'].includes(this.type);
  }

  private getXIntersection(
    obstacle: Obstacle,
    left: number,
    bottom: number,
  ): boolean {
    const isTaskOnHeight =
      this.type === 'task' &&
      this.bottomBaseline !== this.initialBottomBaseline;
    const { top } = POSITION_CONFIG[isTaskOnHeight ? 'taskTop' : this.type];
    const [itemTopLeft, itemTopRight] = top(left, bottom);
    const [_, __, obstBottomRight, obstBottomLeft] =
      getObstacleCoords(obstacle);

    return (
      (itemTopRight[0] >= obstBottomLeft[0] &&
        itemTopLeft[0] <= obstBottomLeft[0]) ||
      (itemTopRight[0] <= obstBottomRight[0] &&
        itemTopLeft[0] >= obstBottomLeft[0]) ||
      (itemTopLeft[0] <= obstBottomRight[0] &&
        itemTopRight[0] >= obstBottomRight[0])
    );
  }

  private getObstaclesUp(left: number, bottom: number) {
    const obstacles = this.level.getObstacles?.() ?? [];

    const { top } = POSITION_CONFIG[this.type];
    const [itemTopLeft, _, __, itemBottomLeft] = top(left, bottom);

    return obstacles
      .filter((obstacle) => {
        const [obstTopLeft, _, obstBottomRight, obstBottomLeft] =
          getObstacleCoords(obstacle);

        const xIntersection = this.getXIntersection(obstacle, left, bottom);
        const yIntersection =
          (itemTopLeft[1] >= obstBottomLeft[1] &&
            itemBottomLeft[1] < obstBottomRight[1]) ||
          (itemTopLeft[1] > obstTopLeft[1] &&
            itemBottomLeft[1] > obstBottomRight[1] &&
            itemBottomLeft[1] < obstTopLeft[1]);

        return yIntersection && xIntersection;
      })
      .sort((a, b) => a.getParams().y - b.getParams().y)[0];
  }

  private getObstaclesDown(left: number, bottom: number) {
    const obstacles = this.level.getObstacles?.() ?? [];
    const { bottom: bottomConfig } = POSITION_CONFIG[this.type];
    const [_, itemTopRight, itemBottomRight, itemBottomLeft] = bottomConfig(
      left,
      bottom,
    );

    return obstacles
      .filter((obstacle) => {
        const [obstTopLeft, obstTopRight] = getObstacleCoords(obstacle);

        const xIntersection = this.getXIntersection(obstacle, left, bottom);
        const yIntersection =
          itemBottomRight[1] < obstTopRight[1] &&
          itemTopRight[1] > obstTopRight[1];

        if (obstacle.getParams().type === 'void' && bottom <= 10) {
          return this.moveDirection === 'right'
            ? itemBottomRight[0] <= obstTopRight[0] &&
                itemBottomLeft[0] >= obstTopLeft[0]
            : itemBottomLeft[0] >= obstTopLeft[0] &&
                itemBottomRight[0] <= obstTopRight[0];
        }

        return yIntersection && xIntersection;
      })
      .sort((a, b) => a.getParams().y - b.getParams().y)[0];
  }

  private checkEndScene() {
    if (this.left > 1150) {
      if (this.type === 'player') {
        const canChange = this.level.changeScene?.(
          'next',
          this.bottom,
          this.isMoving && this.moveDirection === 'right',
        );
        if (canChange) {
          this.left = 0;
        } else {
          this.left = 1140;
        }
      } else {
        this.moveDirection = 'left';
      }
    } else if (this.left < 0) {
      if (this.type === 'player') {
        const progress = this.level.getProgress?.();
        if (
          progress === 'progress' ||
          (progress === 'end' && this.moveDirection === 'left')
        ) {
          const canChange = this.level.changeScene?.('prev');
          if (!canChange) {
            this.left = 0;
            return;
          }
        }
        if (progress === 'start') {
          this.left = 0;
        } else {
          this.left = 1140;
        }
      } else {
        this.moveDirection = 'right';
      }
    }
  }

  private checkBaseline() {
    if (this.bottomBaseline !== this.initialBottomBaseline && !this.isJumping) {
      const obstacles = this.level.getObstacles?.() ?? [];
      const obstacle = obstacles.find((obstacle) => {
        const params = obstacle.getParams();

        const xIntersection = this.getXIntersection(
          obstacle,
          this.left,
          this.bottom,
        );
        const yIntersection = this.bottom === params.y + params.height - 2;

        return yIntersection && xIntersection;
      });
      if (!obstacle) {
        if (this.type === 'task') {
          this.moveDirection =
            this.moveDirection === 'right' ? 'left' : 'right';
        } else {
          this.jumpDirection = 'down';
          this.isJumping = true;
          this.setBottom();
        }
      }
    }
    if (this.isEnemy && this.isJumping) {
      this.setBottom();
    }
  }

  checkLeft() {
    const obstacles = this.level.getObstacles?.() ?? [];
    const { bottom } = POSITION_CONFIG[this.type];
    const [topLeft, topRight, bottomRight, bottomLeft] = bottom(
      this.left,
      this.bottom,
    );
    const obstacle = obstacles.find((obstacle) => {
      const { type } = obstacle.getParams();
      if (
        !type.includes('tube') &&
        !type.includes('void') &&
        type !== 'brick-transparent'
      ) {
        return false;
      }

      const itemPosition = getObstacleCoords(obstacle);

      if (obstacle.getParams().type === 'void' && this.bottomBaseline === 0) {
        return this.moveDirection === 'right'
          ? bottomRight[0] <= itemPosition[1][0] &&
              bottomLeft[0] >= itemPosition[0][0]
          : bottomLeft[0] >= itemPosition[0][0] &&
              bottomRight[0] <= itemPosition[1][0];
      }

      const condition =
        this.moveDirection === 'right'
          ? bottomRight[0] >= itemPosition[3][0] &&
            topRight[0] < itemPosition[1][0]
          : topLeft[0] <= itemPosition[1][0] &&
            topRight[0] > itemPosition[1][0];

      if (
        obstacle.getParams().type === 'brick-transparent' &&
        this.bottomBaseline !== 0
      ) {
        return (
          condition && obstacle.getParams().height > this.bottomBaseline + 5
        );
      }

      return condition;
    });

    if (obstacle) {
      const { type, width, x } = obstacle.getParams();

      if (
        !this.isJumping &&
        this.type === 'player' &&
        type === 'brick-transparent' &&
        this.bottomBaseline !== this.initialBottomBaseline
      ) {
        this.left = this.moveDirection === 'right' ? x - 70 : x + width;
        return;
      }

      if (
        !this.isJumping &&
        this.bottomBaseline === this.initialBottomBaseline
      ) {
        if (type === 'void') {
          if (this.dieCallback) this.dieCallback();
          return;
        }
        this.left = this.moveDirection === 'right' ? x - 70 : x + width;
        if (this.isEnemy) {
          this.moveDirection =
            this.moveDirection === 'right' ? 'left' : 'right';
        }
      }
    }
  }

  setLeft() {
    if (this.moveDirection === 'right') this.left += this.moveSpeed;
    else this.left -= this.moveSpeed;

    this.checkLeft();
    this.checkBaseline();
    this.checkEndScene();
  }

  setBottom(myLevel: 'middle' | 'senior' = 'middle') {
    let bottom = this.bottom;
    let direction = this.jumpDirection;
    let jumping = this.isJumping;

    if (direction === 'up') {
      bottom += 10;
      const intersected = this.getObstaclesUp(this.left, this.bottom);
      let breakpoint = 190 + this.bottomBaseline;
      if (intersected) {
        const params = intersected.getParams();
        breakpoint = params.y - params.height - 65;
      }
      if (bottom > breakpoint) {
        direction = 'down';
        intersected?.destroy?.(myLevel, this.score);
        if (intersected?.getState() === 'destroyed') {
          this.checkEnemies(intersected);
        }
      }
    }
    if (direction === 'down') {
      bottom = this.type === 'player' ? bottom - 10 : bottom - 8;
      const intersected = this.getObstaclesDown(this.left, this.bottom);
      if (intersected && intersected.getParams().type === 'void') {
        if (this.dieCallback) this.dieCallback();
      }
      let breakpoint = 0;
      if (intersected) {
        const params = intersected.getParams();
        breakpoint = params.y + params.height - 2;
      }
      if (bottom <= breakpoint) {
        direction = 'up';
        bottom = breakpoint;
        jumping = false;
        this.bottomBaseline = breakpoint;
      } else {
        this.bottomBaseline = this.initialBottomBaseline;
      }
    }
    this.bottom = bottom;
    this.jumpDirection = direction;
    this.isJumping = jumping;
  }

  checkEnemies(intersected: Obstacle) {
    const { y } = intersected.getParams();
    const enemies = this.level?.getEnemies?.() ?? [];
    const enemy = enemies.find((item) => {
      if (item instanceof Boss) return false;
      const xIntersection = this.getXIntersection(
        intersected,
        item.left,
        item.bottom,
      );
      const yIntersection = Math.abs(item.bottom) === Math.abs(y) + 43;
      return xIntersection && yIntersection;
    });
    if (enemy) {
      (enemy as Enemy).destroy();
    }
  }
}
