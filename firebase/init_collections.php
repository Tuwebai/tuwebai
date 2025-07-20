<?php
/**
 * Script para inicializar colecciones de Firestore
 * Ejecutar: php firebase/init_collections.php
 */

require_once __DIR__ . '/../api/config/firebase.php';
require_once __DIR__ . '/../api/utils/logger.php';

echo "🔥 Inicializando colecciones de Firestore para el sistema de pagos...\n\n";

try {
    // Inicializar Firebase
    initializeFirebase();
    
    // Crear colección de pagos con documento de ejemplo
    $paymentsCollection = getPaymentsCollection();
    
    echo "📋 Creando colección: $paymentsCollection\n";
    
    // Documento de ejemplo para la colección de pagos
    $examplePayment = [
        'user_email' => toFirestoreValue('ejemplo@email.com'),
        'user_name' => toFirestoreValue('Usuario Ejemplo'),
        'payment_type' => toFirestoreValue('website'),
        'amount' => toFirestoreValue(99900),
        'currency' => toFirestoreValue('ARS'),
        'status' => toFirestoreValue('approved'),
        'mercadopago_id' => toFirestoreValue('mp_ejemplo_123'),
        'mercadopago_status' => toFirestoreValue('approved'),
        'payment_method' => toFirestoreValue('credit_card'),
        'description' => toFirestoreValue('Desarrollo de Sitio Web Profesional'),
        'features' => toFirestoreValue(['Diseño responsive', 'SEO optimizado', 'Panel de administración']),
        'created_at' => toFirestoreValue(date('Y-m-d H:i:s')),
        'updated_at' => toFirestoreValue(date('Y-m-d H:i:s')),
        'paid_at' => toFirestoreValue(date('Y-m-d H:i:s')),
        'invoice_url' => toFirestoreValue('https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=ejemplo')
    ];
    
    $result = createFirestoreDocument($paymentsCollection, $examplePayment);
    
    if (isset($result['name'])) {
        echo "✅ Documento de ejemplo creado: " . basename($result['name']) . "\n";
    } else {
        echo "⚠️ Documento de ejemplo creado (sin ID)\n";
    }
    
    // Crear colección de logs
    $logsCollection = getLogsCollection();
    
    echo "📋 Creando colección: $logsCollection\n";
    
    // Documento de ejemplo para la colección de logs
    $exampleLog = [
        'payment_id' => toFirestoreValue('ejemplo_123'),
        'action' => toFirestoreValue('payment_created'),
        'new_status' => toFirestoreValue('approved'),
        'details' => toFirestoreValue([
            'amount' => 99900,
            'currency' => 'ARS',
            'payment_type' => 'website',
            'mercadopago_id' => 'mp_ejemplo_123'
        ]),
        'ip_address' => toFirestoreValue('127.0.0.1'),
        'user_agent' => toFirestoreValue('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
        'created_at' => toFirestoreValue(date('Y-m-d H:i:s'))
    ];
    
    $result = createFirestoreDocument($logsCollection, $exampleLog);
    
    if (isset($result['name'])) {
        echo "✅ Documento de log de ejemplo creado: " . basename($result['name']) . "\n";
    } else {
        echo "⚠️ Documento de log de ejemplo creado (sin ID)\n";
    }
    
    // Crear índices compuestos (Firestore los crea automáticamente)
    echo "🔍 Los índices se crearán automáticamente en Firestore\n";
    
    // Verificar que las colecciones se crearon correctamente
    echo "\n🔍 Verificando colecciones...\n";
    
    // Verificar colección de pagos
    $paymentsResult = queryFirestoreDocuments($paymentsCollection, []);
    $paymentsCount = isset($paymentsResult['document']) ? count($paymentsResult['document']) : 0;
    echo "📊 Colección $paymentsCollection: $paymentsCount documentos\n";
    
    // Verificar colección de logs
    $logsResult = queryFirestoreDocuments($logsCollection, []);
    $logsCount = isset($logsResult['document']) ? count($logsResult['document']) : 0;
    echo "📊 Colección $logsCollection: $logsCount documentos\n";
    
    echo "\n✅ Inicialización completada exitosamente!\n";
    echo "\n📋 Información importante:\n";
    echo "  - Las colecciones se crean automáticamente al insertar el primer documento\n";
    echo "  - Los índices se crean automáticamente en Firestore\n";
    echo "  - Puedes eliminar los documentos de ejemplo después de la configuración\n";
    echo "  - Las reglas de seguridad deben configurarse en la consola de Firebase\n";
    
    echo "\n🔧 Próximos pasos:\n";
    echo "  1. Configura las reglas de seguridad en Firebase Console\n";
    echo "  2. Configura el webhook en Mercado Pago\n";
    echo "  3. Prueba los endpoints con el script de pruebas\n";
    
} catch (Exception $e) {
    echo "❌ Error durante la inicialización: " . $e->getMessage() . "\n";
    echo "📋 Verifica:\n";
    echo "  - Configuración de Firebase en .env\n";
    echo "  - Credenciales de servicio (firebase-service-account.json)\n";
    echo "  - Permisos de Firestore\n";
    exit(1);
}

echo "\n🎉 ¡Sistema de pagos con Firebase listo!\n";
?> 