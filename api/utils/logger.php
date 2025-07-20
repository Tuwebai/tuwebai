<?php
/**
 * Clase Logger para manejo de logs
 */

class Logger {
    private $context;
    private $logDir;
    
    public function __construct($context = 'default') {
        $this->context = $context;
        $this->logDir = __DIR__ . '/../logs/';
        
        // Crear directorio de logs si no existe
        if (!is_dir($this->logDir)) {
            mkdir($this->logDir, 0755, true);
        }
    }
    
    /**
     * Log de información
     */
    public function info($message, $data = []) {
        $this->log('INFO', $message, $data);
    }
    
    /**
     * Log de advertencia
     */
    public function warning($message, $data = []) {
        $this->log('WARNING', $message, $data);
    }
    
    /**
     * Log de error
     */
    public function error($message, $data = []) {
        $this->log('ERROR', $message, $data);
    }
    
    /**
     * Log de debug
     */
    public function debug($message, $data = []) {
        if (getenv('DEBUG') === 'true') {
            $this->log('DEBUG', $message, $data);
        }
    }
    
    /**
     * Log de auditoría
     */
    public function audit($action, $data = []) {
        $this->log('AUDIT', $action, $data, 'audit.log');
    }
    
    /**
     * Método principal de logging
     */
    private function log($level, $message, $data = [], $filename = null) {
        $timestamp = date('Y-m-d H:i:s');
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
        $requestId = $this->getRequestId();
        
        $logEntry = [
            'timestamp' => $timestamp,
            'level' => $level,
            'context' => $this->context,
            'message' => $message,
            'data' => $data,
            'ip' => $ip,
            'user_agent' => $userAgent,
            'request_id' => $requestId,
            'url' => $_SERVER['REQUEST_URI'] ?? 'unknown',
            'method' => $_SERVER['REQUEST_METHOD'] ?? 'unknown'
        ];
        
        // Determinar archivo de log
        if (!$filename) {
            $filename = $this->context . '.log';
        }
        
        $logFile = $this->logDir . $filename;
        
        // Formatear entrada de log
        $logLine = json_encode($logEntry, JSON_UNESCAPED_UNICODE) . "\n";
        
        // Escribir al archivo
        file_put_contents($logFile, $logLine, FILE_APPEND | LOCK_EX);
        
        // Si es error, también escribir al error log general
        if ($level === 'ERROR') {
            $errorLogFile = $this->logDir . 'errors.log';
            file_put_contents($errorLogFile, $logLine, FILE_APPEND | LOCK_EX);
        }
        
        // Si está en modo debug, también mostrar en consola
        if (getenv('DEBUG') === 'true') {
            error_log("[{$level}] {$this->context}: {$message}");
        }
    }
    
    /**
     * Generar ID único para la petición
     */
    private function getRequestId() {
        if (!isset($_SERVER['HTTP_X_REQUEST_ID'])) {
            $_SERVER['HTTP_X_REQUEST_ID'] = uniqid('req_', true);
        }
        return $_SERVER['HTTP_X_REQUEST_ID'];
    }
    
    /**
     * Limpiar logs antiguos
     */
    public static function cleanOldLogs($days = 30) {
        $logDir = __DIR__ . '/../logs/';
        $cutoff = time() - ($days * 24 * 60 * 60);
        
        if (!is_dir($logDir)) {
            return;
        }
        
        $files = glob($logDir . '*.log');
        
        foreach ($files as $file) {
            if (filemtime($file) < $cutoff) {
                unlink($file);
            }
        }
    }
    
    /**
     * Obtener estadísticas de logs
     */
    public static function getLogStats() {
        $logDir = __DIR__ . '/../logs/';
        
        if (!is_dir($logDir)) {
            return [];
        }
        
        $stats = [];
        $files = glob($logDir . '*.log');
        
        foreach ($files as $file) {
            $filename = basename($file);
            $lines = count(file($file));
            $size = filesize($file);
            $modified = filemtime($file);
            
            $stats[$filename] = [
                'lines' => $lines,
                'size' => $size,
                'size_formatted' => self::formatBytes($size),
                'modified' => date('Y-m-d H:i:s', $modified),
                'modified_timestamp' => $modified
            ];
        }
        
        return $stats;
    }
    
    /**
     * Formatear bytes en formato legible
     */
    private static function formatBytes($bytes, $precision = 2) {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, $precision) . ' ' . $units[$i];
    }
    
    /**
     * Buscar en logs
     */
    public static function searchLogs($query, $context = null, $limit = 100) {
        $logDir = __DIR__ . '/../logs/';
        
        if (!is_dir($logDir)) {
            return [];
        }
        
        $pattern = $context ? $logDir . $context . '.log' : $logDir . '*.log';
        $files = glob($pattern);
        
        $results = [];
        $count = 0;
        
        foreach ($files as $file) {
            if ($count >= $limit) {
                break;
            }
            
            $lines = file($file, FILE_IGNORE_NEW_LINES);
            
            foreach ($lines as $line) {
                if ($count >= $limit) {
                    break;
                }
                
                if (stripos($line, $query) !== false) {
                    $logEntry = json_decode($line, true);
                    if ($logEntry) {
                        $results[] = $logEntry;
                        $count++;
                    }
                }
            }
        }
        
        return $results;
    }
}

/**
 * Función helper para logging rápido
 */
function log_info($message, $data = [], $context = 'default') {
    $logger = new Logger($context);
    $logger->info($message, $data);
}

function log_error($message, $data = [], $context = 'default') {
    $logger = new Logger($context);
    $logger->error($message, $data);
}

function log_warning($message, $data = [], $context = 'default') {
    $logger = new Logger($context);
    $logger->warning($message, $data);
}

function log_debug($message, $data = [], $context = 'default') {
    $logger = new Logger($context);
    $logger->debug($message, $data);
}

function log_audit($action, $data = [], $context = 'default') {
    $logger = new Logger($context);
    $logger->audit($action, $data);
}
?> 