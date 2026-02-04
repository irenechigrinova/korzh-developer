import { v4 as uuidv4 } from 'uuid';

export class BaseScene {
  public node: null | HTMLElement;
  public nextLevel: () => void;

  private id: string;

  constructor(nextLevel: () => void) {
    this.id = uuidv4();
    this.nextLevel = nextLevel;
    this.node = null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  init(args?: unknown) {}
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

  setId(id: string) {
    this.id = id;
  }
}
