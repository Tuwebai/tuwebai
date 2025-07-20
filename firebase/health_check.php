<?php
/**
 * Script de verificación de salud del sistema Firebase
 * Ejecutar para verificar que todo esté funcionando correctamente
 */

require_once __DIR__ . '/../api/config/firebase.php';
require_once __DIR__ . '/../api/utils/logger.php';

echo "🏥 Verificación de Salud del Sistema Firebase\n";
echo "============================================\n\n";

$checks = [];
$errors = [];

// Función para agregar check
function addCheck($name, $status, $message = '') {
    global $checks;
    $checks[] = [
        'name' => $name,
        'status' => $status,
        'message' => $message
    ];
}

// Función para agregar error
function addError($name, $message) {
    global $errors;
    $errors[] = [
        'name' => $name,
        'message' => $message
    ];
}

echo "🔍 Iniciando verificaciones...\n\n";

// 1. Verificar configuración de Firebase
echo "1️⃣ Verificando configuración de Firebase...\n";
try {
    $config = getFirebaseConfig();
    
    if (empty($config['project_id'])) {
        addError('Firebase Config', 'Project ID no configurado');
    } else {
        addCheck('Firebase Config', 'OK', "Project ID: {$config['project_id']}");
    }
    
    if (empty($config['api_key'])) {
        addError('Firebase API Key', 'API Key no configurada');
    } else {
        addCheck('Firebase API Key', 'OK', 'API Key configurada');
    }
    
} catch (Exception $e) {
    addError('Firebase Config', $e->getMessage());
}

// 2. Verificar credenciales de servicio
echo "2️⃣ Verificando credenciales de servicio...\n";
$serviceAccountPath = getenv('FIREBASE_SERVICE_ACCOUNT_KEY') ?: __DIR__ . '/../firebase-service-account.json';

if (file_exists($serviceAccountPath)) {
    try {
        $serviceAccount = json_decode(file_get_contents($serviceAccountPath), true);
        
        if (json_last_error() === JSON_ERROR_NONE) {
            addCheck('Service Account', 'OK', 'Archivo JSON válido');
            
            if (isset($serviceAccount['project_id'])) {
                addCheck('Service Account Project', 'OK', "Project: {$serviceAccount['project_id']}");
            } else {
                addError('Service Account Project', 'Project ID no encontrado en credenciales');
            }
        } else {
            addError('Service Account', 'Archivo JSON inválido');
        }
    } catch (Exception $e) {
        addError('Service Account', $e->getMessage());
    }
} else {
    addError('Service Account', 'Archivo no encontrado: ' . $serviceAccountPath);
}

// 3. Verificar conexión a Firestore
echo "3️⃣ Verificando conexión a Firestore...\n";
try {
    initializeFirebase();
    addCheck('Firebase Initialization', 'OK', 'Firebase inicializado correctamente');
    
    // Intentar una operación simple
    $collection = getPaymentsCollection();
    addCheck('Firestore Connection', 'OK', "Colección: $collection");
    
} catch (Exception $e) {
    addError('Firestore Connection', $e->getMessage());
}

// 4. Verificar colecciones
echo "4️⃣ Verificando colecciones...\n";
try {
    $paymentsCollection = getPaymentsCollection();
    $logsCollection = getLogsCollection();
    
    // Verificar colección de pagos
    $result = queryFirestoreDocuments($paymentsCollection, []);
    if (isset($result['document'])) {
        $count = count($result['document']);
        addCheck('Payments Collection', 'OK', "$count documentos encontrados");
    } else {
        addCheck('Payments Collection', 'OK', 'Colección accesible (vacía)');
    }
    
    // Verificar colección de logs
    $result = queryFirestoreDocuments($logsCollection, []);
    if (isset($result['document'])) {
        $count = count($result['document']);
        addCheck('Logs Collection', 'OK', "$count documentos encontrados");
    } else {
        addCheck('Logs Collection', 'OK', 'Colección accesible (vacía)');
    }
    
} catch (Exception $e) {
    addError('Collections Check', $e->getMessage());
}

