import dotenv from "dotenv";
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from "../generated/prisma/client.js";

import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "..", ".env") });
const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaNeon({ connectionString: connectionString });
const prisma = new PrismaClient({ adapter: adapter });

export { prisma };
