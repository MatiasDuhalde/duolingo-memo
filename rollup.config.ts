import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { emptyDirSync } from 'fs-extra';
import path from 'path';
import { chromeExtension, simpleReloader } from 'rollup-plugin-chrome-extension';
import zip from 'rollup-plugin-zip';

const isProduction = process.env.NODE_ENV === 'production';

const config = {
  input: 'src/manifest.json',
  output: {
    dir: 'dist',
    format: 'esm',
    chunkFileNames: path.join('chunks', '[name]-[hash].js'),
    sourcemap: !isProduction && 'inline',
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': isProduction
        ? JSON.stringify('production')
        : JSON.stringify('development'),
      preventAssignment: true,
    }),
    chromeExtension(),
    !isProduction && simpleReloader(),
    nodeResolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
    }),
    isProduction &&
      terser({
        format: {
          comments: false,
        },
      }),
    {
      name: 'empty-dir',
      generateBundle: async () => emptyDirSync('dist'),
    },
    isProduction && zip({ dir: 'releases' }),
  ],
};

export default config;
