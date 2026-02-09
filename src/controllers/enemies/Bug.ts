import { Enemy } from '@/base/Enemy';
import { Level } from '@/base/Level';
import { TMovementParams } from '@/types';

export class Bug extends Enemy {
  constructor(level: Level, params?: Partial<TMovementParams>, delay = 0) {
    super(
      level,
      'bug',
      {
        bottom: params?.bottom ?? 0,
        height: 45,
        left: params?.left ?? 1200,
        moveDirection: params?.moveDirection ?? 'left',
        speed: 2,
        width: 65,
      },
      1,
      100,
      delay,
    );
  }
}
