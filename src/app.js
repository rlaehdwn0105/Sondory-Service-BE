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

dotenv.config();

const app = express();
app.set('port', process.env.PORT || 8001);

app.use(
  cors({
    origin: "http://kimdongju.site",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'production') {
  const logDir = path.join(process.cwd(), "tmp");
  const logPath = path.join(logDir, "access.log");

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  const logStream = fs.createWriteStream(logPath, { flags: 'a' });
  app.use(morgan('combined', { stream: logStream }));

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: false,
    })
  );

  app.use(hpp());
} else {
  app.use(morgan('dev'));
  app.use(helmet());
}

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

db.sequelize.sync({ force: false })
  .then(() => {
    console.log('Database connection successful');
  })
  .catch((err) => {
    console.error('Failed to connect to the database:', err);
  });

app.use("/api/stream", streamRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/auth", authRoute);
app.use("/api/song", songRoute);
app.use("/api/like", likeRoute);
app.use("/api/user", userRoute);

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'OK',
  });
});

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} route not found.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
