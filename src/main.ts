import { gsap } from 'gsap';
import {
  TextPlugin,
  EasePack,
  CSSPlugin,
  CustomEase,
  Observer,
} from 'gsap/all';
import 'nes.css/css/nes.min.css';

import './styles/main.style.scss';

import { GameController } from '@/controllers/GameController';

const plugins = [TextPlugin, EasePack, CSSPlugin, CustomEase, Observer];
gsap.registerPlugin(...plugins);

const controller = new GameController();
controller.init();
