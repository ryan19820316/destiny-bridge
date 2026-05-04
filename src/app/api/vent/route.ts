import { calculateBazi, formatChartForAI } from "@/lib/bazi";
import { generateVentResponse } from "@/lib/ai";
import { buildProfileSummary } from "@/lib/profile";
import { logUsage } from "@/lib/analytics";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, profile } = body;

    logUsage({
      endpoint: "vent",
      timestamp: new Date().toISOString(),
      ip: req.headers.get("x-forwarded-for") || "",
    });

    if (!message || !profile) {
      return NextResponse.json(
        { error: "Missing required fields: message, profile" },
        { status: 400 }
      );
    }

    if (!process.env.DOUBAO_API_KEY && !process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "AI service is not configured" },
        { status: 503 }
      );
    }

    // Build profile context for AI personalization
    const profileSummary = buildProfileSummary(profile);

    // Get last 5 messages for conversation context
    const history = profile.conversationHistory || [];
    const recentHistory = history.slice(-5);
    const conversationHistory = recentHistory
      .map((m: { role: string; content: string }) => `${m.role}: ${m.content}`)
      .join("\n");

    // If user has Bazi data, enrich the profile summary with their chart
    let baziContext = "";
    if (profile.baziData) {
      try {
        const baziResult = calculateBazi(profile.baziData);
        baziContext = formatChartForAI(baziResult, profile.baziData);
      } catch {
        // Bazi calculation failed — continue without it
      }
    }

    const fullContext = [profileSummary, baziContext].filter(Boolean).join("\n\n");

    const result = await generateVentResponse(message, fullContext, conversationHistory);

    return NextResponse.json(result);
  } catch (e) {
    console.error("Vent API error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal server error" },
      { status: 500 }
    );
  }
}
