import { BaseScene } from '@/base/BaseScene';
import { TLevel } from '@/types';

export class Level2 extends BaseScene {
  name: TLevel;
  constructor(nextLevel: () => void) {
    super(nextLevel);

    this.name = '2';
  }
}
