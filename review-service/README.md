# Review Service

**Language:** Perl
**Framework:** Mojolicious
**Port:** 8089

## Description
Microservice responsible for managing product reviews.

## System Requirements
- Perl 5.16+
- Mojolicious (`cpanm Mojolicious`)

## Installation
```bash
cpanm --installeps .
```

## How to Run
```bash
# Morbo is the development server for Mojolicious
morbo -l 'http://*:8089' app.pl
```

## API Endpoints
- `GET /reviews/:productId`: Get reviews for a product.
- `POST /reviews`: Add a review. Body: `{ "productId": "1", "user": "Charlie", "rating": 3, "comment": "Okay" }`
