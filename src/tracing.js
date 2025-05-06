// tracing.js
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
// ... 나머지 import 생략

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const resource = resourceFromAttributes({
  'service.name': 'backend-service',
  'service.version': '1.0.0'
});

const sdk = new NodeSDK({
  resource,
  traceExporter: new OTLPTraceExporter({ url: 'http://otel-otel-collector.lgtm.svc.cluster.local:4317' }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({ url: 'http://otel-otel-collector.lgtm.svc.cluster.local:4318/v1/metrics' }),
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

sdk.start()
  .then(() => {
    console.log('✅ OpenTelemetry SDK started');
  })
  .catch((err) => {
    console.error('❌ OpenTelemetry SDK failed to start', err);
  });
