import { BaseScene } from '@/base/BaseScene';
import { TLevel } from '@/types';

export class Outro extends BaseScene {
  name: TLevel;
  constructor(nextLevel: () => void) {
    super(nextLevel);

    this.name = 'outro';
  }
}
