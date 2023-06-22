import { NextFunction, Request, Response } from "express"
import JsPerformance from "./JsPerformance"
import MongoPerformance from "./mongooseProfiler"

import ExpressErrorMiddelwear from "./ExpressMiddelwear"

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
    JsExpressMiddelwear = (type:'ERROR'|'PERFORMANCE') => {
        if(type === 'ERROR'){
            return (error:Error,req: Request, res: Response, next: NextFunction) => {
                return ExpressErrorMiddelwear(error,req, res, next, this.clientId, this.clientSecret)
            }
        }
        return (req: Request, res: Response, next: NextFunction) => {
            return JsPerformance(req, res, next, this.clientId, this.clientSecret)
        }

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
    JsExpressMiddelwear: (type:'ERROR'|'PERFORMANCE') => ((error: Error, req: Request, res: Response, next: NextFunction) => void) 
        | ((req: Request, res: Response, next: NextFunction) => void)
    JsDbPerformanceMiddeleware: (schema:any) => void
}

export default JsexpertProfiler