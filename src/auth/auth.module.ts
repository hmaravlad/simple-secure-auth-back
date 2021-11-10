import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CommonPasswordsProvider } from './common-passwords.provider';
import { IsNotCommonPasswordValidator } from './common-password.validator';
import { ConfigService } from '@nestjs/config';
import { getConfig } from 'src/config/configuration';

@Module({
  controllers: [AuthController],
  providers: [
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
  ],
})
export class AuthModule {}
