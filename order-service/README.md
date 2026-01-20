# Order Service

**Language:** Ruby
**Framework:** Sinatra
**Port:** 8084

## Description
Microservice responsible for managing user orders.

## System Requirements
- Ruby 2.7+
- Bundler

## Installation
```bash
bundle install
```

## How to Run
```bash
ruby app.rb
```

## API Endpoints
- `GET /orders`: List all orders.
- `POST /orders`: Create a new order. Body: `{ "user_id": "1", "items": [], "total": 99.99 }`
- `GET /orders/:id`: Get order details.
