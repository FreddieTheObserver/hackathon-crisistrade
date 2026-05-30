import { prisma } from "../src/db";

// Idempotent disaster-themed seed for the Marketplace Trades board.
// Run from backend/ with: npm run seed
// Covers every itemType, all four statuses (incl. one completed with a
// counterparty), and all urgency levels. Areas use real Nepal provinces
// (Bagmati, Gandaki, Koshi) so the Location filter has real options.

const trades = [
      {
            title: "Rice for blankets",
            ownerName: "Anita Sharma",
            offering: "Rice (20 kg)",
            wanting: "Blankets (5)",
            itemType: "food",
            urgency: "high",
            area: "Kathmandu, Bagmati",
            contact: "+977-9801000001",
            note: "Sealed sacks, stored dry. Can split into two lots.",
            status: "available",
      },
      {
            title: "Water bottles for power bank",
            ownerName: "Bikash Gurung",
            offering: "Water Bottles (24 x 1L)",
            wanting: "Power Bank (10000mAh+)",
            itemType: "water",
            urgency: "critical",
            area: "Pokhara, Gandaki",
            contact: "+977-9801000002",
            note: "Need to charge a phone for emergency calls.",
            status: "available",
      },
      {
            title: "Blankets for gas cylinder",
            ownerName: "Chandra Rai",
            offering: "Wool Blankets (6)",
            wanting: "Gas Cylinder (half full ok)",
            itemType: "shelter",
            urgency: "medium",
            area: "Biratnagar, Koshi",
            contact: "+977-9801000003",
            status: "available",
      },
      {
            title: "Gas cylinder for rice",
            ownerName: "Deepa Thapa",
            offering: "Gas Cylinder (full)",
            wanting: "Rice or lentils (15 kg)",
            itemType: "other",
            urgency: "high",
            area: "Hetauda, Bagmati",
            contact: "+977-9801000004",
            note: "Reserved pending pickup confirmation.",
            status: "pending",
            counterparty: "Manish Lama",
      },
      {
            title: "Power bank for medicine",
            ownerName: "Eshan Maharjan",
            offering: "Power Bank (20000mAh)",
            wanting: "Paracetamol / ORS sachets",
            itemType: "batteries",
            urgency: "high",
            area: "Kathmandu, Bagmati",
            contact: "+977-9801000005",
            status: "available",
      },
      {
            title: "Medicine for water bottles",
            ownerName: "Farsana Khatun",
            offering: "First-aid kit + ORS (x10)",
            wanting: "Clean drinking water (20L)",
            itemType: "medicine",
            urgency: "critical",
            area: "Pokhara, Gandaki",
            contact: "+977-9801000006",
            note: "Kit includes bandages, antiseptic, painkillers.",
            status: "available",
      },
      {
            title: "AA batteries for candles",
            ownerName: "Gagan Limbu",
            offering: "AA Batteries (24)",
            wanting: "Candles or kerosene lamp",
            itemType: "batteries",
            urgency: "low",
            area: "Dharan, Koshi",
            contact: "+977-9801000007",
            note: "Already traded — keeping listing for reference.",
            status: "unavailable",
      },
      {
            title: "Hand tools for rope",
            ownerName: "Hari Tamang",
            offering: "Shovel + hand saw",
            wanting: "Strong rope (20m)",
            itemType: "tools",
            urgency: "medium",
            area: "Gorkha, Gandaki",
            contact: "+977-9801000008",
            status: "available",
      },
      {
            // Completed trade — reputation already awarded to both sides.
            title: "Rice for blankets (completed)",
            ownerName: "Sita Karki",
            offering: "Rice (20 kg)",
            wanting: "Blankets (5)",
            itemType: "food",
            urgency: "medium",
            area: "Lalitpur, Bagmati",
            contact: "+977-9801000009",
            note: "Exchanged at the community center. Thank you!",
            status: "completed",
            counterparty: "Ram Bahadur",
            reputationAwarded: true,
      },
];

// Traders for the completed trade, pre-seeded with the points that completion
// would have awarded (plus prior history). Mirrors the reputationAwarded guard.
const traders = [
      { name: "Sita Karki", reputationPoints: 3 },
      { name: "Ram Bahadur", reputationPoints: 2 },
];

async function main() {
      // Wipe first so re-running the seed always lands the same state.
      await prisma.trade.deleteMany();
      await prisma.trader.deleteMany();

      await prisma.trade.createMany({ data: trades });
      await prisma.trader.createMany({ data: traders });

      const tradeCount = await prisma.trade.count();
      const traderCount = await prisma.trader.count();
      console.log(`Seeded ${tradeCount} trades and ${traderCount} traders.`);
}

main()
      .catch((err) => {
            console.error("Seed failed:", err);
            process.exit(1);
      })
      .finally(() => prisma.$disconnect());
