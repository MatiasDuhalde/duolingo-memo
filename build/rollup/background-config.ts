import { type Plugin, type RollupOptions } from 'rollup';
import { baseConfig } from './base-config';
import { cleanPlugin, copyPlugin } from './plugins';

export const backgroundConfig: RollupOptions = {
  ...baseConfig,
  input: 'src/background/index.ts',
  output: {
    ...baseConfig.output,
    dir: 'dist/background',
  },
  plugins: [
    ...(baseConfig.plugins as Plugin[]),
    cleanPlugin({
      dir: ['dist/assets', 'dist/manifest.json'],
    }),
    copyPlugin({
      targets: [
        {
          src: 'assets',
          dest: 'dist/assets',
        },
        {
          src: 'src/manifest.json',
          dest: 'dist/manifest.json',
        },
      ],
    }),
  ],
};
