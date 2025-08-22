export class Movement {
  static calcLeft(direction: 'left' | 'right', curLeft: number): number {
    const left = direction === 'right' ? curLeft + 5 : curLeft - 5;

    return left;
  }

  static calcBottom(
    curDirection: 'up' | 'down',
    curBottom: number,
    isJumping: boolean,
  ): [number, 'up' | 'down', boolean] {
    let bottom = curBottom;
    let direction = curDirection;
    let jumping = isJumping;

    if (direction === 'up') {
      bottom += 5;
      if (bottom > 150) {
        direction = 'down';
        bottom = 150;
      }
    }
    if (direction === 'down') {
      bottom -= 5;
      if (bottom < 0) {
        direction = 'up';
        bottom = 0;
        jumping = false;
      }
    }
    return [bottom, direction, jumping];
  }
}
