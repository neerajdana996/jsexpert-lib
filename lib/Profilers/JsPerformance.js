"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var auto_instrumentations_node_1 = require("@opentelemetry/auto-instrumentations-node");
var exporter_trace_otlp_proto_1 = require("@opentelemetry/exporter-trace-otlp-proto");
var instrumentation_express_1 = require("@opentelemetry/instrumentation-express");
var resources_1 = require("@opentelemetry/resources");
var sdk_node_1 = require("@opentelemetry/sdk-node");
var semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
/*instrumentation.js*/
// Require dependencies
var JsPerformance = function (clientId, clientSecret, projectName) {
    var _a;
    console.log('req in the middleware');
    var exporterOptions = {
        url: 'https://api.jsexpert.io/v1/traces',
        headers: {
            clientId: clientId,
            clientsecret: clientSecret,
        },
    };
    var traceExporter = new exporter_trace_otlp_proto_1.OTLPTraceExporter(exporterOptions);
    var sdk = new sdk_node_1.NodeSDK({
        traceExporter: traceExporter,
        instrumentations: [
            (0, auto_instrumentations_node_1.getNodeAutoInstrumentations)({
                '@opentelemetry/instrumentation-mongodb': {
                    enabled: true,
                    enhancedDatabaseReporting: true,
                },
                '@opentelemetry/instrumentation-express': {
                    ignoreLayersType: [instrumentation_express_1.ExpressLayerType.MIDDLEWARE],
                    requestHook: function (span, requestInfo) {
                        span.setAttribute('http.request.body', JSON.stringify(requestInfo.request.body));
                        span.setAttribute('http.request.headers', JSON.stringify(requestInfo.request.headers));
                    },
                },
            }),
        ],
        resource: new resources_1.Resource((_a = {},
            _a[semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME] = "".concat(projectName, "-server"),
            _a)),
    });
    return sdk;
};
exports.default = JsPerformance;
