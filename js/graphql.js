export async function getUserInfo(token) {
  const response = await fetch('https://learn.reboot01.com/api/graphql-engine/v1/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      query: `
        query {
          user(limit: 1) {
            id
            login
            firstName
            lastName
            email
            auditRatio
            totalDown
            totalUp
            attrs
            events {
              level
              event {
                path
                xps(where: {
                  event: { path: { _eq: "/bahrain/bh-module" } }
                }) {
                  amount
                  originEventId
                  path
                  userId
                }
              }
            }
            labels {
              labelName
            }
            public {
              campus
            }
            transactions_aggregate(
              where: {
                event: { path: { _eq: "/bahrain/bh-module" } }
                type: { _eq: "xp" }
              }
            ) {
              aggregate {
                sum {
                  amount
                }
              }
            }
          }
        }
      `
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to fetch user info: ${text}`);
  }

  const json = await response.json();

  if (json.errors) {
    throw new Error(`GraphQL error: ${json.errors[0].message}`);
  }

  return json.data.user;
}
