import { Pool } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const CONNECTION_STRING = process.env.DATABASE_URL;
const ADMIN_PASSWORD = 'admin123';

console.log('Starting database setup...');

// Create database connection
if (!CONNECTION_STRING) {
  console.error('ERROR: DATABASE_URL environment variable is not defined');
  process.exit(1);
}

const pool = new Pool({ connectionString: CONNECTION_STRING });

async function setupDatabase() {
  console.log('Setting up the database...');
  
  try {
    // Test connection
    const client = await pool.connect();
    try {
      console.log('Connected to PostgreSQL database');
      
      // Create admin user if it doesn't exist
      const adminUserResult = await client.query(`
        SELECT COUNT(*) FROM users WHERE email = 'admin@tuweb.ai';
      `);
      
      if (parseInt(adminUserResult.rows[0].count) === 0) {
        console.log('Creating admin user...');
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
        
        await client.query(`
          INSERT INTO users (username, email, password, name, role, "createdAt", "updatedAt", "isActive")
          VALUES ('admin', 'admin@tuweb.ai', $1, 'Admin User', 'admin', NOW(), NOW(), true);
        `, [hashedPassword]);
        
        console.log('Admin user created successfully');
      } else {
        console.log('Admin user already exists');
      }
      
      // Create resources if they don't exist
      const resourcesResult = await client.query(`
        SELECT COUNT(*) FROM resources;
      `);
      
      if (parseInt(resourcesResult.rows[0].count) === 0) {
        console.log('Creating initial resources...');
        
        const resources = [
          {
            title: "Guía SEO 2025",
            type: "pdf",
            url: "/resources/guia-seo-2025.pdf",
            description: "Guía completa de SEO para el año 2025.",
            isPublic: true,
            downloadCount: 45
          },
          {
            title: "Checklist de Conversión",
            type: "pdf",
            url: "/resources/checklist-conversion.pdf",
            description: "Checklist para mejorar las tasas de conversión.",
            isPublic: true,
            downloadCount: 32
          },
          {
            title: "Estrategia de Contenidos",
            type: "pdf",
            url: "/resources/estrategia-contenidos.pdf",
            description: "Guía para desarrollar una estrategia de contenidos efectiva.",
            isPublic: true,
            downloadCount: 28
          },
          {
            title: "Calculadora ROI",
            type: "xlsx",
            url: "/resources/calculadora-roi.xlsx",
            description: "Calcula el retorno de inversión de tus campañas de marketing.",
            isPublic: true,
            downloadCount: 19
          }
        ];
        
        for (const resource of resources) {
          await client.query(`
            INSERT INTO resources (title, type, url, description, "isPublic", "downloadCount", "createdAt", "updatedAt")
            VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW());
          `, [
            resource.title,
            resource.type,
            resource.url,
            resource.description,
            resource.isPublic,
            resource.downloadCount
          ]);
        }
        
        console.log('Resources created successfully');
      } else {
        console.log('Resources already exist');
      }
      
      // Create technologies if they don't exist
      const technologiesResult = await client.query(`
        SELECT COUNT(*) FROM technologies;
      `);
      
      if (parseInt(technologiesResult.rows[0].count) === 0) {
        console.log('Creating initial technologies...');
        
        const technologies = [
          { name: "React", category: "frontend", icon: "react", description: "Librería JavaScript para crear interfaces de usuario" },
          { name: "Next.js", category: "frontend", icon: "nextjs", description: "Framework de React para aplicaciones web" },
          { name: "Node.js", category: "backend", icon: "nodejs", description: "Entorno de ejecución para JavaScript" },
          { name: "PostgreSQL", category: "database", icon: "postgresql", description: "Sistema de base de datos relacional" }
        ];
        
        for (const tech of technologies) {
          await client.query(`
            INSERT INTO technologies (name, category, icon, description)
            VALUES ($1, $2, $3, $4);
          `, [
            tech.name,
            tech.category,
            tech.icon,
            tech.description
          ]);
        }
        
        console.log('Technologies created successfully');
      } else {
        console.log('Technologies already exist');
      }
      
      console.log('Database setup completed successfully!');
      
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run setup
setupDatabase();