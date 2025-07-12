import dotenv from 'dotenv';
import { resolve } from 'path';
import { sendEmail, emailTemplate } from './server/email-service.js';

// Cargar variables de entorno
dotenv.config({ path: resolve(process.cwd(), '.env') });
dotenv.config({ path: resolve(process.cwd(), 'config.env') });

console.log('🔧 Probando sistema de emails con Microsoft 365...\n');

console.log('📋 Variables de entorno SMTP:');
console.log('   - SMTP_HOST:', process.env.SMTP_HOST || '❌ No configurado');
console.log('   - SMTP_PORT:', process.env.SMTP_PORT || '❌ No configurado');
console.log('   - SMTP_USER:', process.env.SMTP_USER || '❌ No configurado');
console.log('   - SMTP_PASS:', process.env.SMTP_PASS ? '✅ Configurado' : '❌ No configurado');
console.log('   - EMAIL_FROM:', process.env.EMAIL_FROM || '❌ No configurado');

if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.log('\n❌ Error: Faltan variables de entorno SMTP. Verifica tu archivo .env');
  process.exit(1);
}

async function testEmail() {
  try {
    console.log('\n📧 Enviando email de prueba...');
    
    const testEmail = await sendEmail({
      to: process.env.SMTP_USER,
      subject: 'Prueba de sistema de emails - TuWebAI',
      html: emailTemplate({
        title: 'Sistema de emails funcionando correctamente',
        message: `
          <p>Este es un email de prueba para verificar que el sistema de emails de TuWebAI está funcionando correctamente con Microsoft 365.</p>
          <p><strong>Detalles de la prueba:</strong></p>
          <ul>
            <li>Remitente: ${process.env.EMAIL_FROM}</li>
            <li>Destinatario: ${process.env.SMTP_USER}</li>
            <li>Servidor SMTP: ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}</li>
            <li>Fecha: ${new Date().toLocaleString()}</li>
          </ul>
          <p>Si recibes este email, significa que la configuración está correcta y el sistema está listo para producción.</p>
        `
      })
    });
    
    console.log('✅ Email enviado exitosamente!');
    console.log('📧 Message ID:', testEmail.messageId);
    console.log('📤 Respuesta del servidor:', testEmail.response);
    
  } catch (error) {
    console.error('❌ Error al enviar email:', error.message);
    console.error('🔍 Detalles del error:', error);
    
    if (error.code === 'EAUTH') {
      console.log('\n💡 Posibles soluciones:');
      console.log('   1. Verifica que SMTP_USER y SMTP_PASS sean correctos');
      console.log('   2. Asegúrate de que la contraseña sea una "App Password" de Microsoft 365');
      console.log('   3. Verifica que el usuario tenga permisos para enviar emails');
    }
    
    if (error.code === 'ECONNECTION') {
      console.log('\n💡 Posibles soluciones:');
      console.log('   1. Verifica que SMTP_HOST y SMTP_PORT sean correctos');
      console.log('   2. Asegúrate de que no haya firewall bloqueando la conexión');
      console.log('   3. Verifica la conectividad a internet');
    }
  }
}

testEmail(); 