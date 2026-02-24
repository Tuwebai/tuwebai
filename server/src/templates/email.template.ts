export function generateEmailTemplate(data: {
  name: string;
  email: string;
  message: string;
  title?: string;
  type: 'contact' | 'test';
}) {
  const { name, email, message, title, type } = data;
  
  const emailTitle = title || "Consulta desde formulario de contacto";
  const isTest = type === 'test';
  
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${emailTitle}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f8f9fa;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 30px 20px;
          text-align: center;
          color: white;
        }
        .logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;
          width: 100%;
          gap: 15px;
        }
        .logo-image {
          width: 50px;
          height: 50px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        .logo-text {
          font-size: 36px;
          font-weight: bold;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          text-align: center;
          letter-spacing: 2px;
        }
        .subtitle {
          font-size: 16px;
          opacity: 0.9;
          margin: 0;
        }
        .content {
          padding: 40px 30px;
        }
        .title {
          color: #2d3748;
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 30px;
          text-align: center;
        }
        .info-section {
          background-color: #f7fafc;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 25px;
          border-left: 4px solid #667eea;
        }
        .info-item {
          margin-bottom: 15px;
        }
        .info-label {
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 5px;
        }
        .info-value {
          color: #2d3748;
          font-size: 16px;
        }
        .message-section {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          margin-top: 20px;
        }
        .message-label {
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 10px;
          font-size: 16px;
        }
        .message-content {
          color: #2d3748;
          font-size: 16px;
          line-height: 1.7;
          white-space: pre-wrap;
        }
        .footer {
          background-color: #2d3748;
          color: white;
          text-align: center;
          padding: 20px;
          font-size: 14px;
        }
        .footer a {
          color: #667eea;
          text-decoration: none;
        }
        .footer a:hover {
          text-decoration: underline;
        }
        .timestamp {
          color: #718096;
          font-size: 12px;
          text-align: center;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        }
        @media (max-width: 600px) {
          .container {
            margin: 10px;
            border-radius: 8px;
          }
          .content {
            padding: 20px 15px;
          }
          .header {
            padding: 20px 15px;
          }
          .logo-container {
            flex-direction: column;
            gap: 10px;
          }
          .logo-image {
            width: 40px;
            height: 40px;
          }
          .logo-text {
            font-size: 30px;
            letter-spacing: 1px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo-container">
            <img src="https://tuweb-ai.com/logo.png" alt="TuWebAI Logo" class="logo-image" onerror="this.style.display='none'">
            <div class="logo-text">TuWebAI</div>
          </div>
          <p class="subtitle">Agencia Digital de Desarrollo Web</p>
        </div>
        
        <div class="content">
          <h1 class="title">${isTest ? 'Test de Nodemailer' : emailTitle}</h1>
          
          <div class="info-section">
            <div class="info-item">
              <div class="info-label">👤 Nombre:</div>
              <div class="info-value">${name}</div>
            </div>
            <div class="info-item">
              <div class="info-label">📧 Email:</div>
              <div class="info-value">${email}</div>
            </div>
            ${isTest ? `
            <div class="info-item">
              <div class="info-label">🖥️ Servidor:</div>
              <div class="info-value">tuwebai-backend.onrender.com</div>
            </div>
            ` : ''}
          </div>
          
          <div class="message-section">
            <div class="message-label">💬 Mensaje:</div>
            <div class="message-content">${message}</div>
          </div>
          
          <div class="timestamp">
            📅 Enviado el: ${new Date().toLocaleString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'America/Argentina/Buenos_Aires'
            })}
          </div>
        </div>
        
        <div class="footer">
          <p>© 2024 TuWebAI. Todos los derechos reservados.</p>
          <p>Visita nuestro sitio: <a href="https://tuweb-ai.com">tuweb-ai.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}
