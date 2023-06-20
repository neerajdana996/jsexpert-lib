import { DbPerformanceObject } from '../Models/DbPerformanceModel';
import { saveMongoosePerformance } from '../Services/requestApiService';

const MongoPerformance = function (schema: any, clientId: string, clientSecret: string) {
  // Intercept find method calls
  schema.pre('find', function (next: any) {
    // Store the start time of the query
    this._queryStartTime = process.hrtime();
    next();
  });

  schema.post('find', function (_: any, next: any) {
    // Calculate the query execution time
    const queryEndTime = process.hrtime(this._queryStartTime);
    const queryTimeInMs = queryEndTime[0] * 1000 + queryEndTime[1] / 1e6;

    // Get the API path from the Mongoose model's collection name
    const collectionName = this.model.collection.name;

    const performanceObject: DbPerformanceObject = {
      durationInMilliseconds: queryTimeInMs,
      query: JSON.stringify(this.getQuery()),
      collectionName,
      populatedPaths: this.getPopulatedPaths(),
      options: this.getOptions(),
    };
    saveMongoosePerformance(performanceObject, clientId, clientSecret);

    next();
  });
};
export default MongoPerformance;
