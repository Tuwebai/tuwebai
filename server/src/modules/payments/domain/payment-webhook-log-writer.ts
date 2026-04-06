export interface PaymentWebhookLogWriter {
  audit(payload: Record<string, unknown>): void;
  elapsedMs(): number;
  error(event: string, payload: Record<string, unknown>): void;
  info(event: string, payload: Record<string, unknown>): void;
  warn(event: string, payload: Record<string, unknown>): void;
}
