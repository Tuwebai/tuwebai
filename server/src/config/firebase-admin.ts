import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import { env } from './env.config';
import { appLogger } from '../utils/app-logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let firestoreInstance: admin.firestore.Firestore | null = null;
let initAttempted = false;
let appInitialized = false;

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
    return JSON.parse(raw);
  } catch (error: any) {
    appLogger.error('firebase_admin.service_account_parse_failed', {
      path: absolutePath,
      error: error?.message,
    });
    return null;
  }
};

const resolveServiceAccount = (): admin.ServiceAccount | null => {
  const inlineJson = env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (inlineJson) {
    try {
      return JSON.parse(inlineJson);
    } catch (error: any) {
      appLogger.error('firebase_admin.service_account_inline_parse_failed', {
        error: error?.message,
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
          projectId: env.FIREBASE_PROJECT_ID || serviceAccount.project_id,
        });
      } else {
        // Fallback to application default credentials when available.
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
          projectId: env.FIREBASE_PROJECT_ID,
        });
      }
    }
    appInitialized = true;
    return true;
  } catch (error: any) {
    appLogger.warn('firebase_admin.unavailable', {
      error: error?.message,
      hint: 'Idempotencia distribuida usara fallback local',
    });
    return false;
  }
};

const ensureInitialized = (): admin.firestore.Firestore | null => {
  if (firestoreInstance) return firestoreInstance;
  if (!ensureAppInitialized()) return null;

  try {
    firestoreInstance = admin.firestore();
    appLogger.info('firebase_admin.initialized', {
      projectId: env.FIREBASE_PROJECT_ID || firestoreInstance.app.options.projectId,
    });
    return firestoreInstance;
  } catch (error: any) {
    appLogger.warn('firebase_admin.unavailable', {
      error: error?.message,
      hint: 'Idempotencia distribuida usara fallback local',
    });
    return null;
  }
};

export const getAdminFirestore = (): admin.firestore.Firestore | null => ensureInitialized();
export const getAdminAuth = (): admin.auth.Auth | null => {
  if (!ensureAppInitialized()) return null;
  try {
    return admin.auth();
  } catch {
    return null;
  }
};
