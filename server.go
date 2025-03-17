package main

import (
	"fmt"
	"log"
	"net/http"
	"sync"

	"cash-register/routes"

	"github.com/gorilla/mux"
	"github.com/pkg/browser"
)

func main() {
	r := routes.RegisterRoutes()

	var wg sync.WaitGroup

	wg.Add(1)
	go startServer(r, &wg)

	err := browser.OpenURL("http://localhost:8080")

	if err != nil {
		fmt.Println("Error opening the browser: ", err)
	}
	wg.Wait()

}

func startServer(r *mux.Router, wg *sync.WaitGroup) {
	port := ":8080"
	fmt.Println("Server is running on port", port)
	log.Fatal(http.ListenAndServe(port, r))
}
