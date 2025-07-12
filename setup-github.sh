#!/bin/bash

echo "🚀 Configurando repositorio GitHub para Tuweb.ai..."

# Verificar que git esté configurado
if ! git config user.name > /dev/null 2>&1; then
    echo "❌ Error: Git no está configurado"
    echo "Ejecuta: git config user.name 'Tu Nombre'"
    echo "Ejecuta: git config user.email 'tu@email.com'"
    exit 1
fi

# Verificar que gh CLI esté instalado
if ! command -v gh &> /dev/null; then
    echo "📦 Instalando GitHub CLI..."
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        # Windows
        winget install GitHub.cli
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install gh
    else
        # Linux
        curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
        sudo apt update
        sudo apt install gh
    fi
fi

# Autenticar con GitHub
echo "🔐 Autenticando con GitHub..."
gh auth login --web

# Crear repositorio
echo "📁 Creando repositorio en GitHub..."
REPO_NAME="tuwebai-platform"
gh repo create $REPO_NAME --public --description "Tuweb.ai - Plataforma de Presencia Online Profesional" --source=. --remote=origin --push

echo "✅ Repositorio creado y código subido!"
echo "🌐 URL del repositorio: https://github.com/$(gh api user --jq .login)/$REPO_NAME"

echo ""
echo "📋 PRÓXIMOS PASOS PARA DESPLIEGUE:"
echo "1. Ve a https://vercel.com"
echo "2. Conecta tu cuenta de GitHub"
echo "3. Importa el repositorio: $REPO_NAME"
echo "4. Configura las variables de entorno en Vercel"
echo "5. ¡Tu app estará online en minutos!" 