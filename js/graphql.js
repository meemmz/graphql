async function graphqlQuery(query) {
    const jwt = localStorage.getItem("jwt");
  
    const res = await fetch("https://learn.reboot01.com/api/graphql-engine/v1/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
    });
  
    const data = await res.json();
    return data.data;
  }
  