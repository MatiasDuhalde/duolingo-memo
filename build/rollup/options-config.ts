import html from '@rollup/plugin-html';
import { type Plugin, type RollupOptions } from 'rollup';
import { baseConfig } from './base-config';
import { cleanPlugin, injectProcessPlugin } from './plugins';
import { reactHtmlTemplate } from './react-html-template';

export const optionsConfig: RollupOptions = {
  ...baseConfig,
  input: 'src/options/index.tsx',
  output: {
    ...baseConfig.output,
    dir: 'dist/options',
  },
  plugins: [
    ...(baseConfig.plugins as Plugin[]),
    html({
      title: 'Duolingo Memo Options',
      fileName: 'index.html',
      template: reactHtmlTemplate,
    }),
    injectProcessPlugin({
      NODE_ENV: 'production',
    }),
    cleanPlugin({
      dir: 'dist/options',
    }),
  ],
};
