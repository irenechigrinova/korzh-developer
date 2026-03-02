import { Enemy } from '@/base/Enemy';
import { Level } from '@/base/Level';
import { TMovementParams } from '@/types';

export class Sq extends Enemy {
  constructor(level: Level, params?: Partial<TMovementParams>, delay = 0) {
    super(
      level,
      'sq',
      {
        bottom: params?.bottom ?? 0,
        height: 50,
        left: params?.left ?? 1200,
        moveDirection: params?.moveDirection ?? 'left',
        speed: 3,
        width: 50,
      },
      1,
      300,
      delay,
      false,
    );
  }
}
