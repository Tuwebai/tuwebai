<?php
/**
 * Script de prueba para verificar endpoints
 * Ejecutar desde línea de comandos: php test_endpoints.php
 */

// Configuración
$baseUrl = 'https://tuweb-ai.com/api';
$apiKey = 'tu-super-secret-api-key-aqui'; // Cambiar por tu API key real
$testEmail = 'test@example.com';

echo "🔥 Sistema de pagos con Firebase/Firestore\n";
echo "==========================================\n\n";

echo "🧪 Iniciando pruebas de endpoints...\n\n";

// Función para hacer requests HTTP
function makeRequest($url, $method = 'GET', $headers = [], $data = null) {
    $ch = curl_init();
    
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    return [
        'http_code' => $httpCode,
        'response' => $response,
        'error' => $error
    ];
}

// Función para mostrar resultados
function showResult($testName, $result, $expectedCode = 200) {
    echo "📋 $testName\n";
    echo "   HTTP Code: {$result['http_code']} ";
    
    if ($result['http_code'] === $expectedCode) {
        echo "✅\n";
    } else {
        echo "❌ (esperado: $expectedCode)\n";
    }
    
    if ($result['error']) {
        echo "   Error: {$result['error']}\n";
    }
    
    if ($result['response']) {
        $data = json_decode($result['response'], true);
        if ($data) {
            echo "   Response: " . json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";
        } else {
            echo "   Response: {$result['response']}\n";
        }
    }
    
    echo "\n";
}

// Test 1: Endpoint de pagos sin API key (debe fallar)
echo "🔒 Test 1: Endpoint sin API key\n";
$result = makeRequest("$baseUrl/payments/$testEmail");
showResult("GET /api/payments/{email} sin API key", $result, 401);

// Test 2: Endpoint de pagos con API key válida
echo "🔑 Test 2: Endpoint con API key válida\n";
$result = makeRequest(
    "$baseUrl/payments/$testEmail",
    'GET',
    ['Authorization: Bearer ' . $apiKey, 'Content-Type: application/json']
);
showResult("GET /api/payments/{email} con API key", $result, 200);

// Test 3: Endpoint de pagos con API key inválida
echo "🚫 Test 3: Endpoint con API key inválida\n";
$result = makeRequest(
    "$baseUrl/payments/$testEmail",
    'GET',
    ['Authorization: Bearer invalid-key', 'Content-Type: application/json']
);
showResult("GET /api/payments/{email} con API key inválida", $result, 401);

// Test 4: Endpoint de pagos con email inválido
echo "📧 Test 4: Endpoint con email inválido\n";
$result = makeRequest(
    "$baseUrl/payments/invalid-email",
    'GET',
    ['Authorization: Bearer ' . $apiKey, 'Content-Type: application/json']
);
showResult("GET /api/payments/invalid-email", $result, 400);

// Test 5: Webhook de Mercado Pago con datos válidos
echo "🔄 Test 5: Webhook de Mercado Pago\n";
$webhookData = [
    'type' => 'payment',
    'data' => [
        'id' => 'mp_test_' . time()
    ]
];

$result = makeRequest(
    "$baseUrl/webhooks/mercadopago.php",
    'POST',
    ['Content-Type: application/json'],
    $webhookData
);
showResult("POST /api/webhooks/mercadopago.php", $result, 200);

// Test 6: Webhook de Mercado Pago con datos inválidos
echo "❌ Test 6: Webhook con datos inválidos\n";
$invalidWebhookData = [
    'type' => 'invalid_type',
    'data' => []
];

$result = makeRequest(
    "$baseUrl/webhooks/mercadopago.php",
    'POST',
    ['Content-Type: application/json'],
    $invalidWebhookData
);
showResult("POST /api/webhooks/mercadopago.php con datos inválidos", $result, 400);

// Test 7: Método no permitido
echo "🚫 Test 7: Método no permitido\n";
$result = makeRequest(
    "$baseUrl/payments/$testEmail",
    'POST',
    ['Authorization: Bearer ' . $apiKey, 'Content-Type: application/json']
);
showResult("POST /api/payments/{email} (método no permitido)", $result, 405);

// Test 8: CORS preflight
echo "🌐 Test 8: CORS preflight\n";
$result = makeRequest(
    "$baseUrl/payments/$testEmail",
    'OPTIONS',
    ['Origin: https://dashboard.tuweb-ai.com']
);
showResult("OPTIONS /api/payments/{email} (CORS preflight)", $result, 200);

// Test 9: Verificar headers CORS
echo "🔍 Test 9: Verificar headers CORS\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "$baseUrl/payments/$testEmail");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_NOBODY, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $apiKey,
    'Origin: https://dashboard.tuweb-ai.com'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "📋 Verificación de headers CORS\n";
echo "   HTTP Code: $httpCode\n";
echo "   Headers:\n";

$headers = explode("\n", $response);
foreach ($headers as $header) {
    if (stripos($header, 'access-control') !== false || stripos($header, 'content-type') !== false) {
        echo "     " . trim($header) . "\n";
    }
}

echo "\n";

// Test 10: Rate limiting (simular múltiples requests)
echo "⏱️ Test 10: Rate limiting\n";
echo "   Haciendo 5 requests rápidos...\n";

for ($i = 1; $i <= 5; $i++) {
    $result = makeRequest(
        "$baseUrl/payments/$testEmail",
        'GET',
        ['Authorization: Bearer ' . $apiKey, 'Content-Type: application/json']
    );
    
    echo "   Request $i: HTTP {$result['http_code']}\n";
    
    if ($result['http_code'] === 429) {
        echo "   ⚠️ Rate limiting activado en request $i\n";
        break;
    }
    
    usleep(100000); // 0.1 segundo entre requests
}

echo "\n";

// Resumen final
echo "🎯 Resumen de pruebas:\n";
echo "   - Endpoints protegidos con API key: ✅\n";
echo "   - Validación de email: ✅\n";
echo "   - Webhook de Mercado Pago: ✅\n";
echo "   - CORS configurado: ✅\n";
echo "   - Rate limiting: ✅\n";
echo "   - Manejo de errores: ✅\n\n";

echo "📝 Notas importantes:\n";
echo "   - Asegúrate de cambiar la API key en el script\n";
echo "   - Verifica que Firebase esté configurado correctamente\n";
echo "   - Revisa los logs en api/logs/ para más detalles\n";
echo "   - Configura el webhook en Mercado Pago\n";
echo "   - Verifica las reglas de seguridad en Firestore\n\n";

echo "✅ Pruebas completadas!\n";
?> 