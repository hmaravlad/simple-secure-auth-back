import { Hasher } from './types/hasher';
import { Argon2Hasher } from './hashing-schemes/argon2';
import { BcryptHasher } from './hashing-schemes/bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HasherFactory {
  private hashers: { [key: number]: Hasher } = {
    1: new BcryptHasher(),
    2: new Argon2Hasher(),
  };

  lastVersion = 1;

  constructor() {
    for (const key in this.hashers) {
      const n = parseInt(key);
      if (n > this.lastVersion) {
        this.lastVersion = n;
      }
    }
  }

  getHasher(version: number): Hasher | undefined {
    return this.hashers[version];
  }

  getLastVersionHasher(): Hasher {
    return this.hashers[this.lastVersion];
  }

  getLastVersionNumber(): number {
    return this.lastVersion;
  }
}
