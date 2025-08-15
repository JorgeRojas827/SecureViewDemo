import { SecureCardData } from '../../../src/capabilities/card-management/domain/entities/secure-card-data.entity';

describe('SecureCardData Entity', () => {
  const mockSecureData: SecureCardData = {
    fullPan: '4111111111111234',
    cvv: '123',
    expiry: '12/25',
    holder: 'Juan Pérez',
  };

  it('should create secure card data with valid information', () => {
    const secureData: SecureCardData = mockSecureData;

    expect(secureData.fullPan).toBe('4111111111111234');
    expect(secureData.cvv).toBe('123');
    expect(secureData.expiry).toBe('12/25');
    expect(secureData.holder).toBe('Juan Pérez');
  });

  it('should handle different PAN formats', () => {
    const secureDataWithDifferentPan: SecureCardData = {
      ...mockSecureData,
      fullPan: '5555555555554444',
    };

    expect(secureDataWithDifferentPan.fullPan).toBe('5555555555554444');
  });

  it('should handle different CVV formats', () => {
    const secureDataWithDifferentCvv: SecureCardData = {
      ...mockSecureData,
      cvv: '456',
    };

    expect(secureDataWithDifferentCvv.cvv).toBe('456');
  });

  it('should handle different expiry formats', () => {
    const secureDataWithDifferentExpiry: SecureCardData = {
      ...mockSecureData,
      expiry: '06/26',
    };

    expect(secureDataWithDifferentExpiry.expiry).toBe('06/26');
  });

  it('should handle different holder names', () => {
    const secureDataWithDifferentHolder: SecureCardData = {
      ...mockSecureData,
      holder: 'María García',
    };

    expect(secureDataWithDifferentHolder.holder).toBe('María García');
  });

  it('should maintain data integrity', () => {
    const secureData: SecureCardData = mockSecureData;

    const secureDataObject = {
      fullPan: secureData.fullPan,
      cvv: secureData.cvv,
      expiry: secureData.expiry,
      holder: secureData.holder,
    };

    expect(secureDataObject).toEqual(mockSecureData);
  });

  it('should handle empty values', () => {
    const secureDataWithEmptyValues: SecureCardData = {
      fullPan: '',
      cvv: '',
      expiry: '',
      holder: '',
    };

    expect(secureDataWithEmptyValues.fullPan).toBe('');
    expect(secureDataWithEmptyValues.cvv).toBe('');
    expect(secureDataWithEmptyValues.expiry).toBe('');
    expect(secureDataWithEmptyValues.holder).toBe('');
  });
});
