import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const OTEL_COLLECTOR = 'otel-otel-collector.lgtm.svc.cluster.local';

const sdk = new NodeSDK({
  // 👇 service.name을 명시해야 Tempo에서 이름이 나옴!
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'backend-service',
  }),

  traceExporter: new OTLPTraceExporter({
    url: `http://${OTEL_COLLECTOR}:4317`,
  }),

  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: `http://${OTEL_COLLECTOR}:4318/v1/metrics`,
    }),
    exportIntervalMillis: 1000,
  }),

  instrumentations: [getNodeAutoInstrumentations()],
});

(async () => {
  try {
    await sdk.start();
    console.log('✅ OTEL SDK started (traces + metrics)');
  } catch (err) {
    console.error('❌ OTEL SDK failed to start', err);
  }
})();

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, async () => {
    try {
      await sdk.shutdown();
      console.log('🛑 OTEL SDK shut down gracefully');
    } catch (err) {
      console.error('❌ Error shutting down OTEL SDK', err);
    } finally {
      process.exit(0);
    }
  });
}
