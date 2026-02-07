import { BaseScene } from '@/base/BaseScene';
import { Enemy } from '@/base/Enemy';
import { Boss } from '@/controllers/enemies/Boss';
import { Obstacle } from '@/base/Obstacle';
import { POSITION_CONFIG } from '@/base/utils';

export type TLevel = '18+' | 'intro' | '1' | '2' | '3' | 'outro';

export type TObstacleType =
  | 'question'
  | 'brick'
  | 'tube-small'
  | 'tube-mid'
  | 'tube-large'
  | 'void'
  | 'brick-transparent';

export type TObstacle = {
  x: number;
  y: number;
  width: number;
  height: number;
  type: TObstacleType;
  destructible?: boolean;
  active: boolean;
  id: string;
  remove: (id: string) => void;
};

export interface ILevel extends BaseScene {
  changeScene?: (
    dir: 'next' | 'prev',
    bottom?: number,
    isMoving?: boolean,
  ) => boolean;
  getProgress?: () => 'progress' | 'start' | 'end';
  getObstacles?: () => Obstacle[];
  onTick?: () => void;
  getEnemies?: () => (Enemy | Boss)[];
  score?: (val: number) => void;
  checkBossIntro?: () => boolean;
  name: TLevel;
  addEnemies?: (enemies: Enemy[]) => void;
  removeEnemy?: (id: string) => void;
}

export type TMovementParams = {
  speed: number;
  left: number;
  bottom: number;
  moveDirection: 'right' | 'left';
  width: number;
  height: number;
  jumpDirection?: 'up' | 'down';
  isJumping?: boolean;
};

export type TCoords = [number, number];

export type TMovementType = keyof typeof POSITION_CONFIG;

export type TBoss = 'petya';
