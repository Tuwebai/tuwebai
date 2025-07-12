const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Crear un archivo zip con el contenido del proyecto
function createProjectZip() {
  // Crear el directorio attached_assets si no existe
  const assetsDir = path.resolve('attached_assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  // Configurar el archivo de salida
  const output = fs.createWriteStream(path.join(assetsDir, 'Tuwebai.zip'));
  const archive = archiver('zip', {
    zlib: { level: 9 } // Nivel de compresión máximo
  });

  // Manejar eventos
  output.on('close', function() {
    console.log(`Archivo zip creado: ${archive.pointer()} bytes totales`);
  });

  archive.on('error', function(err) {
    throw err;
  });

  // Adjuntar el archivo de salida
  archive.pipe(output);

  // Agregar directorios y archivos al zip
  const filesToExclude = [
    '.git', 
    'node_modules', 
    'dist', 
    'attached_assets', 
    'Tuwebai.zip',
    '.replit'
  ];

  // Leer directorio raíz
  fs.readdirSync('.').forEach(item => {
    const itemPath = path.resolve(item);
    const stats = fs.statSync(itemPath);
    
    // Excluir los archivos/directorios de la lista
    if (!filesToExclude.includes(item)) {
      if (stats.isDirectory()) {
        archive.directory(itemPath, item);
      } else {
        archive.file(itemPath, { name: item });
      }
    }
  });

  // Finalizar archivo
  archive.finalize();
}

// Ejecutar la función
createProjectZip();