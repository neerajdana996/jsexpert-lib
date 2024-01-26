import JsPerformance from "./JsPerformance"
import MongoPerformance from "./mongooseProfiler"


class JsexpertProfiler implements IJsPertProfiler {
    clientSecret!: string
    clientId!: string
    projectName!: string
    projectId!: string
    init({ clientId, clientSecret, projectName }: {
        clientId: string,
        clientSecret: string,
        projectName: string
    }) {
        this.clientId = clientId
        this.clientSecret = clientSecret
        this.projectName = projectName
    }

    JsDbPerformanceMiddeleware = (schema: any) => {
        return MongoPerformance(schema, this.clientId, this.clientSecret)
    }
    getJsPerformanceInstance = () => {
        if (!this.clientId || !this.clientSecret) throw new Error('You need to call init method before getJsPerformance')
        return JsPerformance(this.clientId, this.clientSecret, this.projectName)
    }

}

interface IJsPertProfiler {
    clientId: string
    clientSecret: string
    projectName: string
    init: (params: {
        clientId: string,
        clientSecret: string,
        projectName: string

    }) => void

    getJsPerformanceInstance: (clientId: string, clientSecret: string, projectName: string) => {
        start: () => void;
        stop: () => void;
    }
    JsDbPerformanceMiddeleware: (schema: any) => void
}

export default JsexpertProfiler