import { Hasher } from './types/hasher';
import { Argon2Hasher } from './hashing-schemes/argon2';
import { BcryptHasher } from './hashing-schemes/bcrypt';
import { Injectable } from '@nestjs/common';
import { Sha256Hasher } from './hashing-schemes/sha256';
import { EncryptionService } from '../encryption/encryption.service';

@Injectable()
export class HasherFactory {
  constructor(private readonly encryptionService: EncryptionService) {}

  private hashers: Hasher[] = [
    //new Sha256Hasher(),
    //new BcryptHasher(),
    new Argon2Hasher(this.encryptionService),
  ];

  lastVersion = this.hashers.length - 1;

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
