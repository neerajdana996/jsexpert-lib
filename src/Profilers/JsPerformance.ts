import { Instrumentation } from "@opentelemetry/instrumentation"
import {
  ExpressInstrumentation,
  ExpressLayerType
} from "@opentelemetry/instrumentation-express"
import { FastifyInstrumentation } from "@opentelemetry/instrumentation-fastify"
import { GraphQLInstrumentation } from "@opentelemetry/instrumentation-graphql"
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http"
import { IORedisInstrumentation } from "@opentelemetry/instrumentation-ioredis"
import { KnexInstrumentation } from "@opentelemetry/instrumentation-knex"
import {
  KoaInstrumentation,
  KoaLayerType
} from "@opentelemetry/instrumentation-koa"
import { MongoDBInstrumentation } from "@opentelemetry/instrumentation-mongodb"
import { MongooseInstrumentation } from "@opentelemetry/instrumentation-mongoose"
import { MySQLInstrumentation } from "@opentelemetry/instrumentation-mysql"
import { MySQL2Instrumentation } from "@opentelemetry/instrumentation-mysql2"
import { NestInstrumentation } from "@opentelemetry/instrumentation-nestjs-core"
import { PgInstrumentation } from "@opentelemetry/instrumentation-pg"
import { RedisInstrumentation } from "@opentelemetry/instrumentation-redis"
import { RedisInstrumentation as Redis4Instrumentation } from "@opentelemetry/instrumentation-redis-4"
import {
  RestifyInstrumentation,
  LayerType as RestifyLayerType
} from "@opentelemetry/instrumentation-restify"
import { NodeSDK } from "@opentelemetry/sdk-node"
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base'
import { PrismaInstrumentation } from "@prisma/instrumentation"


import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { Resource } from '@opentelemetry/resources'
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'
import { setParams, setSessionData } from './helpers'

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
  const DefaultInstrumentations = {
    "@opentelemetry/instrumentation-express": ExpressInstrumentation,
    "@opentelemetry/instrumentation-fastify": FastifyInstrumentation,
    "@opentelemetry/instrumentation-graphql": GraphQLInstrumentation,
    "@opentelemetry/instrumentation-http": HttpInstrumentation,
    "@opentelemetry/instrumentation-ioredis": IORedisInstrumentation,
    "@opentelemetry/instrumentation-knex": KnexInstrumentation,
    "@opentelemetry/instrumentation-koa": KoaInstrumentation,
    "@opentelemetry/instrumentation-mongodb": MongoDBInstrumentation,
    "@opentelemetry/instrumentation-mongoose": MongooseInstrumentation,
    "@opentelemetry/instrumentation-mysql2": MySQL2Instrumentation,
    "@opentelemetry/instrumentation-mysql": MySQLInstrumentation,
    "@opentelemetry/instrumentation-nestjs-core": NestInstrumentation,
    "@opentelemetry/instrumentation-pg": PgInstrumentation,
    "@opentelemetry/instrumentation-redis": RedisInstrumentation,
    "@opentelemetry/instrumentation-redis-4": Redis4Instrumentation,
    "@opentelemetry/instrumentation-restify": RestifyInstrumentation,
    "@prisma/instrumentation": PrismaInstrumentation
  }
  function defaultInstrumentationsConfig() {


    return {
      "@opentelemetry/instrumentation-express": {
        requestHook: function (_span: any, info: any) {
          if (info.layerType === ExpressLayerType.REQUEST_HANDLER) {
            const routeParams = info.request.params
            const queryParams = info.request.query
            const requestBody = info.request.body
            const params = { ...routeParams, ...queryParams, ...requestBody }
            setParams(params)
            setSessionData(info.request.cookies)
          }
        }
      },
      "@opentelemetry/instrumentation-fastify": {
        requestHook: function (_span: any, info: any) {
          const queryParams = info.request.query
          const requestBody = info.request.body
          const params = { ...queryParams, ...requestBody }
          setParams(params)
        }
      },
      "@opentelemetry/instrumentation-graphql": {
        ignoreTrivialResolveSpans: true,
        mergeItems: true,
        allowValues: false
      },
      "@opentelemetry/instrumentation-http": {
        // headersToSpanAttributes: {
        //   server: { requestHeaders }
        // }
      },
      "@opentelemetry/instrumentation-ioredis": {
        dbStatementSerializer: RedisDbStatementSerializer
      },
      "@opentelemetry/instrumentation-koa": {
        requestHook: function (span: any, info: any) {
          if (info.layerType === KoaLayerType.ROUTER) {
            const queryParams = info.context.request.query
            setParams(queryParams, span)
          }
        }
      },
      "@opentelemetry/instrumentation-redis": {
        dbStatementSerializer: RedisDbStatementSerializer
      },
      "@opentelemetry/instrumentation-redis-4": {
        dbStatementSerializer: RedisDbStatementSerializer
      },
      "@opentelemetry/instrumentation-restify": {
        requestHook: (span: any, info: any) => {
          if (

            info.layerType === RestifyLayerType.REQUEST_HANDLER
          ) {
            const request = info.request
            const params = Object.assign(
              request.params || {},
              request.query || {}
            )
            setParams(params, span)
          }
        }
      },
      "@prisma/instrumentation": {
        middleware: true,
      }

    }
  }
  function defaultInstrumentations(): Instrumentation[] {


    const instrumentationConfigs =
      defaultInstrumentationsConfig() as Record<string, any>
    return Object.entries(DefaultInstrumentations)
      .filter(([name]) => !disableInstrumentations.includes(name))
      .map(
        ([name, constructor]) =>
          new constructor(instrumentationConfigs[name] || {})
      )
  }
  const traceExporter = new OTLPTraceExporter(exporterOptions);
  const consoleSpanExporter = new ConsoleSpanExporter();
  const sdk = new NodeSDK({
    traceExporter,
    instrumentations: [
      ...additionalInstrumentations,
      ...defaultInstrumentations()
    ],
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: `${projectName}-server`,

    }),
  });
  return sdk
};


