
import axios from 'axios';
export const saveJsPerformance = async (data: any,clientId:any,clientSecret:any) => {


    // const response = await fetch('https://api.jsexpert.io/server-data/', {
    //     method: 'POST',
    //     body: JSON.stringify({data}),
    //     headers: {
    //     'Content-Type': 'application/json',
    //     clientId,
    //     clientSecret
    //     }
    // })
    const axiosres = await axios.post('https://api.jsexpert.io/server-data/', {data}, {
        headers: {
            clientId,
            clientSecret
        }
    });
    return axiosres.data;
}

export const saveMongoosePerformance = async (data: any,clientId:any,clientSecret:any) => {
    const axiosres = await axios.post('https://api.jsexpert.io/db-data/', {data}, {
        headers: {
            clientId,
            clientSecret
        }
    });
    return axiosres.data;
}