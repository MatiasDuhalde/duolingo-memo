import { type Plugin, type RollupOptions } from 'rollup';
import { baseConfig } from './base-config';

export const contentScript = (scriptName: string): RollupOptions => ({
  ...baseConfig,
  input: `src/${scriptName}/index.ts`,
  output: {
    ...baseConfig.output,
    dir: `dist/${scriptName}`,
  },
  plugins: [...(baseConfig.plugins as Plugin[])],
});
