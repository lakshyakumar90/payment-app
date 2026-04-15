export interface TokenPayload {
  userId: string;
  role?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}