import { BaseScene } from '@/base/BaseScene';

import '../../styles/level1.style.scss';

export class Level1 extends BaseScene {
  private bgOffset: number;

  constructor(nextLevel: () => void) {
    super(nextLevel);

    this.bgOffset = 0;
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
    section.innerHTML = `<div class="game-body"></div>`;

    document.body.querySelector('#main')!.appendChild(section);
  }

  private setStyles() {
    (this.node!.querySelector(
      '.game-body',
    ) as HTMLDivElement)!.style.backgroundPosition = `${this.bgOffset}px 0`;
  }

  private changeSceneSelf(direction: 'next' | 'prev') {
    if (direction === 'prev') {
      if (this.bgOffset !== 0) {
        this.bgOffset += 1200;
        this.setStyles();
      }
    }
    if (direction === 'next') {
      if (this.bgOffset !== -7200) {
        this.bgOffset -= 1200;
        this.setStyles();
      }
    }
  }

  private getProgressSelf(): 'progress' | 'start' | 'end' {
    if (this.bgOffset === 0) return 'start';
    if (this.bgOffset === -7200) return 'end';
    return 'progress';
  }

  public changeScene = this.changeSceneSelf.bind(this);
  public getProgress = this.getProgressSelf.bind(this);
}
