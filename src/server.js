import dotenv from "dotenv";
import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/connectDB.js";
import authRoute from "./routes/auth-route.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true // ถ้า request มาจากโดเมนอื่น จะถูกปฏิเสธ
}));
app.use(express.json()); // allows us to parse incoming requests:req.body
app.use(cookieParser()); // allows us to parse incoming cookies

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