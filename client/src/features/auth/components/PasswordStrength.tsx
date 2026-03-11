import { useMemo } from 'react';

interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = useMemo(() => {
    if (!password) return 0;

    let score = 0;

    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    return Math.min(100, Math.round((score / 6) * 100));
  }, [password]);

  const getColor = () => {
    if (strength < 30) return 'bg-red-500';
    if (strength < 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getMessage = () => {
    if (strength < 30) return 'Debil';
    if (strength < 60) return 'Moderada';
    return 'Fuerte';
  };

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Fortaleza: {getMessage()}</span>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{strength}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700">
        <div
          className={`h-2 rounded-full ${getColor()}`}
          style={{ width: `${strength}%` }}
        ></div>
      </div>

      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        <ul className="list-disc list-inside">
          {password.length < 8 && (
            <li className="text-red-500">Al menos 8 caracteres</li>
          )}
          {!/[A-Z]/.test(password) && (
            <li className="text-red-500">Al menos una mayuscula</li>
          )}
          {!/[a-z]/.test(password) && (
            <li className="text-red-500">Al menos una minuscula</li>
          )}
          {!/[0-9]/.test(password) && (
            <li className="text-red-500">Al menos un numero</li>
          )}
          {!/[^A-Za-z0-9]/.test(password) && (
            <li className="text-red-500">Al menos un caracter especial</li>
          )}
        </ul>
      </div>
    </div>
  );
}
