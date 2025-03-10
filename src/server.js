import dotenv from "dotenv";
import express from 'express';
import { connectDB } from "./db/connectDB.js";
import authRoute from "./routes/auth-route.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/auth", authRoute);

// app.get("/", (req, res) => {
//     res.json({
//         message: "Welcome to the Node.js Authentication API!",
//     });
// });

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port: ${PORT}`)
});