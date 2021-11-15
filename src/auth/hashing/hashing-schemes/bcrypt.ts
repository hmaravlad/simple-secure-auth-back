import { HashResult } from '../types/hash-result';
import { Hasher } from '../types/hasher';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

export class BcryptHasher implements Hasher {
  async hash(data: string, salt?: string): Promise<HashResult> {
    if (!salt) salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(data, salt);
    return { hash, salt };
  }

  async compare(data: string, hash: string, salt?: string): Promise<boolean> {
    if (!salt) return false;
    return await bcrypt.compare(data, hash);
  }
}
