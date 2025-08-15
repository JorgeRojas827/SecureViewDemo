import { SecureCardBridge, SecureCardViewResult } from '../repositories';

export interface SecureCardViewParams {
  cardId: string;
  token: string;
}

export class ShowSecureCardViewUseCase {
  constructor(private secureCardBridge: SecureCardBridge) {}

  async execute(params: SecureCardViewParams): Promise<SecureCardViewResult> {
    return await this.secureCardBridge.openSecureView(params);
  }
}
