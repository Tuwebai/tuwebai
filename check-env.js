import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Verificando configuración de variables de entorno...\n');

// Verificar si existe el archivo .env
const envPath = path.join(process.cwd(), '.env');
const configEnvPath = path.join(process.cwd(), 'config.env');
const examplePath = path.join(process.cwd(), 'config.env.example');

console.log('📁 Directorio actual:', process.cwd());
console.log('🔍 Buscando archivos de configuración:');
console.log('   - .env:', fs.existsSync(envPath) ? '✅ Existe' : '❌ No existe');
console.log('   - config.env:', fs.existsSync(configEnvPath) ? '✅ Existe' : '❌ No existe');
console.log('   - config.env.example:', fs.existsSync(examplePath) ? '✅ Existe' : '❌ No existe');

// Si no existe .env, crear uno basado en el ejemplo
if (!fs.existsSync(envPath) && fs.existsSync(examplePath)) {
  console.log('\n📝 Creando archivo .env desde config.env.example...');
  
  try {
    const exampleContent = fs.readFileSync(examplePath, 'utf8');
    fs.writeFileSync(envPath, exampleContent);
    console.log('✅ Archivo .env creado exitosamente');
  } catch (error) {
    console.error('❌ Error al crear .env:', error.message);
  }
}

// Cargar variables de entorno
dotenv.config({ path: envPath });
dotenv.config({ path: configEnvPath });

console.log('\n📋 Variables de entorno disponibles:');
console.log('   - NODE_ENV:', process.env.NODE_ENV || 'No configurado');
console.log('   - PORT:', process.env.PORT || 'No configurado');
console.log('   - SESSION_SECRET:', process.env.SESSION_SECRET ? '✅ Configurado' : '❌ No configurado');
console.log('   - SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Configurado' : '❌ No configurado');
console.log('   - SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅ Configurado' : '❌ No configurado');
console.log('   - GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Configurado' : '❌ No configurado');
console.log('   - GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ Configurado' : '❌ No configurado');

console.log('\n💡 Para configurar Google OAuth:');
console.log('   1. Ve a https://console.cloud.google.com/');
console.log('   2. Crea un proyecto o selecciona uno existente');
console.log('   3. Habilita la API de Google+');
console.log('   4. Crea credenciales OAuth 2.0');
console.log('   5. Configura las URLs autorizadas:');
console.log('      - http://localhost:5000/api/auth/google/callback (desarrollo)');
console.log('      - https://tuwebai.com/api/auth/google/callback (producción)');
console.log('   6. Copia el Client ID y Client Secret al archivo .env');

console.log('\n🚀 Para ejecutar el servidor:');
console.log('   npm run dev'); 