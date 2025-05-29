package main

import (
	"log"
	"net/http"
	"graphql/handlers"
)

func main() {
	http.Handle("/", http.FileServer(http.Dir("./frontend")))
	http.HandleFunc("/graphql", handlers.ProxyGraphQL)

	log.Println("Server running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}