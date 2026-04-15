import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import type { Request, Response } from "express";
import authRoutes from "./modules/auth/auth.routes.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ message: "OK" });
});

app.use("/api/v1/auth", authRoutes);

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
})