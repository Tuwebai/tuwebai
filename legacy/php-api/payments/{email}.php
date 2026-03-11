<?php
/**
 * Endpoint para sincronizar pagos por email
 * GET /api/payments/{email}.php
 */

// Configuración de CORS
header('Access-Control-Allow-Origin: https://dashboard.tuweb-ai.com');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Cargar configuración
require_once __DIR__ . '/../config/firebase.php';
require_once __DIR__ . '/../config/auth.php';
require_once __DIR__ . '/../utils/logger.php';

// Inicializar logger
$logger = new Logger('payments_sync');

try {
    // Validar método HTTP
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        throw new Exception('Método no permitido', 405);
    }

    // Validar API Key
    $headers = getallheaders();
    $apiKey = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;
    
    if (!$apiKey || $apiKey !== getenv('API_KEY')) {
        $logger->error('API Key inválida', ['ip' => $_SERVER['REMOTE_ADDR']]);
        throw new Exception('No autorizado', 401);
    }

    // Obtener email de la URL
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $pathParts = explode('/', trim($path, '/'));
    $email = end($pathParts);

    // Validar email
    if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Email inválido', 400);
    }

    // Sanitizar email
    $email = filter_var($email, FILTER_SANITIZE_EMAIL);

    // Consultar pagos del usuario en Firestore
    $collection = getPaymentsCollection();
    $filters = ['user_email' => $email];
    
    $result = queryFirestoreDocuments($collection, $filters);
    $payments = [];
    
    if (isset($result['document'])) {
        foreach ($result['document'] as $doc) {
            $payment = [];
            if (isset($doc['document']['fields'])) {
                foreach ($doc['document']['fields'] as $field => $value) {
                    $payment[$field] = fromFirestoreValue($value);
                }
            }
            if (isset($doc['document']['name'])) {
                $payment['id'] = basename($doc['document']['name']);
            }
            $payments[] = $payment;
        }
    }

    // Procesar features JSON
    foreach ($payments as &$payment) {
        if ($payment['features']) {
            $payment['features'] = json_decode($payment['features'], true) ?: [];
        } else {
            $payment['features'] = [];
        }
        
        // Formatear fechas
        $payment['created_at'] = date('c', strtotime($payment['created_at']));
        $payment['updated_at'] = date('c', strtotime($payment['updated_at']));
        if ($payment['paid_at']) {
            $payment['paid_at'] = date('c', strtotime($payment['paid_at']));
        }
    }

    // Log de auditoría
    $logger->info('Consulta de pagos exitosa', [
        'email' => $email,
        'count' => count($payments),
        'ip' => $_SERVER['REMOTE_ADDR']
    ]);

    // Respuesta exitosa
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'payments' => $payments,
        'total' => count($payments),
        'timestamp' => date('c')
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    $logger->error('Error en endpoint de pagos', [
        'error' => $e->getMessage(),
        'code' => $e->getCode(),
        'ip' => $_SERVER['REMOTE_ADDR']
    ]);

    http_response_code($e->getCode() ?: 500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'timestamp' => date('c')
    ], JSON_UNESCAPED_UNICODE);
}
?> 