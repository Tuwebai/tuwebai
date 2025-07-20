# Firebase - Sistema de Pagos TuWeb.ai

Esta carpeta contiene todos los archivos relacionados con la configuración y gestión de Firebase/Firestore para el sistema de sincronización de pagos.

## 📁 Archivos Incluidos

### 🔧 Configuración
- **`init_collections.php`** - Script para inicializar las colecciones de Firestore
- **`firestore.rules`** - Reglas de seguridad para Firestore
- **`migrate_from_mysql.php`** - Script para migrar datos de MySQL a Firebase
- **`cleanup_example_data.php`** - Script para limpiar datos de ejemplo

## 🚀 Uso

### 1. Inicialización Inicial
```bash
# Inicializar colecciones de Firestore
php firebase/init_collections.php
```

### 2. Configurar Reglas de Seguridad
1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto
3. Ve a **Firestore Database** > **Reglas**
4. Copia y pega el contenido de `firestore.rules`
5. Haz clic en **Publicar**

### 3. Migración de Datos (Opcional)
Si tienes datos existentes en MySQL:
```bash
# Migrar datos de MySQL a Firebase
php firebase/migrate_from_mysql.php
```

### 4. Limpieza de Datos de Ejemplo
Después de completar la configuración:
```bash
# Limpiar datos de ejemplo
php firebase/cleanup_example_data.php
```

## 📊 Estructura de Datos

### Colección: `payments`
```javascript
{
  "user_email": "usuario@email.com",
  "user_name": "Nombre Usuario",
  "payment_type": "website",
  "amount": 99900,
  "currency": "ARS",
  "status": "approved",
  "mercadopago_id": "mp_123456789",
  "mercadopago_status": "approved",
  "payment_method": "credit_card",
  "description": "Desarrollo de Sitio Web",
  "features": ["Diseño responsive", "SEO optimizado"],
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:35:00Z",
  "paid_at": "2024-01-15T10:35:00Z",
  "invoice_url": "https://www.mercadopago.com.ar/..."
}
```

### Colección: `payment_logs`
```javascript
{
  "payment_id": "payment_123",
  "action": "payment_created",
  "new_status": "approved",
  "details": {
    "amount": 99900,
    "currency": "ARS",
    "payment_type": "website"
  },
  "ip_address": "127.0.0.1",
  "user_agent": "Mozilla/5.0...",
  "created_at": "2024-01-15T10:30:00Z"
}
```

## 🔒 Seguridad

### Reglas de Firestore
Las reglas están configuradas para:
- Permitir lectura/escritura solo a usuarios autenticados
- Validar API keys en headers de autorización
- Proteger datos sensibles
- Limitar acceso a administradores para configuraciones

### API Key Validation
```javascript
function validateApiKey(authHeader) {
  return authHeader != null && 
    authHeader.matches('Bearer .*') &&
    authHeader.split('Bearer ')[1] == resource.data.api_key;
}
```

## 📈 Monitoreo

### Métricas Importantes
- **Lecturas de documentos** - Monitorear uso de cuota
- **Escrituras de documentos** - Verificar integridad de datos
- **Errores de reglas** - Detectar intentos de acceso no autorizado

### Alertas Recomendadas
- Uso de cuota > 80%
- Errores de reglas > 10 por hora
- Documentos no encontrados > 50 por hora

## 🛠️ Mantenimiento

### Backup Automático
```bash
# Exportar datos (requiere gcloud CLI)
gcloud firestore export gs://tu-bucket/backup-$(date +%Y%m%d)
```

### Limpieza de Logs Antiguos
```bash
# Eliminar logs de más de 90 días
find api/logs/ -name "*.log" -mtime +90 -delete
```

### Optimización de Consultas
- Usar índices compuestos para consultas frecuentes
- Limitar resultados con `limit()`
- Usar `where()` para filtrar datos

## 🚨 Troubleshooting

### Error: "Permission denied"
1. Verifica las reglas de seguridad
2. Asegúrate de que el usuario esté autenticado
3. Verifica la API key en el header

### Error: "Document not found"
1. Verifica que la colección exista
2. Asegúrate de que el ID del documento sea correcto
3. Verifica los permisos de lectura

### Error: "Quota exceeded"
1. Revisa el uso de cuota en Firebase Console
2. Optimiza las consultas
3. Considera actualizar el plan

## 📞 Soporte

Para problemas específicos de Firebase:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- Email: admin@tuweb-ai.com

## 📝 Notas

- Las colecciones se crean automáticamente al insertar el primer documento
- Los índices se crean automáticamente en Firestore
- Las reglas de seguridad se aplican inmediatamente al publicarlas
- Los datos se replican automáticamente en múltiples regiones 