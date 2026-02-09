import { Level } from '@/base/Level';
import { Movement } from '@/base/Movement';
import { TMovementParams, TMovementType } from '@/types';

export class Enemy extends Movement {
  level: Level;
  node: HTMLDivElement | null;
  state: 'active' | 'pending' | 'destroyed';
  delay: number;
  weight: number;
  lives: number;

  constructor(
    level: Level,
    type: TMovementType,
    params: TMovementParams,
    lives: number,
    weight: number,
    delay: number,
  ) {
    super(
      level,
      (num: number) => level.score(num),
      type,
      params,
      () => this.die(),
    );

    this.level = level;
    this.node = null;
    this.state = 'pending';
    this.delay = delay;
    this.weight = weight;
    this.lives = lives;
  }

  setStyles() {
    if (!this.node) return;

    this.node.style.transform = `translate(${this.left}px, ${-this.bottom}px) scale(${this.moveDirection === 'left' ? '1' : '-1, 1'})`;
    this.node.classList.remove('left');
    this.node.classList.remove('right');
    this.node.classList.add(this.moveDirection);
  }

  init(container: HTMLDivElement) {
    const id = this.getId();
    if (this.node) {
      this.node.style.display = 'block';
    } else {
      this.node = document.createElement('div');
      this.node.className = `enemy ${this.type} active`;
      this.node.id = `enemy-${id}`;
      this.node.innerHTML = `<div class="enemy-score">${this.weight}</div>`;
      this.setStyles();

      setTimeout(() => {
        container.appendChild(this.node as HTMLDivElement);
        this.state = 'active';
      }, this.delay);
    }
  }

  die(): void {
    if (!this.node) return;

    this.state = 'destroyed';
    this.node.classList.add('die');
    setTimeout(() => {
      this.node!.remove();
      this.level.removeEnemy?.(this.getId());
    }, 1000);
  }

  destroy(): void {
    if (!this.node) return;

    this.state = 'destroyed';
    this.node.classList.add('destroyed');
    this.score(this.weight);
    setTimeout(() => {
      this.node!.remove();
      this.level.removeEnemy?.(this.getId());
    }, 1000);
  }

  explode(): void {
    if (!this.node) return;

    this.node.classList.add('explode');
    this.node.classList.remove('active');
    this.node.classList.remove('enemy');
    this.node.classList.remove('bug');
    this.node.classList.remove('task');
    setTimeout(() => {
      this.die();
    }, 3000);
  }

  hit() {
    this.lives -= 1;
    if (this.lives === 0) {
      this.destroy();
    }
  }
}
