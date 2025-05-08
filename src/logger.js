import * as api from "@opentelemetry/api-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  BatchLogRecordProcessor,
  LoggerProvider
} from "@opentelemetry/sdk-logs";
import { OpenTelemetryTransportV3 } from "@opentelemetry/winston-transport";
import * as winston from "winston";

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

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
          const metaInfo = Object.keys(meta).length > 0 ? `\n${JSON.stringify(meta, null, 2)}` : "";
          return `${timestamp} [${level}]: ${message}${stack ? `\n${stack}` : ""}${metaInfo}`;
        })
      ),
    }),
    new OpenTelemetryTransportV3(),
  ],
});

logger.info("Winston logger initialized and OTEL logging is active");
