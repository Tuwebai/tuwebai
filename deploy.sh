#!/bin/bash

echo "🚀 Iniciando despliegue de Tuweb.ai..."

# Verificar que estén las variables de entorno
if [ ! -f .env ]; then
    echo "❌ Error: Archivo .env no encontrado"
    echo "📝 Crea el archivo .env con las variables de config.env.example"
    exit 1
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Construir la aplicación
echo "🔨 Construyendo aplicación..."
npm run build

# Configurar base de datos si es necesario
echo "🗄️  Configurando base de datos..."
node scripts/setup-supabase.js

echo "✅ Aplicación lista para despliegue!"
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo "1. Ve a https://vercel.com y conecta tu repositorio"
echo "2. Configura las variables de entorno en Vercel:"
echo "   - SUPABASE_URL"
echo "   - SUPABASE_ANON_KEY" 
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo "   - SESSION_SECRET"
echo "3. Haz push a tu repositorio: git push origin main"
echo "4. Vercel desplegará automáticamente"
echo ""
echo "🌐 Tu aplicación estará disponible en: https://tu-proyecto.vercel.app" 