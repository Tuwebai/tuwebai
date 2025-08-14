# Tuweb.ai Deployment Helper

## Issue with ZIP File Upload

It seems there was an issue with the ZIP file upload. The system was unable to process the "Tuwebai.zip" file you tried to upload.

## How to Deploy Your Web Application

Follow these steps to properly deploy your Tuweb.ai application:

1. **Upload the ZIP file**: Try uploading your ZIP file again to this Replit project.

2. **Use the helper script**: After successfully uploading the ZIP file, run the included helper script:
   ```
   npm install extract-zip
   node unzip_helper.js
   ```

3. **Install dependencies**: Once the files are extracted, install the dependencies:
   ```
   npm install
   ```

4. **Configure Replit**: Make sure the .replit file is properly configured to run your application.

5. **Run the application**: Start your application according to the instructions in package.json.

## 🔐 Configuración de Google OAuth

Para habilitar el login con Google, sigue estos pasos:

### 1. Crear proyecto en Google Cloud Console
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+ 

### 2. Configurar credenciales OAuth
1. Ve a "APIs & Services" > "Credentials"
2. Haz clic en "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configura las URLs autorizadas:
   - **Authorized JavaScript origins**: `http://localhost:5173` (desarrollo)
   - **Authorized redirect URIs**: `http://localhost:5000/api/auth/google/callback`
4. Copia el Client ID y Client Secret

### 3. Configurar variables de entorno
Agrega estas variables a tu archivo `.env`:

```env
GOOGLE_CLIENT_ID=tu_client_id_aqui
GOOGLE_CLIENT_SECRET=tu_client_secret_aqui
```

### 4. Para producción
En producción, actualiza las URLs autorizadas:
- **Authorized JavaScript origins**: `https://tu-dominio.com`
- **Authorized redirect URIs**: `https://tu-dominio.com/api/auth/google/callback`

## Troubleshooting

If you continue having issues with the ZIP file upload, try these alternatives:

1. **Manual upload**: Upload each file individually if the ZIP file is too large or causing issues.

2. **GitHub**: Upload your project to GitHub and use the "Import from GitHub" feature in Replit.

3. **Split the ZIP**: If the ZIP file is very large, consider splitting it into smaller parts.

## 🔥 Sistema de Sincronización de Pagos con Firebase

El proyecto incluye un sistema completo de sincronización de pagos entre la página principal (tuweb-ai.com) y el dashboard (dashboard.tuweb-ai.com), usando Mercado Pago como procesador de pagos y Firebase/Firestore como base de datos.

### Características Principales
- ✅ Endpoint para sincronizar pagos con Firebase
- ✅ Webhook de Mercado Pago (Node.js + PHP)
- ✅ Sistema de autenticación con API key
- ✅ Logs de auditoría
- ✅ Integración completa con Firestore
- ✅ Botón de panel de control en navbar
- ✅ Configuración de CORS
- ✅ Rate limiting básico

### Instalación Rápida
```bash
# Instalar sistema de pagos
bash install_firebase_payment_system.sh

# Inicializar colecciones de Firestore
php firebase/init_collections.php

# Verificar salud del sistema
php firebase/health_check.php
```

### Documentación Completa
- [Guía de instalación](FIREBASE_PAYMENT_SYNC_SETUP.md)
- [Documentación de Firebase](firebase/README.md)

## 🔔 Webhook de Mercado Pago

### Endpoint Principal
**URL**: `https://tuweb-ai.com/webhook/mercadopago`

**Método**: `POST`

**Descripción**: Endpoint para recibir notificaciones de pagos de Mercado Pago.

### Características del Webhook
- ✅ **Respuesta inmediata**: Siempre responde 200 (ack) sin bloquear
- ✅ **Logging completo**: Headers clave y body persistidos en logs
- ✅ **Validación de firma**: HMAC-SHA256 con `MP_WEBHOOK_SECRET`
- ✅ **Idempotencia**: No reprocesa el mismo `payment_id`
- ✅ **Consulta a API**: Obtiene detalles del pago desde Mercado Pago
- ✅ **Actualización de DB**: Actualiza pedidos en base de datos

### Health Check
**URL**: `https://tuweb-ai.com/webhook/mercadopago/health`

**Método**: `GET`

**Respuesta**: `{ "ok": true }`

### Configuración de Variables de Entorno

Agrega estas variables a tu archivo `.env`:

```env
# Token de acceso de Mercado Pago (producción)
MP_ACCESS_TOKEN=APP_USR-7632702423261345-071520-e935a1cff45988d55056de36b0afdaa9-388958610

# Clave secreta para validar webhooks (configurar en panel de MP)
MP_WEBHOOK_SECRET=cd8ea5b1b0882291870e48ba6446016f554d52302a52186bb7cd6cfbde343688
```

### Configuración en Mercado Pago

1. **Accede al panel de Mercado Pago**
2. **Ve a Configuración > Webhooks**
3. **Configura la URL del webhook**:
   ```
   https://tuweb-ai.com/webhook/mercadopago
   ```
4. **Selecciona los eventos**:
   - `payment.created`
   - `payment.updated`
5. **Configura la clave secreta** (opcional pero recomendado)

### Testing del Webhook

#### 1. Test con curl
```bash
curl -X POST https://tuweb-ai.com/webhook/mercadopago \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment",
    "data": {
      "id": "test-payment-123"
    }
  }'
```

#### 2. Test de health check
```bash
curl https://tuweb-ai.com/webhook/mercadopago/health
```

#### 3. Tests automatizados
```bash
# Ejecutar tests del webhook
node test-webhook.js

# Test con URL específica
TEST_URL=https://tuweb-ai.com node test-webhook.js
```

#### 4. Simular notificación en Mercado Pago
1. Ve al panel de Mercado Pago
2. Busca un pago de prueba
3. Haz clic en "Simular notificación"
4. Verifica que el webhook reciba la notificación

### Logs y Monitoreo

Los logs se guardan en:
```
logs/mercadopago/YYYY-MM-DD.log
```

Cada entrada incluye:
- Timestamp
- Headers clave (x-signature, x-request-id, user-agent)
- Body completo del webhook
- IP del remitente
- Resultado del procesamiento

### Estructura de Respuesta del Webhook

```json
{
  "received": true
}
```

### Manejo de Errores

- **Firma inválida**: Log del error pero responde 200
- **API de MP no disponible**: Log del error y reintento
- **Datos inválidos**: Log del error y continúa
- **Errores de DB**: Log del error y notificación

### Seguridad

- ✅ Validación de firma HMAC-SHA256
- ✅ Headers de seguridad (Helmet)
- ✅ CORS configurado
- ✅ Rate limiting implícito
- ✅ Logs de auditoría

## Need Further Assistance?

If you're still having trouble deploying your Tuweb.ai application, please provide more details about the project structure or any specific error messages you're encountering.
