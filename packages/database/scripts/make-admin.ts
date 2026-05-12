import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "..", ".env") });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
const ADMIN_NAME = process.env.ADMIN_NAME!;

async function main() {
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const existing = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });

  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: { role: "ADMIN", password: hash },
    });
    console.log("Promoted to ADMIN and password updated:", ADMIN_EMAIL);
    return;
  }

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: hash,
        role: "ADMIN",
      },
    });
    await tx.wallet.create({ data: { userId: user.id } });
  });
  console.log("Created ADMIN user + wallet:", ADMIN_EMAIL);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());