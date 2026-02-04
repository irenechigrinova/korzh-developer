import { AgeCheck } from '@/controllers/levels/AgeCheck';
import { Intro } from '@/controllers/levels/Intro';
import { Level1 } from '@/controllers/levels/Level1';
import { Level2 } from '@/controllers/levels/Level2';
import { Level3 } from '@/controllers/levels/Level3';
import { Outro } from '@/controllers/levels/Outro';
import { Player } from '@/controllers/player/Player';
import { TLevel, ILevel } from '@/types';

export class GameController {
  private state: {
    levelIdx: number;
    levels: TLevel[];
    curLevel: null | ILevel;
    score: number;
    playerLevel: 'middle' | 'senior';
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
  private reqAnimationFrameId: number;

  private nextLevel() {
    const idx = this.state.levelIdx + 1;
    this.state.levelIdx = idx;
    this.setLevel(this.state.levels[idx]);
  }

  private getPlayerLevel() {
    return this.state.playerLevel;
  }

  private renderScore() {
    document.querySelector('.score')!.innerHTML = `
      <div>Тревожное расстройство: ${this.state.score}</div>
      <div>Уровень: ${this.state.playerLevel === 'middle' ? 'Мидл' : 'Сеньор'}</div>
    `;
  }

  private setScore(num: number) {
    this.state.score += num;
    if (
      this.state.score >= 1000 &&
      this.state.playerLevel === 'middle' &&
      this.player
    ) {
      this.state.playerLevel = 'senior';
      this.player.updateLevel();
    }

    this.renderScore();
  }

  private setLevel(name: TLevel) {
    const Component = this.mapping[name];
    if (!Component) return;

    this.state.curLevel?.destroy();
    const Level: ILevel = new Component(
      () => this.nextLevel(),
      (num: number) => this.setScore(num),
      () => this.handleChangeScene()
    );
    this.state.curLevel = Level;
    Level.init();

    if (name === '1') {
      this.player = new Player(
        Level,
        () => this.getPlayerLevel(),
        (num: number) => this.setScore(num),
        () => {
          this.state.playerLevel = 'middle';
          this.state.score -= 1000;
          this.renderScore();
        },
      );
      this.player.init();
    }

    if (['1', '2'].includes(name)) {
      const div = document.createElement('div');
      div.className = 'score';
      document.querySelector('main .game-body')?.append(div);
      this.renderScore();
    }
  }

  private handleChangeScene() {
    this.player?.destroyFireballs();
  }

  constructor() {
    this.state = {
      curLevel: null,
      levelIdx: 0,
      levels: ['18+', 'intro', '1', '2', '3', 'outro'],
      playerLevel: 'middle',
      score: 0,
    };
    this.player = null;
    this.reqAnimationFrameId = 0;
  }

  private handleTick() {
    this.reqAnimationFrameId = window.requestAnimationFrame(() => {
      if (this.player) {
        this.player.onTick();
      }
      if (this.state.curLevel) {
        this.state.curLevel.onTick?.();
      }

      this.handleTick();
    });
  }

  init() {
    //const skip18 = localStorage.getItem('skip18');

    //let idx = 0;
    //if (skip18) idx = 1;

    const idx = 2;

    this.state.levelIdx = idx;
    this.setLevel(this.state.levels[idx]);
    this.handleTick();
  }
}
