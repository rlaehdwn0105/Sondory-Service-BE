import { config } from "dotenv";
config();

import { Sequelize } from "sequelize";
import RecentPlays from "../models/recentplay.js";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
  }
);

// 모델 초기화
RecentPlays.initModel(sequelize);

// 더미 데이터 생성
const now = new Date();
const MINUTE = 60 * 1000;

const recentPlays = Array.from({ length: 12 }).map((_, i) => {
  const time = new Date(now - i * 10 * MINUTE);
  const songId = [17, 15, 12, 6, 11, 16, 5, 14, 7, 1, 2, 13][i];
  return {
    UserId: 1,
    SongId: songId,
    playedAt: time,
    createdAt: time,
    updatedAt: time,
  };
});

const seedData = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB 연결 성공");

    await RecentPlays.bulkCreate(recentPlays, { ignoreDuplicates: true });

    console.log("✅ RecentPlays 시드 완료!");
  } catch (error) {
    console.error("❌ 시드 오류:", error);
  } finally {
    await sequelize.close();
  }
};

seedData();
