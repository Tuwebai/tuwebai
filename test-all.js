#!/usr/bin/env node

/**
 * Script para probar todas las funcionalidades de TuWeb.ai
 * Este script verifica que todo esté funcionando correctamente
 */

import dotenv from 'dotenv';
import { resolve } from 'path';
import axios from 'axios';

// Cargar variables de entorno
dotenv.config({ path: resolve(process.cwd(), '.env') });
dotenv.config({ path: resolve(process.cwd(), 'config.env') });

const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000' 
  : 'https://tuwebai-backend.onrender.com';

console.log('🧪 Probando todas las funcionalidades de TuWeb.ai...\n');
console.log(`🌍 API URL: ${API_URL}`);
console.log(`🔧 NODE_ENV: ${process.env.NODE_ENV || 'development'}\n`);

// Función para hacer tests
async function runTest(name, testFn) {
  try {
    console.log(`🔍 Probando: ${name}`);
    await testFn();
    console.log(`✅ ${name}: PASÓ\n`);
    return true;
  } catch (error) {
    console.log(`❌ ${name}: FALLÓ`);
    console.log(`   Error: ${error.message}\n`);
    return false;
  }
}

// Tests simplificados
const tests = [
  {
    name: 'Health check del backend',
    test: async () => {
      const response = await axios.get(`${API_URL}/health`, { timeout: 10000 });
      if (response.status !== 200) {
        throw new Error(`Status ${response.status}`);
      }
    }
  },
  {
    name: 'Conexión al backend',
    test: async () => {
      const response = await axios.get(`${API_URL}/api/auth/me`, { timeout: 10000 });
      if (response.status !== 200) {
        throw new Error(`Status ${response.status}`);
      }
    }
  },
  {
    name: 'Ruta /crear-preferencia',
    test: async () => {
      try {
        await axios.post(`${API_URL}/crear-preferencia`, { plan: 'Plan Básico' }, { timeout: 10000 });
        // Si llega aquí, significa que la ruta funciona (aunque el plan sea inválido)
        return;
      } catch (error) {
        if (error.response?.status === 400) {
          // Esto es esperado - plan inválido
          return;
        }
        throw error;
      }
    }
  },
  {
    name: 'Ruta /consulta',
    test: async () => {
      const testData = {
        nombre: 'Test User',
        email: 'test@example.com',
        mensaje: 'Test message'
      };
      
      const response = await axios.post(`${API_URL}/consulta`, testData, { timeout: 10000 });
      if (response.status !== 200) {
        throw new Error(`Status ${response.status}`);
      }
    }
  },
  {
    name: 'Variables de entorno críticas',
    test: async () => {
      const required = ['SESSION_SECRET', 'DATABASE_URL'];
      const missing = required.filter(key => !process.env[key]);
      
      if (missing.length > 0) {
        throw new Error(`Faltan variables: ${missing.join(', ')}`);
      }
    }
  }
];

// Ejecutar tests
async function runAllTests() {
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    const result = await runTest(test.name, test.test);
    if (result) passed++;
  }
  
  console.log('📊 Resultados:');
  console.log(`✅ Pasaron: ${passed}/${total}`);
  console.log(`❌ Fallaron: ${total - passed}/${total}`);
  
  if (passed === total) {
    console.log('\n🎉 ¡Todos los tests pasaron! TuWeb.ai está funcionando correctamente.');
  } else {
    console.log('\n⚠️ Algunos tests fallaron. Revisa los errores arriba.');
  }
  
  // Verificaciones adicionales
  console.log('\n📋 Verificaciones adicionales:');
  
  if (!process.env.MP_ACCESS_TOKEN) {
    console.log('❌ MP_ACCESS_TOKEN no configurado - Mercado Pago no funcionará');
  } else {
    console.log('✅ MP_ACCESS_TOKEN configurado');
  }
  
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('❌ Configuración de email incompleta - Los formularios no enviarán emails');
  } else {
    console.log('✅ Configuración de email completa');
  }
  
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.log('❌ Google OAuth no configurado - Login con Google no funcionará');
  } else {
    console.log('✅ Google OAuth configurado');
  }
}

// Ejecutar
runAllTests().catch(console.error); 