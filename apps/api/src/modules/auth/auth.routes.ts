import { RegisterSchema, LoginSchema } from "@repo/zod-schemas";
import { Router } from "express";
import { validateRequest } from "../../middleware/validation.middleware.js";
import { loginController, registerController } from "./auth.controller.js";

const authRoutes: Router = Router();

authRoutes.post(
  "/register",
  validateRequest(RegisterSchema),
  registerController,
);

authRoutes.post("/login", validateRequest(LoginSchema), loginController);

export default authRoutes;
