import * as api from "@opentelemetry/api-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  BatchLogRecordProcessor,
  LoggerProvider
} from "@opentelemetry/sdk-logs";
import { OpenTelemetryTransportV3 } from "@opentelemetry/winston-transport";
import * as winston from "winston";

// ✅ 정적인 리소스 정의
const resource = resourceFromAttributes({
  'service.name': 'backend-service',
  'service.version': '1.0.0',
});

const logExporter = new OTLPLogExporter({
  url: 'http://otel-otel-collector.lgtm.svc.cluster.local:4318/v1/logs',
});

const loggerProvider = new LoggerProvider({ resource });

loggerProvider.addLogRecordProcessor(new BatchLogRecordProcessor(logExporter));
api.logs.setGlobalLoggerProvider(loggerProvider);

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }), // stack 자동 포함
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new OpenTelemetryTransportV3(),
  ],
});

logger.info("Winston logger initialized and OTEL logging is active");
