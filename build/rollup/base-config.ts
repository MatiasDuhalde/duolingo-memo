import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { type RollupOptions } from 'rollup';

const isDev = () => !!process.argv.find((v) => v === '--dev');

export const baseConfig: RollupOptions = {
  output: {
    format: 'esm',
    sourcemap: isDev(),
  },
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
    }),
    nodeResolve(),
    commonjs({
      defaultIsModuleExports: true,
      esmExternals: true,
    }),
    !isDev() &&
      terser({
        format: {
          comments: false,
        },
      }),
  ],
};
