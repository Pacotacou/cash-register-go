package main

import (
	"cash-register/routes"
	"fmt"
	"log"
	"net/http"
	"os"
	"sync"

	"github.com/gorilla/mux"
	"github.com/pkg/browser"
)

func main() {
	r := routes.RegisterRoutes()
	var wg sync.WaitGroup
	wg.Add(1)

	// Check if we're running in a container
	inContainer := os.Getenv("IN_CONTAINER")

	go startServer(r, &wg)

	// Only open the browser if we're not in a container
	if inContainer != "true" {
		err := browser.OpenURL("http://localhost:8080")
		if err != nil {
			fmt.Println("Error opening the browser: ", err)
		}
	} else {
		fmt.Println("Running in container. Access the application at http://localhost:8080 from your host machine.")
	}

	wg.Wait()
}

func startServer(r *mux.Router, wg *sync.WaitGroup) {
	port := ":8080"
	fmt.Println("Server is running on port", port)
	log.Fatal(http.ListenAndServe(port, r))
}
