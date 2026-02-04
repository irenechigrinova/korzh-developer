/* eslint-disable @typescript-eslint/no-unused-vars */
import { Movement } from '@/base/Movement';
import { getObstacleCoords } from '@/base/utils';
import { POSITION_CONFIG } from '@/base/utils';
import { ILevel } from '@/types';

export class Fireball extends Movement {
  node: HTMLDivElement | null;
  destroyed: boolean;

  constructor(
    level: ILevel,
    getMyLevel: () => 'middle' | 'senior',
    score: (num: number) => void,
    initialLeft: number,
    initialBottom: number,
    direction: 'left' | 'right',
  ) {
    super(level, score, 'fireball', {
      bottom: initialBottom,
      height: 30,
      left: direction === 'right' ? initialLeft + 80 : initialLeft - 10,
      moveDirection: direction,
      speed: 2,
      width: 30,
    });
    this.node = null;
    this.destroyed = false;
  }

  private setStyles() {
    if (!this.node) return;
    this.node.style.transform = `translate(${this.left}px, ${-this.bottom}px)`;
  }

  destroy() {
    this.destroyed = true;
    this.node?.remove();
  }

  checkLeft() {
    if (this.left > 1200) {
      this.destroy();
    } else if (this.left < 0) {
      this.left = 0;
      this.destroy();
    }
    const obstacles = this.level?.getObstacles?.() ?? [];
    const obstacle = obstacles.find((obstacle) => {
      if (!obstacle.getParams().active || obstacle.getParams().type === 'void')
        return false;

      const [topLeft, _, bottomRight, bottomLeft] = getObstacleCoords(obstacle);
      const curTop = this.bottom + 30;
      const topIntersection =
        (curTop > topLeft[1] && this.bottom <= topLeft[1]) ||
        (curTop <= topLeft[1] && this.bottom >= bottomRight[1]) ||
        (curTop > bottomRight[1] && this.bottom < bottomRight[1]);
      return (
        this.left + 30 >= bottomLeft[0] &&
        this.left < bottomRight[0] &&
        topIntersection
      );
    });

    const enemies = this.level?.getEnemies?.() ?? [];
    const enemy = enemies.find((enemy) => {
      if (enemy.state === 'destroyed' || enemy.state === 'pending')
        return false;

      const { top } = POSITION_CONFIG[enemy.type];
      const [enemyTopLeft, _, enemyBottomRight, enemyBottomLeft] = top(
        enemy.left,
        enemy.bottom,
      );

      const curTop = this.bottom + 30;
      const topIntersection =
        (curTop >= enemyTopLeft[1] && this.bottom <= enemyTopLeft[1]) ||
        (curTop <= enemyTopLeft[1] && this.bottom >= enemyTopLeft[1]) ||
        (curTop >= enemyBottomRight[1] && this.bottom <= enemyBottomRight[1]);

      return (
        this.left + 30 >= enemyBottomLeft[0] &&
        this.left < enemyBottomLeft[0] &&
        topIntersection
      );
    });
    if (obstacle || enemy) {
      this.left = obstacle ? obstacle.getParams().x - 30 : enemy!.left - 30;
      this.node?.classList.add('boom');
      this.destroyed = true;
      setTimeout(() => {
        this.destroy();
      }, 200);

      if (enemy) enemy.hit();
    }
  }

  init() {
    this.node = document.createElement('div');
    const id = this.getId();
    this.node.className = 'fireball';
    this.node.id = `fireball-${id}`;
    this.setStyles();
    document.querySelector('.game-body')?.append(this.node);
  }

  setLeft() {
    if (this.moveDirection === 'right') {
      this.left += 6;
    } else {
      this.left -= 6;
    }
    this.checkLeft();
    this.setStyles();
  }
}
