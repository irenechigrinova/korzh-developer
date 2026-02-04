import { BaseScene } from '@/base/BaseScene';

import '../../styles/level1.style.scss';
import '../../styles/enemies.style.scss';
import { Enemy } from '@/base/Enemy';
import { Obstacle } from '@/base/Obstacle';
import { Bug } from '@/controllers/enemies/Bug';
import { Task } from '@/controllers/enemies/Task';

export class Level1 extends BaseScene {
  private bgOffset: number;
  private obstacles: Record<number, Obstacle[]>;
  private enemies: Record<number, Enemy[]>;
  private onChangeScene: () => void;

  score: (num: number) => void;

  private removeObstacle(id: string) {
    this.obstacles = {
      ...this.obstacles,
      [this.bgOffset]: this.obstacles[this.bgOffset].filter(
        (item) => item.getParams().id !== id,
      ),
    };
    document.querySelector(`#obs-${id}`)?.remove();
  }

  private removeEnemy(id: string) {
    this.enemies = {
      ...this.enemies,
      [this.bgOffset]: this.enemies[this.bgOffset].filter(
        (item) => item.getId() !== id,
      ),
    };
    document.querySelector(`#enemy-${id}`)?.remove();
  }

  constructor(nextLevel: () => void, score: (num: number) => void, onChangeScene: () => void) {
    super(nextLevel);

    this.score = score;
    this.bgOffset = 0;
    this.onChangeScene = onChangeScene;

    this.obstacles = {
      '-7200': [
        new Obstacle(
          'brick-transparent',
          112,
          0,
          this.removeObstacle.bind(this),
        ),
        new Obstacle(
          'brick-transparent',
          152,
          0,
          this.removeObstacle.bind(this),
          40,
          84,
        ),
        new Obstacle(
          'brick-transparent',
          192,
          0,
          this.removeObstacle.bind(this),
          40,
          123,
        ),
        new Obstacle(
          'brick-transparent',
          232,
          0,
          this.removeObstacle.bind(this),
          40,
          162,
        ),
        new Obstacle(
          'brick-transparent',
          272,
          0,
          this.removeObstacle.bind(this),
          40,
          203,
        ),
        new Obstacle(
          'brick-transparent',
          312,
          0,
          this.removeObstacle.bind(this),
          40,
          243,
        ),
        new Obstacle(
          'brick-transparent',
          352,
          0,
          this.removeObstacle.bind(this),
          40,
          283,
        ),
        new Obstacle(
          'brick-transparent',
          392,
          0,
          this.removeObstacle.bind(this),
          40,
          323,
        ),
        new Obstacle(
          'brick-transparent',
          432,
          0,
          this.removeObstacle.bind(this),
          40,
          323,
        ),
      ],
      '-6000': [
        new Obstacle('void', 120, 0, this.removeObstacle.bind(this), 79),
        new Obstacle(
          'brick-transparent',
          199,
          0,
          this.removeObstacle.bind(this),
          40,
          162,
        ),
        new Obstacle(
          'brick-transparent',
          239,
          0,
          this.removeObstacle.bind(this),
          40,
          123,
        ),
        new Obstacle(
          'brick-transparent',
          279,
          0,
          this.removeObstacle.bind(this),
          40,
          84,
        ),
        new Obstacle(
          'brick-transparent',
          319,
          0,
          this.removeObstacle.bind(this),
        ),
        new Obstacle('tube-small', 519, 0, this.removeObstacle.bind(this)),
        new Obstacle('tube-small', 1066, 0, this.removeObstacle.bind(this)),
      ],
      '-4800': [
        new Obstacle(
          'brick-transparent',
          560,
          0,
          this.removeObstacle.bind(this),
        ),
        new Obstacle(
          'brick-transparent',
          600,
          0,
          this.removeObstacle.bind(this),
          40,
          84,
        ),
        new Obstacle(
          'brick-transparent',
          640,
          0,
          this.removeObstacle.bind(this),
          40,
          123,
        ),
        new Obstacle(
          'brick-transparent',
          680,
          0,
          this.removeObstacle.bind(this),
          40,
          162,
        ),
        new Obstacle(
          'brick-transparent',
          800,
          0,
          this.removeObstacle.bind(this),
          40,
          162,
        ),
        new Obstacle(
          'brick-transparent',
          840,
          0,
          this.removeObstacle.bind(this),
          40,
          123,
        ),
        new Obstacle(
          'brick-transparent',
          880,
          0,
          this.removeObstacle.bind(this),
          40,
          84,
        ),
        new Obstacle(
          'brick-transparent',
          920,
          0,
          this.removeObstacle.bind(this),
        ),
        new Obstacle(
          'brick-transparent',
          1120,
          0,
          this.removeObstacle.bind(this),
        ),
        new Obstacle('question', 225, 140, this.removeObstacle.bind(this)),
        new Obstacle('question', 80, 250, this.removeObstacle.bind(this)),
        new Obstacle('question', 324, 230, this.removeObstacle.bind(this)),
      ],
      '-3600': [
        new Obstacle('brick', 100, 140, this.removeObstacle.bind(this)),
        new Obstacle('brick', 144, 140, this.removeObstacle.bind(this)),
        new Obstacle('brick', 188, 140, this.removeObstacle.bind(this)),
        new Obstacle('brick', 300, 140, this.removeObstacle.bind(this)),
        new Obstacle('brick', 344, 140, this.removeObstacle.bind(this)),
        new Obstacle('brick', 388, 140, this.removeObstacle.bind(this)),
        new Obstacle('brick', 431, 140, this.removeObstacle.bind(this)),
        new Obstacle('brick', 600, 140, this.removeObstacle.bind(this)),
        new Obstacle('brick', 644, 140, this.removeObstacle.bind(this)),
        new Obstacle('brick', 688, 140, this.removeObstacle.bind(this)),
        new Obstacle('brick', 732, 140, this.removeObstacle.bind(this)),
        new Obstacle('brick', 776, 140, this.removeObstacle.bind(this)),
        new Obstacle('brick', 819, 140, this.removeObstacle.bind(this)),
        new Obstacle('brick', 950, 140, this.removeObstacle.bind(this)),
        new Obstacle('brick', 994, 140, this.removeObstacle.bind(this)),
        new Obstacle('brick', 1033, 140, this.removeObstacle.bind(this)),
        new Obstacle('brick', 1077, 140, this.removeObstacle.bind(this)),
      ],
      '-2400': [
        new Obstacle('void', 361, 0, this.removeObstacle.bind(this), 79),
        new Obstacle('void', 1040, 0, this.removeObstacle.bind(this), 120),
        new Obstacle('brick', 600, 140, this.removeObstacle.bind(this)),
        new Obstacle('brick', 644, 140, this.removeObstacle.bind(this)),
        new Obstacle('brick', 688, 140, this.removeObstacle.bind(this)),
        new Obstacle('question', 732, 140, this.removeObstacle.bind(this)),
        new Obstacle('question', 600, 310, this.removeObstacle.bind(this)),
        new Obstacle('question', 860, 470, this.removeObstacle.bind(this)),
        new Obstacle('brick', 645, 310, this.removeObstacle.bind(this)),
        new Obstacle('brick', 689, 310, this.removeObstacle.bind(this)),
        new Obstacle('brick', 733, 310, this.removeObstacle.bind(this)),
        new Obstacle('brick', 776, 310, this.removeObstacle.bind(this)),
      ],
      '-1200': [
        new Obstacle('question', 155, 200, this.removeObstacle.bind(this)),
        new Obstacle('question', 105, 200, this.removeObstacle.bind(this)),
        new Obstacle('brick', 780, 140, this.removeObstacle.bind(this)),
        new Obstacle('question', 825, 140, this.removeObstacle.bind(this)),
        new Obstacle('question', 680, 350, this.removeObstacle.bind(this)),
        new Obstacle('brick', 870, 140, this.removeObstacle.bind(this)),
        new Obstacle('tube-mid', 318, 0, this.removeObstacle.bind(this)),
        new Obstacle('tube-large', 639, 0, this.removeObstacle.bind(this)),
        new Obstacle('tube-large', 1011, 0, this.removeObstacle.bind(this)),
      ],
      0: [
        new Obstacle('question', 400, 140, this.removeObstacle.bind(this)),
        new Obstacle('brick', 600, 140, this.removeObstacle.bind(this)),
        new Obstacle('question', 644, 140, this.removeObstacle.bind(this)),
        new Obstacle('brick', 688, 140, this.removeObstacle.bind(this)),
        new Obstacle('question', 733, 140, this.removeObstacle.bind(this)),
        new Obstacle('brick', 776, 140, this.removeObstacle.bind(this)),
        new Obstacle('question', 690, 320, this.removeObstacle.bind(this)),
      ],
    };

    this.enemies = {
      // '-6000': [
      //   new Bug(
      //     this,
      //     (num: number) => this.score(num),
      //     (id: string) => this.removeEnemy(id),
      //     { left: 330 },
      //   ),
      //   new Bug(
      //     this,
      //     (num: number) => this.score(num),
      //     (id: string) => this.removeEnemy(id),
      //     { left: 600, moveDirection: 'right' },
      //   ),
      //   new Task(
      //     this,
      //     (num: number) => this.score(num),
      //     (id: string) => this.removeEnemy(id),
      //     { left: 1000 },
      //   ),
      // ],
      // '-3600': [
      //   new Bug(
      //     this,
      //     (num: number) => this.score(num),
      //     (id: string) => this.removeEnemy(id),
      //     { bottom: -183, jumpDirection: 'down', left: 750 },
      //   ),
      //   new Bug(
      //     this,
      //     (num: number) => this.score(num),
      //     (id: string) => this.removeEnemy(id),
      //     { bottom: -183, jumpDirection: 'down', left: 450 },
      //   ),
      // ],
      // '-2400': [
      //   new Bug(
      //     this,
      //     (num: number) => this.score(num),
      //     (id: string) => this.removeEnemy(id),
      //     { jumpDirection: 'down', left: 900 },
      //   ),
      //   new Bug(
      //     this,
      //     (num: number) => this.score(num),
      //     (id: string) => this.removeEnemy(id),
      //     { jumpDirection: 'down', left: 800 },
      //   ),
      //   new Bug(
      //     this,
      //     (num: number) => this.score(num),
      //     (id: string) => this.removeEnemy(id),
      //     { jumpDirection: 'down', left: 320 },
      //   ),
      //   new Task(
      //     this,
      //     (num: number) => this.score(num),
      //     (id: string) => this.removeEnemy(id),
      //     {
      //       bottom: -183,
      //       jumpDirection: 'down',
      //       left: 700,
      //     },
      //   ),
      //   new Task(
      //     this,
      //     (num: number) => this.score(num),
      //     (id: string) => this.removeEnemy(id),
      //     {
      //       bottom: -353,
      //       jumpDirection: 'down',
      //       left: 700,
      //       moveDirection: 'right',
      //     },
      //   ),
      // ],
      // '-1200': [
      //   new Bug(
      //     this,
      //     (num: number) => this.score(num),
      //     (id: string) => this.removeEnemy(id),
      //     { bottom: -80, jumpDirection: 'down', left: 640 },
      //   ),
      //   new Bug(
      //     this,
      //     (num: number) => this.score(num),
      //     (id: string) => this.removeEnemy(id),
      //     {
      //       bottom: -80,
      //       jumpDirection: 'down',
      //       left: 680,
      //       moveDirection: 'right',
      //     },
      //   ),
      //   new Bug(
      //     this,
      //     (num: number) => this.score(num),
      //     (id: string) => this.removeEnemy(id),
      //     {
      //       bottom: -600,
      //       jumpDirection: 'down',
      //       left: 800,
      //       moveDirection: 'right',
      //     },
      //     2000,
      //   ),
      //   new Bug(
      //     this,
      //     (num: number) => this.score(num),
      //     (id: string) => this.removeEnemy(id),
      //     { bottom: -600, isJumping: true, jumpDirection: 'up', left: 400 },
      //     1000
      //   ),
      //   new Task(
      //     this,
      //     (num: number) => this.score(num),
      //     (id: string) => this.removeEnemy(id),
      //     {
      //       bottom: -183,
      //       jumpDirection: 'down',
      //       left: 850,
      //     },
      //   ),
      //   new Task(
      //     this,
      //     (num: number) => this.score(num),
      //     (id: string) => this.removeEnemy(id),
      //     {
      //       left: 300,
      //     },
      //   ),
      // ],
      // 0: [
      //   new Bug(
      //     this,
      //     (num: number) => this.score(num),
      //     (id: string) => this.removeEnemy(id),
      //   ),
      //   new Bug(
      //     this,
      //     (num: number) => this.score(num),
      //     (id: string) => this.removeEnemy(id),
      //     {},
      //     1000,
      //   ),
      //   new Task(
      //     this,
      //     (num: number) => this.score(num),
      //     (id: string) => this.removeEnemy(id),
      //     {},
      //     2500,
      //   ),
      //   new Bug(
      //     this,
      //     (num: number) => this.score(num),
      //     (id: string) => this.removeEnemy(id),
      //     {},
      //     4000,
      //   ),
      // ],
    };
  }

