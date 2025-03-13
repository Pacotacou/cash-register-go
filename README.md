# Cash Register Project

A web-based cash register system that calculates the coins to be removed at the end of the day to match a specified holdover amount. Built with Go (backend), HTML/CSS (frontend), and JavaScript (client-side logic).

![Cash Register Screenshot](./assets/screenshot.png)

---

## Features

- **Backend**:
  - Go server with Gorilla Mux for routing.
  - Cash register logic to calculate coin removal using a greedy algorithm.
  - RESTful API for processing end-of-day calculations.

- **Frontend**:
  - User-friendly interface to input coin quantities and holdover amount.
  - Dynamic updates using JavaScript and AJAX.

- **Error Handling**:
  - Backend validation for negative values and invalid inputs.
  - Frontend error messages for invalid requests.

---

## Project Structure
cash-register/
├── assets/ # Static assets (e.g., images, fonts)
├── classes/ # Core logic for the cash register
│ └── cash_register.go
├── controllers/ # Handlers for API endpoints
│ └── controllers.go
├── public/ # Client-side JavaScript files
│ └── cash_register.js
├── routes/ # Route definitions
│ └── routes.go
├── styles/ # CSS files for styling
│ └── cash_register.css
├── views/ # HTML templates
│ └── cash_register.html
├── go.mod # Go module dependencies
├── go.sum # Go dependency checksums
└── server.go # Entry point for the application


---

## Prerequisites

- **Go**: Install Go from [https://golang.org/dl/](https://golang.org/dl/).
- **Git**: Install Git from [https://git-scm.com/](https://git-scm.com/).

---