// tracing-and-metrics.js (ESM)
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

const OTEL_COLLECTOR = 'otel-otel-collector.lgtm.svc.cluster.local';

const sdk = new NodeSDK({
  // 트레이스 Exporter (gRPC, default 포트 4317)
  traceExporter: new OTLPTraceExporter({
    url: `http://${OTEL_COLLECTOR}:4317`,
  }),

  // 메트릭 Exporter (HTTP/Protobuf, default 경로 /v1/metrics, 포트 4318)
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: `http://${OTEL_COLLECTOR}:4318/v1/metrics`,
    }),
    exportIntervalMillis: 1000,
  }),

  // 자동 계측: HTTP, Express, MySQL, MongoDB 등 주요 모듈
  instrumentations: [getNodeAutoInstrumentations()],
});

// async IIFE로 sdk.start() 호출
(async () => {
  try {
    await sdk.start();
    console.log('✅ OTEL SDK started (traces + metrics)');
  } catch (err) {
    console.error('❌ OTEL SDK failed to start', err);
  }
})();

// graceful shutdown: SIGINT, SIGTERM 수신 시 sdk.shutdown() 호출
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
