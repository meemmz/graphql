// Set default page view
window.currentView = "home";

// Check if user is authenticated
function isLoggedIn() {
  return !!localStorage.getItem("jwt");
}

// Retrieve stored username after successful login
function getCurrentUsername() {
  return localStorage.getItem("currentUsername") || null;
}

// Change view and re-render navigation
window.setView = function (view) {
  window.currentView = view;
  window.renderNav();
};

// Render the navigation bar based on authentication state
window.renderNav = function () {
  const isAuthenticated = isLoggedIn();
  const username = getCurrentUsername();

  let navHTML = `<div class="topnav">`;

  if (!isAuthenticated) {
    navHTML += `
      <a href="#" id="loginMenuButton" class="${window.currentView === 'login' ? 'active' : ''}">Login</a>
    `;
  } else {
    navHTML += `
      <a href="#" id="userInfoButton" class="${window.currentView === 'account' ? 'active' : ''}">User Info</a>
      <div style="float: right; display: flex; align-items: center; gap: 10px;">
        <span class="topnavuser">Hello, ${username || 'User'}</span>
        <a href="#" id="logoutMenuButton">Logout</a>
      </div>
    `;
  }

  navHTML += `</div>`;
  document.getElementById('header').innerHTML = navHTML;

  window.attachNavEventListeners();
};

// Set up click handlers for nav buttons
window.attachNavEventListeners = function () {
  const loginBtn = document.getElementById('loginMenuButton');
  const userInfoBtn = document.getElementById('userInfoButton');
  const logoutBtn = document.getElementById('logoutMenuButton');

  if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.setView('login');
      window.Login?.();
    });
  }

  if (userInfoBtn) {
    userInfoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.setView('account');
      window.Login?.(); // Login() loads profile info
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout(); // logout is imported globally from auth.js
      alert('You have been logged out.');
      window.setView('login');
      window.Login?.();
    });
  }
};
