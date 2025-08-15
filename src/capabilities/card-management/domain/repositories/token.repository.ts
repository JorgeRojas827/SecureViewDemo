import { SecureToken } from '../entities';

export interface TokenRepository {
  generateToken(cardId: string): Promise<SecureToken>;
  validateToken(token: string): Promise<boolean>;
}
