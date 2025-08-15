import { SecureCardViewParams } from '../use-cases';

export interface SecureCardViewResult {
  success: boolean;
  error?: string;
  reason?: 'USER_DISMISS' | 'TIMEOUT' | 'VALIDATION_ERROR';
}

export interface SecureCardBridge {
  openSecureView(params: SecureCardViewParams): Promise<SecureCardViewResult>;
  isAvailable(): Promise<boolean>;
  addListener(event: string, callback: Function): void;
  removeListener(event: string, callback: Function): void;
}
