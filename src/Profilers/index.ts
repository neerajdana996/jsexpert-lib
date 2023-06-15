import { NextFunction, Request, Response } from "express"
import JsPerformance from "./JsPerformance"

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
    getJsServerPerformanceMiddeleware = (req: Request, res: Response, next: NextFunction) => {
        console.log('this',this)
        return JsPerformance(req, res, next, this.clientId, this.clientSecret)
    }


}

interface IJsPertProfiler {
    clientId: string
    clientSecret: string
    init: (params: {
        clientId: string,
        clientSecret: string,
    }) => void
    getJsServerPerformanceMiddeleware: (req: Request, res: Response, next: NextFunction) => void
}

export default JsexpertProfiler