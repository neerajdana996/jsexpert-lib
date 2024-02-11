import { SpanStatusCode, trace } from "@opentelemetry/api"


import type { AttributeValue, Span } from "@opentelemetry/api"

function setAttribute(attribute: string, value: AttributeValue, span?: Span) {
  const activeSpan = span ?? trace.getActiveSpan()
  if (activeSpan) {
    activeSpan.setAttribute(attribute, value)
  } else {
    const splitAttributes = attribute.split(".")
    const attributeSuffix = splitAttributes[splitAttributes.length - 1]

  }
}

function circularReplacer() {
  const seenValue: any[] = []
  const seenKey: string[] = []
  return (key: string, value: any) => {
    if (typeof value === "object" && value !== null) {
      const i = seenValue.indexOf(value)
      if (i !== -1) {
        return `[cyclic value: ${seenKey[i] || "root object"}]`
      } else {
        seenValue.push(value)
        seenKey.push(key)
      }
    }

    return value
  }
}

function setSerialisedAttribute(attribute: string, value: any, span?: Span) {
  const serialisedValue = JSON.stringify(value, circularReplacer())
  if (serialisedValue) {
    setAttribute(attribute, serialisedValue, span)
  }
}

function setPrefixedAttribute(
  prefix: string,
  suffix: string,
  value: AttributeValue,
  span?: Span
) {
  if (suffix) {
    setAttribute(`${prefix}.${suffix}`, value, span)
  }
}

export function setParams(params: any, span?: Span) {
  setSerialisedAttribute("jsexpert.request.parameters", params, span)
}

export function setSessionData(sessionData: any, span?: Span) {
  setSerialisedAttribute("jsexpert.request.session_data", sessionData, span)
}

export function setCustomData(customData: any, span?: Span) {
  setSerialisedAttribute("jsexpert.custom_data", customData, span)
}

export function setTag(tag: string, value: AttributeValue, span?: Span) {
  setPrefixedAttribute("jsexpert.tag", tag, value, span)
}

export function setHeader(header: string, value: AttributeValue, span?: Span) {
  setPrefixedAttribute("jsexpert.request.headers", header, value, span)
}

export function setName(name: string, span?: Span) {
  setAttribute("jsexpert.name", name, span)
}

export function setCategory(category: string, span?: Span) {
  setAttribute("jsexpert.category", category, span)
}

export function setBody(body: string, span?: Span) {
  setAttribute("jsexpert.body", body, span)
}

export function setSqlBody(body: string, span?: Span) {
  setAttribute("jsexpert.sql_body", body, span)
}

export function setNamespace(namespace: string, span?: Span) {
  setAttribute("jsexpert.namespace", namespace, span)
}

export function setRootName(name: string, span?: Span) {
  setAttribute("jsexpert.root_name", name, span)
}

export function setError(error: Error, span?: Span) {
  if (error && error.name && error.message) {
    const activeSpan = span ?? trace.getActiveSpan()
    if (activeSpan) {
      activeSpan.recordException(error)
      activeSpan.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message
      })
    } else {

    }
  } else {

  }
}

export function sendError(error: Error, fn: () => void = () => { }) {
  if (error && error.name && error.message) {
    trace
      .getTracer("Appsignal.sendError")
      .startActiveSpan(error.name, { root: true }, span => {
        setError(error)
        fn()
        span.end()
      })
  } else {

  }
}

/**
 * @deprecated This function is no longer required for manual instrumentation.
 */
export function instrumentationsLoaded(): Promise<void> {


  return Promise.resolve()
}
