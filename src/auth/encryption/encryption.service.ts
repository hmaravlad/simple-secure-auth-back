import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { config, Credentials, KMS } from 'aws-sdk';
import { getConfig } from 'src/config/configuration';

@Injectable()
export class EncryptionService {
  private kms: KMS;
  private keyId;

  constructor(private readonly configService: ConfigService) {
    const { keyId, ...params } = getConfig(this.configService).aws;
    const credentials = new Credentials({
      accessKeyId: params.accessKeyId,
      secretAccessKey: params.accessKey,
    });
    config.credentials = credentials;
    this.kms = new KMS(params);
    this.keyId = keyId;
  }

  private kmsEncrypt(plaintext: string): Promise<KMS.EncryptResponse> {
    return new Promise((resolve, reject) => {
      this.kms.encrypt(
        { Plaintext: plaintext, KeyId: this.keyId },
        (err, data) => {
          if (err) reject(err);
          resolve(data);
        },
      );
    });
  }

  private kmsDecrypt(encrypted: string): Promise<KMS.DecryptResponse> {
    return new Promise((resolve, reject) => {
      this.kms.decrypt(
        { CiphertextBlob: Buffer.from(encrypted, 'hex'), KeyId: this.keyId },
        (err, data) => {
          if (err) reject(err);
          resolve(data);
        },
      );
    });
  }

  async encrypt(plaintext: string): Promise<string> {
    return (await this.kmsEncrypt(plaintext)).CiphertextBlob.toString('hex');
  }

  async decrypt(encrypted: string): Promise<string> {
    return (await this.kmsDecrypt(encrypted)).Plaintext.toString();
  }
}
