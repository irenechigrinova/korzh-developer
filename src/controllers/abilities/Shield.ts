import { Level } from '@/base/Level';
import { Cloud } from '@/controllers/enemies/Cloud';

export class Shield {
  private node: HTMLDivElement | null;
  private status: 'active' | 'pending' | 'deactivated';
  private onManageShield: (val: boolean) => void;
  private level: Level;
  private helps: string[];
  private curHelp: number;
  private handlePause;
  constructor(
    manageShield: (val: boolean) => void,
    level: Level,
    onPause: (val: boolean) => void,
  ) {
    this.node = null;
    this.status = 'pending';
    this.onManageShield = manageShield;
    this.level = level;
    this.helps = [
      'ira',
      'polina',
      'vacation',
      'bogdanchik',
      'wednesday',
      'andrew',
      'stas',
    ];
    this.curHelp = 6;
    this.handlePause = onPause;
  }

  private drawLightning() {
    const lightning = document.createElement('div');
    lightning.className = 'lightning';
    lightning.innerHTML =
      '<img src="./other/lightning1.png" alt="lightning" />';
    document.querySelector('main .game-body')!.append(lightning);

    const lightning2 = document.createElement('div');
    lightning2.className = 'lightning2';
    lightning2.innerHTML =
      '<img src="./other/lightning1.png" alt="lightning" />';
    document.querySelector('main .game-body')!.append(lightning2);

    setTimeout(() => {
      lightning.remove();
      lightning2.remove();
    }, 1300);
  }

  private triggerHelp() {
    this.drawLightning();

    const container = document.querySelector(
      '.help-container',
    )! as HTMLDivElement;
    container.classList.add(this.helps[this.curHelp]);
    container.classList.remove('fade');
    container.classList.add('show');
    this.level.getEnemies().forEach((item: any) => {
      item.changeBehaviour(this.helps[this.curHelp]);
    });
  }

  private triggerWednesday() {
    this.handlePause(true);
    this.level.getEnemies().forEach((item) => {
      if (item instanceof Cloud) item.toggleFire(false);
    });
    const container = document.querySelector(
      '.help-container',
    )! as HTMLDivElement;
    container.classList.add(this.helps[this.curHelp]);
    container.classList.remove('fade');
    container.classList.add('show');
    let counter = 0;
    let variant = Math.floor(Math.random() * (10 - 1) + 1);
    const interval = setInterval(() => {
      counter += 1;
      if (counter > 3) {
        clearInterval(interval);
        return;
      }
      container.classList.remove(`wednesday-${variant}`);
      variant = Math.floor(Math.random() * (10 - 1) + 1);
      container.classList.add(`wednesday-${variant}`);
    }, 1000);
  }

  private handleHelp() {
    switch (this.helps[this.curHelp]) {
      case 'ira':
      case 'polina':
      case 'vacation':
      case 'bogdanchik':
      case 'andrew':
      case 'stas':
        this.triggerHelp();
        break;
      case 'wednesday':
        this.triggerWednesday();
        break;
      default:
        break;
    }
    if (
      this.helps[this.curHelp] === 'vacation' ||
      this.helps[this.curHelp] === 'stas'
    ) {
      this.onManageShield(true);
    }
  }

  private handleKeyboard(e: KeyboardEvent) {
    if (this.status === 'active' || this.status === 'deactivated' || !this.node)
      return;

    if (e.code === 'KeyH') {
      this.status = 'active';
      this.node.classList.remove('pending');
      this.node.classList.add('active');
      this.level.score(-1000);
      this.handleHelp();

      setTimeout(() => {
        this.status = 'pending';
        // this.curHelp =
        //   this.curHelp + 1 > this.helps.length - 1 ? 0 : this.curHelp + 1;
        this.node!.classList.remove('active');
        this.node!.classList.add('pending');
        this.onManageShield(false);
        this.handlePause(false);
        document.querySelector('.help-container')?.classList.add('fade');
        this.level.getEnemies().forEach((item: any) => {
          item.changeBehaviour('classic');
          if (item instanceof Cloud) item.toggleFire(true);
        });
      }, 50000);
    }
  }

  private handleKeyboardBinded = this.handleKeyboard.bind(this);

  init() {
    this.node = document.createElement('div');
    this.node.className = 'shieldAbility pending';

    document.querySelector('.game-body')?.appendChild(this.node);
    document.addEventListener('keyup', this.handleKeyboardBinded);

    const div = document.createElement('div');
    div.className = 'help-container';
    document.querySelector('main .game-body')!.append(div);
  }

  deactivate() {
    if (!this.node) return;

    this.status = 'deactivated';
    this.node.classList.remove('active');
    this.node.classList.add('deactivated');
    document.removeEventListener('keyup', this.handleKeyboardBinded);
  }

  destroy() {
    this.node?.remove();
    document.removeEventListener('keyup', this.handleKeyboardBinded);
  }
}
