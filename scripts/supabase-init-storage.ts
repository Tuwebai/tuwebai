import { ensureAvatarBucket } from '../server/src/infrastructure/storage/avatar-storage.service.ts';

await ensureAvatarBucket();
console.log('SUPABASE_STORAGE_BUCKET_READY=avatars');