  init() {
    const section = this.create();
    section.classList.add('level1');

    // section.innerHTML = `
    //   <div class="game-body">
    //     <div class="instruction">
    //       <div class="instruction-block">
    //         <h2>Уровень 1</h2>
    //         <p>На пути Коржа к релизу ему будут попадаться баги и фичи, с которыми он должен расправиться с помощью МР.</p>
    //         <div class="desc">
    //           <div>
    //             <img src="korzh.png" alt="Korzh" />
    //             Корж
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // `;
    section.innerHTML = `<div class="game-body"><div class="enemies"></div></div>`;

    document.body.querySelector('#main')!.appendChild(section);
    this.drawObstacles();
    this.drawEnemies();
  }

  private drawObstacles() {
    document.querySelector('.obstacles')?.remove();

    const obstacles = document.createElement('div');
    obstacles.classList.add('obstacles');
    document.body.querySelector('.game-body')?.appendChild(obstacles);
    this.obstacles[this.bgOffset]?.forEach((item) => item.draw(obstacles));
  }

  private drawEnemies() {
    const enemies = document.querySelector('.enemies');
    if (!enemies || !this.enemies[this.bgOffset]) return;

    this.enemies[this.bgOffset].forEach((item) =>
      item.init(enemies as HTMLDivElement),
    );
  }

