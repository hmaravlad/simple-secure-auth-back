import { HashResult } from '../types/hash-result';
import { Hasher } from '../types/hasher';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';

export class Argon2Hasher implements Hasher {
  async hash(data: string, salt?: string): Promise<HashResult> {
    if (!salt) salt = crypto.randomBytes(64).toString('hex');
    const hash = await argon2.hash(data, {
      salt: this.getSalt(salt),
    });
    return { hash, salt };
  }

  async compare(data: string, hash: string, salt?: string): Promise<boolean> {
    if (!salt) return false;
    return await argon2.verify(hash, data, {
      salt: this.getSalt(salt),
    });
  }

  getSalt(salt: string): Buffer {
    const buffer = Buffer.from(salt, 'hex');
    if (buffer.length === 0) {
      return Buffer.from(salt, 'ascii');
    } else {
      return buffer;
    }
  }
}
