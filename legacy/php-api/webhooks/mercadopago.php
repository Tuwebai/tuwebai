<?php
/**
 * Webhook de Mercado Pago
 * POST /api/webhooks/mercadopago.php
 */

// Configuración de CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Cargar configuración
require_once __DIR__ . '/../config/firebase.php';
require_once __DIR__ . '/../config/mercadopago.php';
require_once __DIR__ . '/../utils/logger.php';

// Inicializar logger
$logger = new Logger('mercadopago_webhook');

try {
    // Validar método HTTP
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido', 405);
    }

    // Obtener datos del webhook
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!$data) {
        throw new Exception('Datos JSON inválidos', 400);
    }

    // Log del webhook recibido
    $logger->info('Webhook recibido', [
        'type' => $data['type'] ?? 'unknown',
        'data_id' => $data['data']['id'] ?? 'unknown',
        'ip' => $_SERVER['REMOTE_ADDR']
    ]);

    // Validar que sea una notificación de pago
    if (!isset($data['type']) || $data['type'] !== 'payment') {
        throw new Exception('Tipo de notificación no soportado', 400);
    }

    if (!isset($data['data']['id'])) {
        throw new Exception('ID de pago no encontrado', 400);
    }

    $paymentId = $data['data']['id'];

    // Validar webhook con Mercado Pago
    $mpConfig = getMercadoPagoConfig();
    $mp = new MercadoPago\SDK($mpConfig['access_token']);

    // Obtener información del pago desde Mercado Pago
    $payment = $mp->get("/v1/payments/{$paymentId}");
    
    if (!$payment || isset($payment['error'])) {
        $logger->error('Error al obtener pago de MP', [
            'payment_id' => $paymentId,
            'error' => $payment['error'] ?? 'unknown'
        ]);
        throw new Exception('Error al validar pago con Mercado Pago', 400);
    }

    // Verificar si el pago ya existe en Firestore
    $collection = getPaymentsCollection();
    $filters = ['mercadopago_id' => $paymentId];
    
    $result = queryFirestoreDocuments($collection, $filters);
    $existingPayment = null;
    
    if (isset($result['document']) && !empty($result['document'])) {
        $existingPayment = $result['document'][0];
    }

    // Preparar datos del pago
    $paymentData = [
        'mercadopago_id' => $paymentId,
        'mercadopago_status' => $payment['status'],
        'amount' => $payment['transaction_amount'] * 100, // Convertir a centavos
        'currency' => $payment['currency_id'],
        'payment_method' => $payment['payment_method']['type'] ?? 'unknown',
        'status' => mapMercadoPagoStatus($payment['status']),
        'paid_at' => $payment['status'] === 'approved' ? date('Y-m-d H:i:s') : null,
        'updated_at' => date('Y-m-d H:i:s')
    ];

    // Extraer información del usuario si está disponible
    if (isset($payment['payer']['email'])) {
        $paymentData['user_email'] = $payment['payer']['email'];
        $paymentData['user_name'] = $payment['payer']['name'] ?? '';
    }

    // Extraer descripción y features del pago
    if (isset($payment['description'])) {
        $paymentData['description'] = $payment['description'];
    }

    // Extraer features del pago (si están en metadata)
    if (isset($payment['metadata']['features'])) {
        $paymentData['features'] = $payment['metadata']['features'];
    }

    // URL de factura si está disponible
    if (isset($payment['external_reference'])) {
        $paymentData['invoice_url'] = "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id={$payment['external_reference']}";
    }

    // Convertir datos a formato Firestore
    $firestoreData = [];
    foreach ($paymentData as $key => $value) {
        $firestoreData[$key] = toFirestoreValue($value);
    }
    
    if ($existingPayment) {
        // Actualizar pago existente
        $documentId = basename($existingPayment['document']['name']);
        updateFirestoreDocument($collection, $documentId, $firestoreData);
        
        $logger->info('Pago actualizado', [
            'payment_id' => $paymentId,
            'status' => $payment['status']
        ]);
    } else {
        // Insertar nuevo pago
        $firestoreData['created_at'] = toFirestoreValue(date('Y-m-d H:i:s'));
        $firestoreData['payment_type'] = toFirestoreValue('website');
        $firestoreData['features'] = toFirestoreValue($paymentData['features'] ?? []);
        
        createFirestoreDocument($collection, $firestoreData);
        
        $logger->info('Nuevo pago registrado', [
            'payment_id' => $paymentId,
            'status' => $payment['status']
        ]);
    }

    // Notificar al dashboard si el pago fue aprobado
    if ($payment['status'] === 'approved') {
        notifyDashboard($paymentData['user_email'], $paymentId);
    }

    // Respuesta exitosa
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Webhook procesado correctamente',
        'payment_id' => $paymentId,
        'status' => $payment['status'],
        'timestamp' => date('c')
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    $logger->error('Error en webhook de Mercado Pago', [
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

/**
 * Mapear estado de Mercado Pago a estado interno
 */
function mapMercadoPagoStatus($mpStatus) {
    $statusMap = [
        'pending' => 'pending',
        'approved' => 'approved',
        'authorized' => 'pending',
        'in_process' => 'pending',
        'in_mediation' => 'pending',
        'rejected' => 'rejected',
        'cancelled' => 'cancelled',
        'refunded' => 'cancelled',
        'charged_back' => 'rejected'
    ];
    
    return $statusMap[$mpStatus] ?? 'pending';
}

/**
 * Notificar al dashboard sobre el pago
 */
function notifyDashboard($userEmail, $paymentId) {
    $dashboardUrl = getenv('DASHBOARD_URL') . '/api/payments/notification';
    $apiKey = getenv('API_KEY');
    
    $data = [
        'user_email' => $userEmail,
        'payment_id' => $paymentId,
        'timestamp' => date('c')
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $dashboardUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $apiKey
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) {
        $logger = new Logger('dashboard_notification');
        $logger->error('Error al notificar dashboard', [
            'http_code' => $httpCode,
            'response' => $response
        ]);
    }
}
?> 