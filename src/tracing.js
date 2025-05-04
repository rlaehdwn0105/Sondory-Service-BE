// tracing.js (ESM 기반 OTLP Exporter 운영용 설정 - 수정됨)
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

const traceExporter = new OTLPTraceExporter({
  url: 'http://otel-otel-collector.lgtm.svc.cluster.local:4318/v1/traces'
});

const metricExporter = new OTLPMetricExporter({
  url: 'http://otel-otel-collector.lgtm.svc.cluster.local:4318/v1/metrics'
});

const sdk = new NodeSDK({
  traceExporter,
  metricReader: new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 1000
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

console.log('✅ OTEL SDK started with OTLP exporters');
