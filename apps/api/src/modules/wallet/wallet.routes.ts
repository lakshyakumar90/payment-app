import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware.js";
import { validateRequest } from "../../middleware/validation.middleware.js";
import {
  AdminTopUpWalletSchema,
  AdminDeductWalletSchema,
  AdminResetCacheWalletSchema,
  AdminResetAllCachesWalletSchema,
  AdminTopUpAllWalletSchema,
  AdminDeductAllWalletSchema,
} from "@repo/zod-schemas";
import {
  getWalletByUserIdController,
  topUpWalletController,
  deductWalletController,
  resetCacheWalletController,
  resetAllCachesWalletController,
  topUpAllWalletController,
  deductAllWalletController,
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
router.post(
  "/admin/deduct",
  authMiddleware,
  adminMiddleware,
  validateRequest(AdminDeductWalletSchema),
  deductWalletController,
);
router.post(
  "/admin/reset-cache",
  authMiddleware,
  adminMiddleware,
  validateRequest(AdminResetCacheWalletSchema),
  resetCacheWalletController,
);
router.post(
  "/admin/reset-all-caches",
  authMiddleware,
  adminMiddleware,
  validateRequest(AdminResetAllCachesWalletSchema),
  resetAllCachesWalletController,
);
router.post(
  "/admin/top-up-all",
  authMiddleware,
  adminMiddleware,
  validateRequest(AdminTopUpAllWalletSchema),
  topUpAllWalletController,
);

router.post(
  "/admin/deduct-all",
  authMiddleware,
  adminMiddleware,
  validateRequest(AdminDeductAllWalletSchema),
  deductAllWalletController,
);


export default router;
