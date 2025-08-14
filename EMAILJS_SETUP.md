# Configuración EmailJS - TuWeb.ai

## ✅ Estado actual:
- ✅ Backend Express configurado con EmailJS
- ✅ Frontend actualizado para usar el backend
- ✅ Servicio SMTP de GoDaddy funcionando en EmailJS
- ✅ Plantilla de email creada

## 🔧 Lo que falta completar:

### 1. Obtener Template ID y Private Key de EmailJS:
1. **Template ID:** En EmailJS → Email Templates → Tu plantilla → Copiar el ID (ejemplo: `template_xxxxx`)
2. **Private Key:** En EmailJS → Account → API Keys → Copiar la Private Key

### 2. Actualizar el backend:
En `server/index.ts`, líneas 18-20, reemplazar:
```ts
const EMAILJS_SERVICE_ID = "service_9s9hqqn"; // ✅ Ya está
const EMAILJS_TEMPLATE_ID = "TU_TEMPLATE_ID"; // ← Reemplazar con tu template ID
const EMAILJS_PRIVATE_KEY = "TU_PRIVATE_KEY"; // ← Reemplazar con tu private key
```

### 3. Deployar el backend:
```bash
cd server
npm run build
npm start
```

## 🎯 Resultado:
- Formulario de contacto funcionando
- Emails enviados a tuwebai@gmail.com con diseño profesional
- Backend limpio y sin dependencias innecesarias
- Todo listo para producción

## 📧 HTML de la plantilla (ya configurado):
```html
<div style="background:linear-gradient(135deg,#7c3aed 0%,#0ea5e9 100%);padding:32px 0;min-height:100vh;font-family:Inter,sans-serif;">
  <table style="max-width:480px;margin:auto;background:#fff;border-radius:16px;box-shadow:0 4px 32px #0002;">
    <tr>
      <td style="padding:32px;">
        <img src="https://tuweb-ai.com/logo-tuwebai.png" alt="TuWeb.ai" style="width:120px;margin-bottom:24px;display:block;">
        <h2 style="color:#7c3aed;font-size:22px;margin:0 0 16px 0;">¡Nuevo mensaje de contacto!</h2>
        <p style="color:#334155;font-size:16px;margin:0 0 16px 0;">
          <b>Nombre:</b> {{name}}<br>
          <b>Email:</b> {{email}}<br>
          <b>Asunto:</b> {{title}}
        </p>
        <div style="background:#f1f5f9;border-radius:8px;padding:16px;color:#0f172a;font-size:16px;margin-bottom:24px;">
          {{message}}
        </div>
        <p style="color:#64748b;font-size:13px;margin:0;">Este mensaje fue enviado desde el formulario de contacto de <a href="https://tuweb-ai.com" style="color:#0ea5e9;text-decoration:none;">TuWeb.ai</a></p>
      </td>
    </tr>
  </table>
</div>
```

¡Listo para usar! 🚀 