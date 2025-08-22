import { BaseScene } from '@/base/BaseScene';

import '../../styles/age.style.scss';

export class AgeCheck extends BaseScene {
  constructor(nextLevel: () => void) {
    super(nextLevel);
  }

  private handleSubmit() {
    document.body
      .querySelector('#main form')
      ?.addEventListener('submit', (e) => {
        e.preventDefault();
        localStorage.setItem('skip18', 'true');
        this.nextLevel();
      });
  }

  init() {
    const section = this.create();
    section.classList.add('age');
    section.innerHTML = `
      <dialog class="nes-dialog is-rounded" id="dialog-rounded" open="">
        <form method="dialog">
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
