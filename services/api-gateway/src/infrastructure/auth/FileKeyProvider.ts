import fs from 'fs';
import { fromRoot } from '../configs/paths';
import { KeyProvider } from '../../application/interfaces/KeyProvider';

export class FileKeyProvider implements KeyProvider {
  private readonly publicKeyPath = fromRoot('keys', 'public.pem');

  getPublicKey(): Buffer {
    return fs.readFileSync(this.publicKeyPath);
  }
}

