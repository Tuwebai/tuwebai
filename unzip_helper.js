import extract from 'extract-zip';
import fs from 'fs';
import path from 'path';

async function main() {
  try {
    const source = path.resolve('Tuwebai.zip');
    const target = path.resolve('.');
    
    if (!fs.existsSync(source)) {
      console.error('Error: Archivo Tuwebai.zip no encontrado');
      process.exit(1);
    }
    
    await extract(source, { dir: target });
    console.log('Extracción completada con éxito');
  } catch (err) {
    console.error('Error durante la extracción:', err);
    process.exit(1);
  }
}

main();