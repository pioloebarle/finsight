import "dotenv/config";
import { getSpendingByCategory } from "../src/lib/queries/spending";


async function runTest() {
  // 1. Target criteria matching your seed script defaults
  const fakeUserId = "user@example.com"; // Provide a valid UUID if user.id is explicit, or fetch it dynamically
  const targetDate = new Date(); // Current month matching your seed script arrays

  console.log(`🧪 Running query test for user context...`);
  
  try {
    // Note: Since getSpendingByCategory requires a real UUID string, we fetch your seed user first
    const { PrismaClient } = await import("../src/generated/prisma/client");
    const { PrismaPg } = await import("@prisma/adapter-pg");
    const pg = await import("pg");

    const pool = new pg.default.Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    const user = await prisma.user.findUnique({
      where: { email: fakeUserId }
    });

    if (!user) {
      console.error(`❌ Error: Could not find user with email ${fakeUserId}. Did you run 'npm run seed' first?`);
      await pool.end();
      return;
    }

    console.log(`📊 Aggregating expenses for User ID: ${user.id} for Month: ${targetDate.getMonth() + 1}/${targetDate.getFullYear()}`);
    
    // 2. Call the milestone query function
    const spendingData = await getSpendingByCategory(user.id, targetDate);

    console.log("\n==============================================");
    console.log("       SPENDING BY CATEGORY (IN PESOS)        ");
    console.log("==============================================");
    
    if (spendingData.length === 0) {
      console.log(" ⚠️ No expense records found for this month window.");
    }

    spendingData.forEach((row) => {
      // Convert negative centavos to absolute value standard Pesos for dashboard presentation
      const amountInPesos = Math.abs(row.totalCentavos) / 100;
      const formattedAmount = new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP"
      }).format(amountInPesos);

      const label = row.categoryId ? `Category ID: ${row.categoryId}` : "📁 Uncategorized (null)";
      console.log(`🔹 ${label} -> Total Expense: ${formattedAmount}`);
    });
    
    console.log("==============================================\n");

    await prisma.$disconnect();
    await pool.end();

  } catch (error) {
    console.error("❌ Test script failed with runtime exception:", error);
  }
}

runTest();
