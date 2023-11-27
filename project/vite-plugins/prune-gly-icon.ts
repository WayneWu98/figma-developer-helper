import sfc from '@vue/compiler-sfc';
import { ElementNode } from '@vue/compiler-core';
import MagicString from 'magic-string';
import { createFilter, FilterPattern } from '@rollup/pluginutils';
import { Plugin } from 'vite';

const toDelete = ['name', 'FIGMA_KEY'];

function traverse(
  node: ElementNode,
  callback: (start: number, end: number) => void
) {
  // typeof tagType is ElementTypes,
  // but we can't import it from @vue/compiler-core when 'isolatedModules' is true.
  // So use literal value directly.
  if (node.tagType === 1 && node.tag === 'GlyIcon') {
    for (const prop of node.props) {
      if (toDelete.includes(prop.name))
        callback(prop.loc.start.offset, prop.loc.end.offset);
    }
  }
  if (node?.children?.length > 0) {
    for (const child of node.children) {
      traverse(child as ElementNode, callback);
    }
  }
}

interface Options {
  include?: FilterPattern;
  exclude?: FilterPattern;
}

export default (opts: Options): Plugin => {
  const filter = createFilter(opts.include, opts.exclude);
  return {
    name: 'prune-icon',
    enforce: 'pre',
    transform(code, id) {
      if (!filter(id)) return code;
      const { descriptor } = sfc.parse(code);
      if (!descriptor.template) return code;
      const s = new MagicString(code);
      traverse(descriptor.template.ast, (start, end) => s.remove(start, end));
      return s.toString();
    },
  };
};
