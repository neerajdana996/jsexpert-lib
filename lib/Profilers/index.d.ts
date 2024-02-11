declare class JsexpertProfiler implements IJsPertProfiler {
    clientSecret: string;
    clientId: string;
    projectName: string;
    activate({ clientId, clientSecret, projectName, additionalInstrumentations: [], disableInstrumentations: [] }: {
        clientId: string;
        clientSecret: string;
        projectName: string;
        additionalInstrumentations: any[];
        disableInstrumentations: any[];
    }): void;
}
interface IJsPertProfiler {
    clientId: string;
    clientSecret: string;
    projectName: string;
    activate: (params: {
        clientId: string;
        clientSecret: string;
        projectName: string;
        additionalInstrumentations: any[];
        disableInstrumentations: any[];
    }) => void;
}
export default JsexpertProfiler;
