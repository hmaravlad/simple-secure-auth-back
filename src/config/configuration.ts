import { ConfigService } from '@nestjs/config';

export interface ConfigData {
  commonPasswordsNumber: number;
  db: {
    host: string;
    port: string;
    user: string;
    password: string;
    database: string;
  };
}

export interface Config {
  data: ConfigData;
}

export function parseConfig(): Config {
  return {
    data: {
      commonPasswordsNumber:
        parseInt(process.env.COMMON_PASSWORDS_NUMBER) || 1000,
      db: {
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || '5432',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      },
    },
  };
}

export function getConfig(configService: ConfigService): ConfigData {
  return configService.get<ConfigData>('data');
}
