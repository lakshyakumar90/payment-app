import type { Request, Response } from "express";
import {
    getWalletByUserId,
    topUpWallet,
    deductWallet,
    resetCacheWallet,
    resetAllCachesWallet,
    topUpAllWallet,
    deductAllWallet,
} from "./wallet.service.js";

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
        const wallet = await topUpWallet(req.body.userId, req.body.amount);
        res.status(200).json({ wallet });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const deductWalletController = async (req: Request, res:Response) => {
    try {
        const wallet = await deductWallet(req.body.userId, req.body.amount);
        res.status(200).json({ wallet });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}

export const resetCacheWalletController = async (req: Request, res: Response) => {
    try {
        const wallet = await resetCacheWallet(req.body.userId);
        res.status(200).json({ wallet });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}

export const resetAllCachesWalletController = async (req: Request, res: Response) => {
    try {
        const result = await resetAllCachesWallet();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}

export const topUpAllWalletController = async (req: Request, res: Response) => {
    try {
        const result = await topUpAllWallet(req.body.amount);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}

export const deductAllWalletController = async (req: Request, res: Response) => {
    try {
        const result = await deductAllWallet(req.body.amount);
        res.status(200).json(result);
    } catch (error) {   
        res.status(500).json({ message: (error as Error).message });
    }
}