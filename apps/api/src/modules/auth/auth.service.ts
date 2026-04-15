import { hashPassword } from "../../utils/hash.js";
import type { RegisterSchemaType } from "@repo/zod-schemas";
import { prisma } from "@repo/database";

type RegisterResult = {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    isActive: boolean;
    isVerified: boolean;
}

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
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt,
        isActive: user.isActive,
        isVerified: user.isVerified,
    };
}

export { register };