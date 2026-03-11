<?php
/**
 * Configuración de Mercado Pago
 */

// Cargar variables de entorno si no están cargadas
if (!function_exists('getenv') || !getenv('MERCADOPAGO_ACCESS_TOKEN')) {
    $envFile = __DIR__ . '/../../.env';
    if (file_exists($envFile)) {
        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
                list($key, $value) = explode('=', $line, 2);
                $_ENV[trim($key)] = trim($value);
                putenv(trim($key) . '=' . trim($value));
            }
        }
    }
}

/**
 * Obtener configuración de Mercado Pago
 */
function getMercadoPagoConfig() {
    return [
        'access_token' => getenv('MERCADOPAGO_ACCESS_TOKEN'),
        'public_key' => getenv('MERCADOPAGO_PUBLIC_KEY'),
        'webhook_secret' => getenv('MERCADOPAGO_WEBHOOK_SECRET'),
        'environment' => getenv('MERCADOPAGO_ENVIRONMENT') ?: 'production'
    ];
}

/**
 * Validar webhook de Mercado Pago
 */
function validateMercadoPagoWebhook($data, $headers) {
    $config = getMercadoPagoConfig();
    
    // Verificar que sea un webhook válido
    if (!isset($data['type']) || !isset($data['data']['id'])) {
        return false;
    }
    
    // Verificar tipo de notificación
    $validTypes = ['payment', 'subscription', 'invoice'];
    if (!in_array($data['type'], $validTypes)) {
        return false;
    }
    
    // Si hay webhook secret configurado, validar firma
    if ($config['webhook_secret']) {
        $signature = $headers['X-Signature'] ?? null;
        if ($signature) {
            $expectedSignature = hash_hmac('sha256', json_encode($data), $config['webhook_secret']);
            if (!hash_equals($expectedSignature, $signature)) {
                return false;
            }
        }
    }
    
    return true;
}

/**
 * Obtener información de pago desde Mercado Pago
 */
function getMercadoPagoPayment($paymentId) {
    $config = getMercadoPagoConfig();
    
    if (!$config['access_token']) {
        throw new Exception('Token de acceso de Mercado Pago no configurado');
    }
    
    $url = "https://api.mercadopago.com/v1/payments/{$paymentId}";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $config['access_token'],
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        throw new Exception('Error de cURL: ' . $error);
    }
    
    if ($httpCode !== 200) {
        throw new Exception('Error HTTP: ' . $httpCode . ' - ' . $response);
    }
    
    $data = json_decode($response, true);
    
    if (!$data || isset($data['error'])) {
        throw new Exception('Error en respuesta de Mercado Pago: ' . ($data['error']['message'] ?? 'unknown'));
    }
    
    return $data;
}

/**
 * Crear preferencia de pago en Mercado Pago
 */
function createMercadoPagoPreference($preferenceData) {
    $config = getMercadoPagoConfig();
    
    if (!$config['access_token']) {
        throw new Exception('Token de acceso de Mercado Pago no configurado');
    }
    
    $url = 'https://api.mercadopago.com/checkout/preferences';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($preferenceData));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $config['access_token'],
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        throw new Exception('Error de cURL: ' . $error);
    }
    
    if ($httpCode !== 201) {
        throw new Exception('Error HTTP: ' . $httpCode . ' - ' . $response);
    }
    
    $data = json_decode($response, true);
    
    if (!$data || isset($data['error'])) {
        throw new Exception('Error en respuesta de Mercado Pago: ' . ($data['error']['message'] ?? 'unknown'));
    }
    
    return $data;
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
 * Obtener información del pagador
 */
function extractPayerInfo($payment) {
    $payer = $payment['payer'] ?? [];
    
    return [
        'email' => $payer['email'] ?? '',
        'name' => $payer['name'] ?? '',
        'surname' => $payer['surname'] ?? '',
        'full_name' => trim(($payer['name'] ?? '') . ' ' . ($payer['surname'] ?? '')),
        'identification' => $payer['identification'] ?? null
    ];
}

/**
 * Obtener información del método de pago
 */
function extractPaymentMethodInfo($payment) {
    $paymentMethod = $payment['payment_method'] ?? [];
    
    return [
        'type' => $paymentMethod['type'] ?? 'unknown',
        'id' => $paymentMethod['id'] ?? '',
        'installments' => $payment['installments'] ?? 1,
        'installment_amount' => $payment['installment_amount'] ?? null
    ];
}

/**
 * Obtener información de la transacción
 */
function extractTransactionInfo($payment) {
    return [
        'amount' => $payment['transaction_amount'] ?? 0,
        'currency' => $payment['currency_id'] ?? 'ARS',
        'fee' => $payment['fee'] ?? 0,
        'net_amount' => $payment['net_amount'] ?? 0,
        'external_reference' => $payment['external_reference'] ?? null,
        'description' => $payment['description'] ?? '',
        'metadata' => $payment['metadata'] ?? []
    ];
}

/**
 * Generar URL de factura
 */
function generateInvoiceUrl($payment) {
    $externalRef = $payment['external_reference'] ?? null;
    
    if ($externalRef) {
        return "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id={$externalRef}";
    }
    
    return null;
}

/**
 * Verificar si el pago está aprobado
 */
function isPaymentApproved($payment) {
    return ($payment['status'] ?? '') === 'approved';
}

/**
 * Verificar si el pago está pendiente
 */
function isPaymentPending($payment) {
    $pendingStatuses = ['pending', 'authorized', 'in_process', 'in_mediation'];
    return in_array($payment['status'] ?? '', $pendingStatuses);
}

/**
 * Verificar si el pago fue rechazado
 */
function isPaymentRejected($payment) {
    $rejectedStatuses = ['rejected', 'cancelled', 'refunded', 'charged_back'];
    return in_array($payment['status'] ?? '', $rejectedStatuses);
}
?> 