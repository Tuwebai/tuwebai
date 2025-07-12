-- =====================================================
-- SCRIPT COMPLETO DE INICIALIZACIÓN DE BASE DE DATOS
-- Tuweb.ai - Plataforma de Desarrollo Web Profesional
-- =====================================================

-- 1. CREAR USUARIO ADMINISTRADOR
-- =====================================================
INSERT INTO users (username, email, password, name, role, "createdAt", "updatedAt", "isActive")
VALUES (
    'admin',
    'admin@tuweb.ai',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.gSJm6G', -- admin123
    'Administrador Tuweb.ai',
    'admin',
    NOW(),
    NOW(),
    true
) ON CONFLICT (email) DO NOTHING;

-- 2. CREAR RECURSOS INICIALES
-- =====================================================
INSERT INTO resources (title, type, url, description, "isPublic", "downloadCount", "createdAt", "updatedAt") VALUES
('Guía SEO 2025 - Posicionamiento Web', 'pdf', '/resources/guia-seo-2025.pdf', 'Guía completa de SEO para el año 2025. Incluye técnicas avanzadas de posicionamiento, Core Web Vitals, y estrategias de contenido.', true, 156, NOW(), NOW()),
('Checklist de Conversión - Optimización UX', 'pdf', '/resources/checklist-conversion.pdf', 'Checklist completo para mejorar las tasas de conversión de tu sitio web. Incluye 50+ puntos de verificación.', true, 89, NOW(), NOW()),
('Estrategia de Contenidos Digital', 'pdf', '/resources/estrategia-contenidos.pdf', 'Guía para desarrollar una estrategia de contenidos efectiva que genere engagement y conversiones.', true, 67, NOW(), NOW()),
('Calculadora ROI Marketing Digital', 'xlsx', '/resources/calculadora-roi.xlsx', 'Calcula el retorno de inversión de tus campañas de marketing digital con fórmulas avanzadas.', true, 43, NOW(), NOW()),
('Manual de Branding Corporativo', 'pdf', '/resources/manual-branding.pdf', 'Guía completa para crear y mantener una identidad de marca profesional y coherente.', true, 34, NOW(), NOW()),
('Plantillas de Propuestas Comerciales', 'docx', '/resources/plantillas-propuestas.docx', 'Plantillas profesionales para propuestas comerciales de servicios digitales.', false, 12, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 3. CREAR TECNOLOGÍAS
-- =====================================================
INSERT INTO technologies (name, category, icon, description) VALUES
-- Frontend
('React', 'frontend', 'react', 'Librería JavaScript para crear interfaces de usuario interactivas'),
('Next.js', 'frontend', 'nextjs', 'Framework de React para aplicaciones web con SSR y SSG'),
('Vue.js', 'frontend', 'vue', 'Framework progresivo para construir interfaces de usuario'),
('Angular', 'frontend', 'angular', 'Framework completo para aplicaciones web empresariales'),
('Tailwind CSS', 'frontend', 'tailwind', 'Framework CSS utility-first para diseño rápido'),
('TypeScript', 'frontend', 'typescript', 'Superset de JavaScript con tipado estático'),

-- Backend
('Node.js', 'backend', 'nodejs', 'Entorno de ejecución para JavaScript en el servidor'),
('Express.js', 'backend', 'express', 'Framework web minimalista para Node.js'),
('Python', 'backend', 'python', 'Lenguaje de programación versátil para backend'),
('Django', 'backend', 'django', 'Framework web de alto nivel para Python'),
('FastAPI', 'backend', 'fastapi', 'Framework moderno para APIs con Python'),
('PHP', 'backend', 'php', 'Lenguaje de programación para desarrollo web'),
('Laravel', 'backend', 'laravel', 'Framework PHP elegante y expresivo'),

-- Base de datos
('PostgreSQL', 'database', 'postgresql', 'Sistema de base de datos relacional avanzado'),
('MySQL', 'database', 'mysql', 'Sistema de gestión de bases de datos relacional'),
('MongoDB', 'database', 'mongodb', 'Base de datos NoSQL orientada a documentos'),
('Redis', 'database', 'redis', 'Base de datos en memoria para caché y sesiones'),

-- Cloud y DevOps
('AWS', 'cloud', 'aws', 'Plataforma de computación en la nube de Amazon'),
('Google Cloud', 'cloud', 'gcp', 'Plataforma de servicios en la nube de Google'),
('Azure', 'cloud', 'azure', 'Plataforma de computación en la nube de Microsoft'),
('Docker', 'devops', 'docker', 'Plataforma para desarrollo, envío y ejecución de aplicaciones'),
('Kubernetes', 'devops', 'kubernetes', 'Plataforma de orquestación de contenedores'),

-- Herramientas
('Git', 'tools', 'git', 'Sistema de control de versiones distribuido'),
('GitHub', 'tools', 'github', 'Plataforma de desarrollo colaborativo'),
('Figma', 'tools', 'figma', 'Herramienta de diseño colaborativo'),
('Adobe XD', 'tools', 'adobe-xd', 'Herramienta de diseño de experiencias de usuario')
ON CONFLICT DO NOTHING;

-- 4. CREAR CONTACTOS DE PRUEBA
-- =====================================================
INSERT INTO contacts (name, email, message, "createdAt", "isRead", source) VALUES
('María González', 'maria.gonzalez@empresa.com', 'Hola, estoy interesada en desarrollar un sitio web corporativo para mi empresa. ¿Podrían enviarme información sobre sus servicios y precios?', NOW(), false, 'contact_form'),
('Carlos Rodríguez', 'carlos.rodriguez@startup.com', 'Necesito una aplicación móvil para mi startup. ¿Trabajan con React Native? Me gustaría agendar una consulta.', NOW(), false, 'contact_form'),
('Ana Martínez', 'ana.martinez@tienda.com', 'Quiero crear una tienda online para vender productos artesanales. ¿Cuánto tiempo toma el desarrollo de un e-commerce?', NOW(), false, 'contact_form')
ON CONFLICT DO NOTHING;

-- 5. CREAR CONSULTAS DE PRUEBA
-- =====================================================
-- Consulta 1: Sitio Web Corporativo
INSERT INTO consultations (nombre, email, empresa, telefono, "tipoProyecto", urgente, presupuesto, plazo, mensaje, "comoNosEncontraste", "createdAt", "isProcessed") VALUES
('Roberto Silva', 'roberto.silva@consultoria.com', 'Silva Consultores', '+34 600 123 456', 'sitio_web', false, '5000-10000', '2-3_meses', 'Necesito un sitio web corporativo moderno y profesional para mi consultora. Debe incluir blog, formularios de contacto y integración con redes sociales.', 'google', NOW(), false)
RETURNING id;

-- Obtener el ID de la consulta insertada
DO $$
DECLARE
    consulta_id INTEGER;
BEGIN
    SELECT id INTO consulta_id FROM consultations WHERE email = 'roberto.silva@consultoria.com' LIMIT 1;
    
    -- Insertar servicios para esta consulta
    INSERT INTO consultation_services (consultation_id, service_detail) VALUES
    (consulta_id, 'Diseño UX/UI'),
    (consulta_id, 'Desarrollo Frontend'),
    (consulta_id, 'Desarrollo Backend'),
    (consulta_id, 'SEO Básico');
    
    -- Insertar secciones para esta consulta
    INSERT INTO consultation_sections (consultation_id, section) VALUES
    (consulta_id, 'Inicio'),
    (consulta_id, 'Servicios'),
    (consulta_id, 'Portfolio'),
    (consulta_id, 'Contacto');
END $$;

-- Consulta 2: E-commerce
INSERT INTO consultations (nombre, email, empresa, telefono, "tipoProyecto", urgente, presupuesto, plazo, mensaje, "comoNosEncontraste", "createdAt", "isProcessed") VALUES
('Laura Fernández', 'laura.fernandez@moda.com', 'Boutique Elegante', '+34 600 789 012', 'ecommerce', true, '10000-20000', '1_mes', 'Quiero lanzar mi tienda online de ropa antes de la temporada de verano. Necesito un e-commerce completo con pasarela de pagos y gestión de inventario.', 'instagram', NOW(), false)
RETURNING id;

DO $$
DECLARE
    consulta_id INTEGER;
BEGIN
    SELECT id INTO consulta_id FROM consultations WHERE email = 'laura.fernandez@moda.com' LIMIT 1;
    
    -- Insertar servicios para esta consulta
    INSERT INTO consultation_services (consultation_id, service_detail) VALUES
    (consulta_id, 'Diseño UX/UI'),
    (consulta_id, 'Desarrollo Frontend'),
    (consulta_id, 'Desarrollo Backend'),
    (consulta_id, 'Integración Pagos'),
    (consulta_id, 'Gestión Inventario');
    
    -- Insertar secciones para esta consulta
    INSERT INTO consultation_sections (consultation_id, section) VALUES
    (consulta_id, 'Inicio'),
    (consulta_id, 'Productos'),
    (consulta_id, 'Carrito'),
    (consulta_id, 'Checkout'),
    (consulta_id, 'Mi Cuenta');
END $$;

-- Consulta 3: Aplicación Móvil
INSERT INTO consultations (nombre, email, empresa, telefono, "tipoProyecto", urgente, presupuesto, plazo, mensaje, "comoNosEncontraste", "createdAt", "isProcessed") VALUES
('Miguel Torres', 'miguel.torres@tech.com', 'TechStart', '+34 600 345 678', 'aplicacion_movil', false, '15000-25000', '3-4_meses', 'Desarrollo una aplicación móvil para gestión de proyectos. Necesito una app nativa con sincronización en tiempo real y notificaciones push.', 'linkedin', NOW(), false)
RETURNING id;

DO $$
DECLARE
    consulta_id INTEGER;
BEGIN
    SELECT id INTO consulta_id FROM consultations WHERE email = 'miguel.torres@tech.com' LIMIT 1;
    
    -- Insertar servicios para esta consulta
    INSERT INTO consultation_services (consultation_id, service_detail) VALUES
    (consulta_id, 'Diseño UX/UI'),
    (consulta_id, 'Desarrollo App Nativa'),
    (consulta_id, 'Backend API'),
    (consulta_id, 'Notificaciones Push'),
    (consulta_id, 'Sincronización Tiempo Real');
    
    -- Insertar secciones para esta consulta
    INSERT INTO consultation_sections (consultation_id, section) VALUES
    (consulta_id, 'Dashboard'),
    (consulta_id, 'Proyectos'),
    (consulta_id, 'Tareas'),
    (consulta_id, 'Equipo'),
    (consulta_id, 'Reportes');
END $$;

-- 6. CREAR SUSCRIPTORES DE NEWSLETTER
-- =====================================================
INSERT INTO newsletter (email, "createdAt", "isActive", source) VALUES
('juan.perez@email.com', NOW(), true, 'website'),
('maria.lopez@empresa.com', NOW(), true, 'landing_page'),
('carlos.garcia@startup.com', NOW(), true, 'blog'),
('ana.rodriguez@consultora.com', NOW(), true, 'social_media')
ON CONFLICT (email) DO NOTHING;

-- 7. CREAR DATOS DE ANALÍTICAS DE EJEMPLO
-- =====================================================
INSERT INTO analytics (event_type, event_category, event_action, event_label, path, "createdAt") VALUES
('page_view', 'engagement', 'view', '/', '/', NOW()),
('page_view', 'engagement', 'view', '/servicios', '/servicios', NOW()),
('page_view', 'engagement', 'view', '/portfolio', '/portfolio', NOW()),
('form_submit', 'conversion', 'submit', 'contact_form', '/contacto', NOW()),
('download', 'engagement', 'download', 'guia-seo-2025.pdf', '/recursos', NOW()),
('page_view', 'engagement', 'view', '/blog', '/blog', NOW()),
('form_submit', 'conversion', 'submit', 'newsletter', '/', NOW()),
('page_view', 'engagement', 'view', '/equipo', '/equipo', NOW());

-- 8. CREAR PREFERENCIAS DE USUARIO PARA EL ADMIN
-- =====================================================
INSERT INTO user_preferences (user_id, email_notifications, newsletter, dark_mode, language, "updatedAt") VALUES
(1, true, true, false, 'es', NOW())
ON CONFLICT (user_id) DO NOTHING;

-- 9. VERIFICAR LA INSTALACIÓN
-- =====================================================
-- Mostrar resumen de datos insertados
SELECT 'USUARIOS' as tabla, COUNT(*) as cantidad FROM users
UNION ALL
SELECT 'RECURSOS' as tabla, COUNT(*) as cantidad FROM resources
UNION ALL
SELECT 'TECNOLOGÍAS' as tabla, COUNT(*) as cantidad FROM technologies
UNION ALL
SELECT 'CONTACTOS' as tabla, COUNT(*) as cantidad FROM contacts
UNION ALL
SELECT 'CONSULTAS' as tabla, COUNT(*) as cantidad FROM consultations
UNION ALL
SELECT 'NEWSLETTER' as tabla, COUNT(*) as cantidad FROM newsletter
UNION ALL
SELECT 'ANALÍTICAS' as tabla, COUNT(*) as cantidad FROM analytics;

-- Mostrar credenciales del administrador
SELECT 
    'ADMINISTRADOR' as tipo,
    username,
    email,
    'admin123' as password,
    role,
    "isActive"
FROM users 
WHERE email = 'admin@tuweb.ai';

-- =====================================================
-- ¡CONFIGURACIÓN COMPLETADA!
-- =====================================================
-- 
-- CREDENCIALES DE ACCESO:
-- Email: admin@tuweb.ai
-- Contraseña: admin123
-- 
-- PRÓXIMOS PASOS:
-- 1. Accede al panel de administración en /admin
-- 2. Cambia la contraseña del administrador
-- 3. Personaliza el contenido de la plataforma
-- 4. Configura las variables de entorno para producción
-- 
-- ===================================================== 