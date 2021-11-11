import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { UpdatePasswordDto } from 'src/auth/dto/update-password.dto';
import { Password } from 'src/auth/entities/password.entity';

@Injectable()
export class HashingQueries {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async getPasswords(): Promise<Password[]> {
    return await this.knex('password').select('*');
  }

  async updatePassword(
    id: number,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<void> {
    await this.knex('password').update(updatePasswordDto).where('id', id);
  }
}
