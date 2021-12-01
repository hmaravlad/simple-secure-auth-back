import { buildClient, CommitmentPolicy } from '@aws-crypto/client-node';
import { KmsKeyringNode } from '@aws-crypto/kms-keyring-node';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { config, Credentials } from 'aws-sdk';
import { getConfig } from 'src/config/configuration';

@Injectable()
export class EncryptionService {
  private keyId;
  private keyring: KmsKeyringNode;
  private encryptFn;
  private decryptFn;

  constructor(private readonly configService: ConfigService) {
    const { keyId, additionalKeyId, ...params } = getConfig(
      this.configService,
    ).aws;
    this.keyId = keyId;
    const credentials = new Credentials({
      accessKeyId: params.accessKeyId,
      secretAccessKey: params.accessKey,
    });
    this.keyring = new KmsKeyringNode({
      generatorKeyId: this.keyId,
      keyIds: [this.keyId, additionalKeyId],
    });
    config.credentials = credentials;
    const { encrypt, decrypt } = buildClient(
      CommitmentPolicy.REQUIRE_ENCRYPT_REQUIRE_DECRYPT,
    );
    this.encryptFn = encrypt;
    this.decryptFn = decrypt;
  }

  async encrypt(plaintext: string): Promise<string> {
    const res = (await this.encryptFn(this.keyring, plaintext)).result;
    return res.toString('hex');
  }

  async decrypt(encrypted: string): Promise<string> {
    return (
      await this.decryptFn(this.keyring, Buffer.from(encrypted, 'hex'))
    ).plaintext.toString();
  }
}
