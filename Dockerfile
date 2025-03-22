# Start from a Golang base image
FROM golang:1.24.1

# Set working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum files first (if you have them)
# This is a best practice to take advantage of Docker's layer caching
COPY go.mod go.sum* ./

# Download dependencies
# If you don't have a go.mod file yet, you can remove these two lines
RUN go mod download

# Copy the source code into the container
COPY . .

# Build the Go application
RUN go build -o cash-register .

# Expose port 8080 to the outside world
EXPOSE 8080

# Set environment variable to indicate we're in a container
ENV IN_CONTAINER=true

# Command to run the executable
CMD ["./cash-register"]