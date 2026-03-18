import { v4 as uuidv4 } from 'uuid';

import { Level } from '@/base/Level';

class Fireball {
  bottom: number;
  left: number;
  state: string;
  type: string;
  width: number;
  private id: string;
  private node: HTMLDivElement | null;
  private level: Level;
  private diff: number;
  private behaviour: string;
  constructor(level: Level, left: number, behaviour: string) {
    this.bottom = 250;
    this.width = 30;
    this.left = left;
    this.id = `fireball-${uuidv4()}`;
    this.node = null;
    this.level = level;
    this.state = 'active';
    this.diff = Math.floor(Math.random() * (5 - 1) + 1);
    this.type = 'fireball';
    this.behaviour = behaviour;
  }

  getId() {
    return this.id;
  }

  setStyles() {
    if (!this.node) return;

    this.node.style.transform = `translate(${this.left}px, ${-this.bottom}px)`;
  }

  changeBehaviour(val: string) {
    this.node?.classList.remove(this.behaviour);
    this.behaviour = val;
    this.node?.classList.add(val);
  }

  setLeft() {
    if (this.behaviour === 'polina' || this.behaviour === 'andrew') return;

    if ((this.bottom <= 0 || this.bottom > 260) && this.state === 'active') {
      this.dieHard();
    }
    if (this.bottom <= 0 && this.state !== 'active') return;

    this.bottom -= this.diff;

    if (this.behaviour === 'ira' || this.behaviour === 'bogdanchik') {
      if (this.bottom <= 120 && this.state === 'active') {
        this.dieHard();
      }
    }
  }

  init(container: HTMLDivElement) {
    const id = this.getId();
    if (this.node) {
      this.node.style.display = 'block';
    } else {
      this.node = document.createElement('div');
      this.node.className = `enemy fireball fireball-cloud active ${this.behaviour}`;
      this.node.id = id;
      this.setStyles();

      container.appendChild(this.node);
    }
  }

  dieHard() {
    this.state = 'destroyed';
    this.node!.remove();
    this.level.removeEnemy?.(this.getId());
  }

  die(): void {
    this.dieHard();
  }

  destroy(): void {
    this.dieHard();
  }

  explode() {}

  hit() {}
}

export class Cloud {
  name: string;
  node: HTMLDivElement | null;
  position: 'left' | 'right' | 'center';
  left: number;
  delay: number;
  level: Level;
  behaviour: string;

  private fireTimer: number;
  private canFire: boolean;
  constructor(
    name: string,
    position: 'left' | 'right' | 'center',
    left: number,
    delay: number,
    level: Level,
  ) {
    this.name = name;
    this.node = null;
    this.position = position;
    this.left = left;
    this.delay = delay;
    this.level = level;
    this.fireTimer = 0;
    this.behaviour = 'classic';
    this.canFire = true;
  }

  toggleFire(val: boolean) {
    console.log('toggle', val);
    this.canFire = val;
  }

  getId() {
    return this.name;
  }

  changeBehaviour(val: string) {
    this.behaviour = val;
  }

  fire() {
    if (this.behaviour !== 'polina' && this.behaviour !== 'andrew' && this.canFire) {
      const width = this.left + 350;
      let left = Math.random() * (width - this.left) + this.left;
      if (this.position === 'right') {
        left = Math.random() * (1100 - (1100 - 350)) + 1100 - 350;
      }
      this.level.addEnemies([
        new Fireball(this.level, left, this.behaviour) as any,
      ]);
    }

    this.fireTimer = setTimeout(
      () => {
        this.fire();
      },
      Math.random() * (2000 - 800) + 800,
    );
  }

  init() {
    const div = document.createElement('div');
    div.className = `cloud ${this.position}`;
    div.innerHTML = `<span>${this.name}</span><div class="boom"></div>`;
    div.id = this.name;
    const animationDelay = `${Math.floor(Math.random() * 3000)}`;
    const animationDuration = `${Math.floor(Math.random() * (3000 - 1500) + 1500)}`;
    div.style.animation = `cloud ${animationDuration}ms ease-in-out ${animationDelay}ms infinite`;

    this.node = div;
    document.querySelector('.game-body .enemies')!.appendChild(div);
    setTimeout(() => {
      if (this.position === 'left') {
        div.style.left = `${this.left}px`;
      } else if (this.position === 'right') {
        div.style.right = `${this.left}px`;
      } else {
        div.style.left = `${this.left}px`;
        div.style.opacity = '1';
      }
    }, this.delay);

    this.fireTimer = setTimeout(() => {
      this.fire();
    }, this.delay + 2000);
  }

  deactivate() {
    clearTimeout(this.fireTimer);
  }

  dieHard() {
    clearTimeout(this.fireTimer);
    this.node?.remove();
  }

  destroy() {
    clearTimeout(this.fireTimer);
    setTimeout(
      () => {
        this.node?.querySelector('.boom')?.classList.add('animated');
        this.node?.classList.add('destroyed');
      },
      Math.floor(Math.random() * (1000 - 400) + 400),
    );
  }
}
