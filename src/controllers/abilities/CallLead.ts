import { Enemy } from '@/base/Enemy';
import { Boss } from '@/controllers/enemies/Boss';
import { Bug } from '@/controllers/enemies/Bug';
import { ILevel } from '@/types';

export class CallLead {
  private leads: {
    url: string;
    name: string;
    willHelp: number;
    noWayText: string;
    fatality: string;
  }[];
  private activeLead: number;
  private interval: number;
  private node: HTMLDivElement | null;
  private onFatality: (isOn: boolean) => void;
  private level: ILevel;
  private state: 'idle' | 'active' | 'pending';
  private timeout: number;
  private hasBeenShown: boolean;

  constructor(level: ILevel, onFatality: (isOn: boolean) => void) {
    this.leads = [
      {
        fatality: 'Богданити',
        name: 'bogi',
        noWayText: 'У зелёного клиента',
        url: './leads/bogi-2.png',
        willHelp: 4,
      },
      {
        fatality: 'Иринити',
        name: 'ira',
        noWayText: 'На собесе',
        url: './leads/ira-2.png',
        willHelp: 5,
      },
      {
        fatality: 'Полинити',
        name: 'polly',
        noWayText: 'фстек',
        url: './leads/polly.png',
        willHelp: 6,
      },
      {
        fatality: 'Игорянити <br />(муахаха)',
        name: 'igor',
        noWayText: 'Пожарная тревога',
        url: './leads/igor.png',
        willHelp: 7,
      },
      {
        fatality: 'Стасянити',
        name: 'stas',
        noWayText: 'Всё по плану',
        url: './leads/stas.png',
        willHelp: 8,
      },
    ];
    this.activeLead = 0;
    this.interval = 0;
    this.node = null;
    this.onFatality = onFatality;
    this.state = 'idle';
    this.level = level;
    this.timeout = 10000;
    this.hasBeenShown = false;
  }

  private startIdleAnimation() {
    this.interval = window.setInterval(() => {
      const rand = Math.floor(Math.random() * 5);
      this.activeLead = rand === this.activeLead ? 0 : rand;
      document.querySelectorAll('.leads img').forEach((node, idx) => {
        if (idx === this.activeLead) {
          node.classList.add('active');
        } else {
          node.classList.remove('active');
        }
      });
    }, 550);
    if (this.state === 'pending') {
      this.node?.querySelector('.pending')?.classList.add('active');
      setTimeout(() => {
        this.state = 'idle';
        this.node?.querySelector('.pending')?.classList.remove('active');
      }, this.timeout);
    } else {
      this.node?.querySelector('.pending')?.classList.remove('active');
    }
  }

  private cannotHelp() {
    const text = document.createElement('div');
    text.className = 'no-way nes-balloon from-left';
    text.innerHTML = `<span>${this.leads[this.activeLead].noWayText}</span>`;
    this.node!.append(text);
    (document.querySelector('#lead-fail-audio') as HTMLAudioElement)!.play();
    setTimeout(() => {
      text.remove();
      this.startIdleAnimation();
      this.state = 'idle';
    }, 1500);
  }

  private willHelp() {
    this.onFatality(true);

    const lead = this.leads[this.activeLead];
    const text = document.createElement('div');
    text.className = 'fatality';
    text.innerHTML = lead.fatality;
    document.querySelector('main .game-body')!.append(text);
    (document.querySelector('#fatality-audio') as HTMLAudioElement)!.play();

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

    setTimeout(
      () => {
        text.remove();
        lightning.remove();
        lightning2.remove();
        this.state = 'pending';
        this.startIdleAnimation();
        this.onFatality(false);

        if (lead.name === 'igor') {
          const rand = () => Math.random() * (800 - 200) + 200;
          this.level.addEnemies?.([
            new Bug(
              this.level,
              (num: number) => this.level.score?.(num),
              (id: string) => this.level.removeEnemy?.(id),
              {
                bottom: 600,
                isJumping: true,
                jumpDirection: 'up',
                left: rand(),
              },
            ),
            new Bug(
              this.level,
              (num: number) => this.level.score?.(num),
              (id: string) => this.level.removeEnemy?.(id),
              {
                bottom: 600,
                isJumping: true,
                jumpDirection: 'up',
                left: rand(),
              },
            ),
            new Bug(
              this.level,
              (num: number) => this.level.score?.(num),
              (id: string) => this.level.removeEnemy?.(id),
              {
                bottom: 600,
                isJumping: true,
                jumpDirection: 'up',
                left: rand(),
              },
            ),
          ]);
        }
      },
      lead.name === 'igor' ? 1500 : 3000,
    );

    if (lead.name !== 'igor') {
      setTimeout(() => {
        const enemies = (this.level.getEnemies?.() ?? []).filter(
          (item) => !(item instanceof Boss) && item.state === 'active',
        );
        enemies.forEach((enemy) => (enemy as Enemy).explode());
      }, 1000);
    }
  }

  private activateLead() {
    this.state = 'active';
    this.node!.querySelector('.leads')?.classList.add('activated');
    const willHelp =
      Math.floor(Math.random() * 10) > this.leads[this.activeLead].willHelp;
    if (willHelp) {
      this.willHelp();
    } else {
      this.cannotHelp();
    }
  }

  private watch(e: KeyboardEvent) {
    if (e.code === 'KeyL' && this.interval && this.state === 'idle') {
      window.clearInterval(this.interval);
      this.activateLead();
    }
  }

  init() {
    const start = () => {
      const div = document.createElement('div');
      div.className = 'call-lead';
      div.innerHTML = `
          <div class="leads">
            ${this.leads.map((lead) => `<img src="${lead.url}" alt="${lead.name}" id="lead-${lead.name}" />`).join('')}
            <div class="pending"></div>
          </div>
          <p>Призыв лида &lt;L&gt;</p>
        `;
      this.node = div;
      document.querySelector('main .abilities')?.append(div);
      this.startIdleAnimation();
      document
        .querySelector('body')
        ?.addEventListener('keyup', this.watch.bind(this));
    };
    if (!this.hasBeenShown) {
      this.hasBeenShown = true;
      this.onFatality(true);
      const div = document.createElement('div');
      div.className = 'dialog-container';
      div.innerHTML = `
      <dialog class="nes-dialog is-rounded" id="dialog-rounded" open="">
        <form method="dialog">
          <p>Ты получаешь абилку "Призыв лида"</p>
          <p>Рандомный лид поможет тебе. Или нет.</p>
          <p>В любом случае - жми L. Вдруг повезёт ;)</p>
          <p class="small">* Помощь лидов не приносит очки</p>
          <menu class="dialog-menu">
            <button class="nes-btn is-primary">OK</button>
          </menu>
        </form>
      </dialog>
    `;
      const handleEnter = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          document.body.querySelector('.dialog-container')!.remove();
          document.body.removeEventListener('keyup', handleEnter);
          this.onFatality(false);
          start();
        }
      };
      document.body.appendChild(div);
      document.body.addEventListener('keyup', handleEnter);
      document.body.querySelector('form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        handleEnter({ key: 'Enter' } as KeyboardEvent);
      });
    } else {
      start();
    }
  }

  public destroy() {
    window.clearInterval(this.interval);
    document
      .querySelector('body')
      ?.removeEventListener('keyup', this.watch.bind(this));
    this.node?.remove();
  }
}
