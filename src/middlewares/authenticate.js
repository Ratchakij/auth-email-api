import mongoose from "mongoose"; // const mongoose = require('mongoose');
import jwt from "jsonwebtoken"; // const jwt = require("jsonwebtoken");
import { User } from "../models/user.js"; // const User = require("../models/user.js");

const authenticate = async (req, res, next) => {
    try {
        let token;

        console.log("req.headers: ", req.headers);

        if (req.headers.client === "not-browser") { token = req.headers.authorization; }
        else { token = req.cookies["Authorization"]; }

        if (!token || !token.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Token not provided or invalid format"
            });
        }

        token = token.split(" ")[1];

        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!mongoose.Types.ObjectId.isValid(payload.userId)) {
            return res.status(400).json({
                success: false,
                message: "Bad Request: Invalid user ID in token"
            });
        }

        const user = await User.findById(payload.userId).select("-password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found"
            });
        }

        // const iat = new Date(payload.iat * 1000).toLocaleString();
        // const exp = new Date(payload.exp * 1000).toLocaleString();
        // console.log("Issued At:", iat);
        // console.log("Expires At:", exp);

        req.user = payload;
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
}

export default authenticate;