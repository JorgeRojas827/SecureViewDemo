export interface SecureToken {
  token: string;
  cardId: string;
  expiresAt: number;
  signature: string;
}
