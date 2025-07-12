// Este script inicializa y verifica datos básicos en la base de datos
import { Pool } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import * as WebSocket from 'ws';

// Configurar WebSocket para Neon Serverless
if (!globalThis.WebSocket) {
  console.log("Configurando WebSocket para Neon Serverless");
  globalThis.WebSocket = WebSocket.WebSocket;
}

// Función principal
async function initializeDatabase() {
  // Verificar disponibilidad de la base de datos
  if (!process.env.DATABASE_URL) {
    console.error('❌ La variable de entorno DATABASE_URL no está definida');
    process.exit(1);
  }

  // Crear conexión
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('🔄 Inicializando la base de datos...');
    
    // Verificar tablas existentes
    console.log('📋 Verificando las tablas existentes...');
    
    try {
      const { rows: tables } = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name;
      `);
      
      if (tables.length === 0) {
        console.error('❌ No se encontraron tablas en la base de datos');
        console.log('⚠️ Ejecute primero: npx drizzle-kit push:pg');
        return;
      }
      
      console.log('Tablas disponibles:');
      tables.forEach(table => {
        console.log(`- ${table.table_name}`);
      });
      
      // Verificar usuario administrador
      const { rows: adminUsers } = await pool.query(`
        SELECT * FROM users WHERE email = 'admin@tuweb.ai' LIMIT 1
      `);
      
      if (adminUsers.length === 0) {
        console.log('➕ Creando usuario administrador...');
        
        // Hashear contraseña
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        await pool.query(`
          INSERT INTO users (username, email, password, name, role, created_at, updated_at, is_active)
          VALUES ('admin', 'admin@tuweb.ai', $1, 'Administrador', 'admin', NOW(), NOW(), true)
        `, [hashedPassword]);
        
        console.log('✅ Usuario administrador creado con éxito');
      } else {
        console.log('ℹ️ El usuario administrador ya existe');
      }
      
      // Verificar recursos
      const { rows: resourceCount } = await pool.query(`
        SELECT COUNT(*) FROM resources
      `);
      
      if (parseInt(resourceCount[0].count) === 0) {
        console.log('➕ Creando recursos iniciales...');
        
        const resources = [
          {
            title: "Guía SEO 2025",
            type: "pdf",
            url: "/resources/guia-seo-2025.pdf",
            description: "Guía completa de SEO para el año 2025.",
            is_public: true,
            download_count: 45
          },
          {
            title: "Checklist de Conversión",
            type: "pdf",
            url: "/resources/checklist-conversion.pdf",
            description: "Checklist para mejorar las tasas de conversión.",
            is_public: true,
            download_count: 32
          },
          {
            title: "Estrategia de Contenidos",
            type: "pdf",
            url: "/resources/estrategia-contenidos.pdf",
            description: "Guía para desarrollar una estrategia de contenidos efectiva.",
            is_public: true,
            download_count: 28
          },
          {
            title: "Calculadora ROI",
            type: "xlsx",
            url: "/resources/calculadora-roi.xlsx",
            description: "Calcula el retorno de inversión de tus campañas de marketing.",
            is_public: true,
            download_count: 19
          }
        ];
        
        for (const resource of resources) {
          await pool.query(`
            INSERT INTO resources (title, type, url, description, is_public, download_count, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
          `, [resource.title, resource.type, resource.url, resource.description, resource.is_public, resource.download_count]);
        }
        
        console.log('✅ Recursos creados con éxito');
      } else {
        console.log('ℹ️ Los recursos ya existen');
      }
      
      // Verificar tecnologías
      const { rows: techCount } = await pool.query(`
        SELECT COUNT(*) FROM technologies
      `);
      
      if (parseInt(techCount[0].count) === 0) {
        console.log('➕ Creando tecnologías iniciales...');
        
        const technologies = [
          { name: "React", category: "frontend", icon: "react", description: "Librería JavaScript para crear interfaces de usuario" },
          { name: "Next.js", category: "frontend", icon: "nextjs", description: "Framework de React para aplicaciones web" },
          { name: "Tailwind CSS", category: "frontend", icon: "tailwind", description: "Framework CSS utility-first" },
          { name: "Node.js", category: "backend", icon: "nodejs", description: "Entorno de ejecución para JavaScript" },
          { name: "PostgreSQL", category: "database", icon: "postgresql", description: "Sistema de base de datos relacional" }
        ];
        
        for (const tech of technologies) {
          await pool.query(`
            INSERT INTO technologies (name, category, icon, description)
            VALUES ($1, $2, $3, $4)
          `, [tech.name, tech.category, tech.icon, tech.description]);
        }
        
        console.log('✅ Tecnologías creadas con éxito');
      } else {
        console.log('ℹ️ Las tecnologías ya existen');
      }
      
      console.log('✅ Inicialización de la base de datos completada con éxito');
      
    } catch (error) {
      console.error('❌ Error al verificar tablas:', error);
    }
    
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
  } finally {
    await pool.end();
  }
}

// Ejecutar la función principal
initializeDatabase();