import { config } from "dotenv";
config();

import { Sequelize } from "sequelize";
import Song from "../models/song.js"; // 너가 만든 Sequelize 모델

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
  }
);
Song.initModel(sequelize);

const songs = [
  {
    title: "Stay With Me",
    artist: "Sarah Mitchell",
    coverUrl: "/cover-images/1.jpg",
    audioUrl: "/songs/1.mp3",
    duration: 46,
    UploaderId: 1,
  },
  {
    title: "Midnight Drive",
    artist: "The Wanderers",
    coverUrl: "/cover-images/2.jpg",
    audioUrl: "/songs/2.mp3",
    duration: 41,
    UploaderId: 1,
  },
  {
    title: "Lost in Tokyo",
    artist: "Electric Dreams",
    coverUrl: "/cover-images/3.jpg",
    audioUrl: "/songs/3.mp3",
    duration: 24,
    UploaderId: 1,
  },
  {
    title: "Summer Daze",
    artist: "Coastal Kids",
    coverUrl: "/cover-images/4.jpg",
    audioUrl: "/songs/4.mp3",
    duration: 24,
    UploaderId: 1,
  },
  {
    title: "Neon Lights",
    artist: "Night Runners",
    coverUrl: "/cover-images/5.jpg",
    audioUrl: "/songs/5.mp3",
    duration: 36,
    UploaderId: 1,
  },
  {
    title: "Mountain High",
    artist: "The Wild Ones",
    coverUrl: "/cover-images/6.jpg",
    audioUrl: "/songs/6.mp3",
    duration: 40,
    UploaderId: 1,
  },
  {
    title: "City Rain",
    artist: "Urban Echo",
    coverUrl: "/cover-images/7.jpg",
    audioUrl: "/songs/7.mp3",
    duration: 39,
    UploaderId: 1,
  },
  {
    title: "Desert Wind",
    artist: "Sahara Sons",
    coverUrl: "/cover-images/8.jpg",
    audioUrl: "/songs/8.mp3",
    duration: 28,
    UploaderId: 1,
  },
  {
    title: "Ocean Waves",
    artist: "Coastal Drift",
    coverUrl: "/cover-images/9.jpg",
    audioUrl: "/songs/9.mp3",
    duration: 28,
    UploaderId: 1,
  },
  {
    title: "Starlight",
    artist: "Luna Bay",
    coverUrl: "/cover-images/10.jpg",
    audioUrl: "/songs/10.mp3",
    duration: 30,
    UploaderId: 1,
  },
  {
    title: "Winter Dreams",
    artist: "Arctic Pulse",
    coverUrl: "/cover-images/11.jpg",
    audioUrl: "/songs/11.mp3",
    duration: 29,
    UploaderId: 1,
  },
  {
    title: "Purple Sunset",
    artist: "Dream Valley",
    coverUrl: "/cover-images/12.jpg",
    audioUrl: "/songs/12.mp3",
    duration: 17,
    UploaderId: 1,
  },
  {
    title: "Neon Dreams",
    artist: "Cyber Pulse",
    coverUrl: "/cover-images/13.jpg",
    audioUrl: "/songs/13.mp3",
    duration: 39,
    UploaderId: 1,
  },
  {
    title: "Moonlight Dance",
    artist: "Silver Shadows",
    coverUrl: "/cover-images/14.jpg",
    audioUrl: "/songs/14.mp3",
    duration: 27,
    UploaderId: 1,
  },
  {
    title: "Urban Jungle",
    artist: "City Lights",
    coverUrl: "/cover-images/15.jpg",
    audioUrl: "/songs/15.mp3",
    duration: 36,
    UploaderId: 1,
  },
  {
    title: "Crystal Rain",
    artist: "Echo Valley",
    coverUrl: "/cover-images/16.jpg",
    audioUrl: "/songs/16.mp3",
    duration: 39,
    UploaderId: 1,
  },
  {
    title: "Neon Tokyo",
    artist: "Future Pulse",
    coverUrl: "/cover-images/17.jpg",
    audioUrl: "/songs/17.mp3",
    duration: 39,
    UploaderId: 1,
  },
  {
    title: "Midnight Blues",
    artist: "Jazz Cats",
    coverUrl: "/cover-images/18.jpg",
    audioUrl: "/songs/18.mp3",
    duration: 29,
    UploaderId: 1,
  },
];

const seedSongs = async () => {
	try {
	  await sequelize.authenticate();
	  console.log("✅ DB 연결 성공");
  
	  await Song.bulkCreate(songs);
  
	  console.log("🎵 Songs seeded successfully!");
	} catch (error) {
	  console.error("🔥 Error seeding songs:", error);
	} finally {
	  await sequelize.close();
	}
  };
  
  seedSongs();
