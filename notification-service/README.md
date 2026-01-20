# Notification Service

**Language:** PHP
**Port:** 8087

## Description
Microservice responsible for sending notifications (Email, SMS).

## System Requirements
- PHP 7.4+

## How to Run
```bash
php -S 0.0.0.0:8087 index.php
```

## API Endpoints
- `POST /notify`: Send a notification.
  - Body: `{ "type": "email", "to": "user@example.com", "message": "Order confirmed!" }`
