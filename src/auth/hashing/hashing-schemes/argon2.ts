import { HashResult } from '../types/hash-result';
import { Hasher } from '../types/hasher';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';
import { EncryptionService } from 'src/auth/encryption/encryption.service';

export class Argon2Hasher implements Hasher {
  constructor(private readonly encryptionService: EncryptionService) {}

  private options = {
    parallelism: 1,
    timeCost: 2,
    memoryCost: 1024 * 15,
    type: argon2.argon2id,
  };

  async hash(data: string, salt?: string): Promise<HashResult> {
    if (!salt) salt = crypto.randomBytes(64).toString('hex');
    let hash = await argon2.hash(data, {
      salt: this.getSalt(salt),
      ...this.options,
    });
    hash = await this.encryptionService.encrypt(hash);
    return { hash, salt };
  }

  async compare(data: string, hash: string, salt?: string): Promise<boolean> {
    if (!salt) return false;
    hash = await this.encryptionService.decrypt(hash);
    return await argon2.verify(hash, data, {
      salt: this.getSalt(salt),
      ...this.options,
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
