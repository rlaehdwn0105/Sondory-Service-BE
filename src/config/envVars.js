import dotenv from "dotenv";

dotenv.config();

export const ENV_VARS = {
  //JWT Secret
  JWT_SECRET: process.env.JWT_SECRET,
  // MySQL 관련
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
};
