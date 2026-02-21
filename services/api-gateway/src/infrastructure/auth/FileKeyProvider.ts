import fs from 'fs';

import { IKeyProvider } from '../../application/interfaces/KeyProvider.js';

import { fromRoot } from '../../shared/utils/paths.js';

export class FileKeyProvider implements IKeyProvider {
  private readonly publicKeyPath = fromRoot('keys', 'public.pem');

  getPublicKey(): Buffer {
    return fs.readFileSync(this.publicKeyPath);
  }
}

