// tracing.js
import pkgResource from '@opentelemetry/resources';
const { Resource } = pkgResource;

import pkgSemConv from '@opentelemetry/semantic-conventions';
const { SemanticResourceAttributes } = pkgSemConv;

import pkgSdkNode from '@opentelemetry/sdk-node';
const { NodeSDK } = pkgSdkNode;

import pkgAutoInst from '@opentelemetry/auto-instrumentations-node';
const { getNodeAutoInstrumentations } = pkgAutoInst;

import pkgTraceExp from '@opentelemetry/exporter-trace-otlp-grpc';
const { OTLPTraceExporter } = pkgTraceExp;

import pkgMetricExp from '@opentelemetry/exporter-metrics-otlp-proto';
const { OTLPMetricExporter } = pkgMetricExp;

import pkgMetricSdk from '@opentelemetry/sdk-metrics';
const { PeriodicExportingMetricReader } = pkgMetricSdk;

const traceExporter = new OTLPTraceExporter({
  url: 'http://otel-collector.observability.svc.cluster.local:4317'
});

const metricExporter = new OTLPMetricExporter({
  url: 'http://otel-collector.observability.svc.cluster.local:4318/v1/metrics'
});

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'express-app',
  }),
  traceExporter,
  metricReader: new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 1000
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start()
  .then(() => console.log('✅ OTEL SDK started'))
  .catch((err) => console.error('❌ OTEL SDK failed to start', err));
