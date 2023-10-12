

import { DbPerformanceObject } from "../Models/DbPerformanceModel";
import { saveMongoosePerformance } from "../Services/requestApiService";
const operations = ['find', 'findOne', 'updateOne', 'deleteOne', 'updateMany', 'insertMany', 'deleteMany'];

const MongoPerformance = function (schema: any, clientId: string, clientSecret: string) {
  console.log('MongoPerformance', clientId, clientSecret);
  
  operations.forEach(operation => {
    schema.pre(operation, function (next:any) {
      console.log('MongoPerformance pre', operation,this.mongooseCollection.name);
      this._startTime = Date.now();
      this._collectionName = this.mongooseCollection.name;
      this._operationType = operation;
      next();
    });
    
  });

  // 'post' middleware for all operations
  operations.forEach(operation => {
    schema.post(operation, function (next:any) {
      console.log('MongoPerformance post', operation,this.mongooseCollection.name);

      const duration = Date.now() - this._startTime;
      const performanceObject: DbPerformanceObject = {
        operation: this.op,
        durationInMilliseconds: duration,
        query: JSON.stringify(this.getQuery()),
        collectionName: this._collectionName,
        populatedPaths: this.getPopulatedPaths(),
        options: this.getOptions(),
        operationType: this._operationType,
  
      }
      saveMongoosePerformance(performanceObject, clientId, clientSecret).then((res) => {
        console.log('saveMongoosePerformance', res);
      }).catch((err) => {
        console.log('saveMongoosePerformance error', err);
      });
      next();
      
    });
  });
};
export default MongoPerformance;
