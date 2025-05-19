export interface IPasswordHasher {
  hash(plaintext: string): Promise<string>;
  verify(plaintext: string, hashed: string): Promise<boolean>;
}
