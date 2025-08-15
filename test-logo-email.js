import axios from 'axios';

const API_URL = 'https://tuwebai-backend.onrender.com';

async function testLogoEmail() {
  try {
    console.log('🎨 Probando nueva plantilla con logo...');
    console.log('📧 Enviando email de prueba...');
    
    const response = await axios.post(`${API_URL}/test-email`, {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Respuesta del servidor:');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    
    if (response.data.status === 'OK') {
      console.log('🎉 ¡Email con logo enviado exitosamente!');
      console.log('📧 Message ID:', response.data.messageId);
      console.log('⏰ Timestamp:', response.data.timestamp);
      console.log('\n📬 Revisa tu bandeja de entrada en tuwebai@gmail.com');
      console.log('🎨 El email incluye:');
      console.log('   - Logo TuWebAI (imagen)');
      console.log('   - Banner: "TuWebAI - Agencia Digital de Desarrollo Web"');
      console.log('   - Diseño responsive');
      console.log('   - Gradiente azul/púrpura');
      console.log('   - Footer con enlaces');
    }
    
  } catch (error) {
    console.error('❌ Error probando email con logo:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Ejecutar test
console.log('🚀 Iniciando test de email con logo...\n');
await testLogoEmail();
