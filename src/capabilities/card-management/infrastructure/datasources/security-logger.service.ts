export interface SecurityEvent {
  eventType: string;
  cardId?: string;
  userId?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export class SecurityLoggerService {
  private events: SecurityEvent[] = [];

  logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date().toISOString(),
    };

    this.events.push(securityEvent);
  }

  getRecentEvents(limit: number = 10): SecurityEvent[] {
    return this.events
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, limit);
  }

  getHighRiskEvents(): SecurityEvent[] {
    return this.events.filter(event => event.riskLevel === 'HIGH');
  }
}
