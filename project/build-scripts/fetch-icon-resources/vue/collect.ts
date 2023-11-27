import fg from 'fast-glob';
import sfc from '@vue/compiler-sfc';
import fs from 'fs/promises';

function traverse(node, callback: (icon: string) => void) {
  if (node.tagType === 1 && node.tag === 'GlyIcon') {
    const icon = node.props.find((prop) => prop.name === 'icon')?.value;
    if (icon) callback(icon.content);
  }
  if (node?.children?.length > 0) {
    for (const child of node.children) {
      traverse(child, callback);
    }
  }
}

function look(filename: string) {
  return fs.readFile(filename, 'utf-8').then((code) => {
    const { descriptor } = sfc.parse(code);
    if (!descriptor.template) return [];
    const icons = [] as string[];
    traverse(descriptor.template.ast, (icon) => icons.push(icon));
    return icons;
  });
}

export default function collect() {
  return fg
    .glob('src/**/*.vue')
    .then((fileNames) => {
      return Promise.all(fileNames.map(look));
    })
    .then((icons) => icons.flat());
}
