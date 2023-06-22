import { RequestObject, ResponseObject } from "./RequestObject";

export interface ApiPerformanceObject  {
    requestObject?: RequestObject | null
    responseObject?: ResponseObject | null
    durationInMilliseconds:number
    memoryUsage:number
}