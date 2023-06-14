

import { DbPerformanceObject } from "../Models/DbPerformanceModel";

const MongoPerformance = function (schema:any) {
  // Intercept find method calls
  schema.pre('find', function (next:any) {
    // Store the start time of the query
    this._queryStartTime = process.hrtime();
    next();
  });

  schema.post('find', function (_:any, next:any) {
    // Calculate the query execution time
    const queryEndTime = process.hrtime(this._queryStartTime);
    const queryTimeInMs = (queryEndTime[0] * 1000) + (queryEndTime[1] / 1e6);

    // Get the API path from the Mongoose model's collection name
    const collectionName = this.model.collection.name;
    const apiPath = collectionName.slice(0, collectionName.lastIndexOf('s'));
    const performanceObject:DbPerformanceObject = {
      durationInMilliseconds:queryTimeInMs,
      query:JSON.stringify(this.getQuery()),
      collectionName:collectionName,
      populatedPaths:this._mongooseOptions.populatedPaths

    }
    // Log the query metrics with API path
    console.log(`API Path: /${apiPath}`);
    console.log(`MongoDB Query: ${collectionName}`);
    console.log(`Query Execution Time: ${queryTimeInMs}ms`);
    console.log(`performanceObject DB`,performanceObject);

    next();
  });
};
export default MongoPerformance;