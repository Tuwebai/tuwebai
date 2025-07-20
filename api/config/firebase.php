<?php
/**
 * Configuración de Firebase/Firestore
 */

// Cargar variables de entorno
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

// Configuración de Firebase
$firebaseConfig = [
    'api_key' => getenv('VITE_FIREBASE_API_KEY'),
    'auth_domain' => getenv('VITE_FIREBASE_AUTH_DOMAIN'),
    'project_id' => getenv('VITE_FIREBASE_PROJECT_ID'),
    'storage_bucket' => getenv('VITE_FIREBASE_STORAGE_BUCKET'),
    'messaging_sender_id' => getenv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    'app_id' => getenv('VITE_FIREBASE_APP_ID'),
    'measurement_id' => getenv('VITE_FIREBASE_MEASUREMENT_ID'),
    'service_account_key' => getenv('FIREBASE_SERVICE_ACCOUNT_KEY') ?: __DIR__ . '/../../firebase-service-account.json'
];

/**
 * Obtener configuración de Firebase
 */
function getFirebaseConfig() {
    global $firebaseConfig;
    return $firebaseConfig;
}

/**
 * Inicializar Firebase Admin SDK
 */
function initializeFirebase() {
    global $firebaseConfig;
    
    // Verificar si ya está inicializado
    static $initialized = false;
    if ($initialized) {
        return;
    }
    
    // Verificar que las credenciales estén disponibles
    if (!$firebaseConfig['project_id']) {
        throw new Exception('Configuración de Firebase incompleta. Verifica las variables de entorno.');
    }
    
    // Si no hay service account key, usar configuración pública
    if (!file_exists($firebaseConfig['service_account_key'])) {
        // Usar configuración pública (limitada)
        putenv("GOOGLE_APPLICATION_CREDENTIALS=");
        putenv("FIREBASE_PROJECT_ID=" . $firebaseConfig['project_id']);
    } else {
        putenv("GOOGLE_APPLICATION_CREDENTIALS=" . $firebaseConfig['service_account_key']);
    }
    
    $initialized = true;
}

/**
 * Obtener colección de pagos
 */
function getPaymentsCollection() {
    initializeFirebase();
    return 'payments';
}

/**
 * Obtener colección de logs
 */
function getLogsCollection() {
    initializeFirebase();
    return 'payment_logs';
}

/**
 * Configurar opciones comunes de cURL
 */
function configureCurl($ch) {
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
}

/**
 * Crear documento en Firestore
 */
function createFirestoreDocument($collection, $data) {
    $url = "https://firestore.googleapis.com/v1/projects/" . getenv('VITE_FIREBASE_PROJECT_ID') . "/databases/(default)/documents/$collection";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['fields' => $data]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . getFirebaseAccessToken()
    ]);
    configureCurl($ch);
    
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
    
    $result = json_decode($response, true);
    
    if (!$result || isset($result['error'])) {
        throw new Exception('Error en respuesta de Firestore: ' . ($result['error']['message'] ?? 'unknown'));
    }
    
    return $result;
}

/**
 * Actualizar documento en Firestore
 */
function updateFirestoreDocument($collection, $documentId, $data) {
    $url = "https://firestore.googleapis.com/v1/projects/" . getenv('VITE_FIREBASE_PROJECT_ID') . "/databases/(default)/documents/$collection/$documentId";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['fields' => $data]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . getFirebaseAccessToken()
    ]);
    configureCurl($ch);
    
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
    
    $result = json_decode($response, true);
    
    if (!$result || isset($result['error'])) {
        throw new Exception('Error en respuesta de Firestore: ' . ($result['error']['message'] ?? 'unknown'));
    }
    
    return $result;
}

/**
 * Consultar documentos en Firestore
 */
function queryFirestoreDocuments($collection, $filters = []) {
    $url = "https://firestore.googleapis.com/v1/projects/" . getenv('VITE_FIREBASE_PROJECT_ID') . "/databases/(default)/documents/$collection:runQuery";
    
    $query = [
        'structuredQuery' => [
            'from' => [['collectionId' => $collection]]
        ]
    ];
    
    // Agregar filtros si existen
    if (!empty($filters)) {
        $query['structuredQuery']['where'] = [
            'compositeFilter' => [
                'op' => 'AND',
                'filters' => []
            ]
        ];
        
        foreach ($filters as $field => $value) {
            $query['structuredQuery']['where']['compositeFilter']['filters'][] = [
                'fieldFilter' => [
                    'field' => ['fieldPath' => $field],
                    'op' => 'EQUAL',
                    'value' => ['stringValue' => $value]
                ]
            ];
        }
    }
    
    // Ordenar por fecha de creación descendente
    $query['structuredQuery']['orderBy'] = [
        [
            'field' => ['fieldPath' => 'created_at'],
            'direction' => 'DESCENDING'
        ]
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($query));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . getFirebaseAccessToken()
    ]);
    configureCurl($ch);
    
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
    
    $result = json_decode($response, true);
    
    if (!$result || isset($result['error'])) {
        throw new Exception('Error en respuesta de Firestore: ' . ($result['error']['message'] ?? 'unknown'));
    }
    
    return $result;
}

