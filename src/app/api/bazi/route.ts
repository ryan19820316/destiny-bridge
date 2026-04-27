import { calculateBazi, formatChartForAI } from "@/lib/bazi";
import { generateWellnessReport, generateAIReport } from "@/lib/ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { year, month, day, hour, gender } = body;

    if (!year || !month || !day || hour === undefined || !gender) {
      return NextResponse.json(
        { error: "Missing required fields: year, month, day, hour, gender" },
        { status: 400 }
      );
    }

    const numYear = Number(year), numMonth = Number(month), numDay = Number(day), numHour = Number(hour);
    if (isNaN(numYear) || isNaN(numMonth) || isNaN(numDay) || isNaN(numHour)) {
      return NextResponse.json({ error: "All date fields must be numbers" }, { status: 400 });
    }
    if (numYear < 1900 || numYear > 2100) {
      return NextResponse.json({ error: "Year must be between 1900 and 2100" }, { status: 400 });
    }
    if (numMonth < 1 || numMonth > 12 || numDay < 1 || numDay > 31) {
      return NextResponse.json({ error: "Invalid month or day" }, { status: 400 });
    }
    if (numHour < 0 || numHour > 23) {
      return NextResponse.json({ error: "Hour must be between 0 and 23" }, { status: 400 });
    }
    if (!["male", "female"].includes(gender)) {
      return NextResponse.json({ error: "Gender must be 'male' or 'female'" }, { status: 400 });
    }

    const birthData = { year: numYear, month: numMonth, day: numDay, hour: numHour, gender };
    const baziResult = calculateBazi(birthData);

    let wellnessReport = null;
    let aiReport = null;
    let aiError = null;

    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const chartText = formatChartForAI(baziResult, birthData);
        // New wellness-focused report
        wellnessReport = await generateWellnessReport(chartText, birthData);
        // Also generate legacy report for backward compatibility
        aiReport = await generateAIReport(chartText, birthData);
      } catch (e) {
        aiError = e instanceof Error ? e.message : "AI interpretation failed";
        console.error("AI generation failed:", aiError);
      }
    }

    return NextResponse.json({
      ...baziResult,
      aiReport,
      wellnessReport,
      aiError,
    });
  } catch (e) {
    console.error("Bazi API error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
