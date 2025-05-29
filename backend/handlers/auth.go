package handlers

import (
	"encoding/base64"
	"encoding/json"
	"io"
	"net/http"
)

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	username := r.FormValue("username")
	password := r.FormValue("password")

	auth := base64.StdEncoding.EncodeToString([]byte(username + ":" + password))

	req, _ := http.NewRequest("POST", "https://learn.reboot01.com/api/auth/signin", nil)
	req.Header.Set("Authorization", "Basic "+auth)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		http.Error(w, "Login failed", 500)
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	w.Header().Set("Content-Type", "application/json")
	w.Write(body)
}