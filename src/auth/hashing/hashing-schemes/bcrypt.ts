import { HashResult } from '../types/hash-result';
import { Hasher } from '../types/hasher';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

export class BcryptHasher implements Hasher {
  async hash(data: string, salt?: string): Promise<HashResult> {
    if (!salt) salt = await bcrypt.genSalt();
    const firstHash = crypto.createHash('sha512').update(data).digest('hex');
    const hash = await bcrypt.hash(firstHash, salt);
    return { hash, salt };
  }

  async compare(data: string, hash: string, salt?: string): Promise<boolean> {
    if (!salt) return false;
    const firstHash = crypto.createHash('sha512').update(data).digest('hex');

    return await bcrypt.compare(firstHash, hash);
  }
}
