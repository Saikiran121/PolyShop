<?php
// Secure Configuration
// This file now reads sensitive data from the hidden .env file

// Simple .env parser since we don't have libraries
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && substr($line, 0, 1) != '#') {
            list($key, $value) = explode('=', $line, 2);
            putenv(trim($key) . '=' . trim($value, '"\''));
        }
    }
}

return [
    'smtp_host' => 'smtp.gmail.com',
    'smtp_port' => 587,
    'smtp_user' => 'saikiranbiradar76642@gmail.com',
    'smtp_pass' => getenv('SMTP_PASS') ?: 'password_not_set', // Reads from .env
    'from_email' => 'saikiranbiradar76642@gmail.com',
    'from_name' => 'PolyShop Verification'
];
