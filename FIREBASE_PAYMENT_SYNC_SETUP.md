# Sistema de Sincronización de Pagos con Firebase - TuWeb.ai

Este sistema permite sincronizar pagos entre tu página principal (tuweb-ai.com) y tu dashboard (dashboard.tuweb-ai.com) usando Mercado Pago como procesador de pagos y Firebase/Firestore como base de datos.

## 📋 Requisitos Previos

- PHP 7.4 o superior
- Servidor web con soporte para .htaccess (Apache/Nginx)
- Cuenta de Firebase con Firestore habilitado
- Cuenta de Mercado Pago con API configurada
- SSL/HTTPS configurado en ambos dominios

## 🚀 Instalación

### 1. Configuración de Firebase

#### 1.1 Obtener credenciales de servicio

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto
3. Ve a **Configuración del proyecto** > **Cuentas de servicio**
4. Haz clic en **"Generar nueva clave privada"**
5. Descarga el archivo JSON
6. Renómbralo a `firebase-service-account.json` y colócalo en el directorio raíz

#### 1.2 Configurar reglas de Firestore

En Firebase Console, ve a **Firestore Database** > **Reglas** y configura:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Colección de pagos
    match /payments/{document} {
      allow read, write: if request.auth != null || 
        request.headers.get('Authorization') == 'Bearer ' + resource.data.api_key;
    }
    
    // Colección de logs
    match /payment_logs/{document} {
      allow read, write: if request.auth != null || 
        request.headers.get('Authorization') == 'Bearer ' + resource.data.api_key;
    }
  }
}
```

### 2. Configuración de Variables de Entorno

Copia el archivo de configuración y ajusta las variables:

```bash
cp config.env.example .env
```

Edita el archivo `.env` con tus valores:

```env
# Configuración de sincronización de pagos
API_KEY=tu-super-secret-api-key-aqui
MERCADOPAGO_ACCESS_TOKEN=tu-mercadopago-access-token
MERCADOPAGO_PUBLIC_KEY=tu-mercadopago-public-key
MERCADOPAGO_WEBHOOK_SECRET=tu-mercadopago-webhook-secret
MERCADOPAGO_ENVIRONMENT=production
DASHBOARD_URL=https://dashboard.tuweb-ai.com

# Configuración de Firebase (ya configurado en el proyecto)
VITE_FIREBASE_API_KEY=tu-api-key
VITE_FIREBASE_AUTH_DOMAIN=tu-auth-domain
VITE_FIREBASE_PROJECT_ID=tu-project-id
VITE_FIREBASE_STORAGE_BUCKET=tu-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu-messaging-sender-id
VITE_FIREBASE_APP_ID=tu-app-id
VITE_FIREBASE_MEASUREMENT_ID=tu-measurement-id

# Configuración adicional de Firebase para el sistema de pagos
FIREBASE_SERVICE_ACCOUNT_KEY=firebase-service-account.json

# Configuración de debug
DEBUG=false
```

### 3. Instalación Automatizada

Ejecuta el script de instalación:

```bash
bash install_firebase_payment_system.sh
```

O ejecuta manualmente:

```bash
# Crear directorios
mkdir -p api/logs api/cache firebase

# Configurar permisos
chmod 755 api/
chmod 644 api/.htaccess
chmod 755 api/logs api/cache

# Inicializar colecciones de Firestore
php firebase/init_collections.php
```

### 4. Configuración de Mercado Pago

1. Ve a tu [Panel de Mercado Pago](https://www.mercadopago.com.ar/developers/panel)
2. Obtén tu Access Token y Public Key
3. Configura el webhook en Mercado Pago:
   - URL: `https://tuweb-ai.com/api/webhooks/mercadopago.php`
   - Eventos: `payment.created`, `payment.updated`, `payment.cancelled`

### 5. Configuración del Servidor Web

#### Apache (.htaccess ya incluido)
El archivo `.htaccess` ya está configurado en la carpeta `api/`. Asegúrate de que:
- El módulo `mod_rewrite` esté habilitado
- El módulo `mod_headers` esté habilitado

#### Nginx
Si usas Nginx, agrega esta configuración:

```nginx
location /api/ {
    try_files $uri $uri/ /api/index.php?$query_string;
    
    # CORS headers
    add_header 'Access-Control-Allow-Origin' 'https://dashboard.tuweb-ai.com' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Requested-With' always;
    add_header 'Access-Control-Allow-Credentials' 'true' always;
    
    # Security headers
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options DENY always;
    add_header X-XSS-Protection "1; mode=block" always;
}

# Prevenir acceso a archivos de configuración
location ~ ^/api/(config|utils|logs|cache)/ {
    deny all;
}
```

## 🔧 Configuración del Dashboard

En tu dashboard (dashboard.tuweb-ai.com), necesitas implementar:

### 1. Autenticación con Token

```javascript
// Función para validar token del usuario
function validateUserToken(token) {
  try {
    const decoded = atob(token);
    const userData = JSON.parse(decoded);
    
    // Validar que el token no sea muy antiguo (24 horas)
    const tokenAge = Date.now() - userData.timestamp;
    if (tokenAge > 24 * 60 * 60 * 1000) {
      return null;
    }
    
    return userData;
  } catch (error) {
    return null;
  }
}

// Obtener token de la URL
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
const userData = validateUserToken(token);

if (!userData) {
  // Redirigir a login o mostrar error
  window.location.href = '/login';
}
```

