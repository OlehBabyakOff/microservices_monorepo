export interface TokenVerifier {
  verify(token: string): string | object;
}

