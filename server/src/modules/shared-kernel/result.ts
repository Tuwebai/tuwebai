export interface DomainError {
  code: string;
  message: string;
}

export type Result<T, E = DomainError> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export const ok = <T>(value: T): Result<T> => ({
  ok: true,
  value,
});

export const fail = <E = DomainError>(error: E): Result<never, E> => ({
  ok: false,
  error,
});
