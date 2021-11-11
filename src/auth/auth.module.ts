import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CommonPasswordsProvider } from './common-passwords.provider';
import { IsNotCommonPasswordValidator } from './validators/common-password.validator';
import { ConfigService } from '@nestjs/config';
import { getConfig } from 'src/config/configuration';
import { AuthQueries } from './auth.queries';
import { IsUniqueEmailValidator } from './validators/is-unique-email.validator';
import { HashingModule } from './hashing/hashing.module';
import { LocalStrategy } from './local.strategy';
import { LocalSerializer } from './local-serializer';

@Module({
  controllers: [AuthController],
  providers: [
    AuthQueries,
    AuthService,
    {
      provide: CommonPasswordsProvider,
      useFactory: async (configService: ConfigService) => {
        const cpp = new CommonPasswordsProvider(
          getConfig(configService).commonPasswordsNumber,
        );
        await cpp.init();
        return cpp;
      },
      inject: [ConfigService],
    },
    IsNotCommonPasswordValidator,
    IsUniqueEmailValidator,
    LocalSerializer,
    LocalStrategy,
  ],
  imports: [HashingModule],
})
export class AuthModule {}
