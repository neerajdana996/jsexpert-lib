

import { DbPerformanceObject } from "../Models/DbPerformanceModel";
import { saveMongoosePerformance } from "../Services/requestApiService";

const docOperations = ['save'];
const queryOperations = ['find', 'findOne', 'updateOne', 'deleteOne', 'updateMany', 'insertMany', 'deleteMany'];

const MongoPerformance = function (schema: any, clientId: string, clientSecret: string) {
  [...queryOperations, ...docOperations].forEach(function (operation) {
    schema.pre(operation, function (next: any) {
      try {
        this._startTime = Date.now();

        // Differentiate between document and query operations
        this._collectionName = docOperations.includes(operation) ? this.constructor.modelName : this.model.modelName;

        this._operationType = operation;
        next && next();
      } catch (error) {
        next && next();
      }
    });
  });
  docOperations.forEach(function (operation) {
    schema.post(operation, function (_: any, next: any) {
      try {
        console.log('MongoPerformance post', operation);
        const duration = Date.now() - this._startTime;
        const performanceObject: any = {
          operation: this.op,
          durationInMilliseconds: duration,
          collectionName: this._collectionName,
          operationType: this._operationType,
        }

        saveMongoosePerformance(performanceObject, clientId, clientSecret).then((res) => {
          console.log('saveMongoosePerformance', res);
        }).catch((err) => {
          console.log('saveMongoosePerformance error', err);
        });
        next && next();
      } catch (error) {
        console.log('MongoPerformance post error', error);
        next && next();
      }

    });
  })
  queryOperations.forEach(function (operation) {
    schema.post(operation, function () {
      try {

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
        saveMongoosePerformance(performanceObject, clientId, clientSecret).then(() => {

        }).catch(() => {

        });

      } catch (error) {


      }

    });
  });


};
export default MongoPerformance;
