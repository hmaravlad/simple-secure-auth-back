//added only for testing purposes
import { HashResult } from '../types/hash-result';
import { Hasher } from '../types/hasher';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

export class Sha256Hasher implements Hasher {
  async hash(data: string, salt?: string): Promise<HashResult> {
    if (!salt) salt = await bcrypt.genSalt();
    const hash = await crypto
      .createHash('sha256')
      .update(data + salt)
      .digest('hex');
    return { hash, salt };
  }

  async compare(data: string, hash: string, salt?: string): Promise<boolean> {
    if (!salt) return false;
    const newHash = await crypto
      .createHash('sha256')
      .update(data + salt)
      .digest('hex');

    return hash === newHash;
  }
}
