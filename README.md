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

## Need Further Assistance?

If you're still having trouble deploying your Tuweb.ai application, please provide more details about the project structure or any specific error messages you're encountering.
