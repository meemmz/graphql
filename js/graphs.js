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

export function auditsFiller(data) {
  const passedContainer = document.getElementById('passedPlc');
  const failedContainer = document.getElementById('failedPlc');

  if (!passedContainer || !failedContainer) {
    console.error('Audit containers not found');
    return;
  }

  const createAuditCard = (audit, status) => {
    const date = new Date(audit.createdAt).toLocaleDateString();
    const pathParts = audit.group.path.split('/');
    const project = pathParts[pathParts.length - 1];

    return `
      <div class="audit-card">
        <div class="audit-header">
          <h3>${project}</h3>
          <span class="audit-status ${status}">${status}</span>
        </div>
        <div class="audit-body">
          <p>Audited by: ${audit.group.captainLogin}</p>
          <p>Date: ${date}</p>
        </div>
      </div>
    `;
  };

  if (data && data.passed && data.passed.length > 0) {
    passedContainer.innerHTML = data.passed.map(audit => createAuditCard(audit, 'passed')).join('');
  } else {
    passedContainer.innerHTML = '<p>No passed audits found.</p>';
  }

  if (data && data.failed && data.failed.length > 0) {
    failedContainer.innerHTML = data.failed.map(audit => createAuditCard(audit, 'failed')).join('');
  } else {
    failedContainer.innerHTML = '<p>No failed audits found.</p>';
  }
}

export function FillProgressGraph(transactions) {
  const data = transactions.map(tx => ({
    date: new Date(tx.createdAt),
    xp: tx.amount
  })).sort((a, b) => a.date - b.date);

  let cumulativeXP = 0;
  const cumulativeData = data.map(d => {
    cumulativeXP += d.xp;
    return { date: d.date, xp: cumulativeXP };
  });

  const margin = { top: 20, right: 30, bottom: 30, left: 60 },
    width = 700 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

  const svg = d3.select("#XPOverTime")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleTime()
    .domain(d3.extent(cumulativeData, d => d.date))
    .range([0, width]);
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  const y = d3.scaleLinear()
    .domain([0, d3.max(cumulativeData, d => d.xp)])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y).tickFormat(d => `${(d / 1000).toFixed(0)}k`));

  svg.append("path")
    .datum(cumulativeData)
    .attr("fill", "none")
    .attr("stroke", "#69b3a2")
    .attr("stroke-width", 2)
    .attr("d", d3.line()
      .x(d => x(d.date))
      .y(d => y(d.xp))
    );
}

export function FillSkillsGraph(skills) {
  const technicalSkills = skills.filter(s => ['skill_go', 'skill_js', 'skill_html', 'skill_css', 'skill_unix', 'skill_tcp'].includes(s.type));
  const technologySkills = skills.filter(s => !technicalSkills.map(ts => ts.type).includes(s.type));

  createRadarChart("#technicalSkillsGraph", technicalSkills);
  createRadarChart("#technologySkillsGraph", technologySkills);
}

function createRadarChart(containerId, data) {
    if (!data || data.length === 0) {
        d3.select(containerId).append("p").text("No data available.");
        return;
    }

    const width = 300, height = 300, margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select(containerId).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    const features = data.map(d => d.type.replace('skill_', ''));
    const maxValue = d3.max(data, d => d.amount);
    const angleSlice = Math.PI * 2 / features.length;

    const rScale = d3.scaleLinear()
        .range([0, radius])
        .domain([0, maxValue]);

    const radarLine = d3.radialLine()
        .curve(d3.curveLinearClosed)
        .radius(d => rScale(d.amount))
        .angle((d, i) => i * angleSlice);

    const blobWrapper = svg.append('g')
        .attr('class', 'radar-wrapper');

    blobWrapper.append('path')
        .datum(data)
        .attr('d', radarLine)
        .style('fill', '#8e24aa')
        .style('fill-opacity', 0.7);
    
    const axisGrid = svg.append("g").attr("class", "axis-grid");
    
    axisGrid.selectAll(".levels")
       .data(d3.range(1, 4).reverse())
       .enter()
       .append("circle")
       .attr("class", "radar-circle")
       .attr("r", d => radius / 3 * d)
       .style("fill", "#CDCDCD")
       .style("stroke", "#CDCDCD")
       .style("fill-opacity", 0.1);

    const axis = axisGrid.selectAll(".axis")
        .data(features)
        .enter()
        .append("g")
        .attr("class", "radar-axis");

    axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", (d, i) => rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y2", (d, i) => rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2))
        .attr("class", "line")
        .style("stroke", "grey")
        .style("stroke-width", "1px");

    axis.append("text")
        .attr("class", "skill-label")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", (d, i) => rScale(maxValue * 1.25) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y", (d, i) => rScale(maxValue * 1.25) * Math.sin(angleSlice * i - Math.PI / 2))
        .text(d => capitalize(d));
}
