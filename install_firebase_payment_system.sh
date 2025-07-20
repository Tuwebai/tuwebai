#!/bin/bash

# Script de instalación del Sistema de Sincronización de Pagos con Firebase - TuWeb.ai
# Ejecutar como: bash install_firebase_payment_system.sh

set -e

echo "🔥 Instalando Sistema de Sincronización de Pagos con Firebase - TuWeb.ai"
echo "=================================================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar si estamos en el directorio correcto
if [ ! -f "config.env.example" ]; then
    log_error "No se encontró config.env.example. Ejecuta este script desde el directorio raíz del proyecto."
    exit 1
fi

# Verificar dependencias
log_info "Verificando dependencias..."

# Verificar PHP
if ! command -v php &> /dev/null; then
    log_error "PHP no está instalado. Instala PHP 7.4 o superior."
    exit 1
fi

PHP_VERSION=$(php -r "echo PHP_VERSION;")
log_success "PHP $PHP_VERSION encontrado"

# Verificar cURL
if ! command -v curl &> /dev/null; then
    log_error "cURL no está instalado. Instala cURL para las pruebas."
    exit 1
fi

log_success "cURL encontrado"

echo ""

# Crear directorios necesarios
log_info "Creando directorios..."

mkdir -p api/logs
mkdir -p api/cache
mkdir -p firebase

log_success "Directorios creados"

# Configurar permisos
log_info "Configurando permisos..."

