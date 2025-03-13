# Code Structure

- assets/
- classes/
    - cash_register.go
- controllers/
- public/
    - cash_register.js
- routes/
    - routes.go
- styles/
    - cash_register.css
- views/
    - cash_register.html
- go.mod
- go.sum
- server.go

# Code Content

Filepath: /classes/cash_register.go
```go
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

```

Filepath: /go.mod
```mod
module cash-register

go 1.24.1

require github.com/gorilla/mux v1.8.1 // indirect

```

Filepath: /go.sum
```sum
github.com/gorilla/mux v1.8.1 h1:TuBL49tXwgrFYWhqrNgrUNEY92u81SPhu7sTdzQEiWY=
github.com/gorilla/mux v1.8.1/go.mod h1:AKf9I4AEqPTmMytcMc0KkNouC66V3BtZ4qD5fmWSiMQ=

```

Filepath: /public/cash_register.js
```js
$(document).ready(function() {
    $('#calculate').click(function() {
        let coins = {
            1: parseInt($('#c1').val()),
            5: parseInt($('#c5').val()),
            10: parseInt($('#c10').val()),
            25: parseInt($('#c25').val()),
            50: parseInt($('#c50').val()),
            100: parseInt($('#c100').val()),
            500: parseInt($('#c500').val()),
            1000: parseInt($('#c1000').val()),
            2000: parseInt($('#c2000').val())
        };
        let holdover = parseInt($('#holdover').val());
        
        $.ajax({
            url: '/end-day',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ coins: coins, holdover: holdover }),
            success: function(response) {
                $('#result').empty();
                $.each(response, function(coin, quantity) {
                    $('#result').append('<li>' + coin + '¢: ' + quantity + '</li>');
                });
            },
            error: function() {
                alert('Error processing request');
            }
        });
    });
});

```

Filepath: /routes/routes.go
```go
package routes

import (
	"net/http"
	"github.com/gorilla/mux"
)

// RegisterRoutes sets up the routes and returns a router
func RegisterRoutes() *mux.Router {
	r := mux.NewRouter()

	r.HandleFunc("/", homeHandler).Methods("GET")
	r.HandleFunc("/ping", pingHandler).Methods("GET")

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

```

Filepath: /server.go
```go
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

```

Filepath: /styles/cash_register.css
```css
body {
    font-family: Arial, sans-serif;
    margin: 20px;
    text-align: center;
}

table {
    width: 50%;
    margin: 20px auto;
    border-collapse: collapse;
}

th, td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
}

th {
    background-color: #f4f4f4;
}

button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
}

button:hover {
    background-color: #0056b3;
}

```

Filepath: /views/cash_register.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cash Register</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="stylesheet" href="/styles/style.css">
</head>
<body>
    <h1>Cash Register</h1>
    <table>
        <tr>
            <th>Denomination</th>
            <th>Quantity</th>
        </tr>
        <tr><td>1¢</td><td><input type="number" id="c1" value="0"></td></tr>
        <tr><td>5¢</td><td><input type="number" id="c5" value="0"></td></tr>
        <tr><td>10¢</td><td><input type="number" id="c10" value="0"></td></tr>
        <tr><td>25¢</td><td><input type="number" id="c25" value="0"></td></tr>
        <tr><td>50¢</td><td><input type="number" id="c50" value="0"></td></tr>
        <tr><td>$1</td><td><input type="number" id="c100" value="0"></td></tr>
        <tr><td>$5</td><td><input type="number" id="c500" value="0"></td></tr>
        <tr><td>$10</td><td><input type="number" id="c1000" value="0"></td></tr>
        <tr><td>$20</td><td><input type="number" id="c2000" value="0"></td></tr>
    </table>
    <label for="holdover">Holdover Amount: </label>
    <input type="number" id="holdover" value="0">
    <br>
    <button id="calculate">End Day</button>
    <h2>Coins to Remove</h2>
    <ul id="result"></ul>
    
    <script src="/public/script.js"></script>
</body>
</html>
```

