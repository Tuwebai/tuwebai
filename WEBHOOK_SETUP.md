# 🔔 Webhook de Mercado Pago - Setup Completo

## 📋 Resumen

Este documento describe la implementación completa del webhook de Mercado Pago para TuWeb.ai, que permite recibir notificaciones automáticas de pagos y actualizar el estado de los pedidos en tiempo real.

## 🎯 Objetivo

Implementar un endpoint de Webhook de Mercado Pago en producción para dejar de recibir errores 404 y procesar correctamente las notificaciones de pagos.

## 🏗️ Arquitectura

### Stack Detectado
- **Backend**: Express/Node.js con TypeScript
- **Compilación**: ESBuild (TypeScript → JavaScript)
- **Procesador de pagos**: Mercado Pago
- **Base de datos**: Firebase/Firestore
- **Logs**: Sistema de archivos local

### Endpoints Implementados

#### 1. Webhook Principal
```
POST /webhook/mercadopago
```

**Características:**
- ✅ Responde inmediatamente con 200 (ack)
- ✅ No bloquea el request
- ✅ Logging completo de headers y body
- ✅ Validación de firma HMAC-SHA256
- ✅ Idempotencia por payment_id
- ✅ Consulta a API de Mercado Pago
- ✅ Actualización de pedidos en DB

#### 2. Health Check
```
GET /webhook/mercadopago/health
```

**Respuesta:**
```json
{
  "ok": true
}
```

## 🔧 Configuración

### Variables de Entorno

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

## 🧪 Testing

### Tests Automatizados

```bash
# Ejecutar tests del webhook
node test-webhook.js

# Test con URL específica
TEST_URL=https://tuweb-ai.com node test-webhook.js
```

### Tests Manuales

#### 1. Health Check
```bash
curl https://tuweb-ai.com/webhook/mercadopago/health
```

#### 2. Webhook POST
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

#### 3. Test Local
```bash
# Iniciar servidor local
npm run dev

# En otra terminal, probar webhook
node test-webhook-local.js
```

### Simulación en Mercado Pago

1. Ve al panel de Mercado Pago
2. Busca un pago de prueba
3. Haz clic en "Simular notificación"
4. Verifica que el webhook reciba la notificación

## 📊 Logs y Monitoreo

### Ubicación de Logs
```
logs/mercadopago/YYYY-MM-DD.log
```

### Estructura de Logs
Cada entrada incluye:
- Timestamp ISO
- Headers clave (x-signature, x-request-id, user-agent)
- Body completo del webhook
- IP del remitente
- Resultado del procesamiento
- Tiempo de procesamiento

### Ejemplo de Log
```json
[2024-01-15T10:30:45.123Z] {
  "timestamp": "2024-01-15T10:30:45.123Z",
  "headers": {
    "x-signature": "abc123...",
    "x-request-id": "req-456...",
    "user-agent": "MercadoPago-Webhook/1.0"
  },
  "body": {
    "type": "payment",
    "data": {
      "id": "123456789"
    }
  },
  "ip": "192.168.1.1",
  "success": true,
  "payment_id": "123456789",
  "status": "approved",
  "processing_time": 150
}
```

## 🔒 Seguridad

### Validación de Firma
- **Algoritmo**: HMAC-SHA256
- **Header**: `X-Signature`
- **Secret**: `MP_WEBHOOK_SECRET`
- **Comportamiento**: Si falla, log del error pero responde 200

### Headers de Seguridad
- **X-Frame-Options**: SAMEORIGIN
- **X-Content-Type-Options**: nosniff
- **Referrer-Policy**: strict-origin-when-cross-origin
- **CORS**: Configurado para dominios específicos

### Rate Limiting
- **Implícito**: Por idempotencia
- **Protección**: No reprocesa mismo payment_id

## 🚀 Despliegue

### 1. Compilar Backend
```bash
npm run build:backend
```

### 2. Verificar Variables de Entorno
```bash
# Verificar que las variables estén configuradas
echo $MP_ACCESS_TOKEN
echo $MP_WEBHOOK_SECRET
```

### 3. Iniciar Servidor
```bash
npm start
```

### 4. Verificar Endpoints
```bash
# Health check
curl https://tuweb-ai.com/webhook/mercadopago/health

# Webhook (debería responder 200)
curl -X POST https://tuweb-ai.com/webhook/mercadopago \
  -H "Content-Type: application/json" \
  -d '{"type":"payment","data":{"id":"test"}}'
```

## 🔍 Troubleshooting

### Problemas Comunes

#### 1. Error 404
- **Causa**: Endpoint no configurado
- **Solución**: Verificar que el servidor esté corriendo y la ruta esté correcta

#### 2. Error de CORS
- **Causa**: Dominio no permitido
- **Solución**: Verificar configuración de CORS en `allowedOrigins`

#### 3. Error de Firma
- **Causa**: `MP_WEBHOOK_SECRET` no configurado o inválido
- **Solución**: Verificar variable de entorno y configuración en MP

#### 4. Error de API de MP
- **Causa**: `MP_ACCESS_TOKEN` inválido o expirado
- **Solución**: Regenerar token en panel de Mercado Pago

### Logs de Debug

Para habilitar logs detallados, agregar:
```env
DEBUG=true
```

### Monitoreo en Tiempo Real

```bash
# Ver logs en tiempo real
tail -f logs/mercadopago/$(date +%Y-%m-%d).log

# Ver logs del servidor
npm start 2>&1 | grep webhook
```

## 📈 Métricas

### KPIs del Webhook
- **Tiempo de respuesta**: < 200ms
- **Tasa de éxito**: > 99%
- **Logs completos**: 100%
- **Idempotencia**: 100%

### Monitoreo Recomendado
- **Uptime**: Verificar health check cada 5 minutos
- **Logs**: Revisar logs diariamente
- **Errores**: Alertas en caso de errores de firma o API
- **Performance**: Monitorear tiempo de procesamiento

## 🔄 Mantenimiento

### Tareas Periódicas
- **Diario**: Revisar logs de errores
- **Semanal**: Verificar configuración de MP
- **Mensual**: Revisar tokens de acceso
- **Trimestral**: Actualizar documentación

### Backup de Configuración
- Variables de entorno
- Configuración de webhooks en MP
- Logs históricos
- Scripts de testing

## 📞 Soporte

Para soporte técnico:
- **Email**: tuwebai@gmail.com
- **Documentación**: Este archivo
- **Logs**: `logs/mercadopago/`
- **Tests**: `test-webhook.js`

---

**Última actualización**: Enero 2024
**Versión**: 1.0.0
**Estado**: ✅ Implementado y funcionando
