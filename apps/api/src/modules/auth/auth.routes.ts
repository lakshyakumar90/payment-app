import { RegisterSchema, LoginSchema } from "@repo/zod-schemas";
import { Router } from "express";
import { validateRequest } from "../../middleware/validation.middleware.js";
import {
  loginController,
  registerController,
  refreshTokenController,
  getMeController,
} from "./auth.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const authRoutes: Router = Router();

authRoutes.post(
  "/register",
  validateRequest(RegisterSchema),
  registerController,
);

authRoutes.post("/login", validateRequest(LoginSchema), loginController);

authRoutes.get("/me", authMiddleware, getMeController);

authRoutes.post("/refresh-token", refreshTokenController);

export default authRoutes;
