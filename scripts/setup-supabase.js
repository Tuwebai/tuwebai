const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY deben estar configurados en .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log('🚀 Configurando base de datos en Supabase...');

  try {
    // Crear tablas principales
    const tables = [
      // Tabla de usuarios
      `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user' NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
        last_login TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        verification_token VARCHAR(255),
        reset_password_token VARCHAR(255)
      )`,

      // Tabla de contactos
      `CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        is_read BOOLEAN DEFAULT false,
        source VARCHAR(100) DEFAULT 'contact_form'
      )`,

      // Tabla de consultas
      `CREATE TABLE IF NOT EXISTS consultations (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        empresa VARCHAR(255),
        telefono VARCHAR(50),
        tipo_proyecto VARCHAR(50) NOT NULL,
        urgente BOOLEAN DEFAULT false,
        presupuesto VARCHAR(50) NOT NULL,
        plazo VARCHAR(50),
        mensaje TEXT NOT NULL,
        como_nos_encontraste VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        is_processed BOOLEAN DEFAULT false
      )`,

      // Tabla de newsletter
      `CREATE TABLE IF NOT EXISTS newsletter (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        is_active BOOLEAN DEFAULT true,
        source VARCHAR(100)
      )`,

      // Tabla de recursos
      `CREATE TABLE IF NOT EXISTS resources (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        url VARCHAR(255) NOT NULL,
        description TEXT,
        is_public BOOLEAN DEFAULT true,
        download_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )`,

      // Tabla de tecnologías
      `CREATE TABLE IF NOT EXISTS technologies (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        icon VARCHAR(50) NOT NULL,
        description TEXT
      )`,

      // Tabla de preferencias de usuario
      `CREATE TABLE IF NOT EXISTS user_preferences (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        email_notifications BOOLEAN DEFAULT true,
        newsletter BOOLEAN DEFAULT false,
        dark_mode BOOLEAN DEFAULT false,
        language VARCHAR(10) DEFAULT 'es',
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )`,

      // Tabla de sesiones
      `CREATE TABLE IF NOT EXISTS sessions (
        sid VARCHAR(255) PRIMARY KEY,
        sess TEXT NOT NULL,
        expire TIMESTAMP NOT NULL
      )`,

      // Tabla de analíticas
      `CREATE TABLE IF NOT EXISTS analytics (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(100) NOT NULL,
        event_category VARCHAR(100),
        event_action VARCHAR(100),
        event_label TEXT,
        event_value INTEGER,
        user_id INTEGER REFERENCES users(id),
        session_id VARCHAR(255),
        path VARCHAR(512),
        referrer TEXT,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        ip_address VARCHAR(50)
      )`
    ];

    // Ejecutar todas las consultas
    for (const table of tables) {
      const { error } = await supabase.rpc('exec_sql', { sql: table });
      if (error) {
        console.log(`⚠️  Tabla ya existe o error menor: ${error.message}`);
      } else {
        console.log('✅ Tabla creada correctamente');
      }
    }

    // Crear usuario administrador por defecto
    const { data: existingAdmin } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'admin@tuwebai.com')
      .single();

    if (!existingAdmin) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const { error: adminError } = await supabase
        .from('users')
        .insert({
          username: 'admin',
          email: 'admin@tuwebai.com',
          password: hashedPassword,
          name: 'Administrador',
          role: 'admin',
          is_active: true
        });

      if (adminError) {
        console.log('⚠️  Error creando admin:', adminError.message);
      } else {
        console.log('✅ Usuario administrador creado: admin@tuwebai.com / admin123');
      }
    }

    console.log('🎉 Base de datos configurada correctamente!');
    console.log('📝 Credenciales de administrador:');
    console.log('   Email: admin@tuwebai.com');
    console.log('   Password: admin123');
    console.log('⚠️  IMPORTANTE: Cambia la contraseña después del primer login');

  } catch (error) {
    console.error('❌ Error configurando la base de datos:', error);
    process.exit(1);
  }
}

setupDatabase(); 