import { RollupOptions } from 'rollup';
import { backgroundConfig, contentScript, optionsConfig, popupConfig } from './build/rollup';

const config: RollupOptions[] = [
  popupConfig,
  optionsConfig,
  backgroundConfig,
  contentScript('duolingo-script'),
];

export default config;
