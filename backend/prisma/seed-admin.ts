import { prisma } from "../src/db";
import bcrypt from "bcryptjs";

// Seeds (or resets) a single admin account without touching any other data.
// Idempotent: re-running updates the existing admin's password/role.
// Run from backend/ with: npm run seed:admin

const ADMIN_EMAIL = "admin@crisistrade.test";
const ADMIN_DISPLAY_NAME = "Site Admin";
const ADMIN_PASSWORD = "password123";

async function main() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    create: {
      email: ADMIN_EMAIL,
      displayName: ADMIN_DISPLAY_NAME,
      passwordHash,
      role: "admin",
    },
    update: {
      passwordHash,
      role: "admin",
    },
  });

  console.log(`Admin ready: ${admin.email} / ${ADMIN_PASSWORD}  (role: ${admin.role})`);
}

main()
  .catch((err) => {
    console.error("Admin seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
