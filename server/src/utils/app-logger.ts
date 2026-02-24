import { env } from '../config/env.config';

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

const LOG_SINK_URL = env.LOG_SINK_URL;
const LOG_SINK_TIMEOUT_MS = Number.isFinite(env.LOG_SINK_TIMEOUT_MS) ? env.LOG_SINK_TIMEOUT_MS : 2000;
const LOG_SINK_API_KEY = env.LOG_SINK_API_KEY?.trim();
const IS_DEV = env.NODE_ENV === 'development';

let sinkFailureCount = 0;
let sinkDisabledUntilTs = 0;

const emitToSink = (payload: LogPayload) => {
  if (!LOG_SINK_URL) return;
  if (sinkDisabledUntilTs > Date.now()) return;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LOG_SINK_TIMEOUT_MS);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (LOG_SINK_API_KEY) {
    headers.Authorization = `Bearer ${LOG_SINK_API_KEY}`;
  }

  fetch(LOG_SINK_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
    signal: controller.signal,
  })
    .then((res) => {
      if (!res.ok) {
        sinkFailureCount += 1;
        if (!IS_DEV && (sinkFailureCount <= 3 || sinkFailureCount % 50 === 0)) {
          console.warn(
            JSON.stringify({
              ts: new Date().toISOString(),
              level: 'warn',
              message: 'logger.sink_non_2xx',
              meta: { statusCode: res.status, attempts: sinkFailureCount },
            })
          );
        }
      } else {
        sinkFailureCount = 0;
      }
    })
    .catch((error: unknown) => {
      sinkFailureCount += 1;
      // Basic circuit-breaker to avoid hammering a down sink.
      if (sinkFailureCount >= 3) {
        sinkDisabledUntilTs = Date.now() + 30_000;
      }
      if (!IS_DEV && (sinkFailureCount <= 3 || sinkFailureCount % 50 === 0)) {
        console.warn(
          JSON.stringify({
            ts: new Date().toISOString(),
            level: 'warn',
            message: 'logger.sink_failed',
            meta: {
              attempts: sinkFailureCount,
              error: error instanceof Error ? error.message : String(error),
            },
          })
        );
      }
    })
    .finally(() => {
      clearTimeout(timeout);
    });
};

const emit = (level: LogLevel, message: string, meta?: LogMeta) => {
  const payload: LogPayload = {
    ts: new Date().toISOString(),
    level,
    message,
    ...(meta ? { meta: redactObject(meta) } : {}),
  };
  const line = JSON.stringify(payload);
  emitToSink(payload);

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
