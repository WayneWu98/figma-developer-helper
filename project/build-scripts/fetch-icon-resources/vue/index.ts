import path from 'path';
import fs from 'fs';
import fsp from 'fs/promises';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import collect from './collect';

const resolve = (...paths: string[]) => path.resolve(process.cwd(), ...paths);

dotenv.config({ path: resolve('.env.development'), override: true });

const ICON_HOST = process.env.VITE_APP_ICON_HOST;
const ICON_PATH = resolve('public/__icons');

function run() {
  try {
    fs.rmSync(ICON_PATH, { recursive: true, force: true });
  } catch (e) {
    // pass
  }
  try {
    fs.mkdirSync(ICON_PATH);
  } catch (e) {
    // pass
  }
  return collect().then((icons) => {
    return Promise.all(
      icons.map((icon) => {
        return fetch(`${ICON_HOST}${icon}.svg`)
          .then((res) => res.arrayBuffer())
          .then((buffer) => {
            fsp.writeFile(
              path.join(ICON_PATH, `${icon}.svg`),
              Buffer.from(buffer)
            );
          });
      })
    );
  });
}
run();
