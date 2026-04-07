type LogLevel = 'debug' | 'info' | 'warn' | 'error';

type LogMeta = Record<string, unknown>;

const SENSITIVE_KEYS = ['token', 'secret', 'password', 'authorization', 'apiKey', 'smtp_pass'];

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const redactValue = (key: string, value: unknown): unknown => {
  const lowerKey = key.toLowerCase();
  if (SENSITIVE_KEYS.some((sensitive) => lowerKey.includes(sensitive.toLowerCase()))) {
    return '[REDACTED]';
  }
  if (Array.isArray(value)) {
    return value.map((item) => (isObject(item) ? redactObject(item) : item));
  }
  if (isObject(value)) {
    return redactObject(value);
  }
  return value;
};

const redactObject = (meta: LogMeta): LogMeta => {
  const output: LogMeta = {};
  for (const [key, value] of Object.entries(meta)) {
    output[key] = redactValue(key, value);
  }
  return output;
};

type LogPayload = {
  ts: string;
  level: LogLevel;
  message: string;
  meta?: LogMeta;
};

const emit = (level: LogLevel, message: string, meta?: LogMeta) => {
  const payload: LogPayload = {
    ts: new Date().toISOString(),
    level,
    message,
    ...(meta ? { meta: redactObject(meta) } : {}),
  };
  const line = JSON.stringify(payload);

  if (level === 'error') {
    console.error(line);
    return;
  }
  if (level === 'warn') {
    console.warn(line);
    return;
  }
  console.log(line);
};

export const appLogger = {
  debug: (message: string, meta?: LogMeta) => emit('debug', message, meta),
  info: (message: string, meta?: LogMeta) => emit('info', message, meta),
  warn: (message: string, meta?: LogMeta) => emit('warn', message, meta),
  error: (message: string, meta?: LogMeta) => emit('error', message, meta),
};
