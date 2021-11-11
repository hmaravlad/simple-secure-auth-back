export class CreatePasswordDto {
  hash: string;
  salt: string;
  version: number;
  updatedTo: number;
  compromised: boolean;
}
