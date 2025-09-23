<?php
// Check if config.php exists
if (!file_exists('config.php')) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode([
        'error' => 'Configuration file missing. Please copy config.php.example to config.php and configure GitHub credentials.'
    ]);
    exit;
}

require_once 'config.php';
require_once 'services/github.php';

$service = $_GET['service'] ?? '';

header('Content-Type: application/json');

try {
    switch ($service) {
        case 'github':
            $type = $_GET['type'] ?? 'user';
            $repo = $_GET['repo'] ?? GITHUB_REPO;
            if ($type === 'commits_all') {
                echo json_encode(getAllCommitActivityAsJson());
            } else {
                echo json_encode(fetchGithubData($type, $repo));
            }
            break;
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Service not supported']);
    }
} catch (Exception $e) {
    // Handle specific HTTP codes from service errors
    $code = $e->getCode();
    if ($code >= 400 && $code < 600) {
        http_response_code($code);
    } else {
        http_response_code(500);
    }
    
    echo json_encode(['error' => $e->getMessage()]);
}
?>