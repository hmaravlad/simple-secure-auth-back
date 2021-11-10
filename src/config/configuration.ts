import { ConfigService } from '@nestjs/config';

export interface ConfigData {
  commonPasswordsNumber: number;
}

export interface Config {
  data: ConfigData;
}

export function parseConfig(): Config {
  return {
    data: {
      commonPasswordsNumber:
        parseInt(process.env.COMMON_PASSWORDS_NUMBER) || 1000,
    },
  };
}

export function getConfig(configService: ConfigService): ConfigData {
  return configService.get<ConfigData>('data');
}
