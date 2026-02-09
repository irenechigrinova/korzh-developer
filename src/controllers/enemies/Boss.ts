import { v4 as uuidv4 } from 'uuid';

import { Level } from '@/base/Level';
import { Task } from '@/controllers/enemies/Task';
import { TBoss } from '@/types';

export class Boss {
  level: Level;
  type: TBoss;
  private id: string;

  constructor(level: Level, type: TBoss) {
    this.type = type;
    this.id = this.id = uuidv4();
    this.level = level;
  }

  renderPetya() {
    const div = document.createElement('div');
    div.className = 'petya';
    div.innerHTML = `
      <div class="tear"></div>
      <div class="tear"></div>
    `;
    document.querySelector('.game-body')!.appendChild(div);
    setTimeout(() => this.level.onShowBoss('petya'), 2000);
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

  getId() {
    return this.id;
  }

  init() {
    switch (this.type) {
      case 'petya':
        this.renderPetya();
    }
  }
}
