// Script para copiar los archivos estáticos a la ubicación correcta
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

function copyFiles() {
  console.log('Preparando archivos estáticos para producción...');
  
  // Asegurarse de que el directorio dist existe
  if (!fs.existsSync('dist')) {
    console.error('ERROR: El directorio dist no existe. Ejecuta npm run build primero.');
    process.exit(1);
  }
  
  // Crear el directorio public dentro de dist si no existe
  if (!fs.existsSync(path.join('dist', 'public'))) {
    console.log('Creando directorio dist/public...');
    fs.mkdirSync(path.join('dist', 'public'), { recursive: true });
  }
  
  try {
    // Copiar index.html a la raíz de dist si está en dist/public
    if (fs.existsSync(path.join('dist', 'public', 'index.html')) && 
        !fs.existsSync(path.join('dist', 'index.html'))) {
      console.log('Copiando index.html a la raíz de dist...');
      fs.copyFileSync(path.join('dist', 'public', 'index.html'), path.join('dist', 'index.html'));
    }
    
    // Verificar si assets está en dist/public y copiarlo a dist si es necesario
    if (fs.existsSync(path.join('dist', 'public', 'assets'))) {
      console.log('Copiando assets de dist/public a dist...');
      exec(`cp -r dist/public/assets dist/`, (error) => {
        if (error) {
          console.error(`Error copiando assets: ${error}`);
          return;
        }
        console.log('Archivos estáticos preparados exitosamente.');
      });
    }
    
    console.log('Proceso de preparación de archivos completado.');
  } catch (error) {
    console.error(`Error en la operación de archivos: ${error}`);
  }
}

copyFiles();