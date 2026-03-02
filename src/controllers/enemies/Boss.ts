import { v4 as uuidv4 } from 'uuid';

import { Level } from '@/base/Level';
import { Bug } from '@/controllers/enemies/Bug';
import { Task } from '@/controllers/enemies/Task';
import { TBoss } from '@/types';

export class Boss {
  level: Level;
  type: TBoss;
  private id: string;
  private node: null | HTMLDivElement;

  constructor(level: Level, type: TBoss) {
    this.type = type;
    this.id = this.id = uuidv4();
    this.level = level;
    this.node = null;
  }

  renderPetya() {
    const div = document.createElement('div');
    div.className = 'petya';
    div.innerHTML = `
      <div class="tear"></div>
      <div class="tear"></div>
    `;
    this.node = div;
    document.querySelector('.game-body')!.appendChild(div);
    setTimeout(() => this.level.onShowBoss('petya', 7000), 2000);
    setTimeout(() => {
      div.remove();
    }, 10000);
    this.level.addEnemies([
      new Task(this.level, { left: 560 }, 7300),
      new Task(
        this.level,
        { bottom: 0, left: 560, moveDirection: 'left' },
        7600,
      ),
      new Task(
        this.level,
        { bottom: 183, left: 580, moveDirection: 'left' },
        7100,
      ),
    ]);
  }

  renderNikolina() {
    const div = document.createElement('div');
    div.className = 'nikolina';
    div.innerHTML = `
      <div class="avatar"></div>
      <div class="boss-bubble nes-balloon from-right">
        <span>Дизайн долг!</span>
      </div>
    `;
    this.node = div;
    document.querySelector('.game-body')!.appendChild(div);
    setTimeout(() => this.level.onShowBoss('nikolina', 3500), 200);
    setTimeout(() => {
      div.remove();
    }, 6000);

    const randLeft = () => Math.random() * (1200 - 500) + 500;
    const randNum = Math.floor(Math.random() * (5 - 1) + 5);
    const enemies = [];
    for (let i = 0; i < randNum; i += 1) {
      enemies.push(
        new Task(
          this.level,
          {
            bottom: 0,
            left: randLeft(),
            moveDirection: Math.floor(randLeft()) % 2 === 0 ? 'left' : 'right',
          },
          1500 + 200 * i,
        ),
      );
    }
    this.level.addEnemies?.(enemies);
  }

  renderErmakov() {
    const div = document.createElement('div');
    div.className = 'ermakov';
    div.innerHTML = `
      <div class="avatar"></div>
      <div class="fire"></div>
      <div class="boss-bubble nes-balloon from-right">
        <span>Тех долг!</span>
      </div>
    `;
    this.node = div;
    document.querySelector('.game-body')!.appendChild(div);
    setTimeout(() => this.level.onShowBoss('ermakov', 8000), 500);
    setTimeout(() => {
      div.remove();
    }, 10000);
    this.level.addEnemies([
      new Task(this.level, { left: 1090 }, 4300),
      new Task(
        this.level,
        { bottom: 0, left: 1090, moveDirection: 'left' },
        4600,
      ),
      new Task(
        this.level,
        { bottom: 0, left: 0, moveDirection: 'right' },
        4300,
      ),
      new Task(
        this.level,
        { bottom: 0, left: 0, moveDirection: 'right' },
        4600,
      ),
    ]);
  }

  renderBogi() {
    const div = document.createElement('div');
    div.className = 'bogi';
    div.innerHTML = `
      <div class="avatar"></div>
      <div class="boss-bubble nes-balloon from-right">
        <span>Оптимизация!</span>
      </div>
    `;
    this.node = div;
    document.querySelector('.game-body')!.appendChild(div);
    setTimeout(() => this.level.onShowBoss('bogi', 4000), 200);
    setTimeout(() => {
      div.remove();
    }, 6000);

    const randLeft = () => Math.random() * (780 - 300) + 300;
    const randNum = Math.floor(Math.random() * (5 - 1) + 5);
    const enemies = [];
    for (let i = 0; i < randNum; i += 1) {
      enemies.push(
        new Task(
          this.level,
          {
            bottom: 119,
            left: randLeft(),
            moveDirection: Math.floor(randLeft()) % 2 === 0 ? 'left' : 'right',
          },
          1500 + 200 * i,
        ),
      );
    }
    this.level.addEnemies?.(enemies);
  }

  getId() {
    return this.id;
  }

  init() {
    switch (this.type) {
      case 'petya':
        this.renderPetya();
        break;
      case 'nikolina':
        this.renderNikolina();
        break;

      case 'ermakov':
        this.renderErmakov();
        break;
      case 'bogi':
        this.renderBogi();
        break;
    }
  }

  die() {
    this.node?.remove();
  }
}
