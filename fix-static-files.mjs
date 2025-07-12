// Script para copiar los archivos estáticos a la ubicación correcta
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function copyFiles() {
  console.log('Preparando archivos estáticos para producción...');
  
  // Asegurarse de que el directorio dist existe
  if (!fs.existsSync('dist')) {
    console.error('ERROR: El directorio dist no existe. Ejecuta npm run build primero.');
    process.exit(1);
  }
  
  try {
    // Verificamos si existe dist/public/index.html
    const distPublicIndexPath = path.join('dist', 'public', 'index.html');
    if (fs.existsSync(distPublicIndexPath)) {
      console.log('Copiando archivos de dist/public a dist...');
      
      // Copiamos index.html a la raíz de dist
      fs.copyFileSync(distPublicIndexPath, path.join('dist', 'index.html'));
      
      // Listamos los archivos en dist/public para copiarlos a dist
      const files = fs.readdirSync(path.join('dist', 'public'));
      for (const file of files) {
        const sourcePath = path.join('dist', 'public', file);
        const destPath = path.join('dist', file);
        
        if (fs.statSync(sourcePath).isDirectory()) {
          console.log(`Copiando directorio ${file} a la raíz de dist...`);
          // Para directorios usamos exec para cp -r
          exec(`cp -r ${sourcePath} ${path.dirname(destPath)}`, (error) => {
            if (error) console.error(`Error copiando ${file}: ${error}`);
          });
        } else {
          console.log(`Copiando archivo ${file} a la raíz de dist...`);
          fs.copyFileSync(sourcePath, destPath);
        }
      }
    } else {
      console.log('dist/public/index.html no existe, verificando estructura de archivos alternativa.');
    }
    
    console.log('Proceso de preparación de archivos completado.');
  } catch (error) {
    console.error(`Error en la operación de archivos: ${error}`);
  }
}

copyFiles();