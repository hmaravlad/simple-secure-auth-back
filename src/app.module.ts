import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { KnexModule } from 'nestjs-knex';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { getConfig, parseConfig } from './config/configuration';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [parseConfig],
    }),
    KnexModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        config: {
          client: 'pg',
          connection: getConfig(configService).db,
        },
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot({
      ttl: 60 * 60,
      limit: 10,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
