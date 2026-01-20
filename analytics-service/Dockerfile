FROM alpine:latest 
RUN apk add --no-cache bash netcat-openbsd
WORKDIR /app 
COPY server.sh .
RUN chmod +x server.sh 
EXPOSE 8090 
CMD ["./server.sh"]