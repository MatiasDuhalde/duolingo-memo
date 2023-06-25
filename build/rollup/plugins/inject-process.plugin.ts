import MagicString from 'magic-string';
import { type Plugin } from 'rollup';

const INJECT_PROCESS_MODULE_ID = '\0inject-process';

export const injectProcessPlugin = (env?: Record<string, unknown>): Plugin => ({
  name: 'inject-process-plugin',
  resolveId(id: string) {
    if (id === INJECT_PROCESS_MODULE_ID) {
      return INJECT_PROCESS_MODULE_ID;
    }
  },
  load(id: string) {
    if (id === INJECT_PROCESS_MODULE_ID) {
      return `export const env = ${JSON.stringify(env)};\n`;
    }
  },
  transform(code: string, id: string) {
    if (id !== INJECT_PROCESS_MODULE_ID) {
      const magicString = new MagicString(code);
      magicString.prepend(`import * as process from '${INJECT_PROCESS_MODULE_ID}';\n`);
      return { code: magicString.toString(), map: magicString.generateMap({ hires: true }) };
    }
  },
});
