import { Movement } from '@/base/Movement';
import { POSITION_CONFIG } from '@/base/utils';

import '../../styles/player.style.scss';
import { Fireball } from '@/controllers/player/Fireball';
import { ILevel } from '@/types';

export class Player extends Movement {
  private playerNode: null | HTMLDivElement;

  private getMyLevel: () => 'middle' | 'senior';

  private fireballs: Fireball[];
  private fireDelay: boolean;
  private watch: boolean;

  private downgrade: () => void;

  private levelChanging: boolean;

  private die() {
    if (!this.playerNode) return;

    this.playerNode.classList.add('dead');
    document.removeEventListener('keydown', this.handleKeyboardDown);
    document.removeEventListener('keyup', this.handleKeyboardUp);
    this.watch = false;
  }

  constructor(
    level: ILevel,
    getMyLevel: () => 'middle' | 'senior',
    score: (num: number) => void,
    downgrade: () => void,
  ) {
    super(
      level,
      score,
      'player',
      {
        bottom: 0,
        height: 120,
        left: 0,
        moveDirection: 'right',
        speed: 5,
        width: 77,
      },
      () => this.die(),
    );

    this.playerNode = null;
    this.getMyLevel = getMyLevel;
    this.fireballs = [];
    this.fireDelay = false;
    this.watch = true;
    this.downgrade = downgrade;
    this.levelChanging = false;
  }

  private setStyles() {
    if (!this.playerNode) return;
    this.playerNode.style.transform = `matrix(${this.moveDirection === 'right' ? '1' : '-1'}, 0, 0, 1, ${this.left}, ${-this.bottom})`;

    if (!this.isMoving && !this.isJumping) {
      this.playerNode.classList.add('idle');
      this.playerNode.classList.remove('running');
      this.playerNode.classList.remove('jumping');
    }

    if (this.isMoving && !this.isJumping) {
      this.playerNode.classList.remove('idle');
      this.playerNode.classList.add('running');
    }

    if (this.isJumping) {
      this.playerNode.classList.remove('idle');
      this.playerNode.classList.remove('running');
      this.playerNode.classList.add('jumping');
    }
  }

  private handleKeyboardDown(e: KeyboardEvent) {
    if (!this.watch) return;

    if (
      e.code === 'ArrowRight' ||
      e.code === 'KeyD' ||
      e.code === 'ArrowLeft' ||
      e.code === 'KeyA'
    ) {
      this.isMoving = true;
      this.moveDirection =
        e.code === 'ArrowRight' || e.code === 'KeyD' ? 'right' : 'left';
    }
    if (e.code === 'ArrowUp' || e.code === 'KeyW') {
      this.isJumping = true;
    }
  }

  private handleKeyboardUp(e: KeyboardEvent) {
    if (!this.watch) return;

    if (
      e.code === 'ArrowRight' ||
      e.code === 'KeyD' ||
      e.code === 'ArrowLeft' ||
      e.code === 'KeyA'
    ) {
      this.isMoving = false;
      this.setStyles();
    }
    if (e.code === 'Space' && !this.fireDelay) {
      const fireball = new Fireball(
        this.level,
        this.getMyLevel,
        this.score,
        this.left,
        this.bottom + 20,
        this.moveDirection,
      );
      fireball.init();
      this.fireballs.push(fireball);
      this.fireDelay = true;
      setTimeout(() => {
        this.fireDelay = false;
      }, 200);
    }
  }

  private endLevelAnimation() {
    this.playerNode!.classList.remove('idle');
    this.playerNode!.classList.remove('running');
    this.playerNode!.classList.add('hide');
  }

  private handleMove() {
    if (!this.level) return;

    this.setLeft();

    if (this.left > 845 && this.left <= 1050) {
      const progress = this.level.getProgress?.();
      if (progress === 'end') {
        document.removeEventListener('keydown', this.handleKeyboardDown);
        document.removeEventListener('keyup', this.handleKeyboardUp);
        this.watch = false;
        this.endLevelAnimation();
      }
    }

    this.setStyles();
  }

  private handleJump() {
    this.setBottom(this.getMyLevel());
    this.setStyles();
  }

  private updateFireballs() {
    this.fireballs.forEach((item, idx) => {
      item.setLeft();
      if (item.destroyed) {
        this.fireballs.splice(idx, 1);
      }
    });
  }

  private checkEnemyCollision() {
    if (this.levelChanging) return;

    const enemies = this.level.getEnemies?.() ?? [];
    for (let i = 0; i < enemies.length; i += 1) {
      const enemy = enemies[i];
      if (enemy.state === 'destroyed') continue;

      const { top } = POSITION_CONFIG.player;
      const [playerTopLeft, playerTopRight] = top(this.left, this.bottom);

      const conditionHorizontal =
        (playerTopRight[0] >= enemy.left && playerTopLeft[0] <= enemy.left) ||
        (playerTopRight[0] <= enemy.left + enemy.width &&
          playerTopLeft[0] >= enemy.left) ||
        (playerTopLeft[0] <= enemy.left + enemy.width &&
          playerTopRight[0] >= enemy.left + enemy.width);
      const conditionVertical = enemy.bottom + enemy.height >= this.bottom;
      if (conditionHorizontal && conditionVertical) {
        if (this.getMyLevel() === 'middle') {
          this.die();
          break;
        } else {
          this.levelChanging = true;
          this.downgrade();
          this.updateLevel();
        }
      }
    }
  }

  public onTick() {
    if (!this.playerNode || !this.watch) return;

    if (this.isMoving) {
      this.handleMove();
    }
    if (this.isJumping) {
      this.handleJump();
    }

    this.updateFireballs();
    this.checkEnemyCollision();
  }

  public init() {
    this.playerNode = document.createElement('div');
    this.playerNode.id = 'player';
    this.playerNode.classList.add(this.getMyLevel());
    this.playerNode.classList.add('idle');

    document.querySelector('section .game-body')?.appendChild(this.playerNode);
    document.addEventListener('keydown', this.handleKeyboardDown.bind(this));
    document.addEventListener('keyup', this.handleKeyboardUp.bind(this));
  }

  public updateLevel() {
    if (!this.playerNode) return;

    this.levelChanging = true;

    const level = this.getMyLevel();
    if (level === 'middle') {
      this.playerNode.classList.add('to-middle');
      this.playerNode.classList.remove('senior');
    } else {
      this.playerNode.classList.remove('middle');
      this.playerNode.classList.add('to-senior');
    }

    setTimeout(() => {
      if (!this.playerNode) return;
      if (level === 'middle') {
        this.playerNode.classList.remove('to-middle');
        this.playerNode.classList.add('middle');
      } else {
        this.playerNode.classList.remove('to-senior');
        this.playerNode.classList.add('senior');
      }
      this.levelChanging = false;
    }, 1000);
  }

  public destroyFireballs() {
    this.fireballs.forEach((item) => item.destroy());
    this.fireballs = [];
  }
}
