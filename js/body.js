document.addEventListener('DOMContentLoaded', async function () {
  try {
const { login, logout, Login } = await import('./auth.js');
    window.login = login;
    window.logout = logout;
    window.Login = Login;

    const path = window.location.pathname;
    const errorMatch = path.match(/^\/error\/(\d{3})$/);

    if (errorMatch) {
      const code = parseInt(errorMatch[1], 10);
      renderErrorPage(code, getDefaultErrorMessage(code));
      return;
    }

    window.currentView = "home";
    if (typeof renderNav === "function") renderNav();

    const main = document.getElementById('main');
    if (!main) throw new Error("Main container not found.");

    // Always call Login to render form and auto-login if token exists
    if (!window.isAuthenticated) {
        if (typeof window.Login === "function") {
        window.Login();
    } else {
      console.warn("Login function not defined.");
    }
        return;
    }
    
     main.innerHTML = `<h1 class="Heading">Welcome</h1>`;

  } catch (err) {
    console.error("Error rendering GraphQL app:", err);
    renderErrorPage(500, "Failed to render app content");
  }
});
