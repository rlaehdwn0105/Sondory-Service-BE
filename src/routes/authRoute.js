import express from "express";
import { authCheck, login, logout, signup, verifyEmail } from "../controllers/authController.js";
import { protectRoute } from "../middleware/auth.js";


const router = express.Router();

router.post( "/signup", signup);
router.post("/login", login);
router.post("/logout", protectRoute, logout);

router.get("/verify", verifyEmail);
router.get("/authCheck", protectRoute, authCheck);

export default router;  