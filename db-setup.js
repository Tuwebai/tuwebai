import { Pool } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import bcrypt from 'bcryptjs';
import * as WebSocket from 'ws';

// Configurar WebSocket para Neon Serverless
if (!globalThis.WebSocket) {
  console.log("Configurando WebSocket para Neon Serverless");
  globalThis.WebSocket = WebSocket.WebSocket;
}

// Configuración de la conexión a la base de datos
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('ERROR: La variable de entorno DATABASE_URL no está definida');
  process.exit(1);
}

// Crear una conexión a la base de datos
const pool = new Pool({ connectionString });

async function setupDatabase() {
  try {
    console.log('Iniciando configuración de la base de datos...');
    
    // Validar conexión
    console.log('Validando conexión a la base de datos...');
    const client = await pool.connect();
    
    try {
      const result = await client.query('SELECT version()');
      console.log(`Conexión exitosa a PostgreSQL: ${result.rows[0].version}`);
    } finally {
      client.release();
    }
    
    // Ejecutar migración utilizando Drizzle
    console.log('\nGenerando y aplicando migraciones...');
    try {
      // Generar migraciones
      console.log('Generando SQL para migraciones...');
      execSync('npx drizzle-kit generate:pg', { stdio: 'inherit' });
      
      // Aplicar migraciones
      console.log('\nAplicando migraciones a la base de datos...');
      execSync('npx drizzle-kit push:pg', { stdio: 'inherit' });
      
      console.log('\n✅ Migraciones aplicadas correctamente');
    } catch (error) {
      console.error('❌ Error al aplicar migraciones:', error);
      throw error;
    }
    
    // Verificar la estructura de la base de datos
    console.log('\nVerificando tablas en la base de datos...');
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('Tablas disponibles:');
    tables.rows.forEach(table => {
      console.log(`- ${table.table_name}`);
    });
    
    // Poblar datos iniciales (opcional)
    console.log('\nCreando datos iniciales...');
    
    // Crear un usuario administrador de prueba
    const adminExists = await pool.query(`
      SELECT * FROM users WHERE email = 'admin@tuweb.ai' LIMIT 1
    `);
    
    if (adminExists.rows.length === 0) {
      console.log('Creando usuario administrador de prueba...');
      
      // Hashear la contraseña con bcrypt
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await pool.query(`
        INSERT INTO users (username, email, password, name, role, "createdAt", "updatedAt", "isActive")
        VALUES ('admin', 'admin@tuweb.ai', $1, 'Administrador', 'admin', NOW(), NOW(), true)
      `, [hashedPassword]);
      
      console.log('✅ Usuario administrador creado exitosamente');
    } else {
      console.log('El usuario administrador ya existe');
    }
    
    // Agregar datos de recursos si no existen
    const resourcesExist = await pool.query(`
      SELECT COUNT(*) FROM resources
    `);
    
    if (parseInt(resourcesExist.rows[0].count) === 0) {
      console.log('Creando recursos iniciales...');
      
      const resources = [
        {
          title: "Guía SEO 2025",
          type: "pdf",
          url: "/resources/guia-seo-2025.pdf",
          description: "Guía completa de SEO para el año 2025.",
          isPublic: true,
          downloadCount: 45,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: "Checklist de Conversión",
          type: "pdf",
          url: "/resources/checklist-conversion.pdf",
          description: "Checklist para mejorar las tasas de conversión.",
          isPublic: true,
          downloadCount: 32,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: "Estrategia de Contenidos",
          type: "pdf",
          url: "/resources/estrategia-contenidos.pdf",
          description: "Guía para desarrollar una estrategia de contenidos efectiva.",
          isPublic: true,
          downloadCount: 28,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: "Calculadora ROI",
          type: "xlsx",
          url: "/resources/calculadora-roi.xlsx",
          description: "Calcula el retorno de inversión de tus campañas de marketing.",
          isPublic: true,
          downloadCount: 19,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: "Plantillas Email Marketing",
          type: "zip",
          url: "/resources/plantillas-email.zip",
          description: "Pack de plantillas HTML para email marketing.",
          isPublic: true,
          downloadCount: 37,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: "Webinar Automatización",
          type: "video",
          url: "/resources/webinar-automatizacion.mp4",
          description: "Grabación del webinar sobre automatización de marketing.",
          isPublic: true,
          downloadCount: 24,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ];
      
      for (const resource of resources) {
        await pool.query(`
          INSERT INTO resources (title, type, url, description, "isPublic", "downloadCount", "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [resource.title, resource.type, resource.url, resource.description, resource.isPublic, resource.downloadCount, resource.createdAt, resource.updatedAt]);
      }
      
      console.log('✅ Recursos iniciales creados exitosamente');
    } else {
      console.log('Los recursos ya existen');
    }
    
    // Agregar datos de tecnologías si no existen
    const technologiesExist = await pool.query(`
      SELECT COUNT(*) FROM technologies
    `);
    
    if (parseInt(technologiesExist.rows[0].count) === 0) {
      console.log('Creando tecnologías iniciales...');
      
      const technologies = [
        { id: 1, name: "React", category: "frontend", icon: "react", description: "Librería JavaScript para crear interfaces de usuario" },
        { id: 2, name: "Next.js", category: "frontend", icon: "nextjs", description: "Framework de React para aplicaciones web" },
        { id: 3, name: "Tailwind CSS", category: "frontend", icon: "tailwind", description: "Framework CSS utility-first" },
        { id: 4, name: "Node.js", category: "backend", icon: "nodejs", description: "Entorno de ejecución para JavaScript" },
        { id: 5, name: "PostgreSQL", category: "database", icon: "postgresql", description: "Sistema de base de datos relacional" },
        { id: 6, name: "MongoDB", category: "database", icon: "mongodb", description: "Base de datos NoSQL orientada a documentos" },
        { id: 7, name: "AWS", category: "cloud", icon: "aws", description: "Plataforma de servicios en la nube" },
        { id: 8, name: "Docker", category: "devops", icon: "docker", description: "Plataforma de contenedores" },
        { id: 9, name: "GitHub", category: "devops", icon: "github", description: "Plataforma de desarrollo colaborativo" },
        { id: 10, name: "TypeScript", category: "language", icon: "typescript", description: "Superset tipado de JavaScript" },
      ];
      
      for (const tech of technologies) {
        await pool.query(`
          INSERT INTO technologies (id, name, category, icon, description)
          VALUES ($1, $2, $3, $4, $5)
        `, [tech.id, tech.name, tech.category, tech.icon, tech.description]);
      }
      
      console.log('✅ Tecnologías iniciales creadas exitosamente');
    } else {
      console.log('Las tecnologías ya existen');
    }
    
    console.log('\n✅ Configuración de la base de datos completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error al configurar la base de datos:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Ejecutar la configuración
setupDatabase();