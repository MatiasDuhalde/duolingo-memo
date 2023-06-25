import html from '@rollup/plugin-html';
import { type Plugin, type RollupOptions } from 'rollup';
import { baseConfig } from './base-config';
import { cleanPlugin, injectProcessPlugin } from './plugins';
import { reactHtmlTemplate } from './react-html-template';

export const popupConfig: RollupOptions = {
  ...baseConfig,
  input: 'src/popup/index.tsx',
  output: {
    ...baseConfig.output,
    dir: 'dist/popup',
  },
  plugins: [
    ...(baseConfig.plugins as Plugin[]),
    html({
      title: 'Duolingo Memo',
      fileName: 'index.html',
      template: reactHtmlTemplate,
    }),
    injectProcessPlugin({
      NODE_ENV: 'production',
    }),
    cleanPlugin({
      dir: 'dist/popup',
    }),
  ],
};