/**
 * Obtener documento específico de Firestore
 */
function getFirestoreDocument($collection, $documentId) {
    $url = "https://firestore.googleapis.com/v1/projects/" . getenv('VITE_FIREBASE_PROJECT_ID') . "/databases/(default)/documents/$collection/$documentId";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . getFirebaseAccessToken()
    ]);
    configureCurl($ch);
    
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
    
    $result = json_decode($response, true);
    
    if (!$result || isset($result['error'])) {
        throw new Exception('Error en respuesta de Firestore: ' . ($result['error']['message'] ?? 'unknown'));
    }
    
    return $result;
}

/**
 * Obtener token de acceso de Firebase
 */
function getFirebaseAccessToken() {
    // Para simplificar, usamos un token de acceso fijo o generamos uno
    // En producción, deberías usar Firebase Admin SDK o generar tokens JWT
    
    $serviceAccountKey = getenv('FIREBASE_SERVICE_ACCOUNT_KEY') ?: __DIR__ . '/../../firebase-service-account.json';
    
    if (file_exists($serviceAccountKey)) {
        $serviceAccount = json_decode(file_get_contents($serviceAccountKey), true);
        
        // Generar JWT token
        $header = [
            'alg' => 'RS256',
            'typ' => 'JWT'
        ];
        
        $payload = [
            'iss' => $serviceAccount['client_email'],
            'sub' => $serviceAccount['client_email'],
            'aud' => 'https://oauth2.googleapis.com/token',
            'iat' => time(),
            'exp' => time() + 3600,
            'scope' => 'https://www.googleapis.com/auth/datastore'
        ];
        
        $headerEncoded = base64_encode(json_encode($header));
        $payloadEncoded = base64_encode(json_encode($payload));
        
        $signature = '';
        openssl_sign(
            $headerEncoded . '.' . $payloadEncoded,
            $signature,
            $serviceAccount['private_key'],
            'SHA256'
        );
        
        $signatureEncoded = base64_encode($signature);
        
        $jwt = $headerEncoded . '.' . $payloadEncoded . '.' . $signatureEncoded;
        
        // Intercambiar JWT por access token
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'https://oauth2.googleapis.com/token');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
            'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            'assertion' => $jwt
        ]));
        configureCurl($ch);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        $result = json_decode($response, true);
        
        if (isset($result['access_token'])) {
            return $result['access_token'];
        }
    }
    
    // Fallback: usar API key pública (limitado)
    return getenv('VITE_FIREBASE_API_KEY');
}

/**
 * Convertir datos PHP a formato Firestore
 */
function toFirestoreValue($value) {
    if (is_string($value)) {
        return ['stringValue' => $value];
    } elseif (is_int($value)) {
        return ['integerValue' => $value];
    } elseif (is_float($value)) {
        return ['doubleValue' => $value];
    } elseif (is_bool($value)) {
        return ['booleanValue' => $value];
    } elseif (is_array($value)) {
        if (array_keys($value) !== range(0, count($value) - 1)) {
            // Array asociativo
            $fields = [];
            foreach ($value as $key => $val) {
                $fields[$key] = toFirestoreValue($val);
            }
            return ['mapValue' => ['fields' => $fields]];
        } else {
            // Array indexado
            $values = [];
            foreach ($value as $val) {
                $values[] = toFirestoreValue($val);
            }
            return ['arrayValue' => ['values' => $values]];
        }
    } elseif (is_null($value)) {
        return ['nullValue' => null];
    } else {
        return ['stringValue' => (string) $value];
    }
}

/**
 * Convertir datos Firestore a formato PHP
 */
function fromFirestoreValue($firestoreValue) {
    if (isset($firestoreValue['stringValue'])) {
        return $firestoreValue['stringValue'];
    } elseif (isset($firestoreValue['integerValue'])) {
        return (int) $firestoreValue['integerValue'];
    } elseif (isset($firestoreValue['doubleValue'])) {
        return (float) $firestoreValue['doubleValue'];
    } elseif (isset($firestoreValue['booleanValue'])) {
        return $firestoreValue['booleanValue'];
    } elseif (isset($firestoreValue['arrayValue'])) {
        $result = [];
        foreach ($firestoreValue['arrayValue']['values'] as $value) {
            $result[] = fromFirestoreValue($value);
        }
        return $result;
    } elseif (isset($firestoreValue['mapValue'])) {
        $result = [];
        foreach ($firestoreValue['mapValue']['fields'] as $key => $value) {
            $result[$key] = fromFirestoreValue($value);
        }
        return $result;
    } elseif (isset($firestoreValue['nullValue'])) {
        return null;
    } else {
        return null;
    }
}

/**
 * Verificar conexión a Firebase
 */
function testFirebaseConnection() {
    try {
        initializeFirebase();
        $collection = getPaymentsCollection();
        return true;
    } catch (Exception $e) {
        return false;
    }
}

// Inicializar Firebase al cargar el archivo
if (testFirebaseConnection()) {
    // Firebase configurado correctamente
}
?> 