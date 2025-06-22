import { getUserInfo } from './graphql.js';
import { createProfileHeader, formatXP, auditsFiller, FillProgressGraph, FillSkillsGraph } from './graphs.js';

const signinURL = 'https://learn.reboot01.com/api/auth/signin';

const extractUserId = token => {
  try {
    return JSON.parse(atob(token.split('.')[1]))["https://hasura.io/jwt/claims"]?.["x-hasura-user-id"] || 'Unknown';
  } catch {
    return 'Unknown';
  }
};

const updateUI = (show = true) => {
  const toggle = (id, add) => document.getElementById(id)?.classList[add ? 'add' : 'remove']('hidden');
  toggle('login-form', show);
  ['user-info', 'xp-progress-container', 'skills-container', 'user-audits-container'].forEach(id => toggle(id, !show));
};

async function login() {
  const id = document.getElementById('identifier').value;
  const password = document.getElementById('password').value;
  const errorMsg = document.getElementById('error-msg');
  errorMsg.textContent = '';

  try {
    const credentials = btoa(`${id}:${password}`);
    const res = await fetch(signinURL, { method: 'POST', headers: { 'Authorization': `Basic ${credentials}` } });
    if (!res.ok) throw new Error('Invalid credentials.');

    const token = (await res.json()).trim();
    localStorage.setItem('jwt', token);
    localStorage.setItem('isAuthenticated', 'true');
    window.isAuthenticated = true;

    const user = (await getUserInfo(token))[0] || {};
    const userId = extractUserId(token);

    localStorage.setItem('currentUsername', user.login || '');
    window.currentUsername = user.login || '';

    updateUI(true);
    renderProfileHeader(user);
    await Promise.all([fetchXPProgress(), fetchSkills(), fetchUserAudits()]);
    window.renderNav();

  } catch (err) {
    errorMsg.textContent = err.message;
  }
}

function logout() {
  ['jwt', 'isAuthenticated', 'currentUsername', 'LatestProject'].forEach(key => localStorage.removeItem(key));
  window.isAuthenticated = false;
  window.currentUsername = null;
  ['identifier', 'password'].forEach(id => document.getElementById(id).value = '');
  updateUI(false);
  window.renderNav();
}

function renderProfileHeader(user) {
  const labels = user.labels?.map(l => l.labelName).join(', ') || '';
  const campus = user.public?.campus || 'Unknown';
  const xp = user.transactions_aggregate?.aggregate?.sum?.amount || 0;
  const moduleXP = user.events?.filter(e => e.event?.path === "/bahrain/bh-module")
    .flatMap(e => e.event?.xps || []).reduce((sum, x) => sum + (x.amount || 0), 0);

  const level = (user.events?.find(e => e.event?.path === "/bahrain/bh-module")?.level) || 'N/A';
  const LP = localStorage.getItem('LatestProject') || 'N/A';

  createProfileHeader({
    image: user.image || 'css/GraphQL_Logo.png',
    id: user.id, login: user.login,
    firstName: user.firstName, lastName: user.lastName,
    auditRatio: user.auditRatio, totalXP: xp,
    totalModuleXP: moduleXP, email: user.email,
    campus, level, cohort: labels.split(', ')[0] || 'N/A',
    latestProject: LP
  });
}

async function graphqlQuery(query, variables = {}) {
  const token = localStorage.getItem('jwt');
  const res = await fetch('https://learn.reboot01.com/api/graphql-engine/v1/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ query, variables })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function fetchXPProgress() {
  const user = (await getUserInfo(localStorage.getItem('jwt')))[0];
  const q = `query ($userId: Int!) {
    transaction(where: {
      _and: [
        { userId: { _eq: $userId } },
        { type: { _eq: "xp" } },
        { path: { _like: "/bahrain/bh-module%" } },
        { _not: { path: { _like: "/bahrain/bh-module/piscine-js%" } } },
        { _not: { path: { _like: "/bahrain/bh-module/checkpoint%" } } }
      ]}, order_by: { createdAt: asc }) {
      path amount createdAt object { name }
    }
  }`;
  const result = await graphqlQuery(q, { userId: user.id });
  const txs = result.data.transaction || [];
  const latest = [...txs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  localStorage.setItem('LatestProject', latest?.path || '');
  FillProgressGraph(txs);
}

async function fetchSkills() {
  const user = (await getUserInfo(localStorage.getItem('jwt')))[0];
  const q = `query skills($userId: Int!) {
    user: user_by_pk(id: $userId) {
      transactions(distinct_on: [type], order_by: [{ type: asc }, { amount: desc }],
      where: { userId: { _eq: $userId }, type: { _like: "skill_%" } }) {
        type amount
      }
    }
  }`;
  const result = await graphqlQuery(q, { userId: user.id });
  FillSkillsGraph(result.data.user.transactions);
}

async function fetchUserAudits() {
  const user = (await getUserInfo(localStorage.getItem('jwt')))[0];
  const q = `query getUserAudits($userId: Int!) {
    user(where: { id: { _eq: $userId } }) {
      passed: audits(where: { grade: { _gte: 1 } }, order_by: { createdAt: desc }) {
        group { captainLogin path } createdAt
      }
      failed: audits(where: { grade: { _lt: 1 } }, order_by: { createdAt: desc }) {
        group { captainLogin path } createdAt
      }
    }
  }`;
  const result = await graphqlQuery(q, { userId: user.id });
  auditsFiller(result.data.user[0]);
}

function Login() {
  const main = document.getElementById('main');
  if (!main) return;
  main.innerHTML = `
    <div id="login-form">
      <h1>Login</h1>
      <input type="text" id="identifier" placeholder="Email or Username" /><br><br>
      <input type="password" id="password" placeholder="Password" /><br><br>
      <button onclick="login()">Login</button>
      <p class="error" id="error-msg"></p>
    </div>
    <div id="user-info" class="hidden"></div>
    <div class="profile-section"></div>
    <div id="xp-progress-container" class="hidden"><h2>XP Progress</h2><div id="XPOverTime"></div></div>
    <div id="skills-container" class="skills-container hidden">
      <div id="technical-skills-container"><h2>Technical Skills</h2><div id="technicalSkillsGraph"></div></div>
      <div id="technology-skills-container"><h2>Technology Skills</h2><div id="technologySkillsGraph"></div></div>
    </div>
    <div id="user-audits-container" class="hidden">
      <h2>User Audits</h2>
      <div id="usrAudits">
        <h3>Passed Audits</h3><div id="passedPlc" class="audit-container usrAudits"></div>
        <h3>Failed Audits</h3><div id="failedPlc" class="audit-container usrAudits"></div>
      </div>
    </div>`;

  const token = localStorage.getItem('jwt');
  if (token && extractUserId(token) !== 'Unknown') {
    getUserInfo(token).then(userArr => {
      const user = userArr[0] || {};
      updateUI(true);
      renderProfileHeader(user);
      fetchXPProgress();
      fetchSkills();
      fetchUserAudits();
      window.renderNav();
    }).catch(() => localStorage.removeItem('jwt'));
  } else {
    updateUI(false);
  }
}

export { login, logout, Login };

Login();
