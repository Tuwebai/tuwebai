#!/usr/bin/env node

import dotenv from 'dotenv';
dotenv.config();

console.log('🔧 Diagnóstico y solución de problemas de Google OAuth\n');

// Verificar configuración básica
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const nodeEnv = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 3001;

console.log('📋 Estado actual de la configuración:');
console.log(`✅ Client ID: ${clientId ? 'Configurado' : '❌ FALTA'}`);
console.log(`✅ Client Secret: ${clientSecret ? 'Configurado' : '❌ FALTA'}`);
console.log(`🌐 Entorno: ${nodeEnv}`);
console.log(`🔌 Puerto: ${port}`);

// Calcular URLs
const baseUrl = nodeEnv === 'production' 
  ? `https://${process.env.DOMAIN || 'localhost'}`
  : `http://localhost:${port}`;

const callbackUrl = `${baseUrl}/api/auth/google/callback`;
const frontendUrl = nodeEnv === 'production'
  ? `https://${process.env.DOMAIN || 'localhost'}`
  : 'http://localhost:5173';

console.log(`\n🔗 URLs calculadas:`);
console.log(`🏠 Backend: ${baseUrl}`);
console.log(`🔄 Callback: ${callbackUrl}`);
console.log(`🎨 Frontend: ${frontendUrl}`);

// Verificar problemas comunes
console.log('\n🔍 Diagnóstico de problemas comunes:');

// 1. Variables faltantes
if (!clientId || !clientSecret) {
  console.log('❌ PROBLEMA: Faltan credenciales de Google OAuth');
  console.log('💡 SOLUCIÓN:');
  console.log('   1. Ve a https://console.cloud.google.com/');
  console.log('   2. Crea credenciales OAuth 2.0');
  console.log('   3. Agrega estas variables a tu .env:');
  console.log(`      GOOGLE_CLIENT_ID=tu_client_id_aqui`);
  console.log(`      GOOGLE_CLIENT_SECRET=tu_client_secret_aqui`);
  console.log('');
}

// 2. URLs de callback incorrectas
console.log('🔗 Verificar URLs en Google Cloud Console:');
console.log('   En Google Cloud Console > Credentials > OAuth 2.0 Client IDs:');
console.log(`   - Authorized JavaScript origins: ${frontendUrl}`);
console.log(`   - Authorized redirect URIs: ${callbackUrl}`);
console.log('');

// 3. Problemas de tiempo
console.log('⏰ Verificar sincronización de tiempo:');
console.log('   - Asegúrate de que el reloj de tu PC esté sincronizado');
console.log('   - En Windows: Panel de control > Fecha y hora > Sincronizar ahora');
console.log('');

// 4. Problemas de cookies
console.log('🍪 Verificar configuración de cookies:');
console.log('   - Asegúrate de que las cookies no estén bloqueadas');
console.log('   - Verifica que el navegador permita cookies de terceros');
console.log('   - En desarrollo, usa http://localhost (no 127.0.0.1)');
console.log('');

// 5. Problemas de CORS
console.log('🌐 Verificar CORS:');
console.log('   - El frontend y backend deben estar en el mismo dominio o configurar CORS');
console.log('   - En desarrollo, usa puertos diferentes pero mismo dominio (localhost)');
console.log('');

// 6. Problemas de sesión
console.log('🔐 Verificar sesiones:');
console.log('   - Las sesiones deben persistir entre el inicio y callback');
console.log('   - Verifica que SESSION_SECRET esté configurado');
console.log('   - En desarrollo, usa sameSite: "lax" para cookies');
console.log('');

// Generar archivo .env de ejemplo si no existe
import fs from 'fs';
const envExamplePath = '.env.example';

if (!fs.existsSync(envExamplePath)) {
  console.log('📝 Creando archivo .env.example...');
  const envExample = `# Base de datos Supabase
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Configuración de la aplicación
NODE_ENV=development
PORT=3001
SESSION_SECRET=tu-super-secret-key-aqui

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Email (opcional)
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your_sendgrid_api_key_here

# Dominio (para producción)
DOMAIN=tuwebai.com
`;
  
  fs.writeFileSync(envExamplePath, envExample);
  console.log('✅ Archivo .env.example creado');
}

console.log('\n🚀 Pasos para probar Google OAuth:');
console.log('1. Ejecuta: npm run check-oauth');
console.log('2. Verifica que todas las variables estén configuradas');
console.log('3. Reinicia el servidor: npm run dev');
console.log('4. Intenta hacer login con Google');
console.log('5. Revisa los logs del servidor para errores específicos');
console.log('');

console.log('📞 Si el problema persiste:');
console.log('- Revisa los logs del servidor para errores específicos');
console.log('- Verifica que las URLs en Google Cloud Console coincidan exactamente');
console.log('- Asegúrate de que el proyecto de Google tenga la API de Google+ habilitada');
console.log('- Prueba con un navegador en modo incógnito para evitar problemas de caché'); 