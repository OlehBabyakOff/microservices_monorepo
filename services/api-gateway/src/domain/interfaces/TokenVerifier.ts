export interface ITokenVerifier {
  verify(token: string): string | object;
}

