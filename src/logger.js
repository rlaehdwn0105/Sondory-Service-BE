// logger.js

import * as api from "@opentelemetry/api-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import * as resources from "@opentelemetry/resources"; // 👈 핵심!
import {
  BatchLogRecordProcessor,
  LoggerProvider
} from "@opentelemetry/sdk-logs";
import { OpenTelemetryTransportV3 } from "@opentelemetry/winston-transport";
import * as winston from "winston";

// 👇 구조분해 할당으로 필요한 함수 꺼내기
const {
  detectResourcesSync,
  envDetectorSync,
  hostDetectorSync,
  processDetectorSync,
} = resources;

const logExporter = new OTLPLogExporter({
  url: 'http://otel-otel-collector.lgtm.svc.cluster.local:4318/v1/logs',
});

const loggerProvider = new LoggerProvider({
  resource: detectResourcesSync({
    detectors: [envDetectorSync, processDetectorSync, hostDetectorSync],
  }),
});

loggerProvider.addLogRecordProcessor(new BatchLogRecordProcessor(logExporter));
api.logs.setGlobalLoggerProvider(loggerProvider);

export const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console(),
    new OpenTelemetryTransportV3(),
  ],
});
