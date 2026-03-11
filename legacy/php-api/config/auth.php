<?php
/**
 * Configuración de autenticación y autorización
 */

// Cargar variables de entorno si no están cargadas
if (!function_exists('getenv') || !getenv('API_KEY')) {
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
 * Validar API Key
 */
function validateApiKey($apiKey) {
    $validKey = getenv('API_KEY');
    
    if (!$validKey) {
        error_log('API_KEY no configurada en variables de entorno');
        return false;
    }
    
    return hash_equals($validKey, $apiKey);
}

/**
 * Obtener API Key del header Authorization
 */
function getApiKeyFromHeaders() {
    $headers = getallheaders();
    
    if (isset($headers['Authorization'])) {
        $auth = $headers['Authorization'];
        if (strpos($auth, 'Bearer ') === 0) {
            return substr($auth, 7);
        }
    }
    
    return null;
}

/**
 * Validar autenticación para endpoints protegidos
 */
function requireApiKey() {
    $apiKey = getApiKeyFromHeaders();
    
    if (!$apiKey || !validateApiKey($apiKey)) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'No autorizado',
            'message' => 'API Key inválida o faltante'
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }
}

/**
 * Validar origen de la petición (CORS)
 */
function validateOrigin($allowedOrigins = []) {
    if (empty($allowedOrigins)) {
        $allowedOrigins = [
            'https://dashboard.tuweb-ai.com',
            'https://tuweb-ai.com',
            'http://localhost:3000',
            'http://localhost:5173'
        ];
    }
    
    $origin = $_SERVER['HTTP_ORIGIN'] ?? null;
    
    if ($origin && !in_array($origin, $allowedOrigins)) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'error' => 'Origen no permitido',
            'message' => 'El origen de la petición no está autorizado'
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }
}

/**
 * Generar token de sesión para el dashboard
 */
function generateDashboardToken($userEmail, $userName = '') {
    $payload = [
        'email' => $userEmail,
        'name' => $userName,
        'iat' => time(),
        'exp' => time() + (60 * 60 * 24), // 24 horas
        'iss' => 'tuweb-ai.com'
    ];
    
    $secret = getenv('SESSION_SECRET') ?: 'tuwebai-super-secret-key';
    
    // Codificar payload en base64
    $payloadEncoded = base64_encode(json_encode($payload));
    
    // Generar firma
    $signature = hash_hmac('sha256', $payloadEncoded, $secret);
    
    // Combinar payload y firma
    return $payloadEncoded . '.' . $signature;
}

/**
 * Validar token del dashboard
 */
function validateDashboardToken($token) {
    $parts = explode('.', $token);
    
    if (count($parts) !== 2) {
        return false;
    }
    
    list($payloadEncoded, $signature) = $parts;
    
    $secret = getenv('SESSION_SECRET') ?: 'tuwebai-super-secret-key';
    $expectedSignature = hash_hmac('sha256', $payloadEncoded, $secret);
    
    if (!hash_equals($expectedSignature, $signature)) {
        return false;
    }
    
    $payload = json_decode(base64_decode($payloadEncoded), true);
    
    if (!$payload || !isset($payload['exp']) || $payload['exp'] < time()) {
        return false;
    }
    
    return $payload;
}

/**
 * Rate limiting básico por IP
 */
function checkRateLimit($key, $maxRequests = 100, $window = 3600) {
    $cacheDir = __DIR__ . '/../cache/';
    if (!is_dir($cacheDir)) {
        mkdir($cacheDir, 0755, true);
    }
    
    $cacheFile = $cacheDir . 'rate_limit_' . md5($key) . '.txt';
    
    $now = time();
    $requests = [];
    
    if (file_exists($cacheFile)) {
        $data = file_get_contents($cacheFile);
        $requests = json_decode($data, true) ?: [];
        
        // Limpiar requests antiguos
        $requests = array_filter($requests, function($timestamp) use ($now, $window) {
            return $timestamp > ($now - $window);
        });
    }
    
    // Agregar request actual
    $requests[] = $now;
    
    // Verificar límite
    if (count($requests) > $maxRequests) {
        return false;
    }
    
    // Guardar requests
    file_put_contents($cacheFile, json_encode($requests));
    
    return true;
}

/**
 * Aplicar rate limiting
 */
function applyRateLimit($identifier = null) {
    if (!$identifier) {
        $identifier = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    }
    
    if (!checkRateLimit($identifier, 100, 3600)) {
        http_response_code(429);
        echo json_encode([
            'success' => false,
            'error' => 'Demasiadas peticiones',
            'message' => 'Has excedido el límite de peticiones. Intenta de nuevo más tarde.'
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }
}

/**
 * Sanitizar input
 */
function sanitizeInput($input) {
    if (is_array($input)) {
        return array_map('sanitizeInput', $input);
    }
    
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

/**
 * Validar email
 */
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Log de auditoría de autenticación
 */
function logAuthEvent($event, $details = []) {
    $logFile = __DIR__ . '/../logs/auth.log';
    $logDir = dirname($logFile);
    
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }
    
    $logEntry = [
        'timestamp' => date('c'),
        'event' => $event,
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
        'details' => $details
    ];
    
    file_put_contents($logFile, json_encode($logEntry) . "\n", FILE_APPEND | LOCK_EX);
}
?> 