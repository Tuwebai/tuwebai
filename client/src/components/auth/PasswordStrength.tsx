import React, { useMemo } from 'react';

interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  // Calcular la fortaleza de la contraseña
  const strength = useMemo(() => {
    if (!password) return 0;
    
    let score = 0;
    
    // Longitud mínima
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Complejidad
    if (/[A-Z]/.test(password)) score += 1; // Mayúsculas
    if (/[a-z]/.test(password)) score += 1; // Minúsculas
    if (/[0-9]/.test(password)) score += 1; // Números
    if (/[^A-Za-z0-9]/.test(password)) score += 1; // Caracteres especiales
    
    // Normalizar a una escala de 0-100
    return Math.min(100, Math.round((score / 6) * 100));
  }, [password]);
  
  // Calcular el color según la fortaleza
  const getColor = () => {
    if (strength < 30) return 'bg-red-500';
    if (strength < 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  // Mensaje según la fortaleza
  const getMessage = () => {
    if (strength < 30) return 'Débil';
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
            <li className="text-red-500">Al menos una mayúscula</li>
          )}
          {!/[a-z]/.test(password) && (
            <li className="text-red-500">Al menos una minúscula</li>
          )}
          {!/[0-9]/.test(password) && (
            <li className="text-red-500">Al menos un número</li>
          )}
          {!/[^A-Za-z0-9]/.test(password) && (
            <li className="text-red-500">Al menos un carácter especial</li>
          )}
        </ul>
      </div>
    </div>
  );
}