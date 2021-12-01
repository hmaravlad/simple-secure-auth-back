export class Password {
  id: number;
  hash: string;
  salt: string;
  version: number;
  updatedTo: number;
  compromised: boolean;
}
