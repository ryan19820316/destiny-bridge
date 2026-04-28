import { calculateBazi, formatChartForAI } from "@/lib/bazi";
import { generateDailyGuidance } from "@/lib/ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { year, month, day, hour, gender, date } = body;

    if (!year || !month || !day || hour === undefined || !gender) {
      return NextResponse.json(
        { error: "Missing birth data" },
        { status: 400 }
      );
    }

    const birthData = {
      year: Number(year),
      month: Number(month),
      day: Number(day),
      hour: Number(hour),
      gender,
    };

    const baziResult = calculateBazi(birthData);
    const chartText = formatChartForAI(baziResult, birthData);

    const targetDate = date || new Date().toISOString().split("T")[0];

    let dailyGuidance = null;
    let error = null;

    if (process.env.DOUBAO_API_KEY || process.env.ANTHROPIC_API_KEY) {
      try {
        dailyGuidance = await generateDailyGuidance(chartText, targetDate);
      } catch (e) {
        error = e instanceof Error ? e.message : "Daily guidance generation failed";
        console.error("Daily API error:", error);
      }
    }

    return NextResponse.json({
      date: targetDate,
      baziSummary: {
        dayMaster: baziResult.dayMaster,
        elements: baziResult.elements,
        favorableElements: baziResult.favorableElements,
      },
      dailyGuidance,
      error,
    });
  } catch (e) {
    console.error("Daily API error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
