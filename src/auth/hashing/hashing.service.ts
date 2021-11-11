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
    if (updatedTo === 0) {
      return await this.hasherFactory
        .getHasher(version)
        .compare(password, hash, salt);
    } else {
      const { hash: prevVersionHash } = await this.hasherFactory
        .getHasher(version)
        .hash(password, salt);
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
      updatedTo: 0,
      version: this.hasherFactory.getLastVersionNumber(),
    });
  }

  async makeTemporaryUpdates(): Promise<void> {
    const passwords = await this.hashingQueries.getPasswords();
    const lastVersion = this.hasherFactory.getLastVersionNumber();
    for (const password of passwords) {
      if (password.version !== lastVersion && password.updatedTo === 0) {
        const { hash: newHash } = await this.updatePassword(
          password.hash,
          password.salt,
        );
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

  private async updatePassword(
    password: string,
    salt?: string,
  ): Promise<HashResult> {
    return this.hasherFactory.getLastVersionHasher().hash(password, salt);
  }
}
