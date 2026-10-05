import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const targetEmail = "user@example.com";

    console.log("Resetting database data for target user");

    await prisma.user.deleteMany({
        where: { email: targetEmail }
    });
    console.log("Creating fake user")

    const user = await prisma.user.create({
        data: {
            email: targetEmail,
            passwordHash: "\$2b\$10\$password"
        }
    });
    console.log("Creating fake categories...");
    const categoryNames = ["Food", "Transportation", "Grocery", "Bills", "Internet", "Salary", "Subscriptions"];

    const createdCategories = await Promise.all(
        categoryNames.map(name => 
            prisma.category.create({
                data: {
                    categoryName: name,
                    userId: user.id
                }
            })
        )
    );

    const categoryMap = Object.fromEntries(createdCategories.map(category => [category.categoryName, category.id]));

    console.log("Generating fake transactions...");

    const transactionsData = [];
    const baseDate = new Date();

    transactionsData.push(
        {
            userId: user.id,
            transactionDate: new Date(baseDate.getFullYear(), baseDate.getMonth(), 1),
            amountCentavos: 450000,
            description: "Monthly Salary Core",
            categoryId: categoryMap["Salary"],
            categorizedBy: "USER" as const,
            source: "IMPORT" as const,
            importHash: "salary_core_m1"
        },
        {
            userId: user.id,
            transactionDate: new Date(baseDate.getFullYear(), baseDate.getMonth(), 1),
            amountCentavos: 450000,
            description: "Monthly Salary Core",
            categoryId: categoryMap["Salary"],
            categorizedBy: "USER" as const,
            source: "IMPORT" as const,
            importHash: "salary_core_m2"
        },
        {
            userId: user.id,
            transactionDate: new Date(baseDate.getFullYear(), baseDate.getMonth(), 1),
            amountCentavos: 35000,
            description: "Freelance Design Gig",
            categoryId: categoryMap["Salary"],
            categorizedBy: "USER" as const,
            source: "MANUAL" as const,
            importHash: null
        },

    );

    // 2. Generate random expenses across 2 months
    const sampleExpenses = [
        { desc: "Uber Ride Home", cat: "Transportation", min: -4000, max: -1500 },
        { desc: "Starbucks Coffee", cat: "Food", min: -1200, max: -600 },
        { desc: "McDonalds Dinner", cat: "Food", min: -2500, max: -1200 },
        { desc: "Whole Foods Haul", cat: "Grocery", min: -12000, max: -4500 },
        { desc: "Electric Utility Bill", cat: "Bills", min: -18000, max: -9000 },
        { desc: "ISP Fiber Internet", cat: "Internet", min: -8900, max: -8900 },
        { desc: "Netflix Subscription", cat: "Subscriptions", min: -1599, max: -1599 },
        { desc: "Unknown Corner Store Cash", cat: null, min: -2000, max: -500 }, // Left uncategorized
    ];

    for (let i = 0; i < 33; i++) {
        // Randomly split across current month (0) and previous month (-1)
        const monthOffset = Math.random() > 0.5 ? 0 : -1;
        const randomDay = Math.floor(Math.random() * 27) + 1;
        const generatedDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + monthOffset, randomDay);

        // Pick a random sample transaction type
        const expenseTemplate = sampleExpenses[Math.floor(Math.random() * sampleExpenses.length)];
        
        // Pick an amount between our min and max values
        const amountCentavos = Math.floor(
            Math.random() * (expenseTemplate.max - expenseTemplate.min + 1) + expenseTemplate.min
        );

        transactionsData.push({
            userId: user.id,
            transactionDate: generatedDate,
            amountCentavos,
            description: expenseTemplate.desc,
            categoryId: expenseTemplate.cat ? categoryMap[expenseTemplate.cat] : null,
            categorizedBy: expenseTemplate.cat ? ("RULE" as const) : null,
            source: Math.random() > 0.3 ? ("IMPORT" as const) : ("MANUAL" as const),
            importHash: Math.random() > 0.3 ? `hash_idx_${i}_m${monthOffset}_${randomDay}` : null
        });
    }

    const result = await prisma.transaction.createMany({
        data: transactionsData
    });

    console.log(`Seed successfully completed! Inserted ${result.count} transactions.`);
}

main()
    .catch((error) => {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end(); // Safely shut down connection pool
    });