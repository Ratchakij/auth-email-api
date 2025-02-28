import dotenv from "dotenv";
import express from 'express';

dotenv.config();

const app = express();

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the Node.js Authentication API!",
    });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));