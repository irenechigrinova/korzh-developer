import { Level } from '@/base/Level';

import '../../styles/level2.style.scss';
import '../../styles/enemies.style.scss';
import { Obstacle } from '@/base/Obstacle';
import { Boss } from '@/controllers/enemies/Boss';
import { Bug } from '@/controllers/enemies/Bug';
import { Task } from '@/controllers/enemies/Task';

const prepareObstacles = (remove: (id: string) => void) => ({
  '-7200': [
    new Obstacle('brick-transparent', 112, 0, remove),
    new Obstacle('brick-transparent', 152, 0, remove, 40, 84),
    new Obstacle('brick-transparent', 192, 0, remove, 40, 123),
    new Obstacle('brick-transparent', 232, 0, remove, 40, 162),
    new Obstacle('brick-transparent', 272, 0, remove, 40, 203),
    new Obstacle('brick-transparent', 312, 0, remove, 40, 243),
    new Obstacle('brick-transparent', 352, 0, remove, 40, 283),
    new Obstacle('brick-transparent', 392, 0, remove, 40, 323),
    new Obstacle('brick-transparent', 432, 0, remove, 40, 323),
  ],
  '-6000': [
    new Obstacle('void', 120, 0, remove, 79),
    new Obstacle('brick-transparent', 199, 0, remove, 40, 162),
    new Obstacle('brick-transparent', 239, 0, remove, 40, 123),
    new Obstacle('brick-transparent', 279, 0, remove, 40, 84),
    new Obstacle('brick-transparent', 319, 0, remove),
    new Obstacle('tube-small', 519, 0, remove),
    new Obstacle('tube-small', 1066, 0, remove),
  ],
  '-4800': [
    new Obstacle('brick-transparent', 560, 0, remove),
    new Obstacle('brick-transparent', 600, 0, remove, 40, 84),
    new Obstacle('brick-transparent', 640, 0, remove, 40, 123),
    new Obstacle('brick-transparent', 680, 0, remove, 40, 162),
    new Obstacle('brick-transparent', 800, 0, remove, 40, 162),
    new Obstacle('brick-transparent', 840, 0, remove, 40, 123),
    new Obstacle('brick-transparent', 880, 0, remove, 40, 84),
    new Obstacle('brick-transparent', 920, 0, remove),
    new Obstacle('brick-transparent', 1120, 0, remove),
    new Obstacle('question', 225, 140, remove),
    new Obstacle('question', 80, 250, remove),
    new Obstacle('question', 324, 230, remove),
  ],
  '-3600': [
    new Obstacle('brick', 100, 140, remove),
    new Obstacle('brick', 144, 140, remove),
    new Obstacle('brick', 188, 140, remove),
    new Obstacle('brick', 300, 140, remove),
    new Obstacle('brick', 344, 140, remove),
    new Obstacle('brick', 388, 140, remove),
    new Obstacle('brick', 431, 140, remove),
    new Obstacle('brick', 600, 140, remove),
    new Obstacle('brick', 644, 140, remove),
    new Obstacle('brick', 688, 140, remove),
    new Obstacle('brick', 732, 140, remove),
    new Obstacle('brick', 776, 140, remove),
    new Obstacle('brick', 819, 140, remove),
    new Obstacle('brick', 950, 140, remove),
    new Obstacle('brick', 994, 140, remove),
    new Obstacle('brick', 1033, 140, remove),
    new Obstacle('brick', 1077, 140, remove),
  ],
  '-2400': [
    new Obstacle('void', 361, 0, remove, 79),
    new Obstacle('void', 1040, 0, remove, 120),
    new Obstacle('brick', 600, 140, remove),
    new Obstacle('brick', 644, 140, remove),
    new Obstacle('brick', 688, 140, remove),
    new Obstacle('question', 732, 140, remove),
    new Obstacle('question', 600, 310, remove),
    new Obstacle('question', 860, 470, remove),
    new Obstacle('brick', 645, 310, remove),
    new Obstacle('brick', 689, 310, remove),
    new Obstacle('brick', 733, 310, remove),
    new Obstacle('brick', 776, 310, remove),
  ],
  '-1200': [
    new Obstacle('question', 155, 200, remove),
    new Obstacle('question', 105, 200, remove),
    new Obstacle('brick', 780, 140, remove),
    new Obstacle('question', 825, 140, remove),
    new Obstacle('question', 680, 350, remove),
    new Obstacle('brick', 870, 140, remove),
    new Obstacle('tube-mid', 318, 0, remove),
    new Obstacle('tube-large', 639, 0, remove),
    new Obstacle('tube-large', 1011, 0, remove),
  ],
  0: [
    new Obstacle('question', 400, 140, remove),
    new Obstacle('brick', 600, 140, remove),
    new Obstacle('question', 644, 140, remove),
    new Obstacle('brick', 688, 140, remove),
    new Obstacle('question', 733, 140, remove),
    new Obstacle('brick', 776, 140, remove),
    new Obstacle('question', 690, 320, remove),
  ],
});

