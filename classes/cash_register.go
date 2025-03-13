package classes

import (
	"errors"
)

type CashRegister struct {
	Coins map[int]int
}

// NewCashRegister initializes a new cash register with given quantities
func NewCashRegister(coins map[int]int) *CashRegister {
	return &CashRegister{Coins: coins}
}

// EndDay calculates the coins to be removed to match the holdover amount
func (cr *CashRegister) EndDay(holdover int) (map[int]int, error) {
	if holdover < 0 {
		return nil, errors.New("holdover amount cannot be negative")
	}

	total := 0
	for value, quantity := range cr.Coins {
		total += value * quantity
	}

	if holdover > total {
		return nil, errors.New("holdover amount exceeds total cash in register")
	}

	removal := make(map[int]int)
	remaining := total - holdover
	coinValues := []int{2000, 1000, 500, 100, 50, 25, 10, 5, 1}

	for _, value := range coinValues {
		if remaining == 0 {
			break
		}
		qtyToRemove := min(remaining/value, cr.Coins[value])
		if qtyToRemove > 0 {
			removal[value] = qtyToRemove
			remaining -= value * qtyToRemove
		}
	}

	return removal, nil
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
