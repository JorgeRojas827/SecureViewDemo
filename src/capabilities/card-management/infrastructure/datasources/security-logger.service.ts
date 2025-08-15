export interface SecurityEvent {
  eventType:
    | 'CARD_VIEW_OPENED'
    | 'TOKEN_GENERATED'
    | 'VALIDATION_ERROR'
    | 'UNAUTHORIZED_ACCESS'
    | 'DATA_ACCESSED';
  cardId?: string;
  userId: string;
  timestamp: string;
  metadata?: Record<string, any>;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export class SecurityLoggerService {
  private events: SecurityEvent[] = [];

  /**
   * Registra un evento de seguridad
   */
  logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date().toISOString(),
    };

    this.events.push(securityEvent);

    // Log en consola para desarrollo
    this.logToConsole(securityEvent);

    // En producción, enviar a servicio de seguridad
    this.sendToSecurityService(securityEvent);
  }

  /**
   * Obtiene eventos de seguridad recientes
   */
  getRecentEvents(limit: number = 10): SecurityEvent[] {
    return this.events
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, limit);
  }

  /**
   * Obtiene eventos por tipo
   */
  getEventsByType(eventType: SecurityEvent['eventType']): SecurityEvent[] {
    return this.events.filter(event => event.eventType === eventType);
  }

  /**
   * Obtiene eventos de alto riesgo
   */
  getHighRiskEvents(): SecurityEvent[] {
    return this.events.filter(event => event.riskLevel === 'HIGH');
  }

  private logToConsole(event: SecurityEvent): void {
    const emoji = this.getEventEmoji(event.eventType);
    const riskColor = this.getRiskColor(event.riskLevel);

    console.log(`${emoji} [SECURITY] ${event.eventType}`, {
      ...event,
      riskLevel: `${riskColor}${event.riskLevel}`,
    });
  }

  private sendToSecurityService(event: SecurityEvent): void {
    // En producción, esto enviaría el evento a un servicio de seguridad
    // como AWS CloudTrail, Azure Monitor, etc.
    console.log('📡 [SECURITY SERVICE] Event sent to security monitoring', {
      eventId: this.generateEventId(),
      event,
    });
  }

  private getEventEmoji(eventType: SecurityEvent['eventType']): string {
    const emojiMap = {
      CARD_VIEW_OPENED: '👁️',
      TOKEN_GENERATED: '🔑',
      VALIDATION_ERROR: '⚠️',
      UNAUTHORIZED_ACCESS: '🚨',
      DATA_ACCESSED: '📊',
    };
    return emojiMap[eventType] || '🔍';
  }

  private getRiskColor(riskLevel: SecurityEvent['riskLevel']): string {
    const colorMap = {
      LOW: '🟢',
      MEDIUM: '🟡',
      HIGH: '🔴',
    };
    return colorMap[riskLevel];
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
