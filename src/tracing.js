import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

import { resourceFromAttributes } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

const resource = resourceFromAttributes({
  [SEMRESATTRS_SERVICE_NAME]: 'backend-service',
});

const OTEL_COLLECTOR = 'otel-collector.otel-collector.svc.cluster.local';

const sdk = new NodeSDK({
  resource,

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
    console.log('OTEL SDK started (traces + metrics)');
  } catch (err) {
    console.error('OTEL SDK failed to start', err);
  }
})();
