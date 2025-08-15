<?php
/**
 * Script para inicializar la colección de testimonios en Firestore
 * Ejecutar: php firebase/init_testimonials.php
 */

require_once '../api/config/firebase.php';

try {
    echo "🚀 Inicializando colección de testimonios...\n";
    
    // Testimonios de ejemplo
    $testimonials = [
        [
            'name' => 'Carlos Sánchez',
            'company' => 'CEO, Muebles Modernos',
            'testimonial' => 'Estamos extremadamente satisfechos con los resultados que TuWeb.ai ha conseguido para nuestro negocio. Nuestra tasa de conversión digital ha aumentado un 245% y el retorno de inversión superó nuestras expectativas más optimistas.',
            'isApproved' => true
        ],
        [
            'name' => 'Dra. Marta Rodríguez',
            'company' => 'Directora, Clínica Dental Sonrisa',
            'testimonial' => 'La estrategia SEO local que implementaron aumentó nuestras solicitudes de citas en un 180%. Lo mejor es que el equipo entendió perfectamente las particularidades de nuestro sector.',
            'isApproved' => true
        ],
        [
            'name' => 'Roberto Fernández',
            'company' => 'Global Retail S.A.',
            'testimonial' => 'El equipo de TuWeb.ai transformó nuestra presencia digital por completo. Su enfoque estratégico y atención al detalle nos ha permitido duplicar nuestras conversiones en apenas tres meses.',
            'isApproved' => true
        ],
        [
            'name' => 'Marcela Díaz',
            'company' => 'HealthTech Innovations',
            'testimonial' => 'Trabajar con este equipo ha sido una experiencia excepcional. Su capacidad para entender las complejidades de nuestro sector y traducirlas en soluciones digitales intuitivas superó todas nuestras expectativas.',
            'isApproved' => true
        ],
        [
            'name' => 'Gabriel Torres',
            'company' => 'Constructora Futuro',
            'testimonial' => 'Buscábamos un equipo que pudiera renovar nuestra imagen y mejorar nuestra presencia online. TuWeb.ai no solo cumplió estos objetivos, sino que implementó estrategias que nos han ayudado a alcanzar nuevos mercados.',
            'isApproved' => true
        ]
    ];
    
    $createdCount = 0;
    $errorCount = 0;
    
    foreach ($testimonials as $testimonial) {
        try {
            $testimonialData = [
                'name' => toFirestoreValue($testimonial['name']),
                'company' => toFirestoreValue($testimonial['company']),
                'testimonial' => toFirestoreValue($testimonial['testimonial']),
                'isApproved' => toFirestoreValue($testimonial['isApproved']),
                'createdAt' => toFirestoreValue(date('c')),
                'updatedAt' => toFirestoreValue(date('c'))
            ];
            
            $result = createFirestoreDocument('testimonials', $testimonialData);
            
            if (isset($result['name'])) {
                $createdCount++;
                echo "✅ Testimonio creado: {$testimonial['name']}\n";
            } else {
                $errorCount++;
                echo "❌ Error al crear testimonio: {$testimonial['name']}\n";
            }
            
        } catch (Exception $e) {
            $errorCount++;
            echo "❌ Error al crear testimonio {$testimonial['name']}: " . $e->getMessage() . "\n";
        }
    }
    
    echo "\n📊 Resumen:\n";
    echo "✅ Testimonios creados exitosamente: $createdCount\n";
    echo "❌ Errores: $errorCount\n";
    echo "🎉 Inicialización completada!\n";
    
} catch (Exception $e) {
    echo "❌ Error durante la inicialización: " . $e->getMessage() . "\n";
    exit(1);
}
?>
