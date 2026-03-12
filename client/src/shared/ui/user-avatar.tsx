import { useMemo, useState } from 'react';
import { API_URL } from '@/lib/api';

interface UserAvatarProps {
  image?: string;
  name?: string;
  username?: string;
  className: string;
  textClassName?: string;
}

const isGoogleAvatarHost = (host: string) =>
  host === 'lh3.googleusercontent.com' ||
  host.endsWith('.googleusercontent.com') ||
  host.endsWith('.ggpht.com');

const resolveAvatarSrc = (image?: string) => {
  const source = image?.trim();
  if (!source) return '';
  if (source.startsWith('data:') || source.startsWith('blob:') || source.startsWith('/')) {
    return source;
  }

  try {
    const url = new URL(source);
    if (url.protocol === 'https:' && isGoogleAvatarHost(url.hostname)) {
      return `${API_URL}/api/users/avatar?src=${encodeURIComponent(source)}`;
    }
  } catch {
    return source;
  }

  return source;
};

export function UserAvatar({ image, name, username, className, textClassName = 'text-white' }: UserAvatarProps) {
  const resolvedImage = useMemo(() => resolveAvatarSrc(image), [image]);
  const [hasImageError, setHasImageError] = useState(false);
  const fallbackLabel = name?.trim()?.charAt(0) || username?.trim()?.charAt(0) || 'U';

  return (
    <div className={className}>
      {resolvedImage && !hasImageError ? (
        <img
          src={resolvedImage}
          alt="Profile"
          className="h-full w-full rounded-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setHasImageError(true)}
        />
      ) : (
        <span className={textClassName}>{fallbackLabel}</span>
      )}
    </div>
  );
}
