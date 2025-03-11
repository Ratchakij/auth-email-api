import express from "express";

import * as authController from "../controllers/auth-controller.js"; // Import ทั้งหมดเป็น Object
import verifyToken from "../middlewares/verifyToken.js";
import authenticate from "../middlewares/authenticate.js";

const authRoute = express.Router();

authRoute.get("/check-auth", verifyToken, authController.checkAuth);
authRoute.get('/check-me', authenticate, authController.checkMe);

authRoute.post("/signup", authController.signup);
authRoute.post("/login", authController.login);
authRoute.post("/logout", authController.logout);


authRoute.post("/verify-email", authController.verifyEmail);
authRoute.post("/forgot-password", authController.forgotPassword);

authRoute.post("/reset-password/:token", authController.resetPassword);

export default authRoute;
