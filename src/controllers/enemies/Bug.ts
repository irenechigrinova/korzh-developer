import { Enemy } from '@/base/Enemy';
import { ILevel, TMovementParams } from '@/types';

export class Bug extends Enemy {
  constructor(
    level: ILevel,
    score: (num: number) => void,
    destroy: (id: string) => void,
    params?: Partial<TMovementParams>,
    delay = 0,
  ) {
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
      score,
      destroy,
    );
  }
}
