import { Enemy } from '@/base/Enemy';
import { ILevel, TMovementParams } from '@/types';

export class Task extends Enemy {
  constructor(
    level: ILevel,
    score: (num: number) => void,
    destroy: (id: string) => void,
    params?: Partial<TMovementParams>,
    delay = 0,
  ) {
    super(
      level,
      'task',
      {
        bottom: params?.bottom ?? 0,
        height: 80,
        left: params?.left ?? 1200,
        moveDirection: 'left',
        speed: 1.5,
        width: 76,
      },
      2,
      200,
      delay,
      score,
      destroy,
    );
  }
}
