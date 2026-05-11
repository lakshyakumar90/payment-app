import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware.js";
import { validateRequest } from "../../middleware/validation.middleware.js";
import { TopUpWalletSchema } from "@repo/zod-schemas";
import { getWalletByUserIdController, topUpWalletController } from "./wallet.controller.js";

const router: Router = Router();

router.get("/", authMiddleware, getWalletByUserIdController);
router.post("/top-up", authMiddleware, validateRequest(TopUpWalletSchema), topUpWalletController);

export default router;