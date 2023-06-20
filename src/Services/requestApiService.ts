export const saveJsPerformance = async (data: any, clientId: any, clientSecret: any) => {
  const response = await fetch('https://api.jsexpert.io/server-data/', {
    method: 'POST',
    body: JSON.stringify({ data }),
    headers: {
      'Content-Type': 'application/json',
      clientId,
      clientSecret,
    },
  });
  return response.json();
};

export const saveMongoosePerformance = async (data: any, clientId: any, clientSecret: any) => {
  const response = await fetch('https://api.jsexpert.io/db-data/', {
    method: 'POST',
    body: JSON.stringify({ data }),
    headers: {
      'Content-Type': 'application/json',
      clientId,
      clientSecret,
    },
  });
  return response.json();
};
