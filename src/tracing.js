import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import {
  LoggerProvider,
  BatchLogRecordProcessor,
} from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { logs } from '@opentelemetry/api-logs';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston';

// 진단 로그 출력 수준 설정
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

// 서비스 메타데이터 리소스 정의
const resource = resourceFromAttributes({
  'service.name': 'backend-service',
  'service.version': '1.0.0',
});

// 로그 Exporter + LoggerProvider 설정
const logExporter = new OTLPLogExporter({
  url: 'http://otel-otel-collector.lgtm.svc.cluster.local:4318/v1/logs', // Collector Loki exporter가 이걸 받아야 함
  concurrencyLimit: 1,
});
const loggerProvider = new LoggerProvider({
  resource,
});
loggerProvider.addLogRecordProcessor(new BatchLogRecordProcessor(logExporter));
logs.setGlobalLoggerProvider(loggerProvider);

// NodeSDK 구성
const sdk = new NodeSDK({
  resource,
  traceExporter: new OTLPTraceExporter({
    url: 'http://otel-otel-collector.lgtm.svc.cluster.local:4317',
  }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: 'http://otel-otel-collector.lgtm.svc.cluster.local:4318/v1/metrics',
    }),
    exportIntervalMillis: 1000,
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': { enabled: false },
      '@opentelemetry/instrumentation-winston': { enabled: true },
      '@opentelemetry/instrumentation-express': { enabled: true },
    }),
    new WinstonInstrumentation({
      logHook: (span, record) => {
        if (span) {
          record['trace_id'] = span.spanContext().traceId;
          record['span_id'] = span.spanContext().spanId;
        }
      },
    }),
  ],
});

// OTEL SDK 시작
(async () => {
  try {
    await sdk.start();
    console.log('✅ OTEL SDK started (traces + metrics + logs)');
  } catch (err) {
    console.error('❌ OTEL SDK failed to start', err);
  }
})();
