import express from "express";

import authController from "../controllers/auth-controller.js";

const authRoute = express.Router();

authRoute.post("/signup", authController.signup);
authRoute.post("/login", authController.login);
authRoute.get("/me", authController.getMe);
authRoute.post("/logout", authController.logout);

authRoute.post("/verify-email", authController.verifyEmail);

export default authRoute;
