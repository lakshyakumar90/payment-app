import { RegisterSchema } from "@repo/zod-schemas";
import { Router } from "express";
import { validateRequest } from "../../middleware/validation.middleware.js";
import { registerController } from "./auth.controller.js";

const authRoutes: Router = Router();

authRoutes.post(
  "/register",
  validateRequest(RegisterSchema),
  registerController,
);

export default authRoutes;
