import { createFilter, FilterPattern } from '@rollup/pluginutils'
import { Plugin } from 'vite'
import MagicString from 'magic-string'

interface Options {
  include?: FilterPattern
  exclude?: FilterPattern
}

const regx = /<GlyIcon.*?icon="([^"]+)".*?\/>/gs

export default function autoImportGlyIcon(options: Options = {}) {
  const filter = createFilter(options.include, options.exclude)
  return {
    name: 'auto-import-gly-icon',
    enforce: 'pre',
    transform(code, id) {
      const s = new MagicString(code)
      if (!filter(id)) {
        return {
          code,
          map: s.generateMap({ hires: true }),
        }
      }
      if ([...code.matchAll(regx)].length > 0 && !code.includes('import GlyIcon from')) {
        s.prepend('import GlyIcon from "@/components/GlyIcon";\n')
      }
      return {
        code: s.toString(),
        map: s.generateMap({ hires: true }),
      }
    },
  } as Plugin
}
