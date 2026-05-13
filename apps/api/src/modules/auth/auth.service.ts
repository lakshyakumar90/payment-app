import { hashPassword, hashToken, verifyPassword, verifyToken } from "../../utils/hash.js";
import type { RegisterSchemaType, LoginSchemaType } from "@repo/zod-schemas";
import { prisma } from "@repo/database";
import { interactiveTransactionDefaults } from "../../utils/prisma-transaction.js";
import { createSession } from "./auth.utils.js";
import { verifyRefreshToken } from "../../utils/jwt.js";
import { signAccessToken, signRefreshToken } from "../../utils/jwt.js";
import type { TokenPayload } from "../../types.js";

type RegisterResult = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

type LoginResult = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

const register = async (data: RegisterSchemaType): Promise<RegisterResult> => {
  const { name, email, password } = data;

  if (!name || !email || !password) {
    throw new Error("Missing required fields");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await prisma.$transaction(
    async (tx) => {
      const user = await tx.user.create({
        data: { name, email, password: hashedPassword },
      });

      await tx.wallet.create({
        data: {
          userId: user.id,
        },
      });

      return user;
    },
    interactiveTransactionDefaults,
  );


  const { accessToken, refreshToken } = await createSession(newUser.id);

  return {
    accessToken,  
    refreshToken,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
  };
};

const login = async (data: LoginSchemaType): Promise<LoginResult> => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid Credentials, User not found");
  }

  const isPasswordValid = await verifyPassword(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid Credentials");
  }

  const { accessToken, refreshToken } = await createSession(user.id);

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
};

const refreshToken = async (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken) as TokenPayload;

  const sessions = await prisma.session.findMany({
    where: { userId: payload.userId },
  });

  let validSession = null;

  for (const session of sessions) {
    const isValid = await verifyToken(
      refreshToken,
      session.refreshToken
    );

    if (isValid) {
      validSession = session;
      break;
    }
  }

  if (!validSession) throw new Error("Invalid refresh token");

  await prisma.session.delete({
    where: { id: validSession.id },
  });

  const newAccessToken = signAccessToken({ userId: payload.userId });
  const newRefreshToken = signRefreshToken({ userId: payload.userId });

  const hashed = await hashToken(newRefreshToken);

  await prisma.session.create({
    data: {
      userId: payload.userId,
      refreshToken: hashed,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new Error("User not found");
  }
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as "USER" | "ADMIN",
  };
};

const logout = async (userId: string) => {
  await prisma.session.deleteMany({
    where: { userId },
  });
};

export { register, login, refreshToken, getMe, logout };
