window.addEventListener("load", async () => {
    const userData = await graphqlQuery(`
      {
        user {
          login
          id
        }
      }
    `);
  
    const userId = userData.user[0].id;
    document.getElementById("username").innerText = userData.user[0].login;
  
    const xpData = await graphqlQuery(`
      {
        transaction(where: {type: {_eq: "xp"}}) {
          amount
          createdAt
        }
      }
    `);
  
    const auditData = await graphqlQuery(`
      {
        transaction(where: {type: {_eq: "up"}}) {
          amount
        }
      }
    `);
  
    const failData = await graphqlQuery(`
      {
        progress(where: {grade: {_eq: 0}}) {
          id
        }
      }
    `);
  
    const passData = await graphqlQuery(`
      {
        progress(where: {grade: {_eq: 1}}) {
          id
        }
      }
    `);
  
    // Update UI
    const totalXP = xpData.transaction.reduce((sum, tx) => sum + tx.amount, 0);
    document.getElementById("xp-total").innerText = totalXP;
    document.getElementById("audit-ratio").innerText = auditData.transaction.length;
  
    // Graphs
    drawXPBarChart(xpData.transaction);
    drawResultPieChart(passData.progress.length, failData.progress.length);
  });