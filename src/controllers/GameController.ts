import { Level as LevelBase } from '@/base/Level';
import { CallLead } from '@/controllers/abilities/CallLead';
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
    curLevel: null | LevelBase;
    score: number;
    playerLevel: 'middle' | 'senior';
    paused: boolean;
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
  private callLeadAbility: CallLead | null;

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
      if (!this.callLeadAbility) {
        this.callLeadAbility = new CallLead(
          this.state.curLevel as LevelBase,
          (isOn: boolean) => this.handleFatality(isOn),
        );
      }
      this.callLeadAbility.init();
    }

    this.renderScore();
  }

  private renderDieItem() {
    const rand = Math.floor(Math.random() * 4);
    switch (rand) {
      default:
      case 0: {
        const randLead = Math.random();
        const url = `./leads/${randLead % 2 === 0 ? 'ira' : 'bogi'}.png`;

        return `<div class="die-item-container"><img src=${url} alt="lead" class="lead" /><p>Мне не нравится</p></div>`;
      }
      case 1:
        return `<div class="die-item-container"><img src="./other/polly.png" alt="lead" ></div>`;
      case 2:
        return `<div class="die-item-container"><img src="./other/nik.png" alt="lead" /></div>`;
      case 3:
        return `
      <div class="die-item-container dontlike-container">
        <img src="./dontlike/1.png" alt="dontlike" class="dontlike dontlike-1" />
        <img src="./dontlike/2.png" alt="dontlike" class="dontlike dontlike-2" />
        <img src="./dontlike/3.png" alt="dontlike" class="dontlike dontlike-3" />
        <img src="./dontlike/4.png" alt="dontlike" class="dontlike dontlike-4" />
        <img src="./dontlike/5.png" alt="dontlike" class="dontlike dontlike-5" />
        <img src="./dontlike/6.png" alt="dontlike" class="dontlike dontlike-6" />
        <img src="./dontlike/7.png" alt="dontlike" class="dontlike dontlike-7" />
        <img src="./dontlike/8.png" alt="dontlike" class="dontlike dontlike-8" />
      </div>`;
    }
  }

  private playerDead() {
    this.state.paused = true;
    const div = document.createElement('div');
    div.className = 'dialog-container';
    div.innerHTML = `
      <dialog class="nes-dialog is-rounded" id="dialog-rounded" open="">
        <form method="dialog" id="you-are-dead">
          ${this.renderDieItem()}
          <menu class="dialog-menu">
            <button class="nes-btn is-primary" type="submit">Заново</button>
          </menu>
        </form>
      </dialog>
    `;
    const handleEnter = (e: KeyboardEvent) => {
      if (e.code === 'Enter' || e.code === 'NumpadEnter') {
        this.state.paused = false;
        this.state.score = 0;
        this.state.playerLevel = 'middle';
        this.renderScore();
        document.body.querySelector('.dialog-container')!.remove();
        document.body.removeEventListener('keyup', handleEnter);
        this.player?.destroy();
        this.callLeadAbility?.destroy();
        this.state.curLevel?.restart?.();
        this.player = new Player(
          this.state.curLevel as LevelBase,
          () => this.getPlayerLevel(),
          (num: number) => this.setScore(num),
          () => {
            this.state.playerLevel = 'middle';
            this.state.score -= 1000;
            this.renderScore();
            this.callLeadAbility?.destroy();
          },
          () => this.playerDead(),
        );
        this.player.init();
      }
    };
    document.body.appendChild(div);
    document.body.addEventListener('keyup', handleEnter);
    document.body
      .querySelector('#you-are-dead')
      ?.addEventListener('submit', (e) => {
        e.preventDefault();
        handleEnter({ code: 'Enter' } as KeyboardEvent);
      });
  }

  private handleFatality(isOn: boolean) {
    this.state.paused = isOn;
  }

  private setLevel(name: TLevel) {
    const Component = this.mapping[name];
    if (!Component) return;

    const start = () => {
      if (name === '1') {
        this.player = new Player(
          Level as LevelBase,
          () => this.getPlayerLevel(),
          (num: number) => this.setScore(num),
          () => {
            this.state.playerLevel = 'middle';
            this.state.score -= 1000;
            this.renderScore();
            this.callLeadAbility?.destroy();
          },
          () => this.playerDead(),
        );
      }

      this.player?.init();

      if (['1', '2'].includes(name)) {
        const div = document.createElement('div');
        div.className = 'score';
        document.querySelector('main .game-body')?.append(div);
        this.renderScore();

        const abilities = document.createElement('div');
        abilities.className = 'abilities';
        document.querySelector('main .game-body')?.append(abilities);
      }
    };

    this.state.curLevel?.destroy();
    const Level = new Component(
      () => this.nextLevel(),
      (num: number) => this.setScore(num),
      () => this.handleChangeScene(),
      start,
    );
    this.state.curLevel = Level as LevelBase;
    Level.init();
  }

  private handleChangeScene() {
    this.player?.destroyFireballs();
  }

  constructor() {
    this.state = {
      curLevel: null,
      levelIdx: 0,
      levels: ['18+', 'intro', '1', '2', '3', 'outro'],
      paused: false,
      playerLevel: 'middle',
      score: 0,
    };
    this.player = null;
    this.reqAnimationFrameId = 0;
    this.callLeadAbility = null;
  }

  private handleTick() {
    this.reqAnimationFrameId = window.requestAnimationFrame(() => {
      if (!this.state.paused) {
        if (this.player) {
          this.player.onTick();
        }
        if (this.state.curLevel) {
          this.state.curLevel.onTick?.();
        }
      }

      this.handleTick();
    });
  }

  init() {
    const skip18 = localStorage.getItem('skip18');

    let idx = 0;
    if (skip18) idx = 1;

    const div = document.createElement('div');
    div.className = 'powered';
    div.innerHTML = `
      Powered by KCS
      <svg fill='none' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 38 40' width="40">
        <g>
          <g>
            <path
              fill-rule='evenodd'
              clip-rule='evenodd'
              d='M24.806 17v-6.625L19 7.055l-5.806 3.32V17L7.71 20.135v6.988l6.129 3.503V23.65L19 20.694l5.161 2.956v6.976l6.13-3.503v-6.988l-5.485-3.134Zm-.645-.012-4.838 2.766v-5.87l4.838-2.766v5.87ZM19 7.798l4.834 2.764L19 13.326l-4.834-2.764L19 7.799Zm-5.161 3.32 4.838 2.766v5.87l-4.838-2.766v-5.87Zm-.645 18.397-4.84-2.767V20.88l4.84 2.77v5.866Zm.322-6.424-4.834-2.768 4.834-2.764 4.834 2.764-4.834 2.768Zm6.134-2.768 4.834-2.764 4.834 2.764-4.834 2.768-4.834-2.768Zm9.995 6.425-4.838 2.767V23.65l4.838-2.77v5.868Z'
              fill='#000'
            />
          </g>
          <g>
            <path
                    d='m19 21.525-4.516 2.593v4.96c0 3.078 4.516 4.554 4.516 4.554s4.516-1.476 4.516-4.555v-4.959L19 21.525Zm3.871 7.552c0 2.262-3.032 3.581-3.871 3.895-.839-.314-3.871-1.633-3.871-3.895v-4.614L19 22.247l3.871 2.216v4.614Z'
                    fill='#000'
            />
          </g>
        </g>
      </svg>
    `;
    document.querySelector('.body-loading')!.appendChild(div);

    this.state.levelIdx = idx;
    this.setLevel(this.state.levels[idx]);
    this.handleTick();
  }
}
