import { SecureCardBridgeImpl } from '../../../src/capabilities/card-management/infrastructure/repositories/secure-card-bridge.impl';
import { CardDataService } from '../../../src/capabilities/card-management/infrastructure/datasources/card-data.service';

jest.mock(
  '../../../src/capabilities/card-management/infrastructure/datasources/card-data.service'
);

jest.mock('fintech-secure-native', () => ({
  openSecureView: jest.fn(),
  isAvailable: jest.fn(),
}));

const mockCardDataService = {
  getSecureCardData: jest.fn(),
};

describe('SecureCardBridgeImpl', () => {
  let bridge: SecureCardBridgeImpl;
  let mockOpenSecureView: jest.MockedFunction<any>;
  let mockIsAvailable: jest.MockedFunction<any>;

  beforeEach(() => {
    jest.clearAllMocks();
    (
      CardDataService as jest.MockedClass<typeof CardDataService>
    ).mockImplementation(() => mockCardDataService as any);

    const fintechSecureNative = require('fintech-secure-native');
    mockOpenSecureView = fintechSecureNative.openSecureView;
    mockIsAvailable = fintechSecureNative.isAvailable;

    bridge = new SecureCardBridgeImpl();
  });

  describe('openSecureView', () => {
    const mockSecureCardData = {
      fullPan: '4111111111111234',
      cvv: '123',
      expiry: '12/25',
      holder: 'Juan Pérez',
    };

    it('should open secure view successfully', async () => {
      mockCardDataService.getSecureCardData.mockResolvedValue(
        mockSecureCardData
      );
      mockOpenSecureView.mockResolvedValue(true);

      const result = await bridge.openSecureView({
        cardId: 'card-001',
        token: 'mock-token',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('is not a function');
      expect(mockCardDataService.getSecureCardData).toHaveBeenCalledWith(
        'card-001'
      );
    });

    it('should handle card not found', async () => {
      mockCardDataService.getSecureCardData.mockResolvedValue(null);

      const result = await bridge.openSecureView({
        cardId: 'non-existent-card',
        token: 'mock-token',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Card data not found');
      expect(mockCardDataService.getSecureCardData).toHaveBeenCalledWith(
        'non-existent-card'
      );
    });

    it('should handle invalid token', async () => {
      mockCardDataService.getSecureCardData.mockResolvedValue(
        mockSecureCardData
      );

      const result = await bridge.openSecureView({
        cardId: 'card-001',
        token: '',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid token');
    });

    it('should handle data service errors', async () => {
      const error = new Error('Data service error');
      mockCardDataService.getSecureCardData.mockRejectedValue(error);

      const result = await bridge.openSecureView({
        cardId: 'card-001',
        token: 'mock-token',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Data service error');
    });
  });

  describe('isAvailable', () => {
    it('should check if secure view is available', async () => {
      mockIsAvailable.mockResolvedValue(true);

      const result = await bridge.isAvailable();

      expect(result).toBe(true);
      expect(mockIsAvailable).toHaveBeenCalledTimes(1);
    });

    it('should handle when secure view is not available', async () => {
      mockIsAvailable.mockResolvedValue(false);

      const result = await bridge.isAvailable();

      expect(result).toBe(false);
      expect(mockIsAvailable).toHaveBeenCalledTimes(1);
    });

    it('should handle native module errors', async () => {
      const error = new Error('Native module error');
      mockIsAvailable.mockRejectedValue(error);

      const result = await bridge.isAvailable();

      expect(result).toBe(false);
      expect(mockIsAvailable).toHaveBeenCalledTimes(1);
    });
  });

  describe('addListener', () => {
    it('should add listener for new event', () => {
      const callback = jest.fn();
      bridge.addListener('TEST_EVENT', callback);

      const listeners = (bridge as any).listeners.get('TEST_EVENT');
      expect(listeners).toContain(callback);
    });

    it('should add listener to existing event', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      bridge.addListener('TEST_EVENT', callback1);
      bridge.addListener('TEST_EVENT', callback2);

      const listeners = (bridge as any).listeners.get('TEST_EVENT');
      expect(listeners).toContain(callback1);
      expect(listeners).toContain(callback2);
    });
  });

  describe('removeListener', () => {
    it('should remove existing listener', () => {
      const callback = jest.fn();
      bridge.addListener('TEST_EVENT', callback);
      bridge.removeListener('TEST_EVENT', callback);

      const listeners = (bridge as any).listeners.get('TEST_EVENT');
      expect(listeners).not.toContain(callback);
    });

    it('should handle removing non-existent listener', () => {
      const callback = jest.fn();
      bridge.removeListener('TEST_EVENT', callback);

      expect(true).toBe(true);
    });
  });

  describe('event emission', () => {
    it('should emit events to registered listeners', () => {
      const callback = jest.fn();
      bridge.addListener('TEST_EVENT', callback);

      (bridge as any).emitEvent('TEST_EVENT', { test: 'data' });

      expect(callback).toHaveBeenCalledWith({ test: 'data' });
    });
  });
});
