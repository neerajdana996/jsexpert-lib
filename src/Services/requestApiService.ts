


const http = require('http');

const hostname = 'api.jsexpert.io';
const apiCall = async (data: any, clientId: string, clientSecret: string,path:string) => {
  const payload = JSON.stringify({ data });

  const options = {
    hostname,
    path,
    method: 'POST',


    headers: {
      'Content-Type': 'application/json',
      clientId,
      clientSecret
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res: { on: (arg0: string, arg1: { (chunk: any): void; (): void; }) => void; statusCode: number; }) => {
      let responseData = '';

      res.on('data', (chunk:any) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode <= 299) {
          resolve(JSON.parse(responseData));
        } else {
          reject(new Error(`Request failed with status code ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error: any) => {
      reject(error);
    });

    req.write(payload);
    req.end();
  });
};


export const saveJsPerformance = async (data: any,clientId:any,clientSecret:any) => {
    const response = await apiCall(data, clientId, clientSecret,'/server-data/');
 
    return response;
}

export const saveMongoosePerformance = async (data: any,clientId:any,clientSecret:any) => {
    const response = await apiCall(data, clientId, clientSecret,'/db-data/');
 
    return response;
}
// export const saveJsPerformance = async (data: any,clientId:any,clientSecret:any) => {
//     const response = await fetch('https://api.jsexpert.io/server-data/', {
//         method: 'POST',
//         body: JSON.stringify({data}),
//         headers: {
//         'Content-Type': 'application/json',
//         clientId,
//         clientSecret
//         }
//     })
//     return response.json();
// }

// export const saveMongoosePerformance = async (data: any,clientId:any,clientSecret:any) => {
//     const response = await fetch('https://api.jsexpert.io/db-data/', {
//         method: 'POST',
//         body: JSON.stringify({data}),
//         headers: {
//         'Content-Type': 'application/json',
//         clientId,
//         clientSecret
//         }
//     })
//     return response.json();
// }