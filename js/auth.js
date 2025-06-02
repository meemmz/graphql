document.getElementById("login-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const base64 = btoa(`${username}:${password}`);
  
    const res = await fetch("https://learn.reboot01.com/api/auth/signin", {
      method: "POST",
      headers: { Authorization: `Basic ${base64}` }
    });
  
    if (!res.ok) {
      document.getElementById("error-msg").innerText = "Invalid credentials.";
      return;
    }
  
    const jwt = await res.text();
    localStorage.setItem("jwt", jwt);
    window.location.href = "profile.html";
  });
  
  function logout() {
    localStorage.removeItem("jwt");
    window.location.href = "index.html";
  }