import { NextFunction, Request, Response } from "express"
import JsPerformance from "./JsPerformance"
import MongoPerformance from "./mongooseProfiler"

class JsexpertProfiler implements IJsPertProfiler {
    clientSecret!: string
    clientId!: string
    projectId!: string
    init({ clientId, clientSecret }: {
        clientId: string,
        clientSecret: string,
    }) {
        this.clientId = clientId
        this.clientSecret = clientSecret
    }
    JsServerPerformanceMiddeleware = (error:Error,req: Request, res: Response, next: NextFunction) => {
        return JsPerformance(error,req, res, next, this.clientId, this.clientSecret)
    }
    JsDbPerformanceMiddeleware = (schema:any) => {
        return MongoPerformance(schema, this.clientId, this.clientSecret)
    }

}

interface IJsPertProfiler {
    clientId: string
    clientSecret: string
    init: (params: {
        clientId: string,
        clientSecret: string,
        
    }) => void
    JsServerPerformanceMiddeleware: (error:Error,req: Request, res: Response, next: NextFunction) => void
    JsDbPerformanceMiddeleware: (schema:any) => void
}

export default JsexpertProfiler