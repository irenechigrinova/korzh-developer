import { Enemy } from '@/base/Enemy';
import { Level } from '@/base/Level';

import '../../styles/player.style.scss';
import { Movement } from '@/base/Movement';
import { POSITION_CONFIG } from '@/base/utils';
import { Boss } from '@/controllers/enemies/Boss';
import { Cloud } from '@/controllers/enemies/Cloud';
import { Fireball } from '@/controllers/player/Fireball';

export class Player extends Movement {
  private playerNode: null | HTMLDivElement;

  private getMyLevel: () => 'middle' | 'senior';

  private fireballs: Fireball[];
  private fireDelay: boolean;
  private watch: boolean;

  private downgrade: () => void;
  private onDie: () => void;

  private levelChanging: boolean;
  private keysPressed: Record<string, boolean>;

  private lives: number;
  private shieldActive: boolean;

  private die() {
    if (!this.playerNode) return;

    this.playerNode.classList.add('dead');
    document.removeEventListener('keydown', this.handleKeyboardDown);
    document.removeEventListener('keyup', this.handleKeyboardUp);
    this.watch = false;
    this.fireballs.forEach((item) => {
      item.destroy();
      item.node?.remove();
    });
    this.fireballs = [];
    setTimeout(() => {
      this.onDie();
    }, 1000);
  }

  constructor(
    level: Level,
    getMyLevel: () => 'middle' | 'senior',
    score: (num: number) => void,
    downgrade: () => void,
    onDie: () => void,
  ) {
    super(
      level,
      score,
      'player',
      {
        bottom: level.name === '2' ? 241 : 0,
        height: 120,
        left: level.name === '3' ? 562 : 0,
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
    this.onDie = onDie;
    this.keysPressed = {};
    this.lives = 5;
    this.shieldActive = false;
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

    this.keysPressed[e.code] = true;

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
    this.keysPressed[e.code] = false;
    const keys = Object.keys(this.keysPressed);

    if (
      !keys.length ||
      !(
        this.keysPressed.ArrowRight ||
        this.keysPressed.KeyD ||
        this.keysPressed.ArrowLeft ||
        this.keysPressed.KeyA
      )
    ) {
      this.isMoving = false;
      this.setStyles();
    }
    if (e.code === 'Space' && !this.fireDelay && this.level.name !== '3') {
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
    setTimeout(() => {
      this.level.nextLevel();
    }, 1000);
  }

  private handleMove() {
    if (!this.level) return;

    this.setLeft();

    if (this.level.name === '1' && this.left > 920 && this.left <= 1050) {
      const progress = this.level.getProgress?.();
      if (progress === 'end') {
        document.removeEventListener('keydown', this.handleKeyboardDown);
        document.removeEventListener('keyup', this.handleKeyboardUp);
        this.watch = false;
        this.endLevelAnimation();
      }
    }
    if (
      this.level.name === '3' &&
      this.left >= 1117 &&
      this.moveDirection === 'right'
    ) {
      this.left = 1117;
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

  public getDamage(full?: boolean) {
    if (this.level.name !== '3') {
      if (full) {
        this.die();
      }
      if (this.getMyLevel() === 'middle') {
        this.die();
      } else {
        this.levelChanging = true;
        this.downgrade();
        this.updateLevel();
      }
    } else {
      const hearts = Array.from(document.querySelectorAll('.heart')!);
      if (full) {
        if (this.lives < 5) {
          this.lives += 1;
          hearts[this.lives - 1].classList.remove('is-transparent');
        }
      } else {
        this.lives -= 1;
        hearts[this.lives].classList.add('is-transparent');
        if (this.lives === 0) {
          this.die();
        } else {
          this.playerNode?.classList.add('damaged');
          setTimeout(() => {
            this.playerNode?.classList.remove('damaged');
          }, 900);
        }
      }
    }
  }

  private checkEnemyCollision() {
    if (this.levelChanging || this.shieldActive) return;

    const enemies = this.level.getEnemies?.() ?? [];
    for (let i = 0; i < enemies.length; i += 1) {
      const enemy = enemies[i];
      if (enemy instanceof Boss || enemy instanceof Cloud) continue;
      if (enemy.state === 'destroyed' || enemy.state === 'pending') continue;

      const { top } = POSITION_CONFIG.player;
      const [playerTopLeft, playerTopRight] = top(this.left, this.bottom);

      const conditionHorizontal =
        (playerTopRight[0] >= enemy.left && playerTopLeft[0] <= enemy.left) ||
        (playerTopRight[0] <= enemy.left + enemy.width &&
          playerTopLeft[0] >= enemy.left) ||
        (playerTopLeft[0] <= enemy.left + enemy.width &&
          playerTopRight[0] >= enemy.left + enemy.width);
      let conditionVertical = Math.abs(enemy.bottom - this.bottom) <= 10;
      const myHeight = this.bottom + 115;

      if (enemy.type === 'fireball-g' || enemy.type === 'fireball-b') {
        conditionVertical =
          (enemy.bottom >= this.bottom &&
            enemy.bottom + enemy.height <= myHeight) ||
          (enemy.bottom < this.bottom &&
            enemy.bottom + enemy.height >= this.bottom) ||
          (enemy.bottom < myHeight && enemy.bottom + enemy.height > myHeight);
      } else if (enemy.type === 'fireball' && this.level.name === '3') {
        conditionVertical = enemy.bottom <= this.bottom + 70;
      }
      if (conditionHorizontal && conditionVertical) {
        if (enemy.type === 'sq') {
          if (
            enemy.bottom + enemy.height > this.bottom &&
            enemy.bottom !== this.bottom
          ) {
            (enemy as Enemy).destroy();
          } else {
            this.getDamage();
          }
        } else {
          if (
            !(enemy as any).behaviour ||
            (enemy as any).behaviour === 'classic'
          ) {
            this.getDamage();
          }
          if (enemy.type === 'fireball') {
            enemy.dieHard();
          }
        }
        break;
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
    if (this.level.name === '3') {
      this.playerNode.innerHTML = '<div class="shield"></div>';
    }

    this.setStyles();

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

  public getPosition() {
    return {
      bottom: this.bottom,
      height: this.height,
      left: this.left,
      moveDirection: this.moveDirection,
      width: this.width,
    };
  }

  public manageShield(val: boolean) {
    if (!this.playerNode) return;

    this.shieldActive = val;
    const shield = this.playerNode.querySelector('.shield') as HTMLDivElement;
    if (val) {
      shield.style.display = 'block';
      shield.classList.add('active');
    } else {
      shield.style.display = 'none';
      shield.classList.remove('active');
    }
  }
}
