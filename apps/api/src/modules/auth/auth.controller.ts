import type { Request, Response } from "express";
import * as authService from "./auth.service.js";

const registerController = async (req: Request, res: Response) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

const loginController = async (req: Request, res: Response) => {
  try{
    const user = await authService.login(req.body);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

const refreshTokenController = async (req: Request, res: Response) => {
  try{
    const {refreshTokenValue} = req.body;
    const {accessToken, refreshToken} = await authService.refreshToken(refreshTokenValue);
    res.status(200).json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

const getMeController = async (req: Request, res: Response) => {
  try{
    const user = await authService.getMe(req.user?.userId!);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export { registerController, loginController, refreshTokenController, getMeController };