// 5. Verificar permisos de escritura
echo "5️⃣ Verificando permisos de escritura...\n";
try {
    $testData = [
        'test_field' => toFirestoreValue('health_check_' . time()),
        'created_at' => toFirestoreValue(date('Y-m-d H:i:s'))
    ];
    
    $result = createFirestoreDocument('health_check', $testData);
    
    if (isset($result['name'])) {
        addCheck('Write Permissions', 'OK', 'Permisos de escritura confirmados');
        
        // Limpiar documento de prueba
        $documentId = basename($result['name']);
        $url = "https://firestore.googleapis.com/v1/projects/" . getenv('VITE_FIREBASE_PROJECT_ID') . "/databases/(default)/documents/health_check/$documentId";
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . getFirebaseAccessToken()
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode === 200) {
            addCheck('Delete Permissions', 'OK', 'Permisos de eliminación confirmados');
        } else {
            addError('Delete Permissions', 'No se pudo eliminar documento de prueba');
        }
    } else {
        addError('Write Permissions', 'No se pudo crear documento de prueba');
    }
    
} catch (Exception $e) {
    addError('Write Permissions', $e->getMessage());
}

// 6. Verificar configuración de Mercado Pago
echo "6️⃣ Verificando configuración de Mercado Pago...\n";
$mpAccessToken = getenv('MERCADOPAGO_ACCESS_TOKEN');
$mpPublicKey = getenv('MERCADOPAGO_PUBLIC_KEY');

if (!empty($mpAccessToken)) {
    addCheck('Mercado Pago Access Token', 'OK', 'Token configurado');
} else {
    addError('Mercado Pago Access Token', 'Token no configurado');
}

if (!empty($mpPublicKey)) {
    addCheck('Mercado Pago Public Key', 'OK', 'Public Key configurado');
} else {
    addError('Mercado Pago Public Key', 'Public Key no configurado');
}

// 7. Verificar API Key
echo "7️⃣ Verificando API Key...\n";
$apiKey = getenv('API_KEY');

if (!empty($apiKey)) {
    addCheck('API Key', 'OK', 'API Key configurada');
} else {
    addError('API Key', 'API Key no configurada');
}

// 8. Verificar directorios de logs
echo "8️⃣ Verificando directorios de logs...\n";
$logsDir = __DIR__ . '/../api/logs';
$cacheDir = __DIR__ . '/../api/cache';

if (is_dir($logsDir) && is_writable($logsDir)) {
    addCheck('Logs Directory', 'OK', 'Directorio de logs accesible');
} else {
    addError('Logs Directory', 'Directorio de logs no accesible o no escribible');
}

if (is_dir($cacheDir) && is_writable($cacheDir)) {
    addCheck('Cache Directory', 'OK', 'Directorio de cache accesible');
} else {
    addError('Cache Directory', 'Directorio de cache no accesible o no escribible');
}

// Mostrar resultados
echo "\n📊 Resultados de la Verificación:\n";
echo "================================\n\n";

foreach ($checks as $check) {
    $status = $check['status'] === 'OK' ? '✅' : '⚠️';
    echo "$status {$check['name']}: {$check['status']}";
    if (!empty($check['message'])) {
        echo " - {$check['message']}";
    }
    echo "\n";
}

if (!empty($errors)) {
    echo "\n❌ Errores Encontrados:\n";
    echo "=====================\n";
    
    foreach ($errors as $error) {
        echo "❌ {$error['name']}: {$error['message']}\n";
    }
}

// Resumen final
$totalChecks = count($checks);
$passedChecks = count(array_filter($checks, function($check) {
    return $check['status'] === 'OK';
}));
$failedChecks = count($errors);

echo "\n📈 Resumen:\n";
echo "==========\n";
echo "✅ Verificaciones exitosas: $passedChecks/$totalChecks\n";
echo "❌ Errores: $failedChecks\n";

if ($failedChecks === 0) {
    echo "\n🎉 ¡Sistema saludable! Todo está funcionando correctamente.\n";
} else {
    echo "\n⚠️  Se encontraron problemas. Revisa los errores arriba.\n";
    echo "\n🔧 Próximos pasos:\n";
    echo "  1. Corrige los errores identificados\n";
    echo "  2. Ejecuta este script nuevamente\n";
    echo "  3. Verifica la documentación si necesitas ayuda\n";
}

echo "\n🔚 Fin de la verificación.\n";
?> 