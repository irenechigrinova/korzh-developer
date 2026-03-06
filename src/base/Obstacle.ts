import { v4 as uuidv4 } from 'uuid';

import { TObstacle, TObstacleType } from '@/types';

export class Obstacle {
  private params: TObstacle;
  private node: HTMLDivElement | null;
  private id: string;
  private animationId: number;
  private getPlayerPosition: undefined | (() => Record<string, any>);
  private hit: (full?: boolean) => void;
  private isDestroying: boolean;

  state: 'active' | 'destroyed';

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

  deactivate() {
    this.node = null;
    this.state = 'destroyed';
    window.cancelAnimationFrame(this.animationId);
    this.animationId = 0;
  }

  constructor(
    type: TObstacleType,
    x: number,
    y: number,
    remove: (id: string) => void,
    width?: number,
    height?: number,
    getPlayerPosition?: () => Record<string, number>,
    hit?: (full?: boolean) => void,
  ) {
    this.id = uuidv4();
    this.isDestroying = false;
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
      case 'bridge':
        this.params = {
          active: true,
          destructible: false,
          height: height ?? 42,
          id: this.id,
          remove,
          type,
          width: width ?? 40,
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
      case 'client-blue':
      case 'client-green':
        this.params = {
          active: true,
          destructible: false,
          height: 120,
          id: this.id,
          remove,
          rotate: 0,
          type,
          width: 20,
          x,
          y,
        };
        break;
    }
    this.state = 'active';
    this.node = null;
    this.animationId = 0;
    this.getPlayerPosition = getPlayerPosition;
    this.hit = hit || (() => undefined);
  }

  getParams() {
    return this.params;
  }

  setRotation(num: number) {
    if (!this.node) return;
    this.params.rotate = num;
    this.node.style.transform = `translate(${this.params.x}px, ${-this.params.y}px) rotate(${num}deg)`;
  }

  getState() {
    return this.state;
  }

  private getClientRectIntersection() {
    const { height, type, width, x } = this.params;
    const playerPosition = this.getPlayerPosition?.() ?? {};
    if (type === 'bridge') {
      return (
        playerPosition.bottom > 117 &&
        playerPosition.bottom < 120 &&
        playerPosition.left + 20 > x &&
        playerPosition.left + 20 < x + width
      );
    }
    if (playerPosition.moveDirection === 'right') {
      return (
        playerPosition.left + playerPosition.width >= x - height &&
        playerPosition.left <= x + height
      );
    }
    return (
      playerPosition.left <= x + height &&
      playerPosition.left + playerPosition.width >= x - height
    );
  }

  private updateClient() {
    this.animationId = window.requestAnimationFrame(() => {
      const { height, rotate = 0, type, width, x: ax, y: ay } = this.params;
      if (type === 'bridge') {
        if (this.getClientRectIntersection() && !this.isDestroying) {
          this.isDestroying = true;
          this.node?.classList.add('destroying');
          setTimeout(() => {
            this.deactivate();
            if (this.getClientRectIntersection()) {
              this.hit(true);
            }
          }, 4100);
        }
      } else {
        let rotation = type.includes('green')
          ? (rotate ?? 0) + 2
          : (rotate ?? 0) - 2;
        if (Math.abs(rotation) > 360) rotation = 0;
        this.setRotation(rotation);

        if (this.getClientRectIntersection()) {
          const playerPosition = this.getPlayerPosition?.() ?? {};

          const isGreen = type.includes('green');
          const rad = (rotate * Math.PI) / 180;

          const cos = Math.cos(-rad);
          const sin = Math.sin(-rad);
          const x = width + ax;
          const y = ay + height;
          const px = width + ax - 10;
          const py = ay;

          const dx = x - px;
          const dy = y - py;

          const rotatedX = px + dx * cos - dy * sin;
          const rotatedY = py + dx * sin + dy * cos;

          const bottomCondition = isGreen
            ? rotatedY >= playerPosition.bottom
            : rotatedY <= playerPosition.bottom + playerPosition.height;

          if (playerPosition.moveDirection === 'right') {
            if (
              playerPosition.left + playerPosition.width >= rotatedX &&
              playerPosition.left <= rotatedX &&
              bottomCondition
            ) {
              this.hit();
            }
          } else {
            if (
              playerPosition.left <= rotatedX &&
              playerPosition.left + playerPosition.width >= rotatedX &&
              bottomCondition
            ) {
              this.hit();
            }
          }
        }
      }

      if (this.node && !this.isDestroying) this.updateClient();
    });
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
    if (this.params.type.includes('client')) {
      this.node.classList.add(this.params.type);
    }

    container.appendChild(this.node);

    if (this.params.type.includes('client') || this.params.type === 'bridge') {
      this.updateClient();
    }
  }
}
