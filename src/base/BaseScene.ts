import { v4 as uuidv4 } from 'uuid';

export class BaseScene {
  public node: null | HTMLElement;
  public nextLevel: () => void;

  private id: string;

  constructor(nextLevel: () => void) {
    this.id = `scene-${uuidv4()}`;
    this.nextLevel = nextLevel;
    this.node = null;
  }

  init() {}
  create() {
    const section = document.createElement('section');
    section.id = this.getId();
    this.node = section;
    return section;
  }
  destroy() {
    document.querySelector(`#${this.id}`)?.remove();
  }

  getId() {
    return this.id;
  }
}
