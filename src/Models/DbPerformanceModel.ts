import { RequestObject } from "./RequestObject";

export interface DbPerformanceObject {
    requestObject?: RequestObject | null
    durationInMilliseconds: number
    query: string
    collectionName: string
    [key: string]: any
}