import { RequestObject } from "./RequestObject";

export interface ApiPerformanceObject  {
    requestObject?: RequestObject | null

    durationInMilliseconds:number
    memoryUsage:number
    reqSize:number
    resSize:number
    resStatus:number
}