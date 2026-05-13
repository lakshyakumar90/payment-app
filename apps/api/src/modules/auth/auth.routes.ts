import { RegisterSchema, LoginSchema } from "@repo/zod-schemas";
import { Router } from "express";
import { validateRequest } from "../../middleware/validation.middleware.js";
import {
  loginController,
  registerController,
  refreshTokenController,
  getMeController,
  logoutController,
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

// Back-compat with frontend client
authRoutes.post("/refresh", refreshTokenController);

authRoutes.post("/logout", authMiddleware, logoutController);

export default authRoutes;
