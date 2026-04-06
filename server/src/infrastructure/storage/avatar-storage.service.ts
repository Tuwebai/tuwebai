import { supabaseAdminClient } from '../database/supabase/supabase-admin-client';

const AVATARS_BUCKET = 'avatars';
const AVATAR_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

const ensureAvatarMimeType = (contentType: string) => {
  if (!AVATAR_MIME_TYPES.includes(contentType)) {
    throw new Error('avatar_invalid_mime_type');
  }
};

const decodeDataUrl = (dataUrl: string): { buffer: Buffer; contentType: string } => {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    throw new Error('avatar_invalid_data_url');
  }

  const contentType = match[1].toLowerCase();
  ensureAvatarMimeType(contentType);
  const buffer = Buffer.from(match[2], 'base64');

  if (buffer.length === 0 || buffer.length > MAX_AVATAR_BYTES) {
    throw new Error('avatar_invalid_size');
  }

  return { buffer, contentType };
};

const getAvatarExtension = (contentType: string): string => {
  if (contentType === 'image/jpeg' || contentType === 'image/jpg') return 'jpg';
  if (contentType === 'image/png') return 'png';
  return 'webp';
};

export const ensureAvatarBucket = async (): Promise<void> => {
  const { data, error } = await supabaseAdminClient.storage.getBucket(AVATARS_BUCKET);

  if (!error && data) {
    return;
  }

  const createResult = await supabaseAdminClient.storage.createBucket(AVATARS_BUCKET, {
    allowedMimeTypes: AVATAR_MIME_TYPES,
    fileSizeLimit: `${MAX_AVATAR_BYTES}`,
    public: true,
  });

  if (createResult.error && !String(createResult.error.message).includes('already exists')) {
    throw createResult.error;
  }
};

export const uploadUserAvatar = async (uid: string, dataUrl: string): Promise<string> => {
  await ensureAvatarBucket();

  const { buffer, contentType } = decodeDataUrl(dataUrl);
  const extension = getAvatarExtension(contentType);
  const filePath = `${uid}/avatar.${extension}`;

  const uploadResult = await supabaseAdminClient.storage.from(AVATARS_BUCKET).upload(filePath, buffer, {
    cacheControl: '3600',
    contentType,
    upsert: true,
  });

  if (uploadResult.error) {
    throw uploadResult.error;
  }

  const publicUrlResult = supabaseAdminClient.storage.from(AVATARS_BUCKET).getPublicUrl(filePath);
  return publicUrlResult.data.publicUrl;
};
