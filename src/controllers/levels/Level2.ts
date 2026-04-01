import { Level } from '@/base/Level';

import '../../styles/level2.style.scss';
import '../../styles/enemies.style.scss';
import { Obstacle } from '@/base/Obstacle';
import { Boss } from '@/controllers/enemies/Boss';
import { Bug } from '@/controllers/enemies/Bug';
import { Deadline } from '@/controllers/enemies/Deadline';
import { Sq } from '@/controllers/enemies/Sq';
import { Task } from '@/controllers/enemies/Task';

const prepareObstacles = (
  remove: (id: string) => void,
  getPlayerPosition: () => Record<string, any>,
  hitPlayer: (full?: boolean) => void,
) => ({
  '-6000': [new Obstacle('brick-transparent', 0, 400, remove, 1200, 40)],
  '-4800': [
    new Obstacle('brick-transparent', 0, 400, remove, 1200, 40),
    new Obstacle('brick-transparent', 0, 322, remove, 296, 81),
    new Obstacle('brick-transparent', 854, 282, remove, 82, 119),
    new Obstacle('brick-transparent', 814, 0, remove, 122, 161),
    new Obstacle('brick-transparent', 0, 0, remove, 296, 121),
    new Obstacle(
      'bridge',
      295,
      75,
      remove,
      520,
      45,
      getPlayerPosition,
      hitPlayer,
    ),
    new Obstacle('void', 295, 0, remove, 520),
  ],
  '-3600': [
    new Obstacle('brick-transparent', 0, 400, remove, 1200, 40),
    new Obstacle('brick-transparent', 0, 322, remove, 216, 81),
    new Obstacle('brick-transparent', 814, 322, remove, 387, 81),
    new Obstacle('brick-transparent', 574, 0, remove, 122, 121),
    new Obstacle('brick-transparent', 814, 0, remove, 202, 121),
    new Obstacle('brick-transparent', 1094, 0, remove, 107, 121),
    new Obstacle('void', 215, 0, remove, 120),
    new Obstacle('void', 455, 0, remove, 120),
    new Obstacle('void', 695, 119, remove, 120),
  ],
  '-2400': [
    new Obstacle('brick-transparent', 734, 0, remove, 123, 41),
    new Obstacle('brick-transparent', 775, 0, remove, 41, 81),
    new Obstacle('brick-transparent', 0, 400, remove, 1200, 40),
    new Obstacle('brick-transparent', 734, 322, remove, 123, 80),
    new Obstacle('brick-transparent', 775, 280, remove, 41, 81),
    new Obstacle('brick-transparent', 1174, 323, remove, 35, 78),
    new Obstacle(
      'client-green',
      786,
      56,
      remove,
      35,
      78,
      getPlayerPosition,
      hitPlayer,
    ),
    new Obstacle(
      'client-blue',
      786,
      308,
      remove,
      35,
      78,
      getPlayerPosition,
      hitPlayer,
    ),
    new Obstacle('void', 1095, 0, remove, 80),
  ],
  '-1200': [
    new Obstacle('brick-transparent', 0, 0, remove, 176, 121),
    new Obstacle('brick-transparent', 0, 400, remove, 1200, 40),
    new Obstacle('brick-transparent', 174, 322, remove, 442, 83),
    new Obstacle('brick-transparent', 894, 322, remove, 122, 83),
    new Obstacle('void', 615, 0, remove, 80),
  ],
  0: [
    new Obstacle('brick-transparent', 0, 0, remove, 96, 241),
    new Obstacle('brick-transparent', 96, 0, remove, 40, 201),
    new Obstacle('brick-transparent', 0, 362, remove, 615, 79),
    new Obstacle('brick-transparent', 133, 0, remove, 43, 161),
    new Obstacle('brick-transparent', 172, 0, remove, 444, 121),
    new Obstacle('void', 615, 118, remove, 80),
    new Obstacle('brick-transparent', 695, 0, remove, 120, 121),
    new Obstacle('brick-transparent', 615, 399, remove, 585, 42),
    new Obstacle('void', 815, 118, remove, 80),
    new Obstacle('brick-transparent', 895, 0, remove, 120, 121),
    new Obstacle('void', 1015, 118, remove, 80),
    new Obstacle('brick-transparent', 1092, 0, remove, 120, 121),
  ],
});

const prepareEnemies = (self: Level) => ({
  '-6000': [new Deadline(self)],
  '-4800': [
    new Boss(self, 'bogi'),
    new Bug(self, { bottom: 0, left: 940 }),
    new Bug(self, { bottom: 0, left: 960 }),
  ],
  '-3600': [],

  '-2400': [
    new Boss(self, 'ermakov'),
    new Bug(self, { bottom: 0, left: 400 }),
    new Bug(self, { bottom: 0, left: 500 }),
    new Bug(self, { bottom: 0, left: 950 }),
    new Sq(self, { bottom: 0, left: 420 }),
  ],
  '-1200': [
    new Boss(self, 'nikolina'),
    new Bug(self, { bottom: 0, left: 200 }),
    new Bug(self, { bottom: 0, left: 300 }),
  ],
  0: [
    new Sq(self, { bottom: 119, left: 420 }),
    new Task(self, { bottom: 119, left: 695 }),
    new Task(self, { bottom: 119, left: 950, moveDirection: 'left' }),
  ],
});

export class Level2 extends Level {
  constructor(
    nextLevel: () => void,
    score: (num: number) => void,
    onChangeScene: () => void,
    startLevel: () => void,
    getPlayerPosition: () => Record<string, any>,
    hitPlayer: (full?: boolean) => void,
  ) {
    super({
      bgLast: -6000,
      getPlayerPosition,
      hitPlayer,
      name: '2',
      nextLevel,
      onChangeScene,
      prepareEnemies,
      prepareObstacles,
      score,
      startLevel,
    });
  }

  init() {
    const section = this.create();
    section.classList.add('level2');

    section.innerHTML = `
      <div class="dialog-container"><dialog class="nes-dialog is-rounded" id="dialog-rounded" open="">
        <form method="dialog" id="level-2-inst">
          <div class="instruction">
            <div class="instruction-block">
              <h2>Уровень 2</h2>
              <p>Чем ближе к релизу, тем злее лиды.</p>
              <p>И еще появляется новый враг, его нельзя уничтожить мр, только прыжком сверху.</p>
            </div>
          </div>
          <menu class="dialog-menu">
            <button class="nes-btn is-primary">Погнали</button>
          </menu>
        </form>
      </dialog></div>
    `;

    const handleEnter = (e: KeyboardEvent) => {
      if (
        (e.code === 'Enter' || e.code === 'NumpadEnter') &&
        document.querySelector('#level-2-inst')
      ) {
        document.body.removeEventListener('keyup', handleEnter);
        section.innerHTML = `<div class="game-body"><div class="enemies"></div></div>`;

        this.startLevel();
        this.drawObstacles();
        this.drawEnemies();

        const audio = document.querySelector('#main-audio') as HTMLAudioElement;
        if (audio) {
          audio.play();
          audio.volume = 0.2;
        }
      }
    };
    document.body.querySelector('#main')!.appendChild(section);

    document.body.addEventListener('keyup', handleEnter);
    document.body
      .querySelector('#level-2-inst')
      ?.addEventListener('submit', (e) => {
        e.preventDefault();
        handleEnter({ code: 'Enter' } as KeyboardEvent);
      });
  }
}
