import { Injectable } from '@nestjs/common';
import { HasherFactory } from './hasher-factory';
import { HashingQueries } from './hashing.queries';
import { HashResult } from './types/hash-result';

@Injectable()
export class PasswordHashingService {
  constructor(
    private readonly hasherFactory: HasherFactory,
    private readonly hashingQueries: HashingQueries,
  ) {}

  async hashPassword(password: string): Promise<HashResult> {
    return await this.hasherFactory.getLastVersionHasher().hash(password);
  }

  async checkPassword(
    password: string,
    hash: string,
    salt: string,
    version: number,
    updatedTo: number,
  ): Promise<boolean> {
    if (updatedTo === version) {
      return await this.hasherFactory
        .getHasher(version)
        .compare(password, hash, salt);
    } else {
      let prevVersionHash = password;
      for (let i = version; i < updatedTo; i++) {
        prevVersionHash = (
          await this.hasherFactory.getHasher(i).hash(prevVersionHash, salt)
        ).hash;
      }
      return await this.hasherFactory
        .getHasher(updatedTo)
        .compare(prevVersionHash, hash, salt);
    }
  }

  async updateHash(password: string, passwordId: number): Promise<void> {
    const { hash, salt } = await this.hasherFactory
      .getLastVersionHasher()
      .hash(password);
    await this.hashingQueries.updatePassword(passwordId, {
      hash,
      salt,
      updatedTo: this.hasherFactory.getLastVersionNumber(),
      version: this.hasherFactory.getLastVersionNumber(),
    });
  }

  async makeTemporaryUpdates(): Promise<void> {
    const passwords = await this.hashingQueries.getPasswords();
    const lastVersion = this.hasherFactory.getLastVersionNumber();
    for (const password of passwords) {
      if (password.version !== lastVersion) {
        let newHash = password.hash;

        for (
          let i = Math.max(password.version, password.updatedTo) + 1;
          i <= lastVersion;
          i++
        ) {
          newHash = (
            await this.hasherFactory.getHasher(i).hash(newHash, password.salt)
          ).hash;
        }

        await this.hashingQueries.updatePassword(password.id, {
          hash: newHash,
          updatedTo: lastVersion,
        });
      }
    }
  }

  getLastVersionNumber(): number {
    return this.hasherFactory.getLastVersionNumber();
  }
}
