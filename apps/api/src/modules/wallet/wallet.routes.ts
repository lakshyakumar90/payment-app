import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware.js";
import { validateRequest } from "../../middleware/validation.middleware.js";
import { AdminTopUpWalletSchema } from "@repo/zod-schemas";
import {
  getWalletByUserIdController,
  topUpWalletController,
} from "./wallet.controller.js";
import { adminMiddleware } from "../../middleware/admin.middleware.js";

const router: Router = Router();

router.get("/", authMiddleware, getWalletByUserIdController);
router.post(
  "/admin/top-up",
  authMiddleware,
  adminMiddleware,
  validateRequest(AdminTopUpWalletSchema),
  topUpWalletController,
);

export default router;
