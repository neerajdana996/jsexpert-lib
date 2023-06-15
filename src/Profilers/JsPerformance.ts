import { NextFunction, Request, Response } from "express";
import { ApiPerformanceObject } from "../Models/ApiPerformanceModel";
import { RequestObjectMapper } from "../Mappers/ReqToRequestObject";

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

    fetch('https://squid-app-dzgtl.ondigitalocean.app/server-data/', {
      method: 'POST',
      body: JSON.stringify({data:performanceObject}),
      headers: {
        'Content-Type': 'application/json',
        clientId,
        clientSecret
      }
    })
  



    // You can perform further actions with the metrics, such as storing them in a database or sending them to a monitoring system

  });

  next();
};

export default JsPerformance;