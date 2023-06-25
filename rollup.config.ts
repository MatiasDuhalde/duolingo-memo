import { RollupOptions } from 'rollup';
import { backgroundConfig, optionsConfig, popupConfig } from './build/rollup';

const config: RollupOptions[] = [popupConfig, optionsConfig, backgroundConfig];

export default config;
