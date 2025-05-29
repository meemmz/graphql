async function fetchXP() {
    const jwt = localStorage.getItem("jwt");
  
    const query = `
      {
        transaction(where: {type: {_eq: "xp"}}) {
          amount
          createdAt
        }
      }
    `;
  
    const res = await fetch("https://learn.reboot01.com/api/graphql-engine/v1/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
    });
  
    const data = await res.json();
    return data.data.transaction;
  }


  const res = await fetch("/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query })
  });