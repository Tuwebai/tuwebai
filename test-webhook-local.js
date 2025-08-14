/**
 * Script para probar el webhook de Mercado Pago localmente
 */

import axios from 'axios';

const LOCAL_URL = 'http://localhost:5000';

// Simular webhook de Mercado Pago
const mockWebhookData = {
  type: 'payment',
  data: {
    id: 'test-payment-' + Date.now()
  }
};

// Simular headers de Mercado Pago
const mockHeaders = {
  'Content-Type': 'application/json',
  'X-Signature': 'test-signature',
  'X-Request-Id': 'test-request-' + Date.now(),
  'User-Agent': 'MercadoPago-Webhook/1.0'
};

async function testWebhook() {
  console.log('🧪 Probando webhook localmente...');
  console.log(`📍 URL: ${LOCAL_URL}/webhook/mercadopago`);
  console.log(`📦 Datos:`, JSON.stringify(mockWebhookData, null, 2));
  console.log('');
  
  try {
    // Test 1: Health check
    console.log('1️⃣ Probando health check...');
    const healthResponse = await axios.get(`${LOCAL_URL}/webhook/mercadopago/health`);
    console.log('✅ Health check:', healthResponse.data);
    
    // Test 2: Webhook POST
    console.log('\n2️⃣ Probando webhook POST...');
    const webhookResponse = await axios.post(
      `${LOCAL_URL}/webhook/mercadopago`,
      mockWebhookData,
      { headers: mockHeaders }
    );
    console.log('✅ Webhook response:', webhookResponse.data);
    console.log('✅ Status:', webhookResponse.status);
    
    // Test 3: Idempotencia
    console.log('\n3️⃣ Probando idempotencia...');
    const webhookResponse2 = await axios.post(
      `${LOCAL_URL}/webhook/mercadopago`,
      mockWebhookData,
      { headers: mockHeaders }
    );
    console.log('✅ Segunda llamada:', webhookResponse2.status);
    
    console.log('\n🎉 ¡Todos los tests pasaron!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  testWebhook();
}

export { testWebhook };
