import { RequestObjectMapper } from "../Mappers/ReqToRequestObject";

import { DbPerformanceObject } from "../Models/DbPerformanceModel";

function MongoPerformance(options: any) {
  return function (schema: any) {
    // Intercept find method calls
    schema.pre('find', function (next: any) {
      // Store the start time of the query
      this._queryStartTime = process.hrtime();
      next();
    });

    schema.post('find', function (_: any, next: any) {
      // Calculate the query execution time
      const queryEndTime = process.hrtime(this._queryStartTime);
      const queryTimeInMs = (queryEndTime[0] * 1000) + (queryEndTime[1] / 1e6);
      const collectionName = this.model.collection.name;
      // Access the `req` object from options
      const req = options.req;
      if (req) {
        const performanceObject: DbPerformanceObject = {
          requestObject: RequestObjectMapper(req),
          durationInMilliseconds: queryTimeInMs,
          query: JSON.stringify(this.getQuery()),
          collectionName
        }
        console.log('performanceObject', performanceObject);
      } else {
        const performanceObject: DbPerformanceObject = {
          requestObject: null,
          durationInMilliseconds: queryTimeInMs,
          query: JSON.stringify(this.getQuery()),
          collectionName
        }
        console.log('performanceObject', performanceObject);

      }

      next();
    });
  };
};

export default MongoPerformance;