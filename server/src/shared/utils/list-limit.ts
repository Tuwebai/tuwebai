const MAX_LIST_LIMIT = 100;

export const resolveOptionalLimit = (value: unknown): number | null => {
  if (typeof value !== 'string' || value.trim().length === 0) return null;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return Math.min(parsed, MAX_LIST_LIMIT);
};
