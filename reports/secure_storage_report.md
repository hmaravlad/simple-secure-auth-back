# Sensitive information storage security report

## Implementation
- Sensitive data is encrypted and stored in database (because it is the easiest option)
- Amazon KMS is used for key management, because using cloud KMS is [recommended](https://docs.google.com/document/d/1_W00GZXLNTk6BML6jEaAJDqwMVjaQUv5WL1DCW7ipy4/edit) and because Amazon is one of the biggest cloud providers and is trusted.
- AWS Encryption SDK is used for encryption. It uses AES-GCM with 256-bit key as [recommended](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html#algorithms). Also it uses keyrings to perform envelope encryption.
- Secret access key for accessing Amazon KMS is stored in .env file which is excluded from version control.

## Possible attack vectors
- Access key for accessing Amazon KMS can be stolen because my file-system is not very protected, but it shouldn't be a big problem (i'm not sure honestly), because [AWS KMS keyring uses AWS KMS keys that never leave AWS Key Management Service (AWS KMS) unencrypted](https://docs.aws.amazon.com/encryption-sdk/latest/developer-guide/choose-keyring.html), so attacker can only decrypt data by making requests to AWS (as far as I understand), which can be easily traced and stopped by changing access key. Also we can specify ip from which requests must be made.
- ???