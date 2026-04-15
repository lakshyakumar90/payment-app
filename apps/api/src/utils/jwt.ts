import jwt from "jsonwebtoken";
import type { SignOptions, JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_dev_only";
const ACCESS_SECRET = process.env.ACCESS_SECRET! || "fallback_secret_for_dev_only";
const REFRESH_SECRET = process.env.REFRESH_SECRET! || "fallback_secret_for_dev_only";


export const signAccessToken  = (payload: object, options?: SignOptions) => {
  return jwt.sign(payload, ACCESS_SECRET, {
    ...options,
  });
};

export const signRefreshToken  = (payload: object, options?: SignOptions) => {
  return jwt.sign(payload, REFRESH_SECRET, {
    ...options,
  });
};

export const verifyAccessToken  = (token: string): JwtPayload | string => {
    return jwt.verify(token, ACCESS_SECRET);
};

export const verifyRefreshToken  = (token: string): JwtPayload | string => {
    return jwt.verify(token, REFRESH_SECRET);
};