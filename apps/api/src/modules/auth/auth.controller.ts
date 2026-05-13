import type { Request, Response } from "express";
import * as authService from "./auth.service.js";

const REFRESH_COOKIE_NAME = "refreshToken";

const getCookieOptions = () => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};

const registerController = async (req: Request, res: Response) => {
  try {
    const { accessToken, refreshToken, user } = await authService.register(req.body);
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, getCookieOptions());
    res.status(201).json({ accessToken, user });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

const loginController = async (req: Request, res: Response) => {
  try{
    const { accessToken, refreshToken, user } = await authService.login(req.body);
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, getCookieOptions());
    res.status(200).json({ accessToken, user });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

const refreshTokenController = async (req: Request, res: Response) => {
  try{
    const refreshTokenValue =
      // cookie-parser populates req.cookies
      (req as any).cookies?.[REFRESH_COOKIE_NAME] ?? req.body?.refreshTokenValue;

    if (!refreshTokenValue) {
      return res.status(401).json({ message: "Missing refresh token" });
    }

    const {accessToken, refreshToken} = await authService.refreshToken(refreshTokenValue);
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, getCookieOptions());
    res.status(200).json({
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

const getMeController = async (req: Request, res: Response) => {
  try{
    const user = await authService.getMe(req.user?.userId!);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

const logoutController = async (req: Request, res: Response) => {
  try{
    await authService.logout(req.user?.userId!);
    res.clearCookie(REFRESH_COOKIE_NAME);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export { registerController, loginController, refreshTokenController, getMeController, logoutController };
