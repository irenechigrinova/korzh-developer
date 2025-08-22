import { BaseScene } from '@/base/BaseScene';
import { AgeCheck } from '@/controllers/levels/AgeCheck';
import { Intro } from '@/controllers/levels/Intro';
import { Level1 } from '@/controllers/levels/Level1';
import { Level2 } from '@/controllers/levels/Level2';
import { Level3 } from '@/controllers/levels/Level3';
import { Outro } from '@/controllers/levels/Outro';
import { Player } from '@/controllers/player/Player';
import { TLevel } from '@/types';

interface ILevel extends BaseScene {
  changeScene?: (dir: 'next' | 'prev') => void;
  getProgress?: () => 'progress' | 'start' | 'end';
}

export class GameController {
  private state: {
    levelIdx: number;
    levels: TLevel[];
    curLevel: null | ILevel;
  };
  private mapping = {
    '1': Level1,
    '2': Level2,
    '3': Level3,
    '18+': AgeCheck,
    intro: Intro,
    outro: Outro,
  };
  private player: Player | null;

  private nextLevel() {
    const idx = this.state.levelIdx + 1;
    this.state.levelIdx = idx;
    this.setLevel(this.state.levels[idx]);
  }

  private setLevel(name: TLevel) {
    const Component = this.mapping[name];
    if (!Component) return;

    this.state.curLevel?.destroy();
    const Level: ILevel = new Component(() => this.nextLevel());
    this.state.curLevel = Level;
    Level.init();

    if (name === '1') {
      this.player = new Player([], Level.changeScene, Level.getProgress);
      this.player.init();
    }
  }

  constructor() {
    this.state = {
      curLevel: null,
      levelIdx: 0,
      levels: ['18+', 'intro', '1', '2', '3', 'outro'],
    };
    this.player = null;
  }

  init() {
    //const skip18 = localStorage.getItem('skip18');

    //let idx = 0;
    //if (skip18) idx = 1;

    const idx = 2;

    this.state.levelIdx = idx;
    this.setLevel(this.state.levels[idx]);
  }
}
