import { gsap } from 'gsap';
import { SplitText } from 'gsap/all';

import { BaseScene } from '@/base/BaseScene';

import '../../styles/intro.style.scss';

export class Intro extends BaseScene {
  private loaded: boolean;
  private parentDestroy: () => void;
  private hasSeenOnce: boolean;

  constructor(nextLevel: () => void) {
    super(nextLevel);

    this.loaded = false;
    this.parentDestroy = super.destroy;
    this.hasSeenOnce = !!localStorage.getItem('seenIntro');
  }

  private splitTextShowOptions = {
    autoAlpha: 0,
    duration: 1,
    stagger: 0.05,
    y: '100%',
  };

  private splitTextOptions = {
    linesClass: 'line++',
    mask: 'lines',
    type: 'words, lines',
  } as SplitText.Vars;

  private handleAnimation() {
    const tl = gsap.timeline();
    const split1 = SplitText.create('.text1', this.splitTextOptions);
    const split2 = SplitText.create('.text2', this.splitTextOptions);
    const split3 = SplitText.create('.text3', this.splitTextOptions);
    const hint = SplitText.create('.hint', this.splitTextOptions);
    const titleSplitLines = SplitText.create('.title', this.splitTextOptions);
    const titleSplitChars = SplitText.create('.title', {
      position: 'relative',
      type: 'chars',
    });

    tl.from(split1.lines, this.splitTextShowOptions);
    tl.to('.husband', { delay: 0.02, duration: 1.5, opacity: 1 });
    tl.to('.serpentarium', { delay: -0.05, duration: 1.5, opacity: 1 });

    tl.from(split2.lines, {
      ...this.splitTextShowOptions,
      delay: 0.5,
    });
    tl.to('.neska', { delay: 0.05, duration: 1.5, opacity: 1 });

    tl.from(split3.lines, {
      ...this.splitTextShowOptions,
      delay: 0.4,
    });

    tl.to('.title', { delay: 0.05, duration: 1.5, opacity: 1 });

    tl.from(titleSplitLines.lines, {
      ...this.splitTextShowOptions,
      delay: 0.2,
    });

    gsap
      .timeline({ delay: 11, repeat: -1, repeatDelay: 0.5, yoyo: true })
      .to(titleSplitChars.chars, {
        color: '#FF69B4',
        duration: 0.2,
        ease: 'power2.in',
        fontWeight: 900,
        rotation: '360deg',
        scale: 0.7,
        stagger: {
          amount: 0.8,
          from: 'center',
          grid: [14, 14],
        },
        y: 6,
      })
      .to(
        titleSplitChars.chars,
        {
          color: '#fff',
          duration: 0.4,
          ease: 'power3.inOut',
          fontWeight: 200,
          rotation: '720deg',
          scale: 1,
          stagger: {
            amount: 0.8,
            from: 'center',
            grid: [14, 14],
          },
          y: 0,
        },
        '-=.3',
      );

    tl.from(hint.lines, {
      ...this.splitTextShowOptions,
      delay: 2,
      onComplete: () => {
        this.loaded = true;
        localStorage.setItem('seenIntro', 'true');
        this.hasSeenOnce = true;
      },
    });
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (e.code === 'Enter' && this.hasSeenOnce) {
      this.nextLevel();
    } else {
      if (this.loaded) {
        document.querySelector('.hint')!.innerHTML = 'ENTER блять';
      }
    }
  }

  private handleKeyboard() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  public destroy(): void {
    gsap.globalTimeline.clear();
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    this.parentDestroy();
  }

  init() {
    const section = this.create();
    section.classList.add('intro');
    section.innerHTML = `
      <div class="text-wrapper">
        <div class="text1">При поддержке мужа и Серпентария</div>
        <div class="images">
          <img src="./intro/husband.png" alt="Husband" class="husband" />
          <img src="./intro/serpentarium.png" alt="Serpentarium" class="serpentarium" />
        </div>
        <div class="text2">Под абсолютным контролем</div>
        <div class="text2">Госпожи Ненеке</div>
        <div class="images cat">
          <img src="./intro/neska.png" alt="Cat" class="neska" />
        </div>
        <div class="text3">
          Продолжение культового блокбастера KORZH-AGENT
        </div>
        <div class="title">
          KORZH-DEVELOPER
        </div>
        <div class="hint">Для продолжения нажми ENTER</div>
      </div>
    `;

    document.body.querySelector('#main')!.appendChild(section);
    this.handleAnimation();
    this.handleKeyboard();
  }
}
