<?php
header('Content-Type: application/json; charset=utf-8');
http_response_code(404);

echo json_encode([
    'success' => false,
    'error' => 'Endpoint no encontrado',
    'message' => 'La ruta solicitada no existe',
    'timestamp' => date('c'),
    'path' => $_SERVER['REQUEST_URI'] ?? 'unknown'
], JSON_UNESCAPED_UNICODE);
?> 