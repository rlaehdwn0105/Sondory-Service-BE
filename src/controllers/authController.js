import User from "../models/user.js";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { Op } from "sequelize";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD, 
  },
});

// 회원가입
export async function signup(req, res, next) {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      const error = new Error("All fields are required.");
      error.status = 400;
      throw error;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const error = new Error("Invalid email format.");
      error.status = 400;
      throw error;
    }

    if (password.length < 6) {
      const error = new Error("Password must be at least 6 characters.");
      error.status = 400;
      throw error;
    }

    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      const error = new Error("Email already in use.");
      error.status = 409;
      throw error;
    }

    const usernameExists = await User.findOne({ where: { username } });
    if (usernameExists) {
      const error = new Error("Username already taken.");
      error.status = 409;
      throw error;
    }

    const hashedPassword = await bcryptjs.hash(password, await bcryptjs.genSalt(10));
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const signupTokenExpiration = new Date(Date.now() + 1000 * 60 * 60); // 1시간

    await User.create({
      email,
      username,
      password: hashedPassword,
      isVerified: false,
      signupToken: hashedToken,
      signupTokenExpiration,
    });

    await transporter.sendMail({
      to: email,
      from: process.env.EMAIL,
      subject: "Verify your email",
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
        <div style="max-width: 500px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333333; text-align: center;">Verify Your Email Address</h2>
          <p style="color: #555555; font-size: 16px;">
            Thank you for signing up. To complete your registration, please verify your email by clicking the button below:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.SERVER_URL}/auth/verify?token=${rawToken}" 
               style="background-color: #facc15; color: black; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Verify Email
            </a>
          </div>
          <p style="color: #999999; font-size: 14px; text-align: center;">
            If you did not sign up, you can safely ignore this email.
          </p>
        </div>
      </div>
      `
    });

    res.status(201).json({
      success: true,
      message: "Verification email sent. Please check your inbox."
    });
  } catch (error) {
    next(error);
  }
}

// 로그인
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      const error = new Error("Invalid credentials.");
      error.status = 401;
      throw error;
    }

    if (!user.isVerified) {
      const error = new Error("Please verify your email before logging in.");
      error.status = 403;
      throw error;
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      const error = new Error("Invalid credentials.");
      error.status = 401;
      throw error;
    }

    generateTokenAndSetCookie(user.id, res);

    const userWithoutPassword = { ...user.toJSON(), password: "" };
    res.status(200).json({ success: true, user: userWithoutPassword });
  } catch (error) {
    next(error);
  }
}

// 이메일 인증 처리
export async function verifyEmail(req, res, next) {
  try {
    const { token } = req.query;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      where: {
        signupToken: hashedToken,
        signupTokenExpiration: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      const error = new Error("Invalid or expired token.");
      error.status = 400;
      throw error;
    }

    user.isVerified = true;
    user.signupToken = null;
    user.signupTokenExpiration = null;
    await user.save();

    res.status(200).json({ success: true, message: "Email verification completed." });
  } catch (error) {
    next(error);
  }
}

// 로그아웃
export async function logout(req, res, next) {
  try {
    res.clearCookie("kdj-project");
    res.status(200).json({ success: true, message: "Logged out." });
  } catch (error) {
    next(error);
  }
}

// JWT 체크
export async function authCheck(req, res, next) {
  try {
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    next(error);
  }
}
