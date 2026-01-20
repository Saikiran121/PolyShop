#!/bin/bash

PORT=8090
echo "Analytics Service running on port $PORT..."

while true; do
  { 
    echo -e "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n\r\n{\"status\":\"logged\",\"service\":\"analytics\"}" 
  } | nc -l -p $PORT -q 1 > /dev/null
  
  # Note: This is an extremely basic server that just responds OK to everything
  # and discards input. A real Netcat server is more complex to handle input properly.
  # But for a "Shell Microservice" proof of concept, this works to return 200 OK.
  
  echo "Request received and logged."
done
