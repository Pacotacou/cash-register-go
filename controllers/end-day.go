package controllers

import (
	"encoding/json"
	"net/http"
	"cash-register/classes"
	"fmt"
)

func EndDayHandler(w http.ResponseWriter, r *http.Request) {
	var request struct {
		Coins    map[int]int `json:"coins"`
		Holdover int         `json:"holdover"`
	}

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid JSON payload")
		return
	}

	// Validate coins
	for value, qty := range request.Coins {
		if qty < 0 {
			respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Coin %d¢ has invalid quantity: %d", value, qty))
			return
		}
	}

	// Validate holdover
	if request.Holdover < 0 {
		respondWithError(w, http.StatusBadRequest, "Holdover amount cannot be negative")
		return
	}

	cr := classes.NewCashRegister(request.Coins)
	removal, err := cr.EndDay(request.Holdover)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(removal)
}

// Helper function for consistent error responses
func respondWithError(w http.ResponseWriter, code int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{"error": message})
}