export default JsPerformance;




// import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
// import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
// import { Resource } from '@opentelemetry/resources';
// import { NodeSDK } from '@opentelemetry/sdk-node';
// import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base';
// import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
// import { PrismaInstrumentation } from '@prisma/instrumentation';





// export function RedisDbStatementSerializer(command: string, args: Array<any>) {
//   const values = []
//   if (args.length > 0) {
//     for (let i = 0; i < args.length; i++) {
//       values.push("?")
//     }
//     return `${command} ${values.join(" ")}`
//   } else {
//     return command
//   }
// }



// const JsPerformance = (clientId: string, clientSecret: string, projectName: string,
//   additionalInstrumentations: any[] = [],
//   disableInstrumentations: any = [], devMode = false) => {
//   const url = devMode ? 'http://localhost:3001' : 'https://api.jsexpert.io';
//   const exporterOptions = {
//     url: `${url}/v1/traces`, // TODO: change to `url: url` when the API is ready
//     headers: {
//       clientId: clientId,
//       clientsecret: clientSecret,
//     },
//   };

//   const traceExporter = new OTLPTraceExporter(exporterOptions);
//   const consoleSpanExporter = new ConsoleSpanExporter();
//   console.log('transporterOptions', { ...exporterOptions, devMode })
//   const sdk = new NodeSDK({
//     traceExporter: devMode ? consoleSpanExporter : traceExporter,
//     instrumentations: [
//       ...additionalInstrumentations,
//       new PrismaInstrumentation(),
//       getNodeAutoInstrumentations({
//         '@opentelemetry/instrumentation-fs': {
//           enabled: false,
//         }
//       }),

//     ],
//     resource: new Resource({
//       [SemanticResourceAttributes.SERVICE_NAME]: `${projectName}-server`,

//     }),
//   });
//   return sdk
// };


// export default JsPerformance;