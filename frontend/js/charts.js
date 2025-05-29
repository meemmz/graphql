function drawBarGraph(data) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", 500);
    svg.setAttribute("height", 300);
  
    data.forEach((item, index) => {
      const barHeight = item.amount / 10;
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", 50 * index);
      rect.setAttribute("y", 300 - barHeight);
      rect.setAttribute("width", 40);
      rect.setAttribute("height", barHeight);
      rect.setAttribute("fill", "steelblue");
      svg.appendChild(rect);
    });
  
    document.getElementById("graph-container").appendChild(svg);
  }