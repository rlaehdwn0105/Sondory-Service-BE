import express from 'express';
import { likeSong, unlikeSong, getMyLikedSongs } from '../controllers/likeController.js'; 
import { protectRoute } from '../middleware/auth.js'; 

const likeRouter = express.Router();

likeRouter.get("/", protectRoute, getMyLikedSongs); 

likeRouter.post("/:songId", protectRoute, likeSong);

likeRouter.delete("/:songId", protectRoute, unlikeSong);

export default likeRouter;
