# Firebase Functions - Contacto TuWeb.ai

1. Cambiá TU_ID_PROYECTO_FIREBASE en .firebaserc por el ID real de tu proyecto.
2. Instalá dependencias:
   npm install -g firebase-tools
   cd firebase-functions-contacto/functions
   npm install
3. Logueate y seleccioná el proyecto:
   firebase login
   firebase use --add
4. Build y deploy:
   npm run build
   npm run deploy
5. Cambiá la URL del fetch en tu frontend:
   https://us-central1-TU_ID_PROYECTO_FIREBASE.cloudfunctions.net/contacto

Listo. Los mensajes se guardan en Firestore. 