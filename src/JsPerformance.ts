import { NextFunction, Request, Response } from "express";

const JsPerformance = (req:Request, res:Response, next : NextFunction) => {
    const start = process.hrtime(); // Start measuring request processing time
  
    res.on('finish', () => {
      const end = process.hrtime(start); // End measuring request processing time
  
      const durationInMilliseconds = (end[0] * 1000) + (end[1] / 1e6); // Convert to milliseconds
  
      // Log performance metrics
      console.log(`Request URL: ${req.originalUrl}`);
      console.log(`Request Method: ${req.method}`);
      console.log(`Response Time: ${durationInMilliseconds}ms`);
      console.log(`Memory Usage: ${process.memoryUsage().heapUsed} bytes`);
  
      // You can perform further actions with the metrics, such as storing them in a database or sending them to a monitoring system
  
    });
  
    next();
  };

  export default JsPerformance;