import { BaseScene } from '@/base/BaseScene';
import { Enemy } from '@/base/Enemy';
import { Obstacle } from '@/base/Obstacle';
import { Boss } from '@/controllers/enemies/Boss';
import { Deadline } from '@/controllers/enemies/Deadline';
import { TBoss, TLevel } from '@/types';

export class Level extends BaseScene {
  private bgOffset: number;
  private bgOffsetLast: number;
  private obstacles: Record<number, Obstacle[]>;
  private enemies: Record<number, (Enemy | Boss | Deadline)[]>;
  private onChangeScene: (destroyAbility?: boolean) => void;
  private isBossIntro: boolean;
  private bossesShown: TBoss[];
  public startLevel: () => void;
  public getPlayerPosition: () => Record<string, any>;
  private prepareObstacles: (
    remove: (id: string) => void,
    getPlayerPosition: () => Record<string, any>,
    hitPlayer: (full?: boolean) => void,
  ) => Record<number, Obstacle[]>;
  private prepareEnemies: (
    level: Level,
  ) => Record<number, (Enemy | Boss | Deadline)[]>;
  private hitPlayer: (full?: boolean) => void;

  score: (num: number) => void;
  name: TLevel;
  isBossScene: boolean;

  private removeObstacle(id: string) {
    this.obstacles = {
      ...this.obstacles,
      [this.bgOffset]: this.obstacles[this.bgOffset].filter(
        (item) => item.getParams().id !== id,
      ),
    };
    document.querySelector(`#obs-${id}`)?.remove();
  }

  public removeEnemy(id: string) {
    this.enemies = {
      ...this.enemies,
      [this.bgOffset]: this.enemies[this.bgOffset].filter(
        (item) => item.getId?.() !== id,
      ),
    };
    document.querySelector(`#enemy-${id}`)?.remove();
  }

  public onShowBoss(type: TBoss, delay: number) {
    this.isBossIntro = true;
    this.bossesShown.push(type);
    (document.querySelector('#main-audio') as HTMLAudioElement)!.pause();
    (document.querySelector(
      '#boss-appearance-audio',
    ) as HTMLAudioElement)!.play();
    setTimeout(() => {
      (document.querySelector(
        '#boss-appearance-audio',
      ) as HTMLAudioElement)!.pause();
      (document.querySelector(
        '#boss-appearance-audio',
      ) as HTMLAudioElement)!.currentTime = 0;
      (document.querySelector('#main-audio') as HTMLAudioElement)!.play();
      this.isBossIntro = false;
    }, delay);
  }

  constructor(params: {
    name: TLevel;
    nextLevel: () => void;
    score: (num: number) => void;
    onChangeScene: () => void;
    startLevel: () => void;
    bgLast: number;
    prepareObstacles: (
      remove: (id: string) => void,
      getPlayerPosition: () => Record<string, any>,
      hitPlayer: () => void,
    ) => Record<number, Obstacle[]>;
    prepareEnemies: (
      level: Level,
    ) => Record<number, (Enemy | Boss | Deadline)[]>;
    getPlayerPosition: () => Record<string, any>;
    hitPlayer: () => void;
  }) {
    super(params.nextLevel);

    this.score = params.score;
    this.bgOffset = 0;
    this.bgOffsetLast = params.bgLast;
    this.onChangeScene = params.onChangeScene;
    this.name = params.name;
    this.isBossIntro = false;
    this.bossesShown = [];
    this.startLevel = params.startLevel;
    this.getPlayerPosition = params.getPlayerPosition;
    this.hitPlayer = params.hitPlayer;

    this.prepareEnemies = params.prepareEnemies;
    this.prepareObstacles = params.prepareObstacles;
    this.obstacles = params.prepareObstacles(
      this.removeObstacle.bind(this),
      this.getPlayerPosition.bind(this),
      this.hitPlayer.bind(this),
    );
    this.enemies = params.prepareEnemies(this);
    this.isBossScene = false;
  }

  init() {}

  public drawObstacles() {
    document.querySelector('.obstacles')?.remove();

    const obstacles = document.createElement('div');
    obstacles.classList.add('obstacles');
    document.body.querySelector('.game-body')?.appendChild(obstacles);
    this.obstacles[this.bgOffset]?.forEach((item) => item.draw(obstacles));
  }

