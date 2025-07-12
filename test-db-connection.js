import { Pool } from '@neondatabase/serverless';
import * as WebSocket from 'ws';

// Importante: Configurar el WebSocket para Neon Serverless
if (!globalThis.WebSocket) {
  console.log("Configurando WebSocket para Neon Serverless");
  globalThis.WebSocket = WebSocket.WebSocket;
}

const connectionString = process.env.DATABASE_URL;

console.log("Probando conexión a la base de datos...");

if (!connectionString) {
  console.error("ERROR: No se ha definido DATABASE_URL");
  process.exit(1);
}

const pool = new Pool({ connectionString });

async function testConnection() {
  try {
    const client = await pool.connect();
    
    try {
      const result = await client.query('SELECT NOW() as time');
      console.log("Conexión exitosa, hora del servidor:", result.rows[0].time);
      
      // Probar consulta a la tabla de recursos
      const resources = await client.query('SELECT * FROM resources');
      console.log(`Recursos encontrados: ${resources.rowCount}`);
      
      // Mostrar los recursos
      resources.rows.forEach((resource, index) => {
        console.log(`${index + 1}. ${resource.title} (${resource.type})`);
      });
      
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
  } finally {
    await pool.end();
  }
}

testConnection();