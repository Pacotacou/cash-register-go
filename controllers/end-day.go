package controllers

import (
	"encoding/json"
	"net/http"
	"cash-register/classes"
)

func EndDayHandler(w http.ResponseWriter, r *http.Request) {
	var request struct {
		Coins    map[int]int `json:"coins"`
		Holdover int         `json:"holdover"`
	}

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	cr := classes.NewCashRegister(request.Coins)
	removal, err := cr.EndDay(request.Holdover)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(removal)
}