import express from "express";
import { getSignedAudioUrl } from "../controllers/streamController.js";
import { protectRoute } from '../middleware/auth.js'; 

const router = express.Router();

// 특정 곡의 Signed URL 요청 (CloudFront용)
router.get("/:songId", protectRoute, getSignedAudioUrl);

export default router;
