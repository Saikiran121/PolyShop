<?php

$config = require 'config.php';
$port = 8087;

function send_email($to, $subject, $body, $config) {
    $host = $config['smtp_host'];
    $port = $config['smtp_port'];
    $user = $config['smtp_user'];
    // Remove spaces from App Password if present
    $pass = str_replace(' ', '', $config['smtp_pass']);

    if ($user == 'your_email@gmail.com') {
        error_log("SMTP not configured. Skipping email send.");
        return false;
    }

    try {
        $socket = fsockopen($host, $port, $errno, $errstr, 15);
        if (!$socket) throw new Exception("Could not connect to SMTP host");

        read_response($socket); // 220

        send_command($socket, "EHLO " . gethostname());
        send_command($socket, "STARTTLS");
        stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
        send_command($socket, "EHLO " . gethostname());

        send_command($socket, "AUTH LOGIN");
        send_command($socket, base64_encode($user));
        send_command($socket, base64_encode($pass));

        send_command($socket, "MAIL FROM: <$user>");
        send_command($socket, "RCPT TO: <$to>");
        send_command($socket, "DATA");

        $headers  = "MIME-Version: 1.0\r\n";
        $headers .= "Content-type: text/html; charset=utf-8\r\n";
        $headers .= "To: $to\r\n";
        $headers .= "From: {$config['from_name']} <$user>\r\n";
        $headers .= "Subject: $subject\r\n";

        fwrite($socket, "$headers\r\n$body\r\n.\r\n");
        read_response($socket);

        send_command($socket, "QUIT");
        fclose($socket);
        return true;
    } catch (Exception $e) {
        error_log("SMTP Error: " . $e->getMessage());
        return false;
    }
}

function send_command($socket, $cmd) {
    fwrite($socket, $cmd . "\r\n");
    return read_response($socket);
}

function read_response($socket) {
    $response = "";
    while ($str = fgets($socket, 515)) {
        $response .= $str;
        if (substr($str, 3, 1) == " ") break;
    }
    return $response;
}

if (php_sapi_name() === 'cli-server') {
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $method = $_SERVER['REQUEST_METHOD'];

    header('Content-Type: application/json');
    // Basic CORS
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");

    if ($method === 'OPTIONS') {
        exit(0);
    }

    if ($method === 'POST' && $uri === '/notify') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $to = $input['to'] ?? '';
        $message = $input['message'] ?? 'No message';
        $subject = "Order Confirmation - PolyShop";

        if (!$to) {
            http_response_code(400);
            echo json_encode(["error" => "Email required"]);
            exit;
        }

        // Send Real Email if Configured
        $sent = send_email($to, $subject, $message, $config);

        echo json_encode([
            "status" => $sent ? "sent" : "simulated",
            "details" => $sent ? "Email sent via SMTP" : "SMTP not configured, check logs",
            "timestamp" => date('c')
        ]);
        exit;
    }

    echo json_encode(["status" => "running", "service" => "Notification Service"]);
} else {
    echo "Please run with built-in server: php -S 0.0.0.0:$port index.php\n";
}
