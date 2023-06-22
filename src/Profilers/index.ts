import { NextFunction, Request, Response } from "express"
import JsPerformance from "./JsPerformance"
import MongoPerformance from "./mongooseProfiler"
import ExpressMiddelwear from "./ExpressMiddelwear"

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
    JsServerPerformanceMiddeleware = (req: Request, res: Response, next: NextFunction) => {
        return JsPerformance(req, res, next, this.clientId, this.clientSecret)
    }
    JsDbPerformanceMiddeleware = (schema:any) => {
        return MongoPerformance(schema, this.clientId, this.clientSecret)
    }
    JsExpressMiddelwear = (error:Error,req: Request, res: Response, next: NextFunction) => {
        return ExpressMiddelwear(error,req, res, next, this.clientId, this.clientSecret)
    }

}

interface IJsPertProfiler {
    clientId: string
    clientSecret: string
    init: (params: {
        clientId: string,
        clientSecret: string,
        
    }) => void
    JsServerPerformanceMiddeleware: (req: Request, res: Response, next: NextFunction) => void
    JsExpressMiddelwear: (error:Error,req: Request, res: Response, next: NextFunction) => void
    JsDbPerformanceMiddeleware: (schema:any) => void
}

export default JsexpertProfiler