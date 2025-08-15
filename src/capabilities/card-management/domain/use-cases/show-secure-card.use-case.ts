import { SecureCardBridge, SecureCardViewResult } from '../repositories';

export interface SecureCardViewParams {
  cardId: string;
  token: string;
}

export class ShowSecureCardViewUseCase {
  constructor(private readonly secureCardBridge: SecureCardBridge) {}

  async execute(params: SecureCardViewParams): Promise<SecureCardViewResult> {
    return this.secureCardBridge.openSecureView(params);
  }
}
