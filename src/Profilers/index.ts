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
    startJsPerformanceInstance = () => {
        if (!this.clientId || !this.clientSecret) throw new Error('You need to call init method before getJsPerformance')
        const sdk = JsPerformance(this.clientId, this.clientSecret, this.projectName)
        sdk.start()
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

    startJsPerformanceInstance: (clientId: string, clientSecret: string, projectName: string) => void
    JsDbPerformanceMiddeleware: (schema: any) => void
}

export default JsexpertProfiler