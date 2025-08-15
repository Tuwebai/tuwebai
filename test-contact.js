import axios from 'axios';

const RENDER_URL = 'https://tuwebai-backend.onrender.com';

async function testHealthCheck() {
  try {
    console.log('🏥 Probando Health Check...');
    const response = await axios.get(`${RENDER_URL}/api/health`);
    console.log('✅ Health Check exitoso:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Error en Health Check:', error.message);
    return false;
  }
}

async function testSimpleEndpoint() {
  try {
    console.log('🧪 Probando endpoint de prueba...');
    const response = await axios.get(`${RENDER_URL}/test`);
    console.log('✅ Test endpoint exitoso:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Error en test endpoint:', error.message);
    return false;
  }
}

async function testContactEndpoint() {
  try {
    console.log('📧 Probando endpoint de contacto...');
    const contactData = {
      name: "Juan Esteban López pachao",
      email: "Juanchilopezpachao7@gmail.com",
      message: "hola todo bien?"
    };
    
    const response = await axios.post(`${RENDER_URL}/contact`, contactData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Contact endpoint exitoso:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Error en contact endpoint:', error.message);
    if (error.response) {
      console.error('📋 Status:', error.response.status);
      console.error('📋 Data:', error.response.data);
    }
    return false;
  }
}

async function runTests() {
  console.log('🚀 Iniciando tests del servidor...\n');
  
  const healthOk = await testHealthCheck();
  console.log('');
  
  const testOk = await testSimpleEndpoint();
  console.log('');
  
  const contactOk = await testContactEndpoint();
  console.log('');
  
  if (healthOk && testOk && contactOk) {
    console.log('🎉 ¡Todos los tests pasaron! El servidor está funcionando correctamente.');
  } else {
    console.log('⚠️ Algunos tests fallaron. Revisa los logs de Render.');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { testHealthCheck, testSimpleEndpoint, testContactEndpoint, runTests };
