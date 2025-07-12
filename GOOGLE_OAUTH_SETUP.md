# 🔐 Configuración de Google OAuth - Tuweb.ai

## 🚀 Configuración Rápida

### 1. Crear proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+ (Google+ API)

### 2. Configurar credenciales OAuth

1. Ve a "APIs & Services" > "Credentials"
2. Haz clic en "Create Credentials" > "OAuth 2.0 Client IDs"
3. Selecciona "Web application"
4. Configura las URLs autorizadas:

**Para desarrollo:**
- **Authorized JavaScript origins**: `http://localhost:5173`
- **Authorized redirect URIs**: `http://localhost:3001/api/auth/google/callback`

**Para producción:**
- **Authorized JavaScript origins**: `https://tu-dominio.com`
- **Authorized redirect URIs**: `https://tu-dominio.com/api/auth/google/callback`

5. Copia el **Client ID** y **Client Secret**

### 3. Configurar variables de entorno

Crea o edita tu archivo `.env`:

```env
# Google OAuth
GOOGLE_CLIENT_ID=tu_client_id_aqui
GOOGLE_CLIENT_SECRET=tu_client_secret_aqui

# Configuración de la aplicación
NODE_ENV=development
PORT=3001
SESSION_SECRET=tu-super-secret-key-aqui

# Para producción
DOMAIN=tuwebai.com
```

### 4. Verificar configuración

```bash
npm run check-oauth
```

### 5. Reiniciar servidor

```bash
npm run dev
```

---

## 🔧 Diagnóstico de Problemas

### Error: `invalid_grant`

**Causas comunes:**
1. **Código expirado**: El usuario tardó mucho en aceptar el login
2. **Código ya usado**: Se intentó usar el mismo código dos veces
3. **Desincronización de tiempo**: El reloj del servidor está desfasado
4. **URLs incorrectas**: Las URLs en Google Cloud Console no coinciden

**Soluciones:**
1. Sincroniza el reloj de tu PC
2. Verifica que las URLs en Google Cloud Console sean exactas
3. No recargues la URL del callback manualmente
4. Usa el script de diagnóstico: `npm run fix-oauth`

### Error: `redirect_uri_mismatch`

**Causa:** La URL de callback no coincide con la configurada en Google Cloud Console

**Solución:**
1. Verifica que la URL de callback sea exactamente: `http://localhost:3001/api/auth/google/callback`
2. Asegúrate de que no haya espacios extra o caracteres especiales
3. Si cambiaste la URL, espera unos minutos para que Google actualice la configuración

### Error: `invalid_client`

**Causa:** Client ID o Client Secret incorrectos

**Solución:**
1. Verifica que las variables de entorno estén correctas
2. Asegúrate de que el archivo `.env` esté en la raíz del proyecto
3. Reinicia el servidor después de cambiar las variables

### Problemas de cookies/sesiones

**Síntomas:** El usuario se autentica pero no se mantiene la sesión

**Soluciones:**
1. Verifica que las cookies no estén bloqueadas
2. Usa `http://localhost` en lugar de `127.0.0.1`
3. Asegúrate de que el navegador permita cookies de terceros
4. Prueba en modo incógnito

---

## 🛠️ Scripts de Ayuda

### Verificar configuración
```bash
npm run check-oauth
```

### Diagnóstico completo
```bash
npm run fix-oauth
```

### Logs detallados
El servidor ahora incluye logs detallados para debugging:
- 🔍 Logs de autenticación
- 🍪 Estado de sesiones
- 🔐 Proceso de Google OAuth
- ❌ Errores específicos

---

## 📋 Checklist de Verificación

- [ ] Proyecto creado en Google Cloud Console
- [ ] API de Google+ habilitada
- [ ] Credenciales OAuth 2.0 creadas
- [ ] URLs autorizadas configuradas correctamente
- [ ] Variables de entorno configuradas en `.env`
- [ ] Servidor reiniciado después de configurar variables
- [ ] Reloj del PC sincronizado
- [ ] Cookies habilitadas en el navegador
- [ ] Prueba en modo incógnito

---

## 🚨 Solución de Emergencia

Si nada funciona:

1. **Limpia todo:**
   ```bash
   # Borra cookies del navegador
   # Borra caché del navegador
   # Reinicia el servidor
   npm run dev
   ```

2. **Verifica configuración:**
   ```bash
   npm run check-oauth
   npm run fix-oauth
   ```

3. **Prueba con usuario nuevo:**
   - Usa una cuenta de Google diferente
   - Prueba en modo incógnito
   - Usa un navegador diferente

4. **Revisa logs del servidor:**
   - Busca errores específicos en la consola
   - Verifica que las variables se lean correctamente
   - Comprueba que las rutas se registren

---

## 📞 Soporte

Si el problema persiste:

1. Ejecuta `npm run fix-oauth` y comparte la salida
2. Comparte los logs del servidor durante un intento de login
3. Verifica que todas las URLs en Google Cloud Console coincidan exactamente
4. Asegúrate de que el proyecto de Google tenga la API de Google+ habilitada

---

## 🔄 Actualizaciones

- **v1.0**: Configuración inicial
- **v1.1**: Mejoras en manejo de errores
- **v1.2**: Scripts de diagnóstico
- **v1.3**: Logs detallados y mejor debugging 