import { Movement } from '@/base/Movement';
import { ILevel, TMovementParams, TMovementType } from '@/types';

export class Enemy extends Movement {
  level: ILevel;
  node: HTMLDivElement | null;
  state: 'active' | 'pending' | 'destroyed';
  delay: number;
  weight: number;
  lives: number;
  score: (num: number) => void;
  destroyInLevel: (id: string) => void;

  constructor(
    level: ILevel,
    type: TMovementType,
    params: TMovementParams,
    lives: number,
    weight: number,
    delay: number,
    score: (num: number) => void,
    destroy: (id: string) => void,
  ) {
    super(
      level,
      () => undefined,
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
    this.score = score;
    this.destroyInLevel = destroy;
  }

  setStyles() {
    if (!this.node) return;

    this.node.style.transform = `translate(${this.left}px, ${this.bottom}px) scale(${this.moveDirection === 'left' ? '1' : '-1, 1'})`;
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
      this.destroyInLevel(this.getId());
    }, 1000);
  }

  destroy(): void {
    if (!this.node) return;

    this.state = 'destroyed';
    this.node.classList.add('destroyed');
    this.score(this.weight);
    setTimeout(() => {
      this.node!.remove();
      this.destroyInLevel(this.getId());
    }, 1000);
  }

  hit() {
    this.lives -= 1;
    if (this.lives === 0) {
      this.destroy();
    }
  }
}
