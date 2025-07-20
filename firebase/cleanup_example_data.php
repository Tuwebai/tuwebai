<?php
/**
 * Script para limpiar datos de ejemplo de Firestore
 * Ejecutar después de completar la configuración inicial
 */

require_once __DIR__ . '/../api/config/firebase.php';
require_once __DIR__ . '/../api/utils/logger.php';

echo "🧹 Limpiando datos de ejemplo de Firestore\n";
echo "=========================================\n\n";

try {
    // Inicializar Firebase
    initializeFirebase();
    
    echo "⚠️  ADVERTENCIA: Este script eliminará los datos de ejemplo.\n";
    echo "   Solo ejecuta esto después de completar la configuración.\n\n";
    
    $continue = readline("¿Quieres continuar con la limpieza? (yes/no): ");
    
    if (strtolower($continue) !== 'yes') {
        echo "❌ Limpieza cancelada.\n";
        exit(0);
    }
    
    // Limpiar datos de ejemplo de pagos
    echo "📋 Limpiando datos de ejemplo de pagos...\n";
    
    $paymentsCollection = getPaymentsCollection();
    $filters = ['user_email' => 'ejemplo@email.com'];
    
    $result = queryFirestoreDocuments($paymentsCollection, $filters);
    $deletedPayments = 0;
    
    if (isset($result['document'])) {
        foreach ($result['document'] as $doc) {
            if (isset($doc['document']['name'])) {
                $documentId = basename($doc['document']['name']);
                
                // Eliminar documento
                $url = "https://firestore.googleapis.com/v1/projects/" . getenv('VITE_FIREBASE_PROJECT_ID') . "/databases/(default)/documents/$paymentsCollection/$documentId";
                
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
                    echo "✅ Pago de ejemplo eliminado: $documentId\n";
                    $deletedPayments++;
                } else {
                    echo "❌ Error eliminando pago: $documentId\n";
                }
            }
        }
    }
    
    // Limpiar datos de ejemplo de logs
    echo "\n📋 Limpiando datos de ejemplo de logs...\n";
    
    $logsCollection = getLogsCollection();
    $filters = ['payment_id' => 'ejemplo_123'];
    
    $result = queryFirestoreDocuments($logsCollection, $filters);
    $deletedLogs = 0;
    
    if (isset($result['document'])) {
        foreach ($result['document'] as $doc) {
            if (isset($doc['document']['name'])) {
                $documentId = basename($doc['document']['name']);
                
                // Eliminar documento
                $url = "https://firestore.googleapis.com/v1/projects/" . getenv('VITE_FIREBASE_PROJECT_ID') . "/databases/(default)/documents/$logsCollection/$documentId";
                
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
                    echo "✅ Log de ejemplo eliminado: $documentId\n";
                    $deletedLogs++;
                } else {
                    echo "❌ Error eliminando log: $documentId\n";
                }
            }
        }
    }
    
    echo "\n📊 Resumen de limpieza:\n";
    echo "  🗑️  Pagos eliminados: $deletedPayments\n";
    echo "  🗑️  Logs eliminados: $deletedLogs\n";
    
    if ($deletedPayments > 0 || $deletedLogs > 0) {
        echo "\n✅ Limpieza completada exitosamente!\n";
        echo "\n📋 El sistema está listo para producción.\n";
        echo "   Los datos de ejemplo han sido eliminados.\n";
    } else {
        echo "\nℹ️  No se encontraron datos de ejemplo para eliminar.\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error durante la limpieza: " . $e->getMessage() . "\n";
    echo "\n📋 Verifica:\n";
    echo "  - Configuración de Firebase\n";
    echo "  - Permisos de escritura en Firestore\n";
    echo "  - Credenciales de servicio\n";
    exit(1);
}

echo "\n🔚 Fin de la limpieza.\n";
?> 