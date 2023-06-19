import { Request } from "express";
import { RequestObject } from "../Models/RequestObject";

export const RequestObjectMapper = (req: Request): RequestObject => {
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
        xhr: req.xhr

    }
}