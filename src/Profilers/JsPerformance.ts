import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { ExpressLayerType } from "@opentelemetry/instrumentation-express";
import { Resource } from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
/*instrumentation.js*/
// Require dependencies


const JsPerformance = (clientId: string, clientSecret: string, projectName: string) => {
  console.log('req in the middleware');
  const exporterOptions = {
    url: 'https://api.jsexpert.io/v1/traces',
    headers: {
      clientId: clientId,
      clientsecret: clientSecret,
    },
  };

  const traceExporter = new OTLPTraceExporter(exporterOptions);
  const sdk = new NodeSDK({
    traceExporter,
    instrumentations: [
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-mongodb': {
          enabled: true,
          enhancedDatabaseReporting: true,
        },
        '@opentelemetry/instrumentation-express': {
          ignoreLayersType: [ExpressLayerType.MIDDLEWARE],
          requestHook: (span, requestInfo) => {
            span.setAttribute(
              'http.request.body',
              JSON.stringify(requestInfo.request.body),
            );

            span.setAttribute(
              'http.request.headers',
              JSON.stringify(requestInfo.request.headers),
            );
          },
        },
      }),
    ],
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: `${projectName}-server`,
    }),
  });
  return {
    start: sdk.start,
    stop: sdk.shutdown
  }
};


export default JsPerformance;