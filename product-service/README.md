# Product Service

**Language:** Go (Golang)
**Port:** 8081

## Description
Microservice responsible for managing and retrieving product catalog information.

## System Requirements
- Go 1.20 or higher

## How to Run
1. Navigate to `product-service` directory.
2. Run `go run main.go`

## API Endpoints
- `GET /products`: Returns a list of all products.
- `POST /products`: Add a new product.
  - Body: `{ "name": "Tablet", "price": 150.00, "icon": "fa-mobile" }`
