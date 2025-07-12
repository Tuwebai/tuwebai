#!/usr/bin/env node

/**
 * Script completo para inicializar la base de datos de Tuweb.ai
 * Este script crea todas las tablas, datos de prueba y configuración inicial
 * 
 * Uso: node setup-complete-database.js
 */

import { Pool } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import * as WebSocket from 'ws';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';

// Configurar WebSocket para Neon Serverless
if (!globalThis.WebSocket) {
  console.log("🔧 Configurando WebSocket para Neon Serverless");
  globalThis.WebSocket = WebSocket.WebSocket;
}

// Configuración
const ADMIN_EMAIL = 'admin@tuweb.ai';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_USERNAME = 'admin';

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logError(message) {
  console.error(`${colors.red}❌ ${message}${colors.reset}`);
}

function logSuccess(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

function logInfo(message) {
  console.log(`${colors.blue}ℹ️ ${message}${colors.reset}`);
}

function logWarning(message) {
  console.log(`${colors.yellow}⚠️ ${message}${colors.reset}`);
}

async function setupCompleteDatabase() {
  log('🚀 Iniciando configuración completa de la base de datos Tuweb.ai', 'bright');
  
  // Verificar variables de entorno
  if (!process.env.DATABASE_URL) {
    logError('La variable de entorno DATABASE_URL no está definida');
    logInfo('Asegúrate de tener un archivo .env con DATABASE_URL configurado');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  try {
    log('📡 Conectando a la base de datos...', 'cyan');
    
    // Verificar conexión
    const client = await pool.connect();
    logSuccess('Conexión a PostgreSQL establecida');
    client.release();

    // 1. Ejecutar migraciones de Drizzle
    log('🔄 Ejecutando migraciones de Drizzle...', 'cyan');
    try {
      await migrate(db, { migrationsFolder: './migrations' });
      logSuccess('Migraciones ejecutadas correctamente');
    } catch (error) {
      logWarning('No se encontraron migraciones o ya están aplicadas');
      logInfo('Continuando con la configuración de datos...');
    }

    // 2. Crear usuario administrador
    log('👤 Configurando usuario administrador...', 'cyan');
    const adminExists = await pool.query(
      'SELECT COUNT(*) FROM users WHERE email = $1',
      [ADMIN_EMAIL]
    );

    if (parseInt(adminExists.rows[0].count) === 0) {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
      
      await pool.query(`
        INSERT INTO users (username, email, password, name, role, "createdAt", "updatedAt", "isActive")
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), true)
      `, [ADMIN_USERNAME, ADMIN_EMAIL, hashedPassword, 'Administrador Tuweb.ai', 'admin']);
      
      logSuccess(`Usuario administrador creado: ${ADMIN_EMAIL}`);
      logInfo(`Contraseña: ${ADMIN_PASSWORD}`);
    } else {
      logInfo('Usuario administrador ya existe');
    }

    // 3. Crear recursos iniciales
    log('📚 Configurando recursos iniciales...', 'cyan');
    const resourcesCount = await pool.query('SELECT COUNT(*) FROM resources');
    
    if (parseInt(resourcesCount.rows[0].count) === 0) {
      const resources = [
        {
          title: "Guía SEO 2025 - Posicionamiento Web",
          type: "pdf",
          url: "/resources/guia-seo-2025.pdf",
          description: "Guía completa de SEO para el año 2025. Incluye técnicas avanzadas de posicionamiento, Core Web Vitals, y estrategias de contenido.",
          isPublic: true,
          downloadCount: 156
        },
        {
          title: "Checklist de Conversión - Optimización UX",
          type: "pdf",
          url: "/resources/checklist-conversion.pdf",
          description: "Checklist completo para mejorar las tasas de conversión de tu sitio web. Incluye 50+ puntos de verificación.",
          isPublic: true,
          downloadCount: 89
        },
        {
          title: "Estrategia de Contenidos Digital",
          type: "pdf",
          url: "/resources/estrategia-contenidos.pdf",
          description: "Guía para desarrollar una estrategia de contenidos efectiva que genere engagement y conversiones.",
          isPublic: true,
          downloadCount: 67
        },
        {
          title: "Calculadora ROI Marketing Digital",
          type: "xlsx",
          url: "/resources/calculadora-roi.xlsx",
          description: "Calcula el retorno de inversión de tus campañas de marketing digital con fórmulas avanzadas.",
          isPublic: true,
          downloadCount: 43
        },
        {
          title: "Manual de Branding Corporativo",
          type: "pdf",
          url: "/resources/manual-branding.pdf",
          description: "Guía completa para crear y mantener una identidad de marca profesional y coherente.",
          isPublic: true,
          downloadCount: 34
        },
        {
          title: "Plantillas de Propuestas Comerciales",
          type: "docx",
          url: "/resources/plantillas-propuestas.docx",
          description: "Plantillas profesionales para propuestas comerciales de servicios digitales.",
          isPublic: false,
          downloadCount: 12
        }
      ];

      for (const resource of resources) {
        await pool.query(`
          INSERT INTO resources (title, type, url, description, "isPublic", "downloadCount", "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        `, [resource.title, resource.type, resource.url, resource.description, resource.isPublic, resource.downloadCount]);
      }
      
      logSuccess(`${resources.length} recursos creados`);
    } else {
      logInfo('Recursos ya existen');
    }

    // 4. Crear tecnologías
    log('⚡ Configurando tecnologías...', 'cyan');
    const techCount = await pool.query('SELECT COUNT(*) FROM technologies');
    
    if (parseInt(techCount.rows[0].count) === 0) {
      const technologies = [
        // Frontend
        { name: "React", category: "frontend", icon: "react", description: "Librería JavaScript para crear interfaces de usuario interactivas" },
        { name: "Next.js", category: "frontend", icon: "nextjs", description: "Framework de React para aplicaciones web con SSR y SSG" },
        { name: "Vue.js", category: "frontend", icon: "vue", description: "Framework progresivo para construir interfaces de usuario" },
        { name: "Angular", category: "frontend", icon: "angular", description: "Framework completo para aplicaciones web empresariales" },
        { name: "Tailwind CSS", category: "frontend", icon: "tailwind", description: "Framework CSS utility-first para diseño rápido" },
        { name: "TypeScript", category: "frontend", icon: "typescript", description: "Superset de JavaScript con tipado estático" },
        
        // Backend
        { name: "Node.js", category: "backend", icon: "nodejs", description: "Entorno de ejecución para JavaScript en el servidor" },
        { name: "Express.js", category: "backend", icon: "express", description: "Framework web minimalista para Node.js" },
        { name: "Python", category: "backend", icon: "python", description: "Lenguaje de programación versátil para backend" },
        { name: "Django", category: "backend", icon: "django", description: "Framework web de alto nivel para Python" },
        { name: "FastAPI", category: "backend", icon: "fastapi", description: "Framework moderno para APIs con Python" },
        { name: "PHP", category: "backend", icon: "php", description: "Lenguaje de programación para desarrollo web" },
        { name: "Laravel", category: "backend", icon: "laravel", description: "Framework PHP elegante y expresivo" },
        
        // Base de datos
        { name: "PostgreSQL", category: "database", icon: "postgresql", description: "Sistema de base de datos relacional avanzado" },
        { name: "MySQL", category: "database", icon: "mysql", description: "Sistema de gestión de bases de datos relacional" },
        { name: "MongoDB", category: "database", icon: "mongodb", description: "Base de datos NoSQL orientada a documentos" },
        { name: "Redis", category: "database", icon: "redis", description: "Base de datos en memoria para caché y sesiones" },
        
        // Cloud y DevOps
        { name: "AWS", category: "cloud", icon: "aws", description: "Plataforma de computación en la nube de Amazon" },
        { name: "Google Cloud", category: "cloud", icon: "gcp", description: "Plataforma de servicios en la nube de Google" },
        { name: "Azure", category: "cloud", icon: "azure", description: "Plataforma de computación en la nube de Microsoft" },
        { name: "Docker", category: "devops", icon: "docker", description: "Plataforma para desarrollo, envío y ejecución de aplicaciones" },
        { name: "Kubernetes", category: "devops", icon: "kubernetes", description: "Plataforma de orquestación de contenedores" },
        
        // Herramientas
        { name: "Git", category: "tools", icon: "git", description: "Sistema de control de versiones distribuido" },
        { name: "GitHub", category: "tools", icon: "github", description: "Plataforma de desarrollo colaborativo" },
        { name: "Figma", category: "tools", icon: "figma", description: "Herramienta de diseño colaborativo" },
        { name: "Adobe XD", category: "tools", icon: "adobe-xd", description: "Herramienta de diseño de experiencias de usuario" }
      ];

      for (const tech of technologies) {
        await pool.query(`
          INSERT INTO technologies (name, category, icon, description)
          VALUES ($1, $2, $3, $4)
        `, [tech.name, tech.category, tech.icon, tech.description]);
      }
      
      logSuccess(`${technologies.length} tecnologías creadas`);
    } else {
      logInfo('Tecnologías ya existen');
    }

    // 5. Crear datos de prueba para contactos
    log('📧 Creando datos de prueba para contactos...', 'cyan');
    const contactsCount = await pool.query('SELECT COUNT(*) FROM contacts');
    
    if (parseInt(contactsCount.rows[0].count) === 0) {
      const sampleContacts = [
        {
          name: "María González",
          email: "maria.gonzalez@empresa.com",
          message: "Hola, estoy interesada en desarrollar un sitio web corporativo para mi empresa. ¿Podrían enviarme información sobre sus servicios y precios?",
          source: "contact_form"
        },
        {
          name: "Carlos Rodríguez",
          email: "carlos.rodriguez@startup.com",
          message: "Necesito una aplicación móvil para mi startup. ¿Trabajan con React Native? Me gustaría agendar una consulta.",
          source: "contact_form"
        },
        {
          name: "Ana Martínez",
          email: "ana.martinez@tienda.com",
          message: "Quiero crear una tienda online para vender productos artesanales. ¿Cuánto tiempo toma el desarrollo de un e-commerce?",
          source: "contact_form"
        }
      ];

      for (const contact of sampleContacts) {
        await pool.query(`
          INSERT INTO contacts (name, email, message, "createdAt", "isRead", source)
          VALUES ($1, $2, $3, NOW(), false, $4)
        `, [contact.name, contact.email, contact.message, contact.source]);
      }
      
      logSuccess(`${sampleContacts.length} contactos de prueba creados`);
    } else {
      logInfo('Contactos ya existen');
    }

    // 6. Crear datos de prueba para consultas
    log('💼 Creando datos de prueba para consultas...', 'cyan');
    const consultationsCount = await pool.query('SELECT COUNT(*) FROM consultations');
    
    if (parseInt(consultationsCount.rows[0].count) === 0) {
      const sampleConsultations = [
        {
          nombre: "Roberto Silva",
          email: "roberto.silva@consultoria.com",
          empresa: "Silva Consultores",
          telefono: "+34 600 123 456",
          tipoProyecto: "sitio_web",
          urgente: false,
          presupuesto: "5000-10000",
          plazo: "2-3_meses",
          mensaje: "Necesito un sitio web corporativo moderno y profesional para mi consultora. Debe incluir blog, formularios de contacto y integración con redes sociales.",
          comoNosEncontraste: "google"
        },
        {
          nombre: "Laura Fernández",
          email: "laura.fernandez@moda.com",
          empresa: "Boutique Elegante",
          telefono: "+34 600 789 012",
          tipoProyecto: "ecommerce",
          urgente: true,
          presupuesto: "10000-20000",
          plazo: "1_mes",
          mensaje: "Quiero lanzar mi tienda online de ropa antes de la temporada de verano. Necesito un e-commerce completo con pasarela de pagos y gestión de inventario.",
          comoNosEncontraste: "instagram"
        },
        {
          nombre: "Miguel Torres",
          email: "miguel.torres@tech.com",
          empresa: "TechStart",
          telefono: "+34 600 345 678",
          tipoProyecto: "aplicacion_movil",
          urgente: false,
          presupuesto: "15000-25000",
          plazo: "3-4_meses",
          mensaje: "Desarrollo una aplicación móvil para gestión de proyectos. Necesito una app nativa con sincronización en tiempo real y notificaciones push.",
          comoNosEncontraste: "linkedin"
        }
      ];

      for (const consultation of sampleConsultations) {
        const result = await pool.query(`
          INSERT INTO consultations (nombre, email, empresa, telefono, "tipoProyecto", urgente, presupuesto, plazo, mensaje, "comoNosEncontraste", "createdAt", "isProcessed")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), false)
          RETURNING id
        `, [
          consultation.nombre, consultation.email, consultation.empresa, consultation.telefono,
          consultation.tipoProyecto, consultation.urgente, consultation.presupuesto,
          consultation.plazo, consultation.mensaje, consultation.comoNosEncontraste
        ]);

        const consultationId = result.rows[0].id;

        // Agregar servicios según el tipo de proyecto
        let services = [];
        if (consultation.tipoProyecto === 'sitio_web') {
          services = ['Diseño UX/UI', 'Desarrollo Frontend', 'Desarrollo Backend', 'SEO Básico'];
        } else if (consultation.tipoProyecto === 'ecommerce') {
          services = ['Diseño UX/UI', 'Desarrollo Frontend', 'Desarrollo Backend', 'Integración Pagos', 'Gestión Inventario'];
        } else if (consultation.tipoProyecto === 'aplicacion_movil') {
          services = ['Diseño UX/UI', 'Desarrollo App Nativa', 'Backend API', 'Notificaciones Push'];
        }

        for (const service of services) {
          await pool.query(`
            INSERT INTO consultation_services (consultation_id, service_detail)
            VALUES ($1, $2)
          `, [consultationId, service]);
        }

        // Agregar secciones
        const sections = ['Inicio', 'Servicios', 'Portfolio', 'Contacto'];
        for (const section of sections) {
          await pool.query(`
            INSERT INTO consultation_sections (consultation_id, section)
            VALUES ($1, $2)
          `, [consultationId, section]);
        }
      }
      
      logSuccess(`${sampleConsultations.length} consultas de prueba creadas`);
    } else {
      logInfo('Consultas ya existen');
    }

    // 7. Crear suscriptores de newsletter
    log('📬 Creando suscriptores de newsletter...', 'cyan');
    const newsletterCount = await pool.query('SELECT COUNT(*) FROM newsletter');
    
    if (parseInt(newsletterCount.rows[0].count) === 0) {
      const sampleNewsletter = [
        { email: "juan.perez@email.com", source: "website" },
        { email: "maria.lopez@empresa.com", source: "landing_page" },
        { email: "carlos.garcia@startup.com", source: "blog" },
        { email: "ana.rodriguez@consultora.com", source: "social_media" }
      ];

      for (const subscriber of sampleNewsletter) {
        await pool.query(`
          INSERT INTO newsletter (email, "createdAt", "isActive", source)
          VALUES ($1, NOW(), true, $2)
        `, [subscriber.email, subscriber.source]);
      }
      
      logSuccess(`${sampleNewsletter.length} suscriptores de newsletter creados`);
    } else {
      logInfo('Suscriptores de newsletter ya existen');
    }

    // 8. Crear datos de analíticas de ejemplo
    log('📊 Creando datos de analíticas de ejemplo...', 'cyan');
    const analyticsCount = await pool.query('SELECT COUNT(*) FROM analytics');
    
    if (parseInt(analyticsCount.rows[0].count) === 0) {
      const sampleAnalytics = [
        { eventType: 'page_view', eventCategory: 'engagement', eventAction: 'view', eventLabel: '/', path: '/' },
        { eventType: 'page_view', eventCategory: 'engagement', eventAction: 'view', eventLabel: '/servicios', path: '/servicios' },
        { eventType: 'page_view', eventCategory: 'engagement', eventAction: 'view', eventLabel: '/portfolio', path: '/portfolio' },
        { eventType: 'form_submit', eventCategory: 'conversion', eventAction: 'submit', eventLabel: 'contact_form', path: '/contacto' },
        { eventType: 'download', eventCategory: 'engagement', eventAction: 'download', eventLabel: 'guia-seo-2025.pdf', path: '/recursos' }
      ];

      for (const event of sampleAnalytics) {
        await pool.query(`
          INSERT INTO analytics (event_type, event_category, event_action, event_label, path, "createdAt")
          VALUES ($1, $2, $3, $4, $5, NOW())
        `, [event.eventType, event.eventCategory, event.eventAction, event.eventLabel, event.path]);
      }
      
      logSuccess(`${sampleAnalytics.length} eventos de analíticas creados`);
    } else {
      logInfo('Datos de analíticas ya existen');
    }

    // 9. Verificar tablas creadas
    log('📋 Verificando estructura de la base de datos...', 'cyan');
    const { rows: tables } = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    logSuccess(`Base de datos configurada con ${tables.length} tablas:`);
    tables.forEach(table => {
      log(`  - ${table.table_name}`, 'green');
    });

    // 10. Resumen final
    log('🎉 ¡Configuración completa de la base de datos finalizada!', 'bright');
    log('', 'reset');
    log('📋 RESUMEN DE LA CONFIGURACIÓN:', 'bright');
    log('✅ Usuario administrador creado', 'green');
    log('✅ Recursos iniciales configurados', 'green');
    log('✅ Tecnologías agregadas', 'green');
    log('✅ Datos de prueba creados', 'green');
    log('✅ Estructura de base de datos verificada', 'green');
    log('', 'reset');
    log('🔑 CREDENCIALES DE ADMINISTRADOR:', 'bright');
    log(`   Email: ${ADMIN_EMAIL}`, 'cyan');
    log(`   Contraseña: ${ADMIN_PASSWORD}`, 'cyan');
    log('', 'reset');
    log('🚀 PRÓXIMOS PASOS:', 'bright');
    log('1. Accede al panel de administración en /admin', 'yellow');
    log('2. Cambia la contraseña del administrador', 'yellow');
    log('3. Personaliza el contenido de la plataforma', 'yellow');
    log('4. Configura las variables de entorno para producción', 'yellow');

  } catch (error) {
    logError(`Error durante la configuración: ${error.message}`);
    console.error(error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Ejecutar el script
setupCompleteDatabase().catch(error => {
  logError(`Error fatal: ${error.message}`);
  process.exit(1);
}); 