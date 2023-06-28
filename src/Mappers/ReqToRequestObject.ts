import { Request,Response } from "express";
import { RequestObject } from "../Models/RequestObject";

export const RequestObjectMapper = (req: Request): RequestObject => {
    const date = req?.query?.JsDevreqDate ? new Date(req?.query?.JsDevreqDate as string) : new Date()
    return {
        path: req.path,
        method: req.method,
        params: req.params,
        query: req.query,
        body: req.body,
        headers: "No headers",
        hostname: req.hostname,
        ip: req.ip,
        protocol: req.protocol,
        cookies: req.cookies,
        fresh: req.fresh,
        stale: req.stale,
        secure: req.secure,
        xhr: req.xhr,
        reqSize: req.socket.bytesRead,
        reqDate: date
   

    }
}
export const ResponseObjectMapper = (res: Response,error:Error|null=null): any => {
    return {
        status: res.statusCode,
        resSize: res.socket?res.socket.bytesWritten:0,
        error : error ? {
            name:error?.name,
            message:error?.message,
        } : undefined,

    }
}