import dotenv from 'dotenv';
import { resolve } from 'path';

// Cargar variables de entorno
dotenv.config({ path: resolve(process.cwd(), '.env') });
dotenv.config({ path: resolve(process.cwd(), 'config.env') });

console.log('🔧 Verificando configuración de base de datos...\n');

console.log('📋 Variables críticas:');
console.log('   - DATABASE_URL:', process.env.DATABASE_URL ? '✅ Configurado' : '❌ NO CONFIGURADO');
console.log('   - SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Configurado' : '❌ No configurado');
console.log('   - SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅ Configurado' : '❌ No configurado');

if (process.env.DATABASE_URL) {
  console.log('\n🔍 DATABASE_URL encontrada:');
  console.log('   - Tipo:', process.env.DATABASE_URL.includes('neon') ? 'NeonDB' : 'Otro');
  console.log('   - Longitud:', process.env.DATABASE_URL.length);
  console.log('   - Inicia con:', process.env.DATABASE_URL.substring(0, 20) + '...');
} else {
  console.log('\n❌ PROBLEMA: DATABASE_URL no está configurada');
  console.log('💡 Solución:');
  console.log('   1. Verifica que el archivo .env existe');
  console.log('   2. Agrega DATABASE_URL=tu_url_de_neon_o_supabase');
  console.log('   3. Reinicia el servidor');
}

console.log('\n🚀 Para probar la conexión:');
console.log('   npm run dev'); 