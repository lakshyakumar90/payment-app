import bcrypt from "bcrypt";

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const hashToken = async (token: string): Promise<string> => {
  return await bcrypt.hash(token, 10);
};

export const verifyToken = async (token: string, hashedToken: string): Promise<boolean> => {
  return await bcrypt.compare(token, hashedToken);
};
