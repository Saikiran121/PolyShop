package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
)

type Product struct {
	ID    string  `json:"id"`
	Name  string  `json:"name"`
	Price float64 `json:"price"`
	Icon  string  `json:"icon"` // Added Icon support
}

// Thread-safe storage
var (
	products = []Product{
		{ID: "1", Name: "Quantum Laptop", Price: 1299.99, Icon: "fa-laptop"},
		{ID: "2", Name: "Neural Headphones", Price: 199.99, Icon: "fa-headphones-simple"},
		{ID: "3", Name: "Smart Watch", Price: 299.99, Icon: "fa-clock"},
		{ID: "4", Name: "Ergo Chair X", Price: 899.99, Icon: "fa-chair"},
		{ID: "5", Name: "VR Kit Pro", Price: 699.99, Icon: "fa-vr-cardboard"},
		{ID: "6", Name: "Drone S1", Price: 499.00, Icon: "fa-plane-up"},
	}
	mu sync.Mutex
)

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func handleProducts(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	if r.Method == "OPTIONS" {
		return
	}

	w.Header().Set("Content-Type", "application/json")

	if r.Method == "GET" {
		mu.Lock()
		defer mu.Unlock()
		json.NewEncoder(w).Encode(products)
		return
	}

	if r.Method == "POST" {
		// Security Check
		auth := r.Header.Get("Authorization")
		if auth != "AdminSecret123" {
			http.Error(w, "Unauthorized: Admin access required", http.StatusUnauthorized)
			return
		}

		var p Product
		if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		mu.Lock()
		// Simple ID generation
		p.ID = fmt.Sprintf("%d", len(products)+1)
		if p.Icon == "" {
			p.Icon = "fa-box" // Default icon
		}
		products = append(products, p)
		mu.Unlock()

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(p)
		return
	}
}

func main() {
	http.HandleFunc("/products", handleProducts)
	fmt.Println("Product Service running on port 8081")
	log.Fatal(http.ListenAndServe(":8081", nil))
}
