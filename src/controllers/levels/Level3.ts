import { Level } from '@/base/Level';

import '../../styles/level3.style.scss';
import '../../styles/enemies.style.scss';

import { Cloud } from '@/controllers/enemies/Cloud';

const prepareObstacles = () => ({});

const prepareEnemies = (self: Level) => ({
  0: [
    new Cloud('КАРА', 'left', 0, 1200, self),
    new Cloud('ПСТ', 'right', 0, 2000, self),
    new Cloud('Вулны', 'center', 520, 3200, self),
    new Cloud('Лигалы', 'center', 268, 3000, self),
  ],
});

export class Level3 extends Level {
  public timer: number;
  private timeLeft: number;
  constructor(
    nextLevel: () => void,
    score: (num: number) => void,
    onChangeScene: () => void,
    startLevel: () => void,
    getPlayerPosition: () => Record<string, any>,
    hitPlayer: (full?: boolean) => void,
  ) {
    super({
      bgLast: 0,
      getPlayerPosition,
      hitPlayer,
      name: '3',
      nextLevel,
      onChangeScene,
      prepareEnemies,
      prepareObstacles,
      score,
      startLevel,
    });
    this.timer = 0;
    this.timeLeft = 120;
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.timeLeft -= 1;
      if (this.timeLeft === 0) {
        clearInterval(this.timer);
        this.nextLevel();
        this.timer = 0;
        const enemies = this.getEnemies();
        enemies.forEach((enemy) => {
          if ((enemy as any).type === 'fireball') {
            enemy.dieHard();
          } else {
            (enemy as Cloud).destroy();
          }
        });
        setTimeout(() => {
          (document.querySelector('.fire') as HTMLDivElement)!.style.opacity =
            '0';
          document.querySelector('.score')?.remove();
          document.querySelector('.hearts')?.remove();
          document.querySelector('.timer')?.remove();
        }, 1000);
        setTimeout(() => {
          (document.querySelector('.bg') as HTMLDivElement)!.style.opacity =
            '0';
          (document.querySelector(
            '.game-body',
          ) as HTMLDivElement)!.style.backgroundImage =
            'url("./level3/level3-finish.png")';
        }, 2000);
        setTimeout(() => {
          (document.querySelector('.sun') as HTMLDivElement)!.style.transform =
            'translate(0, 0)';
        }, 3000);
        setTimeout(() => {
          (document.querySelector(
            '.congrats',
          ) as HTMLDivElement)!.style.transform = 'scale(1)';
        }, 3600);

        setTimeout(() => {
          (document.querySelector('.thanks') as HTMLDivElement)!.style.opacity =
            '1';
        }, 5500);
      }
      const timer = document.querySelector('.timer')!;
      const bg = document.querySelector('.bg')! as HTMLDivElement;
      timer.innerHTML = `Осталось продержаться: ${this.timeLeft}`;
      if (
        this.timeLeft <= 80 &&
        this.timeLeft >= 40 &&
        !timer.classList.contains('yellow')
      ) {
        timer.classList.add('yellow');
        bg.style.opacity = '0.2';
      }
      if (
        this.timeLeft >= 0 &&
        this.timeLeft < 40 &&
        !timer.classList.contains('green')
      ) {
        timer.classList.add('green');
        bg.style.opacity = '0.3';
      }
    }, 1000);
  }

  init() {
    const section = this.create();
    section.classList.add('level3');
    this.node = section;

    section.innerHTML = `
        <div class="intro">
          <h3 class="fade-in">релиз</h3>
          <p class="fade-in second">просто держись</p>
          <p class="fade-in small">*На очки тревожности можно призывать помощь (жмакай H)</p>
        </div>
        <div class="game-body">
          <div class="bg"></div>
          <div class="fire"></div>
          <div class="sun"></div>
          <div class="congrats"></div>
          <div class="enemies"></div>
          <div class="timer">Осталось продержаться: ${this.timeLeft}</div>
          <div class="hearts">
            Жизни:
            <i class="nes-icon is-medium heart"></i>
            <i class="nes-icon is-medium heart"></i>
            <i class="nes-icon is-medium heart"></i>
            <i class="nes-icon is-medium heart"></i>
            <i class="nes-icon is-medium heart"></i>
          </div>
          <div class="thanks">
            <p>Благодарности</p>
            <p>Прежде всего, хочу поблагодарить своего супруга, который постоянно говорил мне, как надо делать, а как не надо.</p>
            <p>Отдельной благодарности заслуживает мой личный штат тестировщиков - Полина, Серёжа и Ваня. Эти люди прошли игру больше раз, чем я при разработке. Они нашли баги, которые меня потом преследовали в кошмарах (если найдёте ещё баг, пожалуйста, просто скажите, что это фича).</p>
            <p>Полине также спасибо за её прекрасные идеи, без них Корж-Девелопер не был бы таким крутым.</p>
            <p>Спасибо Андрею за его веру, что я доделаю Коржа (я уже сама не была в этом уверена).</p>
            <p>Спасибо всем, кто дошёл до конца и подписал-таки релиз.</p>
          </div>
        </div>`;

    document.body.querySelector('#main')!.appendChild(section);
    setTimeout(() => {
      section.classList.add('with-bg');
      this.startLevel();
      this.drawEnemies();
    }, 5000);

    setTimeout(() => {
      this.startTimer();
    }, 7000);

    (document.querySelector('#main-audio') as HTMLAudioElement)!.pause();
    (document.querySelector('#main-audio') as HTMLAudioElement)!.currentTime =
      0;
    (document.querySelector('#final-audio') as HTMLAudioElement)!.play();
  }
}
