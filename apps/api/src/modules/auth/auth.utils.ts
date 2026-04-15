import { hashToken } from "../../utils/hash.js";
import { prisma } from "@repo/database";
import { signAccessToken, signRefreshToken } from "../../utils/jwt.js";

const REFRESH_EXPIRES = 7 * 24 * 60 * 60 * 1000;

export const createSession = async (userId: string) => {
  const accessToken = signAccessToken({ userId });
  const refreshToken = signRefreshToken({ userId }, { expiresIn: REFRESH_EXPIRES });
  const hashedRefreshToken = await hashToken(refreshToken);

  await prisma.session.deleteMany({
    where: { userId },
  });

  await prisma.session.create({
    data: {
      userId,
      refreshToken: hashedRefreshToken,
      expiresAt: new Date(Date.now() + REFRESH_EXPIRES),
    },
  });
  return { accessToken, refreshToken };
};
