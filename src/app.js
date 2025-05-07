import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import helmet from 'helmet';
import hpp from 'hpp';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { options } from './swagger/config.js';

import db from './models/index.js';
import authRoute from './routes/authRoute.js';
import songRoute from './routes/songRoute.js';
import likeRoute from './routes/likeRoute.js';
import userRoute from './routes/userRoute.js';
import uploadRoute from './routes/uploadRoute.js';
import streamRoute from './routes/streamRoute.js';
import { logger } from './logger.js';
import { trace, context } from '@opentelemetry/api'; // ✅ 추가된 부분
import winston from 'winston';
import otelTransportPkg from '@opentelemetry/winston-transport';
const { OpenTelemetryTransportV3 } = otelTransportPkg;

dotenv.config();

const app = express();
app.set('port', process.env.PORT || 8001);

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// trace_id 포함하는 Morgan 설정
const morganFormat = (tokens, req, res) => {
  const traceId = trace.getSpan(context.active())?.spanContext().traceId || 'unknown';
  return [
    `trace_id=${traceId}`,
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens['response-time'](req, res), 'ms'
  ].join(' ');
};

if (process.env.NODE_ENV === 'development') {
  const logDir = path.join(process.cwd(), 'tmp');
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
  const logStream = fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' });

  app.use(morgan(morganFormat, { stream: logStream }));

  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  }));
  app.use(hpp());
} else {
  app.use(morgan(morganFormat));
  app.use(helmet());
}

// Swagger
const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});
// DB 연결
db.sequelize.sync({ force: false })
  .then(() => {
    logger.info('✅ Database connected');
  })
  .catch((err) => {
    logger.error('❌ Failed to connect to DB', { error: err.message });
  });

// 라우트
app.use('/api/stream', streamRoute);
app.use('/api/upload', uploadRoute);
app.use('/api/auth', authRoute);
app.use('/api/song', songRoute);
app.use('/api/like', likeRoute);
app.use('/api/user', userRoute);

// 404 처리
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} route not found.`);
  error.status = 404;
  next(error);
});

// 에러 핸들링
app.use((err, req, res, next) => {
  logger.error('Unhandled error occurred', {
    message: err.message,
    status: err.status,
    trace_id: trace.getSpan(context.active())?.spanContext().traceId || 'unknown',
  });

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
