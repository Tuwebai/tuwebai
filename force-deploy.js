#!/usr/bin/env node

/**
 * Script para forzar el deploy en Render
 */

import axios from 'axios';

console.log('🚀 Forzando deploy en Render...\n');

// URL del webhook de Render (debes reemplazar esto con tu webhook real)
const RENDER_WEBHOOK_URL = 'https://api.render.com/deploy/srv-d1rj6795pdvs73e5sl10?key=YOUR_WEBHOOK_KEY';

async function forceDeploy() {
  try {
    console.log('📡 Enviando señal de deploy a Render...');
    
    const response = await axios.post(RENDER_WEBHOOK_URL, {}, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    
    console.log('✅ Deploy iniciado exitosamente');
    console.log('📋 Response:', response.data);
    
    console.log('\n⏳ El deploy tomará 2-3 minutos...');
    console.log('🔍 Puedes monitorear el progreso en: https://dashboard.render.com/web/srv-d1rj6795pdvs73e5sl10');
    
  } catch (error) {
    console.error('❌ Error al forzar deploy:', error.message);
    console.log('\n🔧 Alternativa manual:');
    console.log('1. Ve a https://dashboard.render.com/web/srv-d1rj6795pdvs73e5sl10');
    console.log('2. Haz click en "Manual Deploy"');
    console.log('3. Selecciona "Deploy latest commit"');
  }
}

// Ejecutar
forceDeploy(); 