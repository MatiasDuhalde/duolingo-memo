import { rimraf } from 'rimraf';
import { type Plugin } from 'rollup';

export interface CleanPluginOptions {
  dir?: string | string[];
}

export const cleanPlugin = (options?: CleanPluginOptions): Plugin => ({
  name: 'delete',
  buildStart: async () => {
    await rimraf(options?.dir ?? 'dist');
  },
});