const prepareEnemies = (self: Level) => ({
  '-6000': [
    new Bug(self, { left: 330 }),
    new Bug(self, { left: 600, moveDirection: 'right' }),
    new Task(self, { left: 1000 }),
  ],
  '-3600': [
    new Bug(self, { bottom: 183, jumpDirection: 'down', left: 750 }),
    new Bug(self, { bottom: 183, jumpDirection: 'down', left: 450 }),
    new Boss('petya', () => self.onShowBoss()),
    new Task(self, { left: 560 }, 7300),
    new Task(self, { bottom: 0, left: 560, moveDirection: 'left' }, 7600),
    new Task(self, { bottom: 183, left: 580, moveDirection: 'left' }, 7100),
  ],
  '-2400': [
    new Bug(self, { jumpDirection: 'down', left: 900 }),
    new Bug(self, { jumpDirection: 'down', left: 800 }),
    new Bug(self, { jumpDirection: 'down', left: 320 }),
    new Task(self, {
      bottom: 183,
      jumpDirection: 'down',
      left: 700,
    }),
    new Task(self, {
      bottom: 353,
      jumpDirection: 'down',
      left: 700,
      moveDirection: 'right',
    }),
  ],
  '-1200': [
    new Bug(self, { jumpDirection: 'down', left: 640 }),
    new Bug(self, {
      jumpDirection: 'down',
      left: 680,
      moveDirection: 'right',
    }),
    new Bug(
      self,
      {
        bottom: 600,
        jumpDirection: 'down',
        left: 800,
      },
      2000,
    ),
    new Bug(
      self,
      { bottom: 600, isJumping: true, jumpDirection: 'up', left: 400 },
      1000,
    ),
    new Task(self, {
      bottom: 183,
      jumpDirection: 'down',
      left: 850,
    }),
    new Task(self, {
      left: 300,
    }),
  ],
  0: [
    new Bug(self),
    new Bug(self, {}, 1000),
    new Task(self, {}, 2500),
    new Bug(self, {}, 4000),
  ],
});

export class Level2 extends Level {
  constructor(
    nextLevel: () => void,
    score: (num: number) => void,
    onChangeScene: () => void,
    startLevel: () => void,
  ) {
    super({
      bgLast: -7200,
      name: '1',
      nextLevel,
      onChangeScene,
      prepareEnemies: () => ({}),
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
              <h2>Уровень 1</h2>
              <p>На пути Коржа к релизу ему будут попадаться баги и фичи (и опасные боссы), с которыми он должен расправиться с помощью МР.</p>
              <p>По мере роста очков тревожности будут открываться новые абилки.</p>
              <p>Управление: стрелки, МР - пробел</p>
            </div>
          </div>
          <menu class="dialog-menu">
            <button class="nes-btn is-primary">Ясно-понятно</button>
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
