import { SecureToken } from '../entities';
import { TokenRepository } from '../repositories';

export class GenerateSecureTokenUseCase {
  constructor(private readonly tokenRepository: TokenRepository) {}

  async execute(cardId: string): Promise<SecureToken> {
    return this.tokenRepository.generateToken(cardId);
  }
}
