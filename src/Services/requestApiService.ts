export const saveJsPerformance = async (data: any,clientId:any,clientSecret:any) => {
    const response = await fetch('https://squid-app-dzgtl.ondigitalocean.app/server-data/', {
        method: 'POST',
        body: JSON.stringify({data}),
        headers: {
        'Content-Type': 'application/json',
        clientId,
        clientSecret
        }
    })
    return response.json();
}

export const saveMongoosePerformance = async (data: any,clientId:any,clientSecret:any) => {
    const response = await fetch('https://squid-app-dzgtl.ondigitalocean.app/db-data/', {
        method: 'POST',
        body: JSON.stringify({data}),
        headers: {
        'Content-Type': 'application/json',
        clientId,
        clientSecret
        }
    })
    return response.json();
}