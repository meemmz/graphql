// Renders the profile header UI with user data
export function createProfileHeader(userData) {
  const profileSection = document.querySelector('.profile-section');
  if (!profileSection) {
    console.error('Profile section not found');
    return;
  }

  const headerHTML = `
    <div class="profile-container">
      <div class="profile-header">
        <div class="profile-image">
          <img src="${userData.image || 'css/GraphQL_Logo.png'}" alt="Profile Picture">
        </div>
        <div class="profile-info">
          <div class="info-row single">
            <div class="info-item full-width">
              <span class="label">ID:</span>
              <span class="value">${userData.id || 'N/A'}</span>
            </div>
          </div>

          <div class="info-row">
            <div class="info-item">
              <span class="label">Name:</span>
              <span class="value">${userData.firstName || ''} ${userData.lastName || ''}</span>
            </div>
            <div class="info-item">
              <span class="label">Username:</span>
              <span class="value">${userData.login || 'N/A'}</span>
            </div>
          </div>

          <div class="info-row">
            <div class="info-item">
              <span class="label">Email:</span>
              <span class="value">${userData.email || 'N/A'}</span>
            </div>
            <div class="info-item">
              <span class="label">Level:</span>
              <span class="value">${userData.level || 'N/A'}</span>
            </div>
          </div>

          <div class="info-row">
            <div class="info-item">
              <span class="label">Campus:</span>
              <span class="value">${userData.campus ? capitalize(userData.campus) : 'N/A'}</span>
            </div>
            <div class="info-item">
              <span class="label">Audit Ratio:</span>
              <span class="value highlight">${userData.auditRatio?.toFixed(2) || 'N/A'}</span>
            </div>
          </div>

          <div class="info-row">
            <div class="info-item">
              <span class="label">Total XP:</span>
              <span class="value highlight">${formatXP(userData.totalXP)} KB</span>
            </div>
            <div class="info-item">
              <span class="label">Module XP:</span>
              <span class="value highlight">${formatXP(userData.totalModuleXP)} KB</span>
            </div>
          </div>

          <div class="info-row single">
            <div class="info-item full-width">
              <span class="label">Latest Project:</span>
              <span class="value highlight">${userData.latestProject || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  profileSection.innerHTML = headerHTML;
}

// Placeholder for future XP graph implementation
export function createXPGraph(transactions) {
  // TODO: implement XP visual
}

// Placeholder for future progress graph implementation
export function createProgressGraph(progress) {
  // TODO: implement progress visual
}

// Formats XP from bytes to KB for display
export function formatXP(xp) {
  if (typeof xp !== 'number') return '0';
  return (xp / 1000).toFixed(0);
}

// Capitalizes the first letter of a string
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
