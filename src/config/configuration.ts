import { ConfigService } from '@nestjs/config';

export interface ConfigData {
  commonPasswordsNumber: number;
  sessionSecret: string;
  frontendUrl: string;
  aws: {
    region: string;
    accessKeyId: string;
    accessKey: string;
    keyId: string;
  };
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
      sessionSecret: process.env.SESSION_SECRET,
      frontendUrl: process.env.FRONTEND_URL,
      aws: {
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        accessKey: process.env.AWS_ACCESS_KEY,
        keyId: process.env.KEY_ID,
      },
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
