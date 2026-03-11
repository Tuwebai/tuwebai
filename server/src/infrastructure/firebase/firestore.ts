import fs from 'fs';
import path from 'path';
import admin from 'firebase-admin';
import { env } from '../../config/env.config';
import { appLogger } from '../../utils/app-logger';

let firestoreInstance: admin.firestore.Firestore | null = null;
let initAttempted = false;
let appInitialized = false;

type FirebaseServiceAccountJson = {
  project_id?: string;
  client_email?: string;
  private_key?: string;
  projectId?: string;
  clientEmail?: string;
  privateKey?: string;
};

const normalizeServiceAccount = (
  rawAccount: FirebaseServiceAccountJson
): admin.ServiceAccount | null => {
  const projectId = rawAccount.projectId ?? rawAccount.project_id;
  const clientEmail = rawAccount.clientEmail ?? rawAccount.client_email;
  const privateKey = rawAccount.privateKey ?? rawAccount.private_key;

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return {
    projectId,
    clientEmail,
    privateKey,
  };
};

const resolveServiceAccountFromFile = (): admin.ServiceAccount | null => {
  const configuredPath = env.FIREBASE_SERVICE_ACCOUNT_KEY?.trim();
  if (!configuredPath) return null;

  const absolutePath = path.isAbsolute(configuredPath)
    ? configuredPath
    : path.resolve(process.cwd(), configuredPath);

  if (!fs.existsSync(absolutePath)) {
    appLogger.warn('firebase_admin.service_account_file_not_found', { path: absolutePath });
    return null;
  }

  try {
    const raw = fs.readFileSync(absolutePath, 'utf8');
    return normalizeServiceAccount(JSON.parse(raw) as FirebaseServiceAccountJson);
  } catch (error: unknown) {
    appLogger.error('firebase_admin.service_account_parse_failed', {
      path: absolutePath,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
};

const resolveServiceAccount = (): admin.ServiceAccount | null => {
  const inlineJson = env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (inlineJson) {
    try {
      return normalizeServiceAccount(JSON.parse(inlineJson) as FirebaseServiceAccountJson);
    } catch (error: unknown) {
      appLogger.error('firebase_admin.service_account_inline_parse_failed', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
  return resolveServiceAccountFromFile();
};

const ensureAppInitialized = (): boolean => {
  if (appInitialized) return true;
  if (initAttempted) return false;
  initAttempted = true;

  try {
    if (admin.apps.length === 0) {
      const serviceAccount = resolveServiceAccount();
      if (serviceAccount) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: env.FIREBASE_PROJECT_ID || serviceAccount.projectId,
        });
      } else {
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
          projectId: env.FIREBASE_PROJECT_ID,
        });
      }
    }
    appInitialized = true;
    return true;
  } catch (error: unknown) {
    appLogger.warn('firebase_admin.unavailable', {
      error: error instanceof Error ? error.message : String(error),
      hint: 'Idempotencia distribuida usara fallback local',
    });
    return false;
  }
};

export const getFirestore = (): admin.firestore.Firestore | null => {
  if (firestoreInstance) return firestoreInstance;
  if (!ensureAppInitialized()) return null;

  try {
    firestoreInstance = admin.firestore();
    const adminApp = admin.app();
    appLogger.info('firebase_admin.initialized', {
      projectId: env.FIREBASE_PROJECT_ID || adminApp.options.projectId,
    });
    return firestoreInstance;
  } catch (error: unknown) {
    appLogger.warn('firebase_admin.unavailable', {
      error: error instanceof Error ? error.message : String(error),
      hint: 'Idempotencia distribuida usara fallback local',
    });
    return null;
  }
};

export const getFirebaseAdminAuth = (): admin.auth.Auth | null => {
  if (!ensureAppInitialized()) return null;
  try {
    return admin.auth();
  } catch {
    return null;
  }
};
