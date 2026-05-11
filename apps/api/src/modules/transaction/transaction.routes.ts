import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { validateRequest } from "../../middleware/validation.middleware.js";
import { TransactionSchema } from "@repo/zod-schemas";
import { transactionController } from "./transaction.controller.js";

const router: Router = Router();

router.post("/transfer", authMiddleware, validateRequest(TransactionSchema), transactionController);

export default router;