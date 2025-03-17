package main

import (
	"fmt"
	"log"
	"net/http"

	"cash-register/routes"

	"github.com/gorilla/mux"
	"github.com/pkg/browser"
)

func main() {
	r := routes.RegisterRoutes()

	go startServer(r)

	err := browser.OpenURL("http://localhost:8080")

	if err != nil {
		fmt.Println("Error opening the browser: ", err)
	}

}

func startServer(r *mux.Router) {
	port := ":8080"
	fmt.Println("Server is running on port", port)
	log.Fatal(http.ListenAndServe(port, r))
}
