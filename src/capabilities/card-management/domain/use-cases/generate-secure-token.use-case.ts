import { SecureToken } from '../entities';
import { TokenRepository } from '../repositories';

export class GenerateSecureTokenUseCase {
  constructor(private tokenRepository: TokenRepository) {}

  async execute(cardId: string): Promise<SecureToken> {
    return await this.tokenRepository.generateToken(cardId);
  }
}
