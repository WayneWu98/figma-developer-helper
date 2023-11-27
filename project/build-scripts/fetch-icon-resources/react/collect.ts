import fg from 'fast-glob';
import fs from 'fs/promises';

const regx = /<GlyIcon.*?icon="([^"]+)".*?\/>/gs;

function look(filename: string) {
  return fs.readFile(filename, 'utf-8').then((code) => {
    return [...code.matchAll(regx)].map(([, icon]) => icon).filter(Boolean);
  });
}

export default function collect() {
  return fg
    .glob('src/**/*.tsx')
    .then((fileNames) => {
      return Promise.all(fileNames.map(look));
    })
    .then((icons) => icons.flat());
}
