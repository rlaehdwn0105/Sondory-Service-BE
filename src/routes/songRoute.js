import express from 'express';
import { getAllSongs, getSongById, getrRecentSongs, updateRecentSongs } from '../controllers/songController.js'; 
import { protectRoute } from '../middleware/auth.js'; 

const songRouter = express.Router();

songRouter.get("/", protectRoute, getAllSongs);
songRouter.get("/recent", protectRoute, getrRecentSongs); 

songRouter.post("/recent/:songId", protectRoute, updateRecentSongs);

songRouter.get("/:id", protectRoute, getSongById);

export default songRouter;
