import { v4 as uuidv4 } from 'uuid';

import { TBoss } from '@/types';

export class Boss {
  type: TBoss;
  onStart: () => void;
  private id: string;

  constructor(type: TBoss, onStart: () => void) {
    this.type = type;
    this.onStart = onStart;
    this.id = this.id = uuidv4();
  }

  renderPetya() {
    const div = document.createElement('div');
    div.className = 'petya';
    div.innerHTML = `
      <div class="tear"></div>
      <div class="tear"></div>
    `;
    document.querySelector('.game-body')!.appendChild(div);
    setTimeout(() => this.onStart(), 2000);
    setTimeout(() => {
      div.remove();
    }, 10000);
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
