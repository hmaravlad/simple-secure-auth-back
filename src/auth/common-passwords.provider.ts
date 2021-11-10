import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';

@Injectable()
export class CommonPasswordsProvider {
  private passwords: string[] = [];

  constructor(private limit = 1000) {}

  async init(): Promise<void> {
    const passwords = await readFile(
      __dirname + '/../../resources/common-passwords.txt',
    );
    this.passwords = passwords
      .slice(0, this.limit)
      .toString()
      .split('\n')
      .map((str) => str.trim());
  }

  getPasswords(): string[] {
    return this.passwords;
  }
}
