import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { validateRequest } from "../../middleware/validation.middleware.js";
import { TransactionSchema, AdminTransferBetweenUsersSchema } from "@repo/zod-schemas";
import { transactionController, adminTransferBetweenUsersController } from "./transaction.controller.js";
import { adminMiddleware } from "../../middleware/admin.middleware.js";

const router: Router = Router();

router.post("/transfer", authMiddleware, validateRequest(TransactionSchema), transactionController);
router.post("/admin/transfer", authMiddleware, adminMiddleware, validateRequest(AdminTransferBetweenUsersSchema), adminTransferBetweenUsersController);

export default router;