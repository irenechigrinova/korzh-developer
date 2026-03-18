import { v4 as uuidv4 } from 'uuid';

import { Enemy } from '@/base/Enemy';
import { Level } from '@/base/Level';
import { TMovementParams, TMovementType } from '@/types';

class Fireball extends Enemy {
  constructor(
    type: TMovementType,
    level: Level,
    params?: Partial<TMovementParams>,
    delay = 0,
  ) {
    super(
      level,
      type,
      {
        bottom: params?.bottom ?? 0,
        height: 30,
        left: params?.left ?? 1200,
        moveDirection: params?.moveDirection ?? 'left',
        speed: 5,
        width: 30,
      },
      1,
      100,
      delay,
      false,
    );

    this.setId(`fireball-${uuidv4()}`);
  }

  destroy(): void {
    document.querySelector(`#${this.getId()}`)?.remove();
  }
}

export class Deadline {
  lives: number;
  node: HTMLDivElement | null;
  state: 'active' | 'destroyed';
  bottom: number;
  left: number;
  type: string;
  level: Level;
  width: number;
  height: number;

  private texts: string[];
  private timer: number;
  private fireTimer: number;

  private randInterval() {
    return Math.floor(Math.random() * (2000 - 1500) + 1500);
  }

  private randFireInterval() {
    return Math.floor(Math.random() * (5000 - 2000) + 2000);
  }

  private randLeftPosition() {
    return Math.floor(Math.random() * (200 + 200) - 200);
  }
  private randTopPosition() {
    return Math.floor(Math.random() * (150 + 0) - 0);
  }

  private randText() {
    return Math.floor(Math.random() * (4 + 0) - 0);
  }

  constructor(level: Level) {
    this.lives = 5;
    this.node = null;
    this.state = 'active';
    this.bottom = 200;
    this.left = 800;
    this.type = 'deadline';
    this.texts = [
      'EOD переносится',
      'У нас блокер',
      'ППЦ в 3ПЦ',
      'Агенты отвалились',
    ];
    this.timer = 0;
    this.fireTimer = 0;
    this.level = level;
    this.width = 150;
    this.height = 150;
  }

  changePosition() {
    if (this.state === 'active') {
      this.left = this.randLeftPosition() + 800;
      this.bottom = this.randTopPosition();

      if (!this.node) return;

      this.node.style.transform = `translate(${this.left}px, ${-this.bottom}px)`;
      this.node.querySelector('.boss-bubble')!.innerHTML =
        `<span>${this.texts[this.randText()]}</span>`;
      this.timer = setTimeout(() => this.changePosition(), this.randInterval());
    }
  }

  fire() {
    if (this.state === 'active') {
      const timer = this.randFireInterval();
      this.fireTimer = setTimeout(() => {
        if (this.state === 'active') {
          this.level.addEnemies([
            new Fireball(
              `fireball-${timer % 2 === 0 ? 'g' : 'b'}`,
              this.level,
              {
                bottom: this.bottom,
                left: this.left,
              },
            ),
          ]);
          this.fire();
        }
      }, this.randFireInterval());
    }
  }

  init() {
    const div = document.createElement('div');
    div.id = 'deadline';
    div.className = 'deadline';
    div.innerHTML = `
      <div class="boss-bubble nes-balloon from-right">
        <span>${this.texts[0]}</span>
      </div>
      <div class="avatar"></div>
      <div class="health"></div>
      <div class="boom"></div>
    `;
    this.node = div;

    document.body.querySelector('.enemies')?.appendChild(div);

    setTimeout(() => {
      div.style.opacity = '1';
    }, 200);
    this.changePosition();
    this.fire();

    (document.querySelector('#main-audio') as HTMLAudioElement)!.pause();
    (document.querySelector(
      '#boss-appearance-audio',
    ) as HTMLAudioElement)!.play();
    (document.querySelector(
      '#boss-appearance-audio',
    ) as HTMLAudioElement)!.loop = true;
  }

  hit() {
    this.lives -= 1;
    (this.node!.querySelector('.health') as HTMLDivElement)!.style.height =
      `${(this.lives * 100) / 5}%`;
    if (this.lives === 0) {
      this.state = 'destroyed';
      this.node!.classList.add('destroyed');
      this.node!.classList.add(`e-${Math.round(Math.random() * (8 - 1) + 1)}`);
      clearTimeout(this.timer);
      clearTimeout(this.fireTimer);
      (this.node!.querySelector('.boom') as HTMLDivElement)!.classList.add(
        'animated',
      );
      this.level.score(5000);

      setTimeout(() => {
        this.level?.fade();
      }, 4200);
    }
  }

  die() {
    clearTimeout(this.timer);
    clearTimeout(this.fireTimer);
    this.node?.remove();
  }

  dieHard() {
    this.die();
  }

  getId() {
    return 'deadline';
  }

  deactivate() {
    clearTimeout(this.fireTimer);
  }
}
