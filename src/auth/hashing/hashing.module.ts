import { Module } from '@nestjs/common';
import { HasherFactory } from './hasher-factory';
import { HashingQueries } from './hashing.queries';
import { PasswordHashingService } from './hashing.service';

@Module({
  providers: [
    {
      provide: PasswordHashingService,
      useFactory: async (
        hasherFactory: HasherFactory,
        hashingQueries: HashingQueries,
      ) => {
        const hashingService = new PasswordHashingService(
          hasherFactory,
          hashingQueries,
        );
        await hashingService.makeTemporaryUpdates();
        return hashingService;
      },
      inject: [HasherFactory, HashingQueries],
    },
    HasherFactory,
    HashingQueries,
  ],
  exports: [PasswordHashingService],
})
export class HashingModule {}
