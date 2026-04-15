import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import type { Request, Response } from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "OK" });
});

app.use("/api/v1/auth", authRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
