package main

import (
	"fmt"
	"log"
	"net/http"

	"cash-register/routes"
)

func main() {
	r := routes.RegisterRoutes()

	// Start server
	port := ":8080"
	fmt.Println("Server is running on port", port)
	log.Fatal(http.ListenAndServe(port, r))
}
