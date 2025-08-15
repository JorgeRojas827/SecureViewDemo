/* eslint-env jest */

jest.mock('fintech-secure-native', () => ({
  generateSecureToken: jest.fn(() => Promise.resolve({
    token: 'mock-token',
    signature: 'mock-signature',
    expiresAt: Date.now() + 3600000,
  })),
  validateToken: jest.fn(() => Promise.resolve(true)),
  openSecureView: jest.fn(() => Promise.resolve()),
  isAvailable: jest.fn(() => Promise.resolve(true)),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

global.console = {
  ...console,
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};
