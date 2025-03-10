import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { User } from "../models/user.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../services/email-service.js";

const authController = {
   signup: async (req, res, next) => {
      const { email, password, name } = req.body;
      try {
         if (!email || !password || !name) { throw new Error("All fields are required"); }

         const existingUser = await User.findOne({ email });
         console.log("existingUser", existingUser);

         if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
         }

         const hashedPassword = await bcryptjs.hash(password, 10);
         const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
         const expiresTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

         const newUser = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: expiresTime,
         });

         const user = await newUser.save();

         // jwt
         generateTokenAndSetCookie(res, user._id);
         // veryfy email
         await sendVerificationEmail(user.email, verificationToken);

         res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
               ...user._doc,
               password: undefined,
            },
         });
      }
      catch (error) {
         console.log("Error in signup ", error);
         return res.status(400).json({ success: false, message: error.message });
      }
   },
   login: async (req, res, next) => {
      const { email, password } = req.body;
      try {
         const user = await User.findOne({ email });
         if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
         }
         const isPasswordValid = await bcryptjs.compare(password, user.password);
         if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
         }

         generateTokenAndSetCookie(res, user._id);

         user.lastLogin = new Date();
         await user.save();

         res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
               ...user._doc,
               password: undefined,
            },
         });
      }
      catch (error) {
         console.log("Error in login ", error);
         res.status(400).json({ success: false, message: error.message });
      }
   },
   getMe: async (req, res, next) => {
      try {
      }
      catch (error) {
         console.log(error);
      }
   },
   logout: async (req, res, next) => {
      try {
         res.clearCookie("token");
         res.status(200).json({ success: true, message: "Logged out successfully" });
      }
      catch (error) {
         console.log(error);
      }
   },
   verifyEmail: async (req, res, next) => {
      const { code } = req.body;
      try {
         // const user = await User.findOneAndUpdate(
         //    {
         //       verificationToken: code,
         //       verificationTokenExpiresAt: { $gt: Date.now() }
         //    },
         //    { $set: { isVerified: true, verificationToken: null } },
         //    { new: true }
         // );

         const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
         });

         if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
         }

         user.isVerified = true;
         user.verificationToken = undefined;
         user.verificationTokenExpiresAt = undefined;
         await user.save();

         await sendWelcomeEmail(user.email, user.name);

         res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
               ...user._doc,
               password: undefined,
            },
         });
      }
      catch (error) {
         console.log("error in verifyEmail ", error);
         res.status(500).json({ success: false, message: "Server error" });
      }
   },
};

export default authController;
