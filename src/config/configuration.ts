import { ConfigService } from '@nestjs/config';

export interface AppConfig {
  commonPasswordsNumber: number;
}

export interface Config {
  config: AppConfig;
}

export function parseConfig(): Config {
  return {
    config: {
      commonPasswordsNumber:
        parseInt(process.env.COMMON_PASSWORDS_NUMBER) || 1000,
    },
  };
}

export function getConfig(configService: ConfigService): AppConfig {
  return configService.get<AppConfig>('config');
}
