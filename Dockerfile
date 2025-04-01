
FROM golang:1.24.1

WORKDIR /app

COPY . .

RUN go mod download

RUN go build -o cash-register .

EXPOSE 8080

ENV IN_CONTAINER=true

ENTRYPOINT ["./cash-register"]