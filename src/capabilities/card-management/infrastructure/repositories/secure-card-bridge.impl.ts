import SecureCardNative from 'fintech-secure-native';
import {
  SecureCardBridge,
  SecureCardViewResult,
} from '../../domain/repositories/secure-card-data.repository';
import { SecureCardViewParams } from '../../domain/use-cases';
import { CardDataService } from '../datasources/card-data.service';
import { SecureTokenService } from '../datasources/secure-token.service';

export class SecureCardBridgeImpl implements SecureCardBridge {
  private cardDataService = new CardDataService();
  private tokenService = new SecureTokenService();
  private listeners: Map<string, Function[]> = new Map();

  async openSecureView(
    params: SecureCardViewParams
  ): Promise<SecureCardViewResult> {
    try {
      const secureData = await this.cardDataService.getSecureCardData(
        params.cardId
      );

      if (!secureData) {
        return {
          success: false,
          error: 'Card data not found',
          reason: 'VALIDATION_ERROR',
        };
      }

      if (!params.token || params.token.length === 0) {
        return {
          success: false,
          error: 'Invalid token',
          reason: 'VALIDATION_ERROR',
        };
      }

      const tokenResponse = await this.tokenService.generateCardToken({
        cardId: params.cardId,
        userId: 'user-001',
      });

      await SecureCardNative.openSecureView({
        cardId: params.cardId,
        token: tokenResponse.token,
        signature: tokenResponse.signature,
        cardData: {
          pan: secureData.fullPan,
          cvv: secureData.cvv,
          expiry: secureData.expiry,
          holder: secureData.holder,
        },
        config: {
          timeout: 60000,
          blockScreenshots: true,
          requireBiometric: false,
          blurOnBackground: true,
          theme: 'dark',
        },
      });

      this.emitEvent('SECURE_VIEW_OPENED', { cardId: params.cardId });

      return {
        success: true,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.emitEvent('SECURE_VIEW_ERROR', { error: errorMessage });

      return {
        success: false,
        error: errorMessage,
        reason: 'VALIDATION_ERROR',
      };
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      return await SecureCardNative.isAvailable();
    } catch (error) {
      return false;
    }
  }

  addListener(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.push(callback);
    }
  }

  removeListener(event: string, callback: Function): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private emitEvent(event: string, data: unknown): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }
}
