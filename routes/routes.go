package routes

import (
	"net/http"
	"github.com/gorilla/mux"
	"cash-register/controllers"
)

// RegisterRoutes sets up the routes and returns a router
func RegisterRoutes() *mux.Router {
	r := mux.NewRouter()

	// Serve static files from the "public" and "styles" directories
	r.PathPrefix("/public/").Handler(http.StripPrefix("/public/", http.FileServer(http.Dir("./public"))))
	r.PathPrefix("/styles/").Handler(http.StripPrefix("/styles/", http.FileServer(http.Dir("./styles"))))

	// Serve the HTML file for the root URL
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./views/cash_register.html")
	}).Methods("GET")

	// API routes
	r.HandleFunc("/ping", pingHandler).Methods("GET")
	r.HandleFunc("/end-day", controllers.EndDayHandler).Methods("POST")

	return r
}

// Handlers
func pingHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("pong"))
}