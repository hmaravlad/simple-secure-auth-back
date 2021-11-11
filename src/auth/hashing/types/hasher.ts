import { HashResult } from './hash-result';

export interface Hasher {
  hash: (data: string, salt?: string) => Promise<HashResult>;

  compare: (data: string, hash: string, salt?: string) => Promise<boolean>;
}
