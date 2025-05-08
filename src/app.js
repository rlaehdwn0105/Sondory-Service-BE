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

dotenv.config();

const app = express();
app.set('port', process.env.PORT || 8001);

// CORS 설정
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// helmet
if (process.env.NODE_ENV === 'production') {
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: false,
    }),
  );
  app.use(hpp());
} else {
  app.use(morgan('dev'));
}
// Swagger
const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Health check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// DB 연결
db.sequelize.sync({ force: false })
  .then(() => {
    logger.info('Database connected');
  })
  .catch((err) => {
    logger.error('Failed to connect to DB', { error: err.message });
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
    status: err.status || 500,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    data: err.data || null,
  });

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    data: err.data || null,
  });
});

export default app;
