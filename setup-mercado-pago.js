#!/usr/bin/env node

/**
 * Script para configurar Mercado Pago en TuWeb.ai
 * Este script verifica y configura las variables de entorno necesarias
 */

import dotenv from 'dotenv';
import { resolve } from 'path';
import fs from 'fs';

// Cargar variables de entorno
dotenv.config({ path: resolve(process.cwd(), '.env') });
dotenv.config({ path: resolve(process.cwd(), 'config.env') });

console.log('🔧 Configurando Mercado Pago para TuWeb.ai...\n');

// Verificar variables de entorno
const requiredVars = {
  'MP_ACCESS_TOKEN': process.env.MP_ACCESS_TOKEN,
  'SMTP_HOST': process.env.SMTP_HOST,
  'SMTP_USER': process.env.SMTP_USER,
  'SMTP_PASS': process.env.SMTP_PASS,
  'SESSION_SECRET': process.env.SESSION_SECRET,
  'DATABASE_URL': process.env.DATABASE_URL
};

console.log('📋 Estado de las variables de entorno:');
Object.entries(requiredVars).forEach(([key, value]) => {
  const status = value ? '✅ Configurado' : '❌ No configurado';
  console.log(`   ${key}: ${status}`);
});

// Verificar si MP_ACCESS_TOKEN está configurado
if (!process.env.MP_ACCESS_TOKEN) {
  console.log('\n❌ ERROR: MP_ACCESS_TOKEN no está configurado');
  console.log('\n📝 Para configurar Mercado Pago:');
  console.log('1. Ve a https://www.mercadopago.com.ar/developers/panel/credentials');
  console.log('2. Crea una aplicación o usa una existente');
  console.log('3. Copia el Access Token de producción');
  console.log('4. Agrega la variable MP_ACCESS_TOKEN a tu archivo .env o config.env');
  console.log('\nEjemplo:');
  console.log('MP_ACCESS_TOKEN=APP_USR-1234567890abcdef-123456-abcdef1234567890');
  
  process.exit(1);
}

// Verificar que el token tenga el formato correcto
if (!process.env.MP_ACCESS_TOKEN.startsWith('APP_USR-')) {
  console.log('\n⚠️ ADVERTENCIA: El MP_ACCESS_TOKEN no parece tener el formato correcto');
  console.log('Los tokens de Mercado Pago suelen comenzar con "APP_USR-"');
}

console.log('\n✅ Mercado Pago está configurado correctamente');
console.log('\n🔧 Para probar la integración:');
console.log('1. Inicia el servidor: npm run dev');
console.log('2. Ve a la sección de precios en tuweb-ai.com');
console.log('3. Intenta crear un pago con cualquier plan');
console.log('4. Verifica los logs del servidor para confirmar que funciona');

// Crear archivo de configuración de ejemplo si no existe
const configExamplePath = resolve(process.cwd(), 'config.env.example');
if (!fs.existsSync(configExamplePath)) {
  console.log('\n📝 Creando archivo de configuración de ejemplo...');
  const configExample = `# Configuración de Mercado Pago
MP_ACCESS_TOKEN=tu-mercado-pago-access-token-aqui

# Configuración de email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-password-de-aplicacion

# Configuración de sesiones
SESSION_SECRET=tu-super-secret-key-aqui

# Configuración de la base de datos
DATABASE_URL=postgresql://username:password@localhost:5432/tuwebai

# Configuración de Google OAuth
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret

# Configuración del frontend
FRONTEND_URL=https://tuweb-ai.com

# Configuración de entorno
NODE_ENV=production
`;
  
  fs.writeFileSync(configExamplePath, configExample);
  console.log('✅ Archivo config.env.example creado');
}

console.log('\n🎉 Configuración completada!');
console.log('\n📚 Recursos útiles:');
console.log('- Documentación de Mercado Pago: https://www.mercadopago.com.ar/developers/docs');
console.log('- API de Checkout Pro: https://www.mercadopago.com.ar/developers/docs/es/checkout-pro/integrate-checkout-pro');
console.log('- Webhooks: https://www.mercadopago.com.ar/developers/docs/es/notifications/webhooks'); 