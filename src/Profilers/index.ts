import JsPerformance from "./JsPerformance"
class JsexpertProfiler implements IJsPertProfiler {
    clientSecret!: string
    clientId!: string
    projectName!: string

    activate({ clientId, clientSecret, projectName, additionalInstrumentations = [], disableInstrumentations = [] }: {
        clientId: string,
        clientSecret: string,
        projectName: string,
        additionalInstrumentations: any[],
        disableInstrumentations: any[]
    }) {
        this.clientId = clientId
        this.clientSecret = clientSecret
        this.projectName = projectName
        if (!this.clientId || !this.clientSecret) throw new Error('You need to call init method before getJsPerformance')
        const sdk = JsPerformance(this.clientId, this.clientSecret, this.projectName,
            additionalInstrumentations, disableInstrumentations)
        console.log('starting sdk')
        sdk.start()
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
        additionalInstrumentations: any[],
        disableInstrumentations: any[]

    }) => void
}

export default JsexpertProfiler