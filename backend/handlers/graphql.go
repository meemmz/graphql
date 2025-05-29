package handlers

import (
	"encoding/json"
	"io"
	"net/http"
	"strings"
)

// GraphQLRequest is a basic structure for forwarding GraphQL payloads
type GraphQLRequest struct {
	Query string `json:"query"`
}

// ProxyGraphQL handles incoming GraphQL requests and forwards them
func ProxyGraphQL(w http.ResponseWriter, r *http.Request) {
	// Parse incoming body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Failed to read request body", http.StatusBadRequest)
		return
	}

	// Get JWT from Authorization header
	authHeader := r.Header.Get("Authorization")
	if !strings.HasPrefix(authHeader, "Bearer ") {
		http.Error(w, "Missing or invalid Authorization header", http.StatusUnauthorized)
		return
	}

	// Forward to Reboot01 GraphQL endpoint
	req, err := http.NewRequest("POST", "https://learn.reboot01.com/api/graphql-engine/v1/graphql", strings.NewReader(string(body)))
	if err != nil {
		http.Error(w, "Failed to create request", http.StatusInternalServerError)
		return
	}

	req.Header.Set("Authorization", authHeader)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, "Failed to forward request", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	// Copy response to client
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(resp.StatusCode)
	io.Copy(w, resp.Body)
}