chmod 755 api/
chmod 644 api/.htaccess
chmod 644 api/config/*.php 2>/dev/null || true
chmod 644 api/utils/*.php 2>/dev/null || true
chmod 644 api/payments/*.php 2>/dev/null || true
chmod 644 api/webhooks/*.php 2>/dev/null || true
chmod 644 api/error/*.php 2>/dev/null || true
chmod 755 api/logs api/cache
chmod 644 api/logs/.htaccess api/cache/.htaccess

log_success "Permisos configurados"

# Verificar si existe .env
if [ ! -f ".env" ]; then
    log_info "Creando archivo .env desde config.env.example..."
    cp config.env.example .env
    log_warning "Archivo .env creado. Edita las variables de entorno antes de continuar."
    echo ""
    log_info "Variables importantes a configurar:"
    echo "  - API_KEY: Genera una clave segura"
    echo "  - MERCADOPAGO_ACCESS_TOKEN: Token de Mercado Pago"
    echo "  - VITE_FIREBASE_*: Configuración de Firebase (ya configurada)"
    echo "  - FIREBASE_SERVICE_ACCOUNT_KEY: Archivo de credenciales de servicio"
    echo ""
    read -p "¿Quieres continuar con la configuración de Firebase? (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Instalación pausada. Completa la configuración y ejecuta el script nuevamente."
        exit 0
    fi
else
    log_success "Archivo .env encontrado"
fi

# Configuración de Firebase
log_info "Configurando Firebase..."

# Verificar configuración de Firebase
if [ -f ".env" ]; then
    source <(grep -E '^VITE_FIREBASE_' .env | sed 's/^/export /')
fi

echo "Configuración de Firebase:"
echo "  Project ID: ${VITE_FIREBASE_PROJECT_ID:-'No configurado'}"
echo "  API Key: ${VITE_FIREBASE_API_KEY:-'No configurado'}"
echo "  Auth Domain: ${VITE_FIREBASE_AUTH_DOMAIN:-'No configurado'}"

if [ -z "$VITE_FIREBASE_PROJECT_ID" ]; then
    log_error "Configuración de Firebase incompleta. Verifica las variables VITE_FIREBASE_* en .env"
    exit 1
fi

# Verificar credenciales de servicio
log_info "Verificando credenciales de servicio..."

if [ ! -f "firebase-service-account.json" ]; then
    log_warning "No se encontró firebase-service-account.json"
    echo ""
    log_info "Para obtener las credenciales de servicio:"
    echo "  1. Ve a Firebase Console: https://console.firebase.google.com"
    echo "  2. Selecciona tu proyecto"
    echo "  3. Ve a Configuración del proyecto > Cuentas de servicio"
    echo "  4. Haz clic en 'Generar nueva clave privada'"
    echo "  5. Descarga el archivo JSON"
    echo "  6. Renómbralo a 'firebase-service-account.json' y colócalo en el directorio raíz"
    echo ""
    read -p "¿Quieres continuar sin credenciales de servicio? (limitado) (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Instalación pausada. Obtén las credenciales de servicio y ejecuta el script nuevamente."
        exit 0
    fi
else
    log_success "Credenciales de servicio encontradas"
fi

# Verificar configuración de PHP
log_info "Verificando configuración de PHP..."

# Verificar extensiones necesarias
REQUIRED_EXTENSIONS=("json" "curl" "openssl")

for ext in "${REQUIRED_EXTENSIONS[@]}"; do
    if php -m | grep -q "^$ext$"; then
        log_success "Extensión PHP $ext encontrada"
    else
        log_error "Extensión PHP $ext no encontrada. Instálala antes de continuar."
    fi
done

# Verificar configuración de PHP
PHP_UPLOAD_MAX_FILESIZE=$(php -r "echo ini_get('upload_max_filesize');")
PHP_POST_MAX_SIZE=$(php -r "echo ini_get('post_max_size');")
PHP_MAX_EXECUTION_TIME=$(php -r "echo ini_get('max_execution_time');")

echo "Configuración PHP actual:"
echo "  upload_max_filesize: $PHP_UPLOAD_MAX_FILESIZE"
echo "  post_max_size: $PHP_POST_MAX_SIZE"
echo "  max_execution_time: $PHP_MAX_EXECUTION_TIME"

# Inicializar colecciones de Firestore
log_info "Inicializando colecciones de Firestore..."

if [ -f "firebase/init_collections.php" ]; then
    php firebase/init_collections.php
    log_success "Colecciones de Firestore inicializadas"
else
    log_error "No se encontró el script de inicialización de colecciones"
    exit 1
fi

# Probar endpoints
log_info "Probando endpoints..."

# Verificar si el servidor web está configurado
if curl -s -o /dev/null -w "%{http_code}" "http://localhost/api/health" | grep -q "200\|404"; then
    log_success "Servidor web accesible"
else
    log_warning "No se pudo acceder al servidor web. Asegúrate de que esté configurado correctamente."
fi

# Crear script de prueba
log_info "Creando script de prueba..."

if [ -f "api/test/test_endpoints.php" ]; then
    log_success "Script de prueba encontrado"
else
    log_warning "Script de prueba no encontrado"
fi

# Configuración final
echo ""
log_info "Configuración final:"
echo ""

# Mostrar información importante
echo "📋 Información importante:"
echo "  - API endpoints: https://tuweb-ai.com/api/"
echo "  - Webhook URL: https://tuweb-ai.com/api/webhooks/mercadopago.php"
echo "  - Logs: api/logs/"
echo "  - Firebase Project: $VITE_FIREBASE_PROJECT_ID"
echo ""

# Configuración de Mercado Pago
echo "🔧 Configuración de Mercado Pago:"
echo "  1. Ve a tu Panel de Mercado Pago"
echo "  2. Configura el webhook: https://tuweb-ai.com/api/webhooks/mercadopago.php"
echo "  3. Eventos: payment.created, payment.updated, payment.cancelled"
echo ""

# Configuración del dashboard
echo "🎛️ Configuración del Dashboard:"
echo "  - URL: https://dashboard.tuweb-ai.com"
echo "  - Implementa la validación de token"
echo "  - Usa la API key para sincronizar pagos"
echo ""

# Configuración de Firebase
echo "🔥 Configuración de Firebase:"
echo "  1. Ve a Firebase Console: https://console.firebase.google.com"
echo "  2. Selecciona tu proyecto: $VITE_FIREBASE_PROJECT_ID"
echo "  3. Ve a Firestore Database"
echo "  4. Configura las reglas de seguridad"
echo "  5. Verifica que las colecciones 'payments' y 'payment_logs' existan"
echo ""

# Comandos útiles
echo "🛠️ Comandos útiles:"
echo "  - Probar endpoints: php api/test/test_endpoints.php"
echo "  - Ver logs: tail -f api/logs/payments_sync.log"
echo "  - Inicializar colecciones: php firebase/init_collections.php"
echo ""

# Verificar archivos críticos
log_info "Verificando archivos críticos..."

CRITICAL_FILES=(
    "api/payments/{email}.php"
    "api/webhooks/mercadopago.php"
    "api/config/firebase.php"
    "api/config/auth.php"
    "api/config/mercadopago.php"
    "api/utils/logger.php"
    "api/.htaccess"
    "firebase/init_collections.php"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        log_success "$file"
    else
        log_error "$file - NO ENCONTRADO"
    fi
done

echo ""
log_success "🎉 Instalación completada!"
echo ""
log_info "Próximos pasos:"
echo "  1. Configura las variables en .env"
echo "  2. Configura las reglas de seguridad en Firebase Console"
echo "  3. Configura el webhook en Mercado Pago"
echo "  4. Implementa la sincronización en tu dashboard"
echo "  5. Ejecuta las pruebas: php api/test/test_endpoints.php"
echo ""

log_info "Para soporte técnico: admin@tuweb-ai.com"
echo "" 