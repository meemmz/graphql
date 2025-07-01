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

export function FillProgressGraph(progressInfo) {
    const XPOverTime = document.getElementById("XPOverTime");
    if (!XPOverTime || !progressInfo.length) return;
    
    // Clear existing content first to prevent duplicates
    XPOverTime.innerHTML = "";
    
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 800 400");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.style.overflow = "visible";
    
    const padding = 60;
    const width = 800 - 2 * padding;
    const height = 400 - 2 * padding;

    // Cumulative XP Calculation
    let cumulativeXP = 0;
    const cumulativeData = progressInfo.map((point) => ({
        createdAt: new Date(point.createdAt),
        amount: (cumulativeXP += point.amount),
        projectName: point.object.name,
    }));

    // Extracting Dates and XP max and min
    const dates = progressInfo.map((p) => new Date(p.createdAt).getTime());
    const xMin = new Date(Math.min(...dates));
    const xMax = new Date(Math.max(...dates));
    const yMin = 0;
    const yMax = Math.max(...cumulativeData.map((p) => p.amount));
    
    // Drawing the Axes
    const xAxis = document.createElementNS(svgNS, "line");
    xAxis.setAttribute("x1", padding);
    xAxis.setAttribute("y1", height + padding);
    xAxis.setAttribute("x2", width + padding);
    xAxis.setAttribute("y2", height + padding);
    xAxis.setAttribute("stroke", "#ffffff");
    svg.appendChild(xAxis);

    const yAxis = document.createElementNS(svgNS, "line");
    yAxis.setAttribute("x1", padding);
    yAxis.setAttribute("y1", padding);
    yAxis.setAttribute("x2", padding);
    yAxis.setAttribute("y2", height + padding);
    yAxis.setAttribute("stroke", "#ffffff");
    svg.appendChild(yAxis);

    // Adding Y-Axis Labels and Grid Lines
    for (let i = 0; i <= 5; i++) {
        const y = height + padding - (i * height) / 5;
        const value = Math.round((yMax * i) / 5);
        const label = document.createElementNS(svgNS, "text");
        label.setAttribute("x", padding - 10);
        label.setAttribute("y", y);
        label.setAttribute("text-anchor", "end");
        label.setAttribute("fill", "#ffffff");
        label.setAttribute("class", "axis-label");
        label.textContent = formatXP(value) + " KB";
        svg.appendChild(label);

        const gridLine = document.createElementNS(svgNS, "line");
        gridLine.setAttribute("x1", padding);
        gridLine.setAttribute("y1", y);
        gridLine.setAttribute("x2", width + padding);
        gridLine.setAttribute("y2", y);
        gridLine.setAttribute("stroke", "rgba(255, 255, 255, 0.1)");
        gridLine.setAttribute("class", "grid-line");
        svg.appendChild(gridLine);
    }

    // Adding X-Axis Date Labels
    const numDateLabels = 5;
    for (let i = 0; i <= numDateLabels; i++) {
        const x = padding + (i * width) / numDateLabels;
        const date = new Date(xMin.getTime() + (xMax - xMin) * (i / numDateLabels));
        const label = document.createElementNS(svgNS, "text");
        label.setAttribute("x", x);
        label.setAttribute("y", height + padding + 20);
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("fill", "#ffffff");
        label.setAttribute("class", "axis-label");
        label.textContent = date.toLocaleDateString();
        svg.appendChild(label);
    }

    // Plotting Data Points
    cumulativeData.forEach((point, index) => {
        const x = padding + ((point.createdAt - xMin) / (xMax - xMin)) * width;
        const y = height + padding - ((point.amount - yMin) / (yMax - yMin)) * height;

        if (index > 0) {
            const prevPoint = cumulativeData[index - 1];
            const prevX = padding + ((prevPoint.createdAt - xMin) / (xMax - xMin)) * width;
            const prevY = height + padding - ((prevPoint.amount - yMin) / (yMax - yMin)) * height;
            const line = document.createElementNS(svgNS, "line");
            line.setAttribute("x1", prevX);
            line.setAttribute("y1", prevY);
            line.setAttribute("x2", x);
            line.setAttribute("y2", y);
            line.setAttribute("stroke", "#8e24aa");
            line.setAttribute("stroke-width", "2");
            line.setAttribute("class", "xp-line animate-line");
            svg.appendChild(line);
        }

        // A circle element is created for each data point
        const dot = document.createElementNS(svgNS, "circle");
        dot.setAttribute("cx", x);
        dot.setAttribute("cy", y);
        dot.setAttribute("r", 4);
        dot.setAttribute("fill", "#8e24aa");
        dot.setAttribute("class", "xp-dot animate-dot");
        dot.style.animationDelay = `${index * 0.01}s`;

        dot.addEventListener("mouseover", (e) => {
            const tooltip = document.createElementNS(svgNS, "text");
            tooltip.setAttribute("x", x);
            tooltip.setAttribute("y", y - 20);
            tooltip.setAttribute("text-anchor", "middle");
            tooltip.setAttribute("fill", "#ffffff");
            tooltip.setAttribute("class", "tooltip");
            tooltip.textContent = formatXP(point.amount) + " KB";
            svg.appendChild(tooltip);

            const tooltip2 = document.createElementNS(svgNS, "text");
            tooltip2.setAttribute("x", x);
            tooltip2.setAttribute("y", y - 5);
            tooltip2.setAttribute("text-anchor", "middle");
            tooltip2.setAttribute("fill", "#ffffff");
            tooltip2.setAttribute("class", "tooltip2");
            tooltip2.textContent = point.projectName;
            svg.appendChild(tooltip2);
        });

        // Removing Tooltips event
        dot.addEventListener("mouseout", () => {
            const tooltip = svg.querySelector(".tooltip");
            if (tooltip) tooltip.remove();
            const tooltip2 = svg.querySelector(".tooltip2");
            if (tooltip2) tooltip2.remove();
        });

        svg.appendChild(dot);
    });

    XPOverTime.appendChild(svg);
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
