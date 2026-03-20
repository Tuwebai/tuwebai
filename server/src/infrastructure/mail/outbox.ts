import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { EmailData } from './email.service';
import { appLogger } from '../../utils/app-logger';

export interface BackgroundEmailOptions {
  event: string;
  meta?: Record<string, unknown>;
}

export interface TransactionalOutboxPayload {
  to: string;
  subject: string;
  html: string;
  text: string;
  from?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    path: string;
    cid: string;
  }>;
}

type OutboxTask =
  | {
      id: string;
      kind: 'contact';
      attempts: number;
      createdAt: string;
      nextAttemptAt: string;
      options: BackgroundEmailOptions;
      payload: EmailData;
    }
  | {
      id: string;
      kind: 'transactional';
      attempts: number;
      createdAt: string;
      nextAttemptAt: string;
      options: BackgroundEmailOptions;
      payload: TransactionalOutboxPayload;
    };

type ProcessHandlers = {
  sendContact: (payload: EmailData) => Promise<{ messageId?: string } | unknown>;
  sendTransactional: (payload: TransactionalOutboxPayload) => Promise<{ messageId?: string } | unknown>;
};

const OUTBOX_ROOT = path.resolve(process.cwd(), 'logs/mail-outbox');
const PENDING_DIR = path.join(OUTBOX_ROOT, 'pending');
const FAILED_DIR = path.join(OUTBOX_ROOT, 'failed');
const PROCESSING_DIR = path.join(OUTBOX_ROOT, 'processing');
const MAX_ATTEMPTS = 4;
const BASE_RETRY_MS = 30_000;
const PROCESS_BATCH_SIZE = 5;
const POLL_INTERVAL_MS = 15_000;

let isProcessing = false;
let handlers: ProcessHandlers | null = null;

const ensureOutboxDirs = () => {
  [OUTBOX_ROOT, PENDING_DIR, FAILED_DIR, PROCESSING_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

const readTask = (filePath: string): OutboxTask | null => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as OutboxTask;
  } catch (error) {
    appLogger.error('mail.outbox.read_failed', {
      filePath,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
};

const persistTask = (dir: string, task: OutboxTask) => {
  fs.writeFileSync(path.join(dir, `${task.id}.json`), JSON.stringify(task), 'utf8');
};

const deleteTask = (filePath: string) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const moveTask = (fromPath: string, toDir: string, task: OutboxTask) => {
  deleteTask(fromPath);
  persistTask(toDir, task);
};

const getRetryDelayMs = (attempts: number) => BASE_RETRY_MS * Math.max(1, attempts);

const getPendingFiles = (): string[] => {
  ensureOutboxDirs();
  return fs
    .readdirSync(PENDING_DIR)
    .filter((fileName) => fileName.endsWith('.json'))
    .map((fileName) => path.join(PENDING_DIR, fileName))
    .sort();
};

const processSingleTask = async (filePath: string) => {
  if (!handlers) return;

  const task = readTask(filePath);
  if (!task) {
    deleteTask(filePath);
    return;
  }

  if (new Date(task.nextAttemptAt).getTime() > Date.now()) {
    return;
  }

  const processingPath = path.join(PROCESSING_DIR, `${task.id}.json`);
  fs.renameSync(filePath, processingPath);

  try {
    const result =
      task.kind === 'contact'
        ? await handlers.sendContact(task.payload)
        : await handlers.sendTransactional(task.payload);

    deleteTask(processingPath);
    appLogger.info(`${task.options.event}.smtp_sent`, {
      ...(task.options.meta || {}),
      outboxId: task.id,
      attempts: task.attempts + 1,
      messageId:
        result && typeof result === 'object' && 'messageId' in result
          ? (result as { messageId?: string }).messageId
          : undefined,
    });
  } catch (error) {
    const attempts = task.attempts + 1;
    const updatedTask: OutboxTask = {
      ...task,
      attempts,
      nextAttemptAt: new Date(Date.now() + getRetryDelayMs(attempts)).toISOString(),
    };

    if (attempts >= MAX_ATTEMPTS) {
      moveTask(processingPath, FAILED_DIR, updatedTask);
      appLogger.error(`${task.options.event}.smtp_failed_terminal`, {
        ...(task.options.meta || {}),
        outboxId: task.id,
        attempts,
        error: error instanceof Error ? error.message : String(error),
      });
      return;
    }

    moveTask(processingPath, PENDING_DIR, updatedTask);
    appLogger.warn(`${task.options.event}.smtp_retry_scheduled`, {
      ...(task.options.meta || {}),
      outboxId: task.id,
      attempts,
      nextAttemptAt: updatedTask.nextAttemptAt,
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

const processOutbox = async () => {
  if (isProcessing || !handlers) return;
  isProcessing = true;

  try {
    const files = getPendingFiles().slice(0, PROCESS_BATCH_SIZE);
    for (const filePath of files) {
      await processSingleTask(filePath);
    }
  } finally {
    isProcessing = false;
  }
};

const enqueueTask = (task: OutboxTask) => {
  ensureOutboxDirs();
  persistTask(PENDING_DIR, task);
  appLogger.info(`${task.options.event}.queued`, {
    ...(task.options.meta || {}),
    outboxId: task.id,
    kind: task.kind,
  });
  void processOutbox();
};

export const enqueueContactEmailOutbox = (payload: EmailData, options: BackgroundEmailOptions) => {
  enqueueTask({
    id: crypto.randomUUID(),
    kind: 'contact',
    attempts: 0,
    createdAt: new Date().toISOString(),
    nextAttemptAt: new Date().toISOString(),
    options,
    payload,
  });
};

export const enqueueTransactionalEmailOutbox = (
  payload: TransactionalOutboxPayload,
  options: BackgroundEmailOptions,
) => {
  enqueueTask({
    id: crypto.randomUUID(),
    kind: 'transactional',
    attempts: 0,
    createdAt: new Date().toISOString(),
    nextAttemptAt: new Date().toISOString(),
    options,
    payload,
  });
};

export const startMailOutboxWorker = (nextHandlers: ProcessHandlers) => {
  handlers = nextHandlers;
  ensureOutboxDirs();
  void processOutbox();
  setInterval(() => {
    void processOutbox();
  }, POLL_INTERVAL_MS);
};
