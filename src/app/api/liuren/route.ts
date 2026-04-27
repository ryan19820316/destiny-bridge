import { NextRequest, NextResponse } from "next/server";
import { calculateXiaoLiuRen } from "@/lib/liuren";
import { generateLiurenQuick, generateLiurenDeep } from "@/lib/ai";
import {
  isMemberActive,
  getDailyLiurenCount,
  incrementLiurenCount,
  canQueryLiuren,
  saveLiurenQuery,
  getProfile,
} from "@/lib/profile";
import { calculateBazi, formatChartForAI } from "@/lib/bazi";
import { QuestionCategory, LiurenQuickResult, LiurenDeepResult, LiurenPalaceData } from "@/types";

function getDomainText(palace: LiurenPalaceData, category: QuestionCategory): string {
  const map: Record<QuestionCategory, keyof LiurenPalaceData["domains"]> = {
    love: "love",
    family: "family",
    health: "health",
    career: "career",
    daily: "wealth", // fallback — daily uses general wealth/career as closest
  };
  return palace.domains[map[category]] || palace.domains.love;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const category: QuestionCategory = body.category || "daily";
    const validCategories: QuestionCategory[] = ["love", "family", "health", "career", "daily"];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: "Invalid category. Must be: love, family, health, career, daily" },
        { status: 400 }
      );
    }

    const profile = getProfile();
    const memberActive = isMemberActive();

    // Calculate divination (no AI — instant)
    const divination = calculateXiaoLiuRen();
    const { palace, lunarDateStr, timeZhi, hourIndex, palaceIndex } = divination;

    // Anti-abuse: same category + same shichen can't be re-queried
    if (!canQueryLiuren(category, hourIndex)) {
      return NextResponse.json(
        {
          error: "同一时辰此事已卜过，请静候时辰更替后再问。",
          errorEn: "You've already asked about this during the current time period. Please wait for the next two-hour period.",
          nextAvailable: `Next 时辰: ${hourIndex + 1 > 12 ? 1 : hourIndex + 1}`,
        },
        { status: 429 }
      );
    }

    // Free tier: check daily limit
    if (!memberActive) {
      const dailyCount = getDailyLiurenCount();
      if (dailyCount >= 1) {
        // Return the divination result anyway, but mark it as limited
        return NextResponse.json({
          palace,
          lunarDateStr,
          timeZhi,
          category,
          limited: true,
          dailyFreeUsed: dailyCount,
          message: "今日免费次数已用完。升级会员享受无限深度推演。",
          messageEn: "Free daily limit reached. Upgrade to membership for unlimited deep readings.",
        });
      }
      incrementLiurenCount();
    }

    // Save query record for anti-abuse
    saveLiurenQuery({
      category,
      palaceIndex,
      hourIndex,
      date: new Date().toISOString().slice(0, 10),
      timestamp: new Date().toISOString(),
    });

    // Build Ba Zi context for deep readings (member only)
    let baziContext = "";
    let chartData = "";
    if (memberActive && profile.baziData) {
      try {
        const bazi = calculateBazi(profile.baziData);
        chartData = formatChartForAI(bazi, profile.baziData);
        baziContext = `Day Master: ${bazi.dayMaster.stem} (${bazi.dayMaster.element}), Strength: ${bazi.dayMaster.strength}. Favorable elements: ${bazi.favorableElements.join(", ")}. Five Elements: ${JSON.stringify(bazi.elements)}.`;
      } catch { /* ignore bazi calc errors */ }
    }

    if (memberActive) {
      // Deep interpretation with AI
      const deep = await generateLiurenDeep(
        palace,
        category,
        baziContext,
        profile.nickname ? `User: ${profile.nickname}, Tone: ${profile.preferredTone}` : ""
      );

      const result: LiurenDeepResult = {
        palace,
        lunarDateStr,
        timeZhi,
        category,
        deepInterpretation: deep.deepInterpretation,
        elementAnalysis: deep.elementAnalysis,
        domainAnalysis: deep.domainAnalysis,
        actionAdvice: deep.actionAdvice,
        timestamp: new Date().toISOString(),
      };

      return NextResponse.json({
        ...result,
        level: "deep",
        memberActive: true,
      });
    }

    // Quick interpretation for free tier
    try {
      const quick = await generateLiurenQuick(palace, category);
      const result: LiurenQuickResult = {
        palace,
        lunarDateStr,
        timeZhi,
        category,
        interpretation: quick.interpretation,
        timestamp: new Date().toISOString(),
      };

      return NextResponse.json({
        ...result,
        level: "quick",
        memberActive: false,
      });
    } catch {
      // If AI fails, return the palace data with traditional interpretation as fallback
      const result: LiurenQuickResult = {
        palace,
        lunarDateStr,
        timeZhi,
        category,
        interpretation: `${palace.name} (${palace.nameEn}) — ${palace.auspiciousness}. ${getDomainText(palace, category)}`,
        timestamp: new Date().toISOString(),
      };

      return NextResponse.json({
        ...result,
        level: "quick",
        memberActive: false,
        aiFallback: true,
      });
    }
  } catch (e) {
    console.error("Liuren API error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
