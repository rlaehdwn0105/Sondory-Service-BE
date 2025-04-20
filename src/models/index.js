import Sequelize from 'sequelize';
import dotenv from 'dotenv';
import User from './user.js';
import Song from './song.js';
import RecentPlays from './recentplay.js';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
  }
);

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.Song = Song;
db.RecentPlay = RecentPlays; 

User.initModel(sequelize);
Song.initModel(sequelize);
RecentPlays.initModel(sequelize); 

User.associate(db);
Song.associate(db);
RecentPlays.associate(db);


export default db;
