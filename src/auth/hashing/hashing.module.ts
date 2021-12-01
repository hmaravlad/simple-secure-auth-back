import { Module } from '@nestjs/common';
import { EncryptionModule } from '../encryption/encryption.module';
import { EncryptionService } from '../encryption/encryption.service';
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
    EncryptionService,
  ],
  exports: [PasswordHashingService],
  imports: [EncryptionModule],
})
export class HashingModule {}
