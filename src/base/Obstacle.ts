import { v4 as uuidv4 } from 'uuid';

import { TObstacle, TObstacleType } from '@/types';

export class Obstacle {
  private params: TObstacle;
  private state: 'active' | 'destroyed';
  private node: HTMLDivElement | null;
  private id: string;

  destroy(level: 'middle' | 'senior', score: (val: number) => void) {
    if (this.state !== 'active') return;

    switch (this.params.type) {
      case 'question': {
        this.node?.classList.remove('active');
        this.node?.classList.add('destroyed');
        this.state = 'destroyed';
        score(100);
        break;
      }
      case 'brick': {
        if (level === 'senior') {
          this.node?.classList.remove('active');
          this.node?.classList.add('destroyed');
          this.state = 'destroyed';

          setTimeout(() => this.params.remove(this.params.id), 60);
        } else {
          this.node?.classList.remove('active');
          this.node?.classList.remove('toggled');
          void this.node?.offsetWidth;
          this.node?.classList.add('toggled');
        }
        break;
      }

      default:
        break;
    }
  }

  constructor(
    type: TObstacleType,
    x: number,
    y: number,
    remove: (id: string) => void,
    width?: number,
    height?: number,
  ) {
    this.id = uuidv4();
    switch (type) {
      default:
      case 'question':
      case 'brick':
        this.params = {
          active: true,
          destructible: true,
          height: 45,
          id: this.id,
          remove,
          type,
          width: 45,
          x,
          y,
        };
        break;
      case 'brick-transparent':
        this.params = {
          active: true,
          destructible: false,
          height: height ?? 42,
          id: this.id,
          remove,
          type,
          width: 40,
          x,
          y,
        };
        break;
      case 'tube-small':
        this.params = {
          active: true,
          destructible: false,
          height: 82,
          id: this.id,
          remove,
          type,
          width: 82,
          x,
          y,
        };
        break;
      case 'tube-mid':
        this.params = {
          active: true,
          destructible: false,
          height: 120,
          id: this.id,
          remove,
          type,
          width: 82,
          x,
          y,
        };
        break;
      case 'tube-large':
        this.params = {
          active: true,
          destructible: false,
          height: 160,
          id: this.id,
          remove,
          type,
          width: 82,
          x,
          y,
        };
        break;
      case 'void':
        this.params = {
          active: true,
          destructible: false,
          height: 2,
          id: this.id,
          remove,
          type,
          width: width ?? 120,
          x,
          y,
        };
        break;
    }
    this.state = 'active';
    this.node = null;
  }

  getParams() {
    return this.params;
  }

  getState() {
    return this.state;
  }

  draw(container: HTMLDivElement) {
    this.node = document.createElement('div');
    this.node.id = `obs-${this.id}`;
    this.node.classList.add(this.params.type);
    this.node.classList.add(
      this.state === 'destroyed' ? 'destroyed-fixed' : 'active',
    );
    this.node.classList.add(
      ['a', 'b', 'c', 'd', 'e'][Math.floor(Math.random() * 5)],
    );
    this.node.style.transform = `translate(${this.params.x}px, ${-this.params.y}px)`;
    this.node.style.width = `${this.params.width}px`;
    this.node.style.height = `${this.params.height}px`;

    if (this.params.type === 'brick') {
      this.node.innerHTML = `<div></div><div></div><div></div><div></div>`;
    }

    container.appendChild(this.node);
  }
}
