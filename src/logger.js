import * as api from "@opentelemetry/api-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  BatchLogRecordProcessor,
  LoggerProvider
} from "@opentelemetry/sdk-logs";
import { OpenTelemetryTransportV3 } from "@opentelemetry/winston-transport";
import * as winston from "winston";

// ✅ OpenTelemetry 리소스 정보 (서비스 메타데이터)
const resource = resourceFromAttributes({
  'service.name': 'backend-service',
  'service.version': '1.0.0',
});

// ✅ OTLP Log Exporter 설정 (Collector로 로그 전송)
const logExporter = new OTLPLogExporter({
  url: 'http://otel-otel-collector.lgtm.svc.cluster.local:4318/v1/logs',
});

// ✅ OpenTelemetry LoggerProvider 구성
const loggerProvider = new LoggerProvider({ resource });
loggerProvider.addLogRecordProcessor(new BatchLogRecordProcessor(logExporter));
api.logs.setGlobalLoggerProvider(loggerProvider);

// ✅ Winston Logger 정의
export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }), // Error.stack 자동 포함
    winston.format.json()
  ),
  transports: [
    // ✅ 콘솔에는 보기 좋게 출력
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          return `${timestamp} [${level}]: ${message}\n${JSON.stringify(meta, null, 2)}`;
        })
      )
    }),
    // ✅ OTEL Collector 전송용 JSON
    new OpenTelemetryTransportV3(),
  ],
});

// ✅ 초기 로그 확인용 메시지
logger.info("🚀 Winston logger initialized and OTEL logging is active");
