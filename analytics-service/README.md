# Analytics Service

**Language:** Shell (Bash)
**Dependencies:** `netcat` (nc)
**Port:** 8090

## Description
Microservice responsible for logging events. It accepts any request and returns a 200 OK JSON response.

## System Requirements
- Linux/Bash
- Netcat (`nc` command available) (Use `netcat-openbsd` or similar if traditional nc doesn't support -q)

## How to Run
```bash
chmod +x server.sh
./server.sh
```

## API Endpoints
- `ANY /`: Logs the request and returns success.
