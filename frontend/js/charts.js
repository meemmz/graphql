function drawXPBarChart(data) {
    const container = document.getElementById("xp-graph");
    container.innerHTML = "";
  
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", 600);
    svg.setAttribute("height", 300);
  
    data.slice(0, 10).forEach((tx, i) => {
      const barHeight = tx.amount / 10;
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", 60 * i + 10);
      rect.setAttribute("y", 300 - barHeight);
      rect.setAttribute("width", 50);
      rect.setAttribute("height", barHeight);
      rect.setAttribute("fill", "teal");
      svg.appendChild(rect);
    });
  
    container.appendChild(svg);
  }
  
  function drawResultPieChart(pass, fail) {
    const container = document.getElementById("result-graph");
    container.innerHTML = "";
  
    const total = pass + fail;
    const passAngle = (pass / total) * 360;
  
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", 300);
    svg.setAttribute("height", 300);
  
    const passArc = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    passArc.setAttribute("cx", 150);
    passArc.setAttribute("cy", 150);
    passArc.setAttribute("r", 100);
    passArc.setAttribute("fill", "none");
    passArc.setAttribute("stroke", "green");
    passArc.setAttribute("stroke-width", 50);
    passArc.setAttribute("stroke-dasharray", `${passAngle} ${360 - passAngle}`);
    passArc.setAttribute("transform", "rotate(-90 150 150)");
  
    const failArc = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    failArc.setAttribute("cx", 150);
    failArc.setAttribute("cy", 150);
    failArc.setAttribute("r", 100);
    failArc.setAttribute("fill", "none");
    failArc.setAttribute("stroke", "red");
    failArc.setAttribute("stroke-width", 50);
    failArc.setAttribute("stroke-dasharray", `${360 - passAngle} ${passAngle}`);
    failArc.setAttribute("transform", `rotate(${passAngle - 90} 150 150)`);
  
    svg.appendChild(passArc);
    svg.appendChild(failArc);
    container.appendChild(svg);
  }