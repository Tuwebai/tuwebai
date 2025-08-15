<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/firebase.php';

try {
    $method = $_SERVER['REQUEST_METHOD'];
    $path = $_SERVER['REQUEST_URI'];
    $pathParts = explode('/', trim($path, '/'));
    
    // Obtener el último segmento de la URL
    $endpoint = end($pathParts);
    
    switch ($method) {
        case 'GET':
            if ($endpoint === 'testimonials' || $endpoint === 'index.php') {
                // Obtener todos los testimonios aprobados
                $testimonials = getApprovedTestimonials();
                echo json_encode([
                    'success' => true,
                    'data' => $testimonials
                ]);
            } else {
                // Obtener testimonio específico
                $testimonialId = $endpoint;
                $testimonial = getTestimonialById($testimonialId);
                
                if ($testimonial) {
                    echo json_encode([
                        'success' => true,
                        'data' => $testimonial
                    ]);
                } else {
                    http_response_code(404);
                    echo json_encode([
                        'success' => false,
                        'error' => 'Testimonio no encontrado'
                    ]);
                }
            }
            break;
            
        case 'POST':
            // Crear nuevo testimonio
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Datos inválidos'
                ]);
                exit();
            }
            
            // Validar campos requeridos
            if (empty($input['name']) || empty($input['testimonial'])) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Nombre y testimonio son campos obligatorios'
                ]);
                exit();
            }
            
            $testimonialData = [
                'name' => toFirestoreValue($input['name']),
                'company' => toFirestoreValue($input['company'] ?? 'Cliente'),
                'testimonial' => toFirestoreValue($input['testimonial']),
                'isApproved' => toFirestoreValue(false),
                'createdAt' => toFirestoreValue(date('c')),
                'updatedAt' => toFirestoreValue(date('c'))
            ];
            
            $result = createFirestoreDocument('testimonials', $testimonialData);
            
            echo json_encode([
                'success' => true,
                'data' => [
                    'id' => $result['name'] ?? 'created',
                    'message' => 'Testimonio creado exitosamente'
                ]
            ]);
            break;
            
        case 'PUT':
            // Actualizar testimonio
            if ($endpoint === 'testimonials' || $endpoint === 'index.php') {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'ID de testimonio requerido'
                ]);
                exit();
            }
            
            $testimonialId = $endpoint;
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Datos inválidos'
                ]);
                exit();
            }
            
            $updateData = [];
            if (isset($input['name'])) $updateData['name'] = toFirestoreValue($input['name']);
            if (isset($input['company'])) $updateData['company'] = toFirestoreValue($input['company']);
            if (isset($input['testimonial'])) $updateData['testimonial'] = toFirestoreValue($input['testimonial']);
            if (isset($input['isApproved'])) $updateData['isApproved'] = toFirestoreValue($input['isApproved']);
            $updateData['updatedAt'] = toFirestoreValue(date('c'));
            
            updateFirestoreDocument('testimonials', $testimonialId, $updateData);
            
            echo json_encode([
                'success' => true,
                'data' => [
                    'id' => $testimonialId,
                    'message' => 'Testimonio actualizado exitosamente'
                ]
            ]);
            break;
            
        case 'DELETE':
            // Eliminar testimonio
            if ($endpoint === 'testimonials' || $endpoint === 'index.php') {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'ID de testimonio requerido'
                ]);
                exit();
            }
            
            $testimonialId = $endpoint;
            deleteFirestoreDocument('testimonials', $testimonialId);
            
            echo json_encode([
                'success' => true,
                'data' => [
                    'id' => $testimonialId,
                    'message' => 'Testimonio eliminado exitosamente'
                ]
            ]);
            break;
            
        default:
            http_response_code(405);
            echo json_encode([
                'success' => false,
                'error' => 'Método no permitido'
            ]);
            break;
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error interno del servidor: ' . $e->getMessage()
    ]);
}

/**
 * Obtener testimonios aprobados
 */
function getApprovedTestimonials() {
    try {
        $filters = ['isApproved' => 'true'];
        $result = queryFirestoreDocuments('testimonials', $filters);
        
        $testimonials = [];
        if (isset($result['document'])) {
            foreach ($result['document'] as $doc) {
                if (isset($doc['document'])) {
                    $fields = $doc['document']['fields'] ?? [];
                    $testimonials[] = [
                        'id' => basename($doc['document']['name']),
                        'name' => fromFirestoreValue($fields['name'] ?? null),
                        'company' => fromFirestoreValue($fields['company'] ?? null),
                        'testimonial' => fromFirestoreValue($fields['testimonial'] ?? null),
                        'isApproved' => fromFirestoreValue($fields['isApproved'] ?? false),
                        'createdAt' => fromFirestoreValue($fields['createdAt'] ?? null),
                        'updatedAt' => fromFirestoreValue($fields['updatedAt'] ?? null)
                    ];
                }
            }
        }
        
        return $testimonials;
    } catch (Exception $e) {
        error_log('Error getting approved testimonials: ' . $e->getMessage());
        return [];
    }
}

/**
 * Obtener testimonio por ID
 */
function getTestimonialById($testimonialId) {
    try {
        $result = getFirestoreDocument('testimonials', $testimonialId);
        
        if (isset($result['fields'])) {
            $fields = $result['fields'];
            return [
                'id' => $testimonialId,
                'name' => fromFirestoreValue($fields['name'] ?? null),
                'company' => fromFirestoreValue($fields['company'] ?? null),
                'testimonial' => fromFirestoreValue($fields['testimonial'] ?? null),
                'isApproved' => fromFirestoreValue($fields['isApproved'] ?? false),
                'createdAt' => fromFirestoreValue($fields['createdAt'] ?? null),
                'updatedAt' => fromFirestoreValue($fields['updatedAt'] ?? null)
            ];
        }
        
        return null;
    } catch (Exception $e) {
        error_log('Error getting testimonial by ID: ' . $e->getMessage());
        return null;
    }
}

/**
 * Eliminar documento de Firestore
 */
function deleteFirestoreDocument($collection, $documentId) {
    $url = "https://firestore.googleapis.com/v1/projects/" . getenv('VITE_FIREBASE_PROJECT_ID') . "/databases/(default)/documents/$collection/$documentId";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
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
    
    return json_decode($response, true);
}
?>
