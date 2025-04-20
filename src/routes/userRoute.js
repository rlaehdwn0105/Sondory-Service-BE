import express from 'express';
import { uploadSong, deleteSong, getMySongs } from '../controllers/userController.js';
import { protectRoute } from '../middleware/auth.js'; 

const userRouter = express.Router();

userRouter.get("/", protectRoute, getMySongs);

userRouter.post("/upload", protectRoute, uploadSong);

userRouter.delete("/deletesong/:songId", protectRoute, deleteSong);

export default userRouter;
