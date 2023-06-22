import { NextFunction, Request, Response } from "express";
import { ApiPerformanceObject } from "../Models/ApiPerformanceModel";
import { RequestObjectMapper } from "../Mappers/ReqToRequestObject";
import { saveJsPerformance } from "../Services/requestApiService";

const JsPerformance = (error:Error,req: Request, res: Response, next: NextFunction,
  clientId: string, clientSecret: string
) => {
  const start = process.hrtime(); // Start measuring request processing time
  console.log('error',req.path,error.stack,error.message,error.name,error)
  res.on('error', (err) => {
    console.log('error in error',req.path,err.stack,err.message,err.name,err)
  });
  res.on('finish', () => {
    const end = process.hrtime(start); // End measuring request processing time
    console.log('error in finished',req.path,error.stack,error.message,error.name,error)
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

    saveJsPerformance(performanceObject, clientId, clientSecret)

    // You can perform further actions with the metrics, such as storing them in a database or sending them to a monitoring system

  });

  next();
};

export default JsPerformance;