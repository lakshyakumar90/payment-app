import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import type { Request, Response } from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import cookieParser from "cookie-parser";
import walletRoutes from "./modules/wallet/wallet.routes.js";
import transactionRoutes from "./modules/transaction/transaction.routes.js";

dotenv.config();

const app = express();

// apps/api/src/index.ts — replace the cors() block

const parseOrigins = (): string[] => {
  const raw = process.env.CLIENT_URLS ?? process.env.CLIENT_URL;
  if (!raw) {
    return ["http://localhost:3000", "http://localhost:3001"];
  }
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
};

const allowedOrigins = parseOrigins();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "OK" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/wallet", walletRoutes);
app.use("/api/v1/transaction", transactionRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
