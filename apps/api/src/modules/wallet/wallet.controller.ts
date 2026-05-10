import type { Request, Response } from "express";
import { getWalletByUserId, topUpWallet } from "./wallet.service.js";

export const getWalletByUserIdController = async (req: Request, res: Response) => {
    try {
        const wallet = await getWalletByUserId(req.user?.userId!);
        res.status(200).json({ wallet });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const topUpWalletController = async (req: Request, res: Response) => {
    try {
        const wallet = await topUpWallet(req.user?.userId!, req.body.amount);
        res.status(200).json({ wallet });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};