<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['ok'=>false,'error'=>'Use POST.']); exit; }

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!$data) { http_response_code(400); echo json_encode(['ok'=>false,'error'=>'JSON inválido.']); exit; }

$dir = __DIR__ . '/sheets';
if (!is_dir($dir)) { mkdir($dir, 0775, true); }
$name = preg_replace('/[^a-zA-Z0-9_-]/', '_', $data['name'] ?? 'exorcista');
$file = $dir . '/' . $name . '-' . date('Ymd-His') . '.json';
file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
echo json_encode(['ok'=>true,'file'=>basename($file)]);
