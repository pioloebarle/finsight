import { NextRequest, NextResponse } from "next/server";
import { getSpendingByCategory } from "@/lib/queries/spending";
import { parseMonth, monthToDate, MONTH_ERROR_MESSAGE } from "@/lib/validation/month";

export async function GET(request: NextRequest) {
  try {
    
    const { searchParams } = new URL(request.url);
    const rawMonth = searchParams.get("month");

    const parsed = parseMonth(rawMonth);
    if(!parsed){
      return NextResponse.json(
        { error: MONTH_ERROR_MESSAGE },
        { status: 400 }
      )
    }
    
    const userId = process.env.DEV_USER_ID;
    if (!userId) {
      console.error("Configuration Error: DEV_USER_ID is not defined in the environment variables.");
      return NextResponse.json(
        { error: "Server configuration missing target user context." },
        { status: 500 }
      );
    }

    const dateParam = monthToDate(parsed);

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
