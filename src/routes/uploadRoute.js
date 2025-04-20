import express from "express";
import { generatePresignedUrl } from "../controllers/presignController.js";

const router = express.Router();

router.post("/presign", generatePresignedUrl);

export default router;
