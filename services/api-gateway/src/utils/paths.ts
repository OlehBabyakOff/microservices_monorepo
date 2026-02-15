import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const ROOT_DIR = resolve(__dirname, '..');

export function fromRoot(...segments: string[]): string {
  return resolve(ROOT_DIR, ...segments);
}

