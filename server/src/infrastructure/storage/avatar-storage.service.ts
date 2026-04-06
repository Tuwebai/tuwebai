import { supabaseAdminClient } from '../database/supabase/supabase-admin-client';

const AVATARS_BUCKET = 'avatars';
const AVATAR_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const buildAvatarPath = (uid: string) => `${uid}/avatar`;

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

export const ensureAvatarBucket = async (): Promise<void> => {
  const { data, error } = await supabaseAdminClient.storage.getBucket(AVATARS_BUCKET);

  if (!error && data) {
    if (data.public) {
      const updateResult = await supabaseAdminClient.storage.updateBucket(AVATARS_BUCKET, {
        allowedMimeTypes: AVATAR_MIME_TYPES,
        fileSizeLimit: `${MAX_AVATAR_BYTES}`,
        public: false,
      });

      if (updateResult.error) {
        throw updateResult.error;
      }
    }
    return;
  }

  const createResult = await supabaseAdminClient.storage.createBucket(AVATARS_BUCKET, {
    allowedMimeTypes: AVATAR_MIME_TYPES,
    fileSizeLimit: `${MAX_AVATAR_BYTES}`,
    public: false,
  });

  if (createResult.error && !String(createResult.error.message).includes('already exists')) {
    throw createResult.error;
  }
};

export const uploadUserAvatar = async (uid: string, dataUrl: string): Promise<string> => {
  await ensureAvatarBucket();

  const { buffer, contentType } = decodeDataUrl(dataUrl);
  const filePath = buildAvatarPath(uid);

  const uploadResult = await supabaseAdminClient.storage.from(AVATARS_BUCKET).upload(filePath, buffer, {
    cacheControl: '3600',
    contentType,
    upsert: true,
  });

  if (uploadResult.error) {
    throw uploadResult.error;
  }

  return `/api/users/${encodeURIComponent(uid)}/avatar`;
};

export const getUserAvatar = async (uid: string): Promise<{ buffer: Buffer; contentType: string }> => {
  await ensureAvatarBucket();

  const downloadResult = await supabaseAdminClient.storage.from(AVATARS_BUCKET).download(buildAvatarPath(uid));

  if (downloadResult.error || !downloadResult.data) {
    throw new Error('avatar_not_found');
  }

  const arrayBuffer = await downloadResult.data.arrayBuffer();
  return {
    buffer: Buffer.from(arrayBuffer),
    contentType: downloadResult.data.type || 'image/webp',
  };
};
