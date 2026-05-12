import type { Request, Response } from "express";
import * as transactionService from "./transaction.service.js";

export const transactionController = async (req: Request, res: Response) => {
  try {
    const senderId = req.user?.userId!;
    const { receiverId, amount } = req.body;
    const transactionResult = await transactionService.transaction(
      senderId,
      receiverId,
      amount,
    );
    res.status(200).json({ transactionResult });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const adminTransferBetweenUsersController = async (
  req: Request,
  res: Response,
) => {
    try{
        const { fromUserId, toUserId, amount } = req.body;
        const transactionResult = await transactionService.adminTransferBetweenUsers(fromUserId, toUserId, amount);
        res.status(200).json({ transactionResult });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
