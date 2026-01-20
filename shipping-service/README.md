# Shipping Service

**Language:** Rust
**Framework:** Actix-web
**Port:** 8086

## Description
Microservice responsible for calculating shipping costs and delivery times.

## System Requirements
- Rust (Cargo)

## Installation
```bash
cargo build
```

## How to Run
```bash
cargo run
```

## API Endpoints
- `POST /shipping/calculate`: Calculate shipping.
  - Body: `{ "order_id": "123", "address": "123 Main St", "items": 5 }`
- `GET /health`: Health check.
