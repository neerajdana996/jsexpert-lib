import type { Context } from "@opentelemetry/api"
import { SpanKind } from "@opentelemetry/api"
import type {
    SpanProcessor as OpenTelemetrySpanProcessor,
    ReadableSpan,
    Span
} from "@opentelemetry/sdk-trace-base"


export class SpanProcessor implements OpenTelemetrySpanProcessor {


    forceFlush(): Promise<void> {
        return Promise.resolve()
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onStart(_span: Span, _parentContext: Context): void { }
    onEnd(span: ReadableSpan): void {
        const spanAttributes = {
            ...span.attributes,
            "jsexpert.kind": SpanKind[span.kind]
        }

        const spanContext = span.spanContext()
        const spanData = {
            spanId: spanContext.spanId,
            traceId: spanContext.traceId,
            parentSpanId: span.parentSpanId,
            name: span.name,
            kind: SpanKind[span.kind],
            startTimestamp: span.startTime,
            endTimestamp: span.endTime,
            attributes: spanAttributes,
            status: {
                code: span.status.code,
                message: span.status.message
            }
        }
        console.log(spanData)

    }
    shutdown(): Promise<void> {
        return Promise.resolve()
    }

}