### 2. Sincronización de Pagos

```javascript
// Función para obtener pagos del usuario
async function fetchUserPayments(email) {
  try {
    const response = await fetch(`https://tuweb-ai.com/api/payments/${email}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener pagos');
    }
    
    const data = await response.json();
    return data.payments;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// Usar la función
const payments = await fetchUserPayments(userData.email);
```

## 📡 Endpoints Disponibles

### 1. Obtener Pagos por Email
```
GET /api/payments/{email}
Headers:
  Authorization: Bearer {API_KEY}
```

**Respuesta:**
```json
{
  "success": true,
  "payments": [
    {
      "id": "payment_123",
      "user_email": "usuario@email.com",
      "user_name": "Nombre Usuario",
      "payment_type": "website",
      "amount": 99900,
      "currency": "ARS",
      "status": "approved",
      "mercadopago_id": "mp_123456789",
      "payment_method": "credit_card",
      "description": "Desarrollo de Sitio Web",
      "features": ["Diseño responsive", "SEO optimizado"],
      "created_at": "2024-01-15T10:30:00Z",
      "paid_at": "2024-01-15T10:35:00Z"
    }
  ],
  "total": 1,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 2. Webhook de Mercado Pago
```
POST /api/webhooks/mercadopago.php
Content-Type: application/json
```

**Datos recibidos:**
```json
{
  "type": "payment",
  "data": {
    "id": "mp_123456789"
  }
}
```

## 🔒 Seguridad

### API Key
- Genera una API key segura y única
- Nunca la compartas o subas a repositorios públicos
- Rota la key periódicamente

### Validación de Webhooks
- Mercado Pago valida automáticamente los webhooks
- Los webhooks solo se procesan si vienen de IPs de Mercado Pago
- Se registran todos los intentos de acceso

### Rate Limiting
- Se aplica rate limiting básico por IP
- Máximo 100 requests por hora por IP
- Los logs se mantienen para auditoría

### Firebase Security Rules
- Configura reglas de seguridad en Firestore
- Limita acceso solo a usuarios autenticados
- Valida datos antes de escribir

## 📊 Monitoreo y Logs

### Archivos de Log
- `api/logs/payments_sync.log` - Logs del endpoint de pagos
- `api/logs/mercadopago_webhook.log` - Logs del webhook
- `api/logs/errors.log` - Errores generales
- `api/logs/auth.log` - Logs de autenticación

### Monitoreo de Firestore
```javascript
// Ver estadísticas de pagos
const paymentsRef = collection(db, 'payments');
const paymentsSnapshot = await getDocs(paymentsRef);
console.log('Total pagos:', paymentsSnapshot.size);

// Ver pagos por estado
const approvedPayments = await getDocs(
  query(paymentsRef, where('status', '==', 'approved'))
);
console.log('Pagos aprobados:', approvedPayments.size);
```

## 🛠️ Mantenimiento

### Limpiar Logs Antiguos
```bash
# Limpiar logs de más de 30 días
find api/logs/ -name "*.log" -mtime +30 -delete
```

### Backup de Firestore
```bash
# Exportar datos de Firestore (requiere gcloud CLI)
gcloud firestore export gs://tu-bucket/backup-$(date +%Y%m%d)
```

### Monitoreo de Costos
- Revisa el uso de Firestore en Firebase Console
- Configura alertas de costos
- Optimiza consultas para reducir lecturas

## 🚨 Troubleshooting

### Error de Conexión a Firebase
1. Verifica las credenciales en `firebase-service-account.json`
2. Asegúrate de que Firestore esté habilitado
3. Verifica las reglas de seguridad

### Webhook no Recibe Notificaciones
1. Verifica que la URL del webhook esté correcta en Mercado Pago
2. Asegúrate de que el servidor sea accesible desde internet
3. Revisa los logs de error

### CORS Errors
1. Verifica que el dominio del dashboard esté en la lista de orígenes permitidos
2. Asegúrate de que los headers CORS estén configurados correctamente

### API Key Inválida
1. Verifica que la API key esté configurada correctamente
2. Asegúrate de que el header Authorization esté presente
3. Revisa los logs de autenticación

### Problemas con Firestore
1. Verifica las reglas de seguridad
2. Asegúrate de que las colecciones existan
3. Revisa los límites de cuota

## 📞 Soporte

Para soporte técnico:
- Email: admin@tuweb-ai.com
- WhatsApp: +54 9 11 1234-5678
- Documentación: https://docs.tuweb-ai.com

## 📝 Changelog

### v1.0.0 (2024-01-15)
- ✅ Endpoint para sincronizar pagos con Firebase
- ✅ Webhook de Mercado Pago
- ✅ Sistema de autenticación con API key
- ✅ Logs de auditoría
- ✅ Integración completa con Firestore
- ✅ Botón de panel de control en navbar
- ✅ Configuración de CORS
- ✅ Rate limiting básico
- ✅ Script de inicialización de colecciones
- ✅ Documentación específica para Firebase 