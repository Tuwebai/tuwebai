#!/usr/bin/env node

import dotenv from 'dotenv';
dotenv.config();

console.log('🔍 Verificando configuración de Google OAuth...\n');

// Verificar variables de entorno
const requiredVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'NODE_ENV',
  'PORT'
];

let allVarsPresent = true;

console.log('📋 Variables de entorno requeridas:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  const isPresent = !!value;
  const status = isPresent ? '✅' : '❌';
  const displayValue = isPresent ? (varName.includes('SECRET') ? '***configurado***' : value) : 'NO CONFIGURADO';
  
  console.log(`${status} ${varName}: ${displayValue}`);
  
  if (!isPresent) {
    allVarsPresent = false;
  }
});

console.log('\n🔧 Configuración de la aplicación:');
console.log(`📦 NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`🌐 Puerto: ${process.env.PORT || 3001}`);
console.log(`🏠 Dominio: ${process.env.DOMAIN || 'localhost'}`);

// Verificar URL de callback
const callbackURL = process.env.NODE_ENV === 'production' 
  ? `${process.env.DOMAIN}/api/auth/google/callback`
  : 'http://localhost:3001/api/auth/google/callback';

console.log(`🔄 Callback URL: ${callbackURL}`);

console.log('\n📝 Instrucciones para configurar Google OAuth:');
console.log('1. Ve a https://console.cloud.google.com/');
console.log('2. Crea un proyecto o selecciona uno existente');
console.log('3. Habilita la API de Google+');
console.log('4. Ve a "APIs & Services" > "Credentials"');
console.log('5. Crea credenciales OAuth 2.0');
console.log('6. Configura las URLs autorizadas:');
console.log(`   - Authorized JavaScript origins: http://localhost:5173`);
console.log(`   - Authorized redirect URIs: ${callbackURL}`);
console.log('7. Copia el Client ID y Client Secret');
console.log('8. Agrega las variables a tu archivo .env');

if (allVarsPresent) {
  console.log('\n✅ ¡Configuración completa! Google OAuth debería funcionar.');
} else {
  console.log('\n❌ Faltan variables de entorno. Configura las variables faltantes en tu archivo .env');
  process.exit(1);
} 