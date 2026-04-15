import type { TokenPayload } from "../types.d.js"; // Import the interface
import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  try {
    const decoded = verifyToken(token);
    
    if (typeof decoded === "string") {
      return res.status(401).json({ message: "Invalid token payload" });
    }
  
    req.user = decoded as unknown as TokenPayload; 
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};