  public drawEnemies() {
    const enemies = document.querySelector('.enemies');
    if (!enemies || !this.enemies[this.bgOffset]) return;

    this.enemies[this.bgOffset].forEach((item) => {
      if (
        !(item instanceof Boss) ||
        (item instanceof Boss && !this.bossesShown.includes(item.type))
      ) {
        item.init(enemies as HTMLDivElement);
      }
    });
  }

  private setStyles(bgOffset: number) {
    (this.node!.querySelector(
      '.game-body',
    ) as HTMLDivElement)!.style.backgroundPosition = `${this.bgOffset}px 0`;
    this.obstacles[bgOffset]?.forEach((item) => item.deactivate());
    this.drawObstacles();
    this.drawEnemies();
  }

  private destroyEnemies(offset: number) {
    if (!this.enemies[offset]) return;

    this.enemies[offset].forEach((enemy) => {
      const node = document.querySelector(
        `#enemy-${enemy.getId()}`,
      ) as HTMLDivElement;
      if (node) {
        node.style.display = 'none';
      }
    });
  }

  private changeSceneSelf(
    direction: 'next' | 'prev',
    bottom?: number,
    isMoving?: boolean,
  ) {
    if (this.isBossIntro || this.isBossScene) return false;

    const offset = this.bgOffset;
    if (direction === 'prev') {
      if (this.bgOffset !== 0) {
        this.bgOffset += 1200;
        this.setStyles(offset);
        this.destroyEnemies(offset);
        this.onChangeScene();
      }
    }
    if (direction === 'next') {
      if (this.bgOffset !== this.bgOffsetLast) {
        this.bgOffset -= 1200;
        this.setStyles(offset);
        this.destroyEnemies(offset);
        this.onChangeScene(this.name === '2' && this.bgOffset === -6000);

        if (this.name === '2' && this.bgOffset === this.bgOffsetLast) {
          this.isBossScene = true;
        }
      }
    }
    return true;
  }

  private getProgressSelf(): 'progress' | 'start' | 'end' {
    if (this.bgOffset === 0) return 'start';
    if (this.bgOffset === this.bgOffsetLast) return 'end';
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
    (this.enemies[this.bgOffset] ?? []).forEach((enemy) => {
      const isBoss = enemy instanceof Boss || enemy instanceof Deadline;
      if (!isBoss) {
        if (enemy.state === 'active') {
          enemy.setLeft();
          enemy.setStyles();
        }
      }
    });
  }

  public checkBossIntro() {
    return this.isBossIntro;
  }

  public addEnemies(newEnemies: Enemy[]) {
    if (!this.enemies[this.bgOffset]) {
      this.enemies[this.bgOffset] = [];
    }
    this.enemies[this.bgOffset].push(...newEnemies);

    const enemies = document.querySelector('.enemies');
    if (!enemies) return;

    newEnemies.forEach((item) => {
      item.init(enemies as HTMLDivElement);
    });
  }

  public restart() {
    document.querySelector('.obstacles')?.remove();
    document.querySelector('.enemies')?.remove();

    const div = document.createElement('div');
    div.className = 'enemies';
    document.querySelector('.game-body')?.append(div);

    const offset = this.bgOffset;
    this.bgOffset = 0;
    this.setStyles(offset);
    this.enemies = this.prepareEnemies(this);
    this.obstacles = this.prepareObstacles(
      this.removeObstacle.bind(this),
      this.getPlayerPosition.bind(this),
      this.hitPlayer.bind(this),
    );
    this.bossesShown = [];
    this.drawObstacles();
    this.drawEnemies();

    (document.querySelector(
      '#boss-appearance-audio',
    ) as HTMLAudioElement)!.pause();
    (document.querySelector(
      '#boss-appearance-audio',
    ) as HTMLAudioElement)!.currentTime = 0;
    (document.querySelector('#main-audio') as HTMLAudioElement)!.play();
  }

  public destroy(full?: boolean): void {
    this.obstacles[this.bgOffset]?.forEach((item) => item.deactivate());
    this.enemies[this.bgOffset]?.forEach((item) => (item as Enemy).dieHard());
    if (full) {
      this.node?.remove();
    }
  }
}
