import * as api from "@opentelemetry/api-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import {
  detectResourcesSync,
  envDetectorSync,
  hostDetectorSync,
  processDetectorSync,
} from "@opentelemetry/resources";
import {
  BatchLogRecordProcessor,
  LoggerProvider
} from "@opentelemetry/sdk-logs";
import { OpenTelemetryTransportV3 } from "@opentelemetry/winston-transport";
import * as winston from "winston";

// ✅ OTEL Collector 주소 설정
const logExporter = new OTLPLogExporter({
  url: 'http://otel-otel-collector.lgtm.svc.cluster.local:4318/v1/logs',
});

const loggerProvider = new LoggerProvider({
  resource: detectResourcesSync({
    detectors: [envDetectorSync, processDetectorSync, hostDetectorSync],
  }),
});

loggerProvider.addLogRecordProcessor(
  new BatchLogRecordProcessor(logExporter)
);

api.logs.setGlobalLoggerProvider(loggerProvider);

export const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console(),
    new OpenTelemetryTransportV3(), // ✅ 이건 globalLoggerProvider 기반이라 따로 주소 안 줘도 됨
  ],
});

logger.info('Hello world');
