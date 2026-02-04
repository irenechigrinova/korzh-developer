import { Obstacle } from '@/base/Obstacle';
import { TCoords } from '@/types';

export const POSITION_CONFIG = {
  bug: {
    bottom: (left: number, bottom: number) => [
      [left, bottom + 50],
      [left + 50, bottom + 50],
      [left + 50, bottom],
      [left, bottom],
    ],
    top: (left: number, bottom: number) => [
      [left, bottom + 50],
      [left + 50, bottom + 50],
      [left + 50, bottom],
      [left, bottom],
    ],
  },
  fireball: {
    bottom: (left: number, bottom: number) => [
      [left, bottom + 30],
      [left + 30, bottom + 30],
      [left + 30, bottom],
      [left, bottom],
    ],
    top: (left: number, bottom: number) => [
      [left, bottom + 30],
      [left + 30, bottom + 30],
      [left + 30, bottom],
      [left, bottom],
    ],
  },

  player: {
    bottom: (left: number, bottom: number) => [
      [left + 16, bottom + 25],
      [left + 16 + 48, bottom + 25],
      [left + 16 + 48, bottom + 5],
      [left + 16, bottom + 5],
    ],
    top: (left: number, bottom: number) => [
      [left + 16, bottom + 115],
      [left + 16 + 48, bottom + 115],
      [left + 16 + 48, bottom + 75],
      [left + 16, bottom + 75],
    ],
  },

  task: {
    bottom: (left: number, bottom: number) => [
      [left, bottom + 80],
      [left + 76, bottom + 80],
      [left + 76, bottom],
      [left, bottom],
    ],
    top: (left: number, bottom: number) => [
      [left, bottom + 80],
      [left + 76, bottom + 80],
      [left + 76, bottom],
      [left, bottom],
    ],
  },
  taskTop: {
    bottom: (left: number, bottom: number) => [
      [left, bottom + 80],
      [left, bottom + 80],
      [left, bottom],
      [left, bottom],
    ],
    top: (left: number, bottom: number) => [
      [left + 38, bottom + 80],
      [left + 38, bottom + 80],
      [left + 38, bottom],
      [left + 38, bottom],
    ],
  },
};

export const getObstacleCoords = (item: Obstacle): TCoords[] => {
  const params = item.getParams();

  return [
    [params.x, params.y + params.height],
    [params.x + params.width, params.y + params.height],
    [params.x + params.width, params.y],
    [params.x, params.y],
  ];
};
