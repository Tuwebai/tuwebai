<?php
header('Content-Type: application/json; charset=utf-8');
http_response_code(500);

echo json_encode([
    'success' => false,
    'error' => 'Error interno del servidor',
    'message' => 'Ha ocurrido un error inesperado. Por favor, intenta de nuevo más tarde.',
    'timestamp' => date('c'),
    'path' => $_SERVER['REQUEST_URI'] ?? 'unknown'
], JSON_UNESCAPED_UNICODE);
?> 