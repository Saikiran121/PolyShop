# Cart Service

**Language:** Python
**Framework:** Flask
**Port:** 8082

## Description
Microservice responsible for managing user shopping carts.

## System Requirements
- Python 3.8+
- pip

## Installation
```bash
pip install -r requirements.txt
```

## How to Run
```bash
python app.py
```

## API Endpoints
- `GET /cart/<user_id>`: Retrieve user cart.
- `POST /cart/<user_id>`: Add item to cart. Body: JSON object of item.
- `DELETE /cart/<user_id>`: Clear user cart.
