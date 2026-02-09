import { BaseScene } from '@/base/BaseScene';

import '../../styles/age.style.scss';
import { TLevel } from '@/types';

export class AgeCheck extends BaseScene {
  name: TLevel;

  constructor(nextLevel: () => void) {
    super(nextLevel);

    this.name = '18+';
  }

  private handleSubmit() {
    const handleEnter = (e: KeyboardEvent) => {
      if ((e.code === 'Enter' || e.code === 'NumpadEnter') && document.querySelector('#age-check')) {
        localStorage.setItem('skip18', 'true');
        this.nextLevel();
        document.body.removeEventListener('keyup', handleEnter);
      }
    };
    document.body.addEventListener('keyup', handleEnter);
    document.body
      .querySelector('#age-check')
      ?.addEventListener('submit', (e) => {
        e.preventDefault();
        handleEnter({ code: 'Enter' } as KeyboardEvent);
      });
  }

  init() {
    const section = this.create();
    section.classList.add('age');
    section.innerHTML = `
      <dialog class="nes-dialog is-rounded" id="dialog-rounded" open="">
        <form method="dialog" id="age-check">
          <p>Игра содержит ненормативную лексику и сцены насилия. </p>
          <menu class="dialog-menu">
            <button class="nes-btn is-primary">Мне есть 18</button>
          </menu>
        </form>
      </dialog>
    `;

    document.body.querySelector('#main')!.appendChild(section);
    this.handleSubmit();
  }
}
