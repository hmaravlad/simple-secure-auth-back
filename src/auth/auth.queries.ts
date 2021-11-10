import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthQueries {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async insertUser(createUserDto: CreateUserDto): Promise<void> {
    const { password, ...user } = createUserDto;
    await this.knex.transaction(async (trx) => {
      const id = parseInt(
        (await trx('password').insert(password).returning('id'))[0],
      );
      console.dir({ id, type: typeof id });
      await trx('user').insert({ ...user, password_id: id });
    });
  }

  async getUserById(id: number): Promise<User | undefined> {
    const users = await this.knex('user').select('*').where('id', id);
    const { password_id, ...user } = users[0];
    if (users.length === 0) return undefined;
    const { id: _, ...password } = await this.knex('password')
      .select('*')
      .where('id', password_id)
      .first();
    return {
      ...user,
      password,
    };
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const users = await this.knex('user').select('*').where('email', email);
    if (users.length === 0) return undefined;
    const { password_id, ...user } = users[0];
    const { id: _, ...password } = await this.knex('password')
      .select('*')
      .where('id', password_id)
      .first();
    return {
      ...user,
      password,
    };
  }
}
