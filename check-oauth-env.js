#!/usr/bin/env node

import dotenv from 'dotenv';
import { resolve } from 'path';

// Cargar variables de entorno desde múltiples ubicaciones
dotenv.config({ path: resolve(process.cwd(), '.env') });
dotenv.config({ path: resolve(process.cwd(), 'config.env') });
dotenv.config({ path: resolve(process.cwd(), 'config.env.example') });

console.log('🔧 Verificando configuración de OAuth y base de datos...\n');

// Variables críticas para OAuth
const criticalVars = {
  'NODE_ENV': process.env.NODE_ENV,
  'SESSION_SECRET': process.env.SESSION_SECRET,
  'DATABASE_URL': process.env.DATABASE_URL,
  'GOOGLE_CLIENT_ID': process.env.GOOGLE_CLIENT_ID,
  'GOOGLE_CLIENT_SECRET': process.env.GOOGLE_CLIENT_SECRET,
  'DOMAIN': process.env.DOMAIN
};

let allConfigured = true;

console.log('📋 Estado de las variables críticas:');
console.log('=====================================');

for (const [key, value] of Object.entries(criticalVars)) {
  const isConfigured = value && value !== 'your_' + key.toLowerCase().replace(/_/g, '_') + '_here';
  const status = isConfigured ? '✅ Configurado' : '❌ No configurado';
  const displayValue = isConfigured ? (key.includes('SECRET') || key.includes('KEY') ? '***' : value) : 'No definido';
  
  console.log(`${key}: ${status} - ${displayValue}`);
  
  if (!isConfigured) {
    allConfigured = false;
  }
}

console.log('\n🔍 Verificaciones adicionales:');
console.log('==============================');

// Verificar NODE_ENV
if (process.env.NODE_ENV === 'production') {
  console.log('✅ NODE_ENV está en producción');
} else {
  console.log('⚠️  NODE_ENV no está en producción:', process.env.NODE_ENV || 'development');
}

// Verificar DATABASE_URL
if (process.env.DATABASE_URL) {
  if (process.env.DATABASE_URL.includes('supabase.co')) {
    console.log('✅ DATABASE_URL apunta a Supabase');
  } else if (process.env.DATABASE_URL.includes('postgresql://')) {
    console.log('✅ DATABASE_URL es una conexión PostgreSQL válida');
  } else {
    console.log('⚠️  DATABASE_URL no parece ser una URL de base de datos válida');
  }
} else {
  console.log('❌ DATABASE_URL no está configurado');
}

// Verificar Google OAuth
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  console.log('✅ Google OAuth está configurado');
  
  // Verificar que las credenciales no sean placeholders
  if (process.env.GOOGLE_CLIENT_ID.includes('your_') || process.env.GOOGLE_CLIENT_SECRET.includes('your_')) {
    console.log('❌ Google OAuth tiene valores placeholder');
    allConfigured = false;
  }
} else {
  console.log('❌ Google OAuth no está configurado');
  allConfigured = false;
}

// Verificar DOMAIN para producción
if (process.env.NODE_ENV === 'production') {
  if (process.env.DOMAIN && process.env.DOMAIN !== 'tuwebai.com') {
    console.log('✅ DOMAIN está configurado para producción:', process.env.DOMAIN);
  } else {
    console.log('❌ DOMAIN no está configurado correctamente para producción');
    allConfigured = false;
  }
}

console.log('\n📊 Resumen:');
console.log('===========');

if (allConfigured) {
  console.log('🎉 ¡Todas las variables críticas están configuradas correctamente!');
  console.log('✅ OAuth debería funcionar sin problemas');
} else {
  console.log('❌ Hay variables críticas sin configurar');
  console.log('⚠️  OAuth puede fallar en producción');
  console.log('\n🔧 Variables que necesitan configuración:');
  
  for (const [key, value] of Object.entries(criticalVars)) {
    const isConfigured = value && value !== 'your_' + key.toLowerCase().replace(/_/g, '_') + '_here';
    if (!isConfigured) {
      console.log(`   - ${key}`);
    }
  }
  
  console.log('\n📝 Instrucciones:');
  console.log('1. Configura las variables en Render.com (Environment Variables)');
  console.log('2. Asegúrate de que DATABASE_URL apunte a tu base de datos de producción');
  console.log('3. Configura las credenciales de Google OAuth en Google Cloud Console');
  console.log('4. Establece NODE_ENV=production');
  console.log('5. Configura SESSION_SECRET con una clave segura');
}

console.log('\n🔗 URLs de verificación:');
console.log('=======================');
console.log('Frontend: https://tuweb-ai.com');
console.log('Backend: https://tuwebai-backend.onrender.com');
console.log('Google OAuth: https://console.cloud.google.com/apis/credentials');

process.exit(allConfigured ? 0 : 1); 