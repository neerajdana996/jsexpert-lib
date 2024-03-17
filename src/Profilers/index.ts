import { NodeSDK } from "@opentelemetry/sdk-node";
import JsPerformance from "./JsPerformance";
class JsexpertProfiler implements IJsPertProfiler {
    clientSecret!: string
    clientId!: string
    projectName!: string

    activate({ clientId, clientSecret, projectName, additionalInstrumentations = [], disableInstrumentations = [],
        devMode = false
    }: {
        clientId: string,
        clientSecret: string,
        projectName: string,
        additionalInstrumentations?: any[],
        disableInstrumentations?: any[],
        devMode?: boolean
    }) {
        this.clientId = clientId
        this.clientSecret = clientSecret
        this.projectName = projectName
        if (!this.clientId || !this.clientSecret) throw new Error('You need to call init method before getJsPerformance')
        return JsPerformance(this.clientId, this.clientSecret, this.projectName,
            additionalInstrumentations, disableInstrumentations, devMode)

    }



}

interface IJsPertProfiler {
    clientId: string
    clientSecret: string
    projectName: string
    activate: (params: {
        clientId: string,
        clientSecret: string,
        projectName: string,
        additionalInstrumentations?: any[],
        disableInstrumentations?: any[],
        devMode?: boolean

    }) => NodeSDK
}

export default JsexpertProfiler