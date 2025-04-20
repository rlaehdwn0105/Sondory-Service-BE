import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("kdj-project", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15일
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development", // HTTPS에서만 쿠키 전송
  });

  return token;
};
