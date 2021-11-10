import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CommonPasswordsProvider } from './common-passwords.provider';
import { IsNotCommonPasswordValidator } from './common-password.validator';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: CommonPasswordsProvider,
      useFactory: async () => {
        const cpp = new CommonPasswordsProvider(5000);
        await cpp.init();
        return cpp;
      },
    },
    IsNotCommonPasswordValidator,
  ],
})
export class AuthModule {}
