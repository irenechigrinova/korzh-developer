import { TObstacle } from '@/types';

import { Movement } from './Movement';

import '../../styles/player.style.scss';

export class Player {
  private obstacles: TObstacle[];

  private isMoving: boolean;
  private left: number;
  private moveDirection: 'right' | 'left';

  private isJumping: boolean;
  private bottom: number;
  private jumpDirection: 'up' | 'down';

  private playerNode: null | HTMLDivElement;

  private nextScene: (dir: 'next' | 'prev') => void;
  private getProgress: () => 'progress' | 'start' | 'end';

  private reqAnimationFrameId: number;

  constructor(
    obstacles: TObstacle[],
    nextScene: ((dir: 'next' | 'prev') => void) | undefined,
    getProgress: (() => 'progress' | 'start' | 'end') | undefined,
  ) {
    this.obstacles = obstacles;
    this.isMoving = false;
    this.nextScene = nextScene ?? (() => 'progress');
    this.left = 0;
    this.isJumping = false;
    this.bottom = 0;
    this.jumpDirection = 'up';
    this.playerNode = null;
    this.moveDirection = 'right';
    this.reqAnimationFrameId = 0;
    this.getProgress = getProgress ?? (() => 'progress');
  }

  private setStyles() {
    if (!this.playerNode) return;
    this.playerNode.style.transform = `matrix(${this.moveDirection === 'right' ? '1' : '-1'}, 0, 0, 1, ${this.left}, ${-this.bottom})`;
    if (this.isMoving) {
      this.playerNode.classList.remove('idle');
      this.playerNode.classList.add('running');
    } else {
      this.playerNode.classList.add('idle');
      this.playerNode.classList.remove('running');
    }
  }

  private handleKeyboardDown(e: KeyboardEvent) {
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
    if (
      e.code === 'ArrowRight' ||
      e.code === 'KeyD' ||
      e.code === 'ArrowLeft' ||
      e.code === 'KeyA'
    ) {
      this.isMoving = false;
      this.setStyles();
    }
  }

  private endLevelAnimation() {
    this.playerNode!.classList.remove('idle');
    this.playerNode!.classList.remove('running');
    this.playerNode!.classList.add('hide');
  }

  private handleMove() {
    const left = Movement.calcLeft(this.moveDirection, this.left);
    if (left > 845 && left <= 1050) {
      const progress = this.getProgress();
      if (progress === 'end') {
        document.removeEventListener('keydown', this.handleKeyboardDown);
        document.removeEventListener('keyup', this.handleKeyboardUp);
        cancelAnimationFrame(this.reqAnimationFrameId);
        this.endLevelAnimation();
      } else {
        this.left = left;
      }
    } else if (left > 1050) {
      this.nextScene('next');
      this.left = 0;
    } else if (left < 0) {
      const oldProgress = this.getProgress();
      this.nextScene('prev');
      const progress = this.getProgress();
      if (oldProgress === progress) {
        this.left = 0;
      } else {
        this.left = 1050;
      }
    } else {
      this.left = left;
    }
    this.setStyles();
  }

  private handleJump() {
    const [bottom, direction, jumping] = Movement.calcBottom(
      this.jumpDirection,
      this.bottom,
      this.isJumping,
    );
    this.bottom = bottom;
    this.jumpDirection = direction;
    this.isJumping = jumping;
    this.setStyles();
  }

  private handleTick() {
    this.reqAnimationFrameId = window.requestAnimationFrame(() => {
      if (!this.playerNode) return;

      if (this.isMoving) {
        this.handleMove();
      }
      if (this.isJumping) {
        this.handleJump();
      }
      this.handleTick();
    });
  }

  public setObstacles(obstacles: TObstacle[]) {
    this.obstacles = obstacles;
  }

  public init() {
    this.playerNode = document.createElement('div');
    this.playerNode.id = 'player';
    this.playerNode.classList.add('idle');

    document.querySelector('section .game-body')?.appendChild(this.playerNode);
    document.addEventListener('keydown', this.handleKeyboardDown.bind(this));
    document.addEventListener('keyup', this.handleKeyboardUp.bind(this));

    this.handleTick();
  }
}
