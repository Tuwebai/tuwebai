@echo off
echo 🚀 Configurando Tuweb.ai para despliegue...

echo.
echo 📋 INSTRUCCIONES PASO A PASO:
echo.
echo 1. Ve a https://github.com y crea una cuenta si no tienes una
echo.
echo 2. Crea un nuevo repositorio:
echo    - Ve a https://github.com/new
echo    - Nombre: tuwebai-platform
echo    - Descripción: Tuweb.ai - Plataforma de Presencia Online Profesional
echo    - Marca como público
echo    - NO inicialices con README
echo.
echo 3. Copia la URL del repositorio (ej: https://github.com/tu-usuario/tuwebai-platform.git)
echo.
echo 4. Ejecuta estos comandos en PowerShell:
echo    git remote add origin https://github.com/tu-usuario/tuwebai-platform.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 5. Ve a https://vercel.com y conecta tu cuenta de GitHub
echo.
echo 6. Importa el repositorio tuwebai-platform
echo.
echo 7. Configura las variables de entorno en Vercel:
echo    - SUPABASE_URL
echo    - SUPABASE_ANON_KEY
echo    - SUPABASE_SERVICE_ROLE_KEY
echo    - SESSION_SECRET
echo.
echo 8. ¡Tu app estará online en minutos!
echo.
pause 