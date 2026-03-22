import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, initializeFirestore, memoryLocalCache } from 'firebase/firestore';

const getRequiredEnv = (key: string, value: string | undefined): string => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }

  throw new Error(
    `Falta la variable de entorno ${key} para inicializar Firebase en frontend. Verifica vite.config.ts (envDir) y el archivo .env de la raíz.`
  );
};

const firebaseConfig = {
  apiKey: getRequiredEnv('VITE_FIREBASE_API_KEY', import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: getRequiredEnv('VITE_FIREBASE_AUTH_DOMAIN', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: getRequiredEnv('VITE_FIREBASE_PROJECT_ID', import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: getRequiredEnv('VITE_FIREBASE_STORAGE_BUCKET', import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: getRequiredEnv(
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  ),
  appId: getRequiredEnv('VITE_FIREBASE_APP_ID', import.meta.env.VITE_FIREBASE_APP_ID),
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const isAndroidChrome =
  typeof navigator !== 'undefined' &&
  /Android/i.test(navigator.userAgent) &&
  /Chrome/i.test(navigator.userAgent);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = isAndroidChrome
  ? initializeFirestore(app, { localCache: memoryLocalCache() })
  : getFirestore(app);
