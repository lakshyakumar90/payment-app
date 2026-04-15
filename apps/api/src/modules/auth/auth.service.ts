import { hashPassword, hashToken, verifyPassword } from "../../utils/hash.js";
import type { RegisterSchemaType, LoginSchemaType } from "@repo/zod-schemas";
import { prisma } from "@repo/database";
import { createSession } from "./auth.utils.js";

type RegisterResult = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

type LoginResult = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
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

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  const { accessToken, refreshToken } = await createSession(user.id);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
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
    user: { id: user.id, name: user.name, email: user.email },
  };
};

export { register, login };
