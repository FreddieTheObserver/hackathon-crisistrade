import { prisma } from "../src/db";
import bcrypt from "bcryptjs";

// Unified disaster-themed seed for the integration phase.
// Creates demo accounts and reseeds all four boards owned by them.
// Run from backend/ with: npm run seed   (after: npm run db:push)

const PASSWORD = "password123";

const demoUsers = [
  { key: "anita", email: "anita@crisistrade.test", displayName: "Anita Sharma" },
  { key: "bikash", email: "bikash@crisistrade.test", displayName: "Bikash Gurung" },
  { key: "chandra", email: "chandra@crisistrade.test", displayName: "Chandra Rai" },
  { key: "deepa", email: "deepa@crisistrade.test", displayName: "Deepa Thapa" },
  { key: "sita", email: "sita@crisistrade.test", displayName: "Sita Karki" },
  { key: "ram", email: "ram@crisistrade.test", displayName: "Ram Bahadur" },
] as const;

type UserKey = (typeof demoUsers)[number]["key"];
type DemoUser = { id: string; displayName: string };

// Trades / Emergency / Exchange use userId; Donations use ownerId.
const owner = (users: Record<string, DemoUser>, key: UserKey) => ({
  userId: users[key].id,
  ownerName: users[key].displayName,
});
const donationOwner = (users: Record<string, DemoUser>, key: UserKey) => ({
  ownerId: users[key].id,
  ownerName: users[key].displayName,
});

async function main() {
  // Wipe everything (plain-string refs, no FK order constraints).
  await prisma.trade.deleteMany();
  await prisma.trader.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.emergencyRequest.deleteMany();
  await prisma.exchangePoint.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash(PASSWORD, 10);
  const users: Record<string, DemoUser> = {};
  for (const u of demoUsers) {
    const created = await prisma.user.create({
      data: { email: u.email, displayName: u.displayName, passwordHash },
    });
    users[u.key] = { id: created.id, displayName: created.displayName };
  }

  // ── Trades ──
  await prisma.trade.createMany({
    data: [
      { title: "Rice for blankets", ...owner(users, "anita"), offering: "Rice (20 kg)", wanting: "Blankets (5)", itemType: "food", urgency: "high", area: "Kathmandu, Bagmati", contact: "+977-9801000001", note: "Sealed sacks, stored dry.", status: "available" },
      { title: "Water bottles for power bank", ...owner(users, "bikash"), offering: "Water Bottles (24 x 1L)", wanting: "Power Bank (10000mAh+)", itemType: "water", urgency: "critical", area: "Pokhara, Gandaki", contact: "+977-9801000002", note: "Need to charge a phone.", status: "available" },
      { title: "Blankets for gas cylinder", ...owner(users, "chandra"), offering: "Wool Blankets (6)", wanting: "Gas Cylinder", itemType: "shelter", urgency: "medium", area: "Biratnagar, Koshi", contact: "+977-9801000003", status: "available" },
      { title: "Gas cylinder for rice", ...owner(users, "deepa"), offering: "Gas Cylinder (full)", wanting: "Rice or lentils (15 kg)", itemType: "other", urgency: "high", area: "Hetauda, Bagmati", contact: "+977-9801000004", note: "Reserved pending pickup.", status: "pending", counterparty: "Ram Bahadur" },
      { title: "Rice for blankets (completed)", ...owner(users, "sita"), offering: "Rice (20 kg)", wanting: "Blankets (5)", itemType: "food", urgency: "medium", area: "Lalitpur, Bagmati", contact: "+977-9801000009", note: "Exchanged at the community center.", status: "completed", counterparty: "Ram Bahadur", reputationAwarded: true },
    ],
  });

  // ── Traders (reputation; owner side linked to a user) ──
  await prisma.trader.create({ data: { name: users.sita.displayName, userId: users.sita.id, reputationPoints: 3 } });
  await prisma.trader.create({ data: { name: users.ram.displayName, userId: users.ram.id, reputationPoints: 2 } });

  // ── Donations ──
  await prisma.donation.createMany({
    data: [
      { title: "Free drinking water", item: "Bottled water", quantity: "30 bottles", category: "water", location: "Kathmandu, Bagmati", availableAt: "Today 2-6pm", contact: "+977-9802000001", status: "AVAILABLE", ...donationOwner(users, "anita") },
      { title: "Spare blankets", item: "Wool blankets", quantity: "8", category: "shelter", location: "Pokhara, Gandaki", availableAt: "Tomorrow morning", contact: "+977-9802000002", status: "AVAILABLE", ...donationOwner(users, "bikash") },
      { title: "First-aid supplies", item: "Bandages + antiseptic", quantity: "5 kits", category: "medicine", location: "Lalitpur, Bagmati", availableAt: "Weekdays 9-5", contact: "+977-9802000003", status: "RESERVED_PENDING", ...donationOwner(users, "sita") },
    ],
  });

  // ── Emergency Requests ──
  await prisma.emergencyRequest.createMany({
    data: [
      { title: "Need clean water", need: "20L drinking water", location: "Bhaktapur", urgency: "Urgent", contact: "+977-9803000001", status: "Open", ...owner(users, "chandra"), isOwner: false },
      { title: "Baby formula", need: "Infant formula + bottles", location: "Kathmandu", urgency: "Urgent", contact: "+977-9803000002", status: "Open", ...owner(users, "deepa"), isOwner: false },
      { title: "Warm clothes", need: "Jackets for 3 kids", location: "Dharan", urgency: "Medium", contact: "+977-9803000003", status: "Helped", ...owner(users, "ram"), isOwner: false },
    ],
  });

  // ── Safe Exchange Points ──
  await prisma.exchangePoint.createMany({
    data: [
      { placeName: "Tundikhel Community Ground", area: "Kathmandu, Bagmati", openTime: "6am - 8pm", notes: "Open field, well-lit, guarded.", contactNotes: "Ward office desk", ...owner(users, "anita") },
      { placeName: "Lakeside Aid Tent", area: "Pokhara, Gandaki", openTime: "8am - 6pm", notes: "Near the boat station.", contactNotes: "Ask for the volunteer lead", ...owner(users, "bikash") },
    ],
  });

  console.log("Seeded users:");
  for (const u of demoUsers) console.log(`  ${u.email} / ${PASSWORD}  (${u.displayName})`);
  console.log(
    `Counts: ${await prisma.user.count()} users, ${await prisma.trade.count()} trades, ` +
      `${await prisma.donation.count()} donations, ${await prisma.emergencyRequest.count()} requests, ` +
      `${await prisma.exchangePoint.count()} exchange points.`,
  );
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
