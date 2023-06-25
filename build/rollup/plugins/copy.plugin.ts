import fse from 'fs-extra';
import { type Plugin } from 'rollup';

export interface CopyPluginOptions {
  targets: {
    src: string;
    dest: string;
  }[];
}

export const copyPlugin = (options: CopyPluginOptions): Plugin => ({
  name: 'copy',
  buildStart: async () => {
    options.targets.forEach(async (target) => {
      await fse.copy(target.src, target.dest);
    });
  },
});
