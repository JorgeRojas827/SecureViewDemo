import { SecurityLoggerService } from '../../../src/capabilities/card-management/infrastructure/datasources/security-logger.service';

describe('SecurityLoggerService', () => {
  let service: SecurityLoggerService;

  beforeEach(() => {
    service = new SecurityLoggerService();
  });

  describe('logSecurityEvent', () => {
    it('should log security event successfully', () => {
      const event = {
        eventType: 'CARD_ACCESS',
        cardId: 'card-001',
        userId: 'user-001',
        riskLevel: 'LOW' as const,
        metadata: { action: 'view' },
      };

      service.logSecurityEvent(event);

      const recentEvents = service.getRecentEvents();
      expect(recentEvents).toHaveLength(1);
      expect(recentEvents[0].eventType).toBe('CARD_ACCESS');
      expect(recentEvents[0].cardId).toBe('card-001');
    });

    it('should handle multiple events', () => {
      const event1 = {
        eventType: 'TOKEN_GENERATED',
        cardId: 'card-001',
        riskLevel: 'LOW' as const,
      };

      const event2 = {
        eventType: 'SECURE_VIEW_ACCESSED',
        cardId: 'card-002',
        riskLevel: 'MEDIUM' as const,
      };

      service.logSecurityEvent(event1);
      service.logSecurityEvent(event2);

      const recentEvents = service.getRecentEvents();
      expect(recentEvents).toHaveLength(2);
    });
  });

  describe('getRecentEvents', () => {
    it('should return recent events with limit', () => {
      for (let i = 0; i < 15; i++) {
        service.logSecurityEvent({
          eventType: `EVENT_${i}`,
          riskLevel: 'LOW' as const,
        });
      }

      const recentEvents = service.getRecentEvents(5);
      expect(recentEvents).toHaveLength(5);
    });
  });

  describe('getHighRiskEvents', () => {
    it('should return only high risk events', () => {
      service.logSecurityEvent({
        eventType: 'LOW_RISK_EVENT',
        riskLevel: 'LOW' as const,
      });

      service.logSecurityEvent({
        eventType: 'HIGH_RISK_EVENT',
        riskLevel: 'HIGH' as const,
      });

      const highRiskEvents = service.getHighRiskEvents();
      expect(highRiskEvents).toHaveLength(1);
      expect(highRiskEvents[0].eventType).toBe('HIGH_RISK_EVENT');
    });
  });
});
