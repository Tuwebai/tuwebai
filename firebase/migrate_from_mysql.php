<?php
/**
 * Script para migrar datos de MySQL a Firebase/Firestore
 * Solo usar si tienes datos existentes en MySQL que quieres migrar
 */

require_once __DIR__ . '/../api/config/firebase.php';
require_once __DIR__ . '/../api/utils/logger.php';

echo "🔄 Script de migración de MySQL a Firebase/Firestore\n";
echo "==================================================\n\n";

// Configuración de MySQL (solo para migración)
$mysqlConfig = [
    'host' => getenv('DB_HOST') ?: 'localhost',
    'port' => getenv('DB_PORT') ?: '3306',
    'database' => getenv('DB_NAME') ?: 'tuwebai_payments',
    'username' => getenv('DB_USER') ?: 'root',
    'password' => getenv('DB_PASS') ?: ''
];

echo "📋 Configuración de MySQL:\n";
echo "  Host: {$mysqlConfig['host']}\n";
echo "  Database: {$mysqlConfig['database']}\n";
echo "  Username: {$mysqlConfig['username']}\n\n";

// Verificar si queremos proceder
echo "⚠️  ADVERTENCIA: Este script migrará datos de MySQL a Firebase.\n";
echo "   Asegúrate de tener un backup antes de continuar.\n\n";

$continue = readline("¿Quieres continuar con la migración? (yes/no): ");

if (strtolower($continue) !== 'yes') {
    echo "❌ Migración cancelada.\n";
    exit(0);
}

try {
    // Conectar a MySQL
    echo "🔌 Conectando a MySQL...\n";
    
    $dsn = "mysql:host={$mysqlConfig['host']};port={$mysqlConfig['port']};dbname={$mysqlConfig['database']};charset=utf8mb4";
    $pdo = new PDO($dsn, $mysqlConfig['username'], $mysqlConfig['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);
    
    echo "✅ Conexión a MySQL establecida\n\n";
    
    // Verificar si existe la tabla payments
    $stmt = $pdo->query("SHOW TABLES LIKE 'payments'");
    if ($stmt->rowCount() === 0) {
        echo "❌ No se encontró la tabla 'payments' en MySQL.\n";
        echo "   No hay datos para migrar.\n";
        exit(0);
    }
    
    // Obtener datos de pagos
    echo "📊 Obteniendo datos de pagos...\n";
    
    $stmt = $pdo->query("SELECT * FROM payments ORDER BY created_at DESC");
    $payments = $stmt->fetchAll();
    
    echo "✅ Se encontraron " . count($payments) . " pagos para migrar\n\n";
    
    if (empty($payments)) {
        echo "ℹ️  No hay pagos para migrar.\n";
        exit(0);
    }
    
    // Inicializar Firebase
    echo "🔥 Inicializando Firebase...\n";
    initializeFirebase();
    $collection = getPaymentsCollection();
    
    echo "✅ Firebase inicializado\n\n";
    
    // Migrar cada pago
    $migrated = 0;
    $errors = 0;
    
    foreach ($payments as $payment) {
        try {
            echo "🔄 Migrando pago ID: {$payment['id']}...\n";
            
            // Convertir datos a formato Firestore
            $firestoreData = [];
            
            // Mapear campos
            $fieldMapping = [
                'id' => 'mysql_id',
                'user_email' => 'user_email',
                'user_name' => 'user_name',
                'payment_type' => 'payment_type',
                'amount' => 'amount',
                'currency' => 'currency',
                'status' => 'status',
                'mercadopago_id' => 'mercadopago_id',
                'mercadopago_status' => 'mercadopago_status',
                'payment_method' => 'payment_method',
                'description' => 'description',
                'features' => 'features',
                'created_at' => 'created_at',
                'updated_at' => 'updated_at',
                'paid_at' => 'paid_at',
                'invoice_url' => 'invoice_url'
            ];
            
            foreach ($fieldMapping as $mysqlField => $firestoreField) {
                if (isset($payment[$mysqlField])) {
                    $value = $payment[$mysqlField];
                    
                    // Procesar campos especiales
                    if ($mysqlField === 'features' && is_string($value)) {
                        $value = json_decode($value, true) ?: [];
                    }
                    
                    if ($mysqlField === 'amount') {
                        $value = (int) $value;
                    }
                    
                    $firestoreData[$firestoreField] = toFirestoreValue($value);
                }
            }
            
            // Agregar metadatos de migración
            $firestoreData['migrated_from_mysql'] = toFirestoreValue(true);
            $firestoreData['migration_date'] = toFirestoreValue(date('Y-m-d H:i:s'));
            $firestoreData['original_mysql_id'] = toFirestoreValue($payment['id']);
            
            // Crear documento en Firestore
            $result = createFirestoreDocument($collection, $firestoreData);
            
            if (isset($result['name'])) {
                echo "✅ Pago migrado: " . basename($result['name']) . "\n";
                $migrated++;
            } else {
                echo "⚠️  Pago migrado (sin ID)\n";
                $migrated++;
            }
            
        } catch (Exception $e) {
            echo "❌ Error migrando pago {$payment['id']}: " . $e->getMessage() . "\n";
            $errors++;
        }
    }
    
    echo "\n📊 Resumen de migración:\n";
    echo "  ✅ Pagos migrados: $migrated\n";
    echo "  ❌ Errores: $errors\n";
    echo "  📊 Total procesados: " . count($payments) . "\n\n";
    
    if ($errors === 0) {
        echo "🎉 ¡Migración completada exitosamente!\n";
        echo "\n📋 Próximos pasos:\n";
        echo "  1. Verifica los datos en Firebase Console\n";
        echo "  2. Actualiza las reglas de seguridad si es necesario\n";
        echo "  3. Prueba los endpoints con los datos migrados\n";
        echo "  4. Una vez verificado, puedes eliminar la tabla MySQL\n";
    } else {
        echo "⚠️  Migración completada con errores.\n";
        echo "   Revisa los errores arriba y considera reejecutar el script.\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error durante la migración: " . $e->getMessage() . "\n";
    echo "\n📋 Verifica:\n";
    echo "  - Configuración de MySQL\n";
    echo "  - Configuración de Firebase\n";
    echo "  - Permisos de acceso\n";
    exit(1);
}

echo "\n🔚 Fin de la migración.\n";
?> 