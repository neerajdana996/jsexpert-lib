import { NextFunction, Request, Response } from "express";
import { ApiPerformanceObject } from "../Models/ApiPerformanceModel";
import { RequestObjectMapper } from "../Mappers/ReqToRequestObject";
import axios from 'axios';
const JsPerformance = (req: Request, res: Response, next: NextFunction,
  clientId: string, clientSecret: string
) => {
  const start = process.hrtime(); // Start measuring request processing time

  res.on('finish', () => {
    const end = process.hrtime(start); // End measuring request processing time

    const durationInMilliseconds = (end[0] * 1000) + (end[1] / 1e6); // Convert to milliseconds

    // Log performance metrics

    const performanceObject: ApiPerformanceObject = {
      requestObject: RequestObjectMapper(req),
      durationInMilliseconds,
      memoryUsage: process.memoryUsage().heapUsed,
      reqSize: req.socket.bytesRead,
      resSize: req.socket.bytesWritten,
      resStatus: res.statusCode

    }

    axios.post('https://squid-app-dzgtl.ondigitalocean.app/server-data/', { data: performanceObject }, {
      headers: {
        'Content-Type': 'application/json',
        clientId,
        clientSecret
      }
    }).then((res) => {
      console.log(`statusCode: ${res.status}`)
      console.log(res)
    })



    // You can perform further actions with the metrics, such as storing them in a database or sending them to a monitoring system

  });

  next();
};

export default JsPerformance;