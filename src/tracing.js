import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { LoggerProvider, BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { logs } from '@opentelemetry/api-logs';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston';

// Enable OpenTelemetry internal debugging logs (optional)
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

// Define OTEL resource attributes manually (no SemanticResourceAttributes)
const resource = resourceFromAttributes({
  'service.name': 'backend-service',
  'service.version': '1.0.0'
});

// Define collector endpoint
const OTEL_COLLECTOR = 'otel-otel-collector.lgtm.svc.cluster.local';

// TRACE exporter (gRPC)
const traceExporter = new OTLPTraceExporter({
  url: `http://${OTEL_COLLECTOR}:4317`
});

// LOG exporter (HTTP)
const logExporter = new OTLPLogExporter({
  url: `http://${OTEL_COLLECTOR}:4318/v1/logs` 
});

// METRIC exporter (HTTP)
const metricExporter = new OTLPMetricExporter({
  url: `http://${OTEL_COLLECTOR}:4318/v1/metrics`
});

// LOGGING provider
const loggerProvider = new LoggerProvider({ resource });
loggerProvider.addLogRecordProcessor(new BatchLogRecordProcessor(logExporter));
logs.setGlobalLoggerProvider(loggerProvider);

// SDK 통합 (trace, metrics, logs, auto instrumentation)
const sdk = new NodeSDK({
  resource,
  traceExporter,
  metricReader: new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 1000
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': { enabled: false },
      '@opentelemetry/instrumentation-winston': { enabled: true }
    }),
    new WinstonInstrumentation({
      logHook: (span, record) => {
        if (span) {
          record['trace_id'] = span.spanContext().traceId;
          record['span_id'] = span.spanContext().spanId;
        }
      }
    })
  ]
});

await sdk.start();
