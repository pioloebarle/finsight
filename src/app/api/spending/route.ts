import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSpendingByCategory } from "@/lib/queries/spending";

// YYYY-MM format
const querySchema = z.object({
  month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: "Invalid month format. Expected YYYY-MM (e.g., 2026-10)."
  })
});

export async function GET(request: NextRequest) {
  try {
    
    const { searchParams } = new URL(request.url);
    const rawMonth = searchParams.get("month");

    
    const validation = querySchema.safeParse({ month: rawMonth ?? "" });

    // Return a 400 Bad Request on validation failure
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const validatedMonthString = validation.data.month;

    
    const userId = process.env.DEV_USER_ID;
    if (!userId) {
      console.error("Configuration Error: DEV_USER_ID is not defined in the environment variables.");
      return NextResponse.json(
        { error: "Server configuration missing target user context." },
        { status: 500 }
      );
    }

    
    const dateParam = new Date(`${validatedMonthString}-01`);

    
    const spendingData = await getSpendingByCategory(userId, dateParam);

    
    return NextResponse.json(spendingData);

  } catch (error) {
    
    console.error("Server Runtime Error inside GET /api/spending:", error);
    
    return NextResponse.json(
      { error: "An internal server error occurred while retrieving spending analytics data." },
      { status: 500 }
    );
  }
}
