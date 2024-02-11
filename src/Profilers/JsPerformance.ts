
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { PrismaInstrumentation } from '@prisma/instrumentation';





export function RedisDbStatementSerializer(command: string, args: Array<any>) {
  const values = []
  if (args.length > 0) {
    for (let i = 0; i < args.length; i++) {
      values.push("?")
    }
    return `${command} ${values.join(" ")}`
  } else {
    return command
  }
}



const JsPerformance = (clientId: string, clientSecret: string, projectName: string,
  additionalInstrumentations: any[] = [],
  disableInstrumentations: any = [], devMode = false) => {
  const url = devMode ? 'http://localhost:3001' : 'https://api.jsexpert.io';
  const exporterOptions = {
    url: `${url}/v1/traces`, // TODO: change to `url: url` when the API is ready
    headers: {
      clientId: clientId,
      clientsecret: clientSecret,
    },
  };

  const traceExporter = new OTLPTraceExporter(exporterOptions);
  const consoleSpanExporter = new ConsoleSpanExporter();
  console.log('transporterOptions', { ...exporterOptions, devMode })
  const sdk = new NodeSDK({
    traceExporter: devMode ? consoleSpanExporter : traceExporter,
    instrumentations: [
      ...additionalInstrumentations,
      new PrismaInstrumentation(),
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-fs': {
          enabled: false,
        }
      }),

    ],
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: `${projectName}-server`,

    }),
  });
  return sdk
};


export default JsPerformance;