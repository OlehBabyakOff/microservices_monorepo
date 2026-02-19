import fs from 'fs';
import { fromRoot } from '../configs/paths';
import { IKeyProvider } from '../../application/interfaces/KeyProvider';

export class FileKeyProvider implements IKeyProvider {
  private readonly publicKeyPath = fromRoot('keys', 'public.pem');

  getPublicKey(): Buffer {
    return fs.readFileSync(this.publicKeyPath);
  }
}

