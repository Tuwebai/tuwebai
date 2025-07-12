# 🚀 Guía de Despliegue - Tuweb.ai

## ⚡ Despliegue Rápido (30 minutos)

### 1. **Configurar Supabase (Base de Datos)**

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Ve a Settings > API y copia:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

### 2. **Configurar Variables de Entorno**

Crea un archivo `.env` en la raíz del proyecto:

```env
# Base de datos Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui

# Configuración de la aplicación
NODE_ENV=production
PORT=5000
SESSION_SECRET=tu-super-secret-key-aqui-cambialo

# Email (opcional por ahora)
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=tu-sendgrid-key-aqui
```

### 3. **Configurar Base de Datos**

```bash
# Ejecutar el script de configuración
node scripts/setup-supabase.js
```

### 4. **Desplegar en Vercel**

1. Ve a [vercel.com](https://vercel.com) y conecta tu repositorio de GitHub
2. En la configuración del proyecto, añade las variables de entorno del paso 2
3. Haz push a tu repositorio: `git push origin main`
4. Vercel desplegará automáticamente

### 5. **Configurar Dominio (Opcional)**

1. Compra un dominio en [Namecheap](https://namecheap.com) o [GoDaddy](https://godaddy.com)
2. En Vercel, ve a Settings > Domains
3. Añade tu dominio y sigue las instrucciones de DNS

---

## 🔧 Configuración Avanzada

### **Email Service (SendGrid)**

1. Crea cuenta en [sendgrid.com](https://sendgrid.com)
2. Genera una API Key
3. Añade la key a las variables de entorno

### **Monitoreo y Analytics**

1. **Sentry** para errores: [sentry.io](https://sentry.io)
2. **Google Analytics 4** para métricas
3. **UptimeRobot** para monitoreo de disponibilidad

### **SSL y Seguridad**

- Vercel incluye SSL automático
- Configura headers de seguridad en `vercel.json`

---

## 📊 Verificación Post-Despliegue

### **Checklist de Verificación:**

- [ ] Aplicación carga correctamente
- [ ] Formularios de contacto funcionan
- [ ] Panel de administración accesible
- [ ] Base de datos conectada
- [ ] Emails se envían (si configurado)
- [ ] SSL funcionando
- [ ] Dominio configurado (si aplica)

### **Credenciales de Administrador:**

- **Email:** admin@tuwebai.com
- **Password:** admin123
- **⚠️ IMPORTANTE:** Cambia la contraseña después del primer login

---

## 🎯 Próximos Pasos para Vender

### **1. Crear Contenido de Valor**
- Casos de éxito
- Testimonios de clientes
- Blog con tips de presencia online
- Recursos descargables

### **2. Configurar Marketing**
- Google Analytics 4
- Google Search Console
- Facebook Pixel
- LinkedIn Insight Tag

### **3. Automatizar Ventas**
- CRM (HubSpot, Pipedrive)
- Email marketing (Mailchimp, ConvertKit)
- Chat en vivo (Intercom, Crisp)

---

## 🆘 Solución de Problemas

### **Error: "Database connection failed"**
- Verifica las credenciales de Supabase
- Asegúrate de que el proyecto esté activo

### **Error: "Build failed"**
- Verifica que todas las dependencias estén instaladas
- Revisa los logs de build en Vercel

### **Error: "Environment variables missing"**
- Verifica que todas las variables estén configuradas en Vercel
- Asegúrate de que el archivo `.env` esté en el repositorio

---

## 📞 Soporte

Si tienes problemas con el despliegue:

1. Revisa los logs en Vercel
2. Verifica la configuración de Supabase
3. Consulta la documentación oficial
4. Contacta al equipo de soporte

---

**¡Tu plataforma estará lista para vender presencia online profesional en menos de 1 hora!** 🎉 