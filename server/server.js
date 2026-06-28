import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoute.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `\x1b[32m%s\x1b[0m`,
      `✔ MongoDB Connected Successfully: ${conn.connection.host}`,
    );
  } catch (error) {
    console.error(
      `\x1b[31m%s\x1b[0m`,
      `✖ Database Connection Failed! Error: ${error.message}`,
    );
    process.exit(1);
  }
};

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Resume Builder Backend API running smoothly.",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `\x1b[36m%s\x1b[0m`,
    `🚀 Server running in production mode on port: ${PORT}`,
  );
});
