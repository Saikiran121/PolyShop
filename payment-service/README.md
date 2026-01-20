# Payment Service

**Language:** JavaScript (Node.js)
**Port:** 8083

## Description
Microservice responsible for processing transactions.

## System Requirements
- Node.js (v14+)
- npm

## Installation
```bash
npm install
```

## How to Run
```bash
npm start
```

## API Endpoints
- `POST /payment/process`: Process a payment.
  - Body: `{ "orderId": "123", "amount": 100, "currency": "USD", "paymentMethod": "credit_card" }`
