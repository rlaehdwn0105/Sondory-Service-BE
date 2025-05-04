// tracing.js
import { Resource } from '@opentelemetry/resources/build/src/resource.js';

import semconvModule from '@opentelemetry/semantic-conventions';
const { SemanticResourceAttributes } = semconvModule;

import sdkNodeModule from '@opentelemetry/sdk-node';
const { NodeSDK } = sdkNodeModule;

import autoInstModule from '@opentelemetry/auto-instrumentations-node';
const { getNodeAutoInstrumentations } = autoInstModule;

import traceExporterModule from '@opentelemetry/exporter-trace-otlp-grpc';
const { OTLPTraceExporter } = traceExporterModule;

import metricExporterModule from '@opentelemetry/exporter-metrics-otlp-proto';
const { OTLPMetricExporter } = metricExporterModule;

import metricSdkModule from '@opentelemetry/sdk-metrics';
const { PeriodicExportingMetricReader } = metricSdkModule;

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
