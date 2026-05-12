import { prisma } from "@repo/database";
import type { Request, Response, NextFunction } from "express";

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
    const userId = req.user?.userId;

    if(!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            role: true, deletedAt: true, isActive: true, isVerified: true,
        }
    })

    if(!user || user.deletedAt || !user.isActive || !user.isVerified) {
        return res.status(401).json({ message: "User not found" });
    }

    if(user.role !== "ADMIN") {
        return res.status(401).json({ message: "Forbidden" });
    }

    next();
};