  private setStyles() {
    (this.node!.querySelector(
      '.game-body',
    ) as HTMLDivElement)!.style.backgroundPosition = `${this.bgOffset}px 0`;
    this.drawObstacles();
    this.drawEnemies();
  }

  private destroyEnemies(offset: number) {
    if (!this.enemies[offset]) return;

    this.enemies[offset].forEach((enemy) => {
      const node = document.querySelector(
        `#enemy-${enemy.getId()}`,
      ) as HTMLDivElement;
      node.style.display = 'none';
    });
  }

  private changeSceneSelf(
    direction: 'next' | 'prev',
    bottom?: number,
    isMoving?: boolean,
  ) {
    const offset = this.bgOffset;
    if (direction === 'prev') {
      if (this.bgOffset !== 0) {
        this.bgOffset += 1200;
        this.setStyles();
        this.destroyEnemies(offset);
        this.onChangeScene();
      }
    }
    if (direction === 'next') {
      if (this.bgOffset !== -7200) {
        this.bgOffset -= 1200;
        this.setStyles();
        this.destroyEnemies(offset);
        this.onChangeScene();
      }
    }
    return true;
  }

  private getProgressSelf(): 'progress' | 'start' | 'end' {
    if (this.bgOffset === 0) return 'start';
    if (this.bgOffset === -7200) return 'end';
    return 'progress';
  }

  public changeScene = this.changeSceneSelf.bind(this);
  public getProgress = this.getProgressSelf.bind(this);

  public getObstacles() {
    return this.obstacles[this.bgOffset];
  }

  public getEnemies() {
    return this.enemies[this.bgOffset];
  }

  public onTick() {
    if (!this.enemies[this.bgOffset]) return;
    this.enemies[this.bgOffset].forEach((enemy) => {
      if (enemy.state === 'active') {
        enemy.setLeft();
        enemy.setStyles();
      }
    });
  }
}
