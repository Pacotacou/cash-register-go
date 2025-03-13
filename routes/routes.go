package routes

import (
	"net/http"
	"github.com/gorilla/mux"
	"cash-register/controllers"
)

// RegisterRoutes sets up the routes and returns a router
func RegisterRoutes() *mux.Router {
	r := mux.NewRouter()

	r.HandleFunc("/", homeHandler).Methods("GET")
	r.HandleFunc("/ping", pingHandler).Methods("GET")
	r.HandleFunc("/end-day", controllers.EndDayHandler).Methods("POST")

	return r
}

// Handlers
func homeHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Welcome to Cash Register API"))
}

func pingHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("pong"))
}
