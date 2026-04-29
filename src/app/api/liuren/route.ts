import { NextRequest, NextResponse } from "next/server";
import { callDoubao, parseJsonFromLLM, getDoubaoKey } from "@/lib/doubao";
import { buildLiurenUserMessage, getLiurenSystemPrompt } from "@/lib/liuren-prompt";
import { saveLiurenQuery } from "@/lib/profile";
import { QuestionCategory } from "@/types";

function hourToShichenIndex(hhMM: string): number {
  const h = parseInt(hhMM.split(":")[0], 10);
  if (h >= 23 || h < 1) return 1;   // 子
  if (h >= 1 && h < 3) return 2;    // 丑
  if (h >= 3 && h < 5) return 3;    // 寅
  if (h >= 5 && h < 7) return 4;    // 卯
  if (h >= 7 && h < 9) return 5;    // 辰
  if (h >= 9 && h < 11) return 6;   // 巳
  if (h >= 11 && h < 13) return 7;  // 午
  if (h >= 13 && h < 15) return 8;  // 未
  if (h >= 15 && h < 17) return 9;  // 申
  if (h >= 17 && h < 19) return 10; // 酉
  if (h >= 19 && h < 21) return 11; // 戌
  return 12;                         // 亥 (21-23)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      question,
      solarDate,
      timeHHMM,
      gender,
      category,
    } = body;

    const validCategories: QuestionCategory[] = ["love", "family", "health", "career", "daily"];
    const cat: QuestionCategory = validCategories.includes(category) ? category : "daily";

    if (!question || !solarDate || !timeHHMM) {
      return NextResponse.json(
        { error: "缺少必填参数：question, solarDate, timeHHMM", errorEn: "Missing required fields: question, solarDate, timeHHMM" },
        { status: 400 }
      );
    }

    if (!getDoubaoKey()) {
      return NextResponse.json(
        { error: "AI 服务未配置", errorEn: "AI service is not configured" },
        { status: 503 }
      );
    }

    const hourIndex = hourToShichenIndex(timeHHMM);

    // Anti-abuse: same category + same shichen can't be re-queried
    const { canQueryLiuren } = await import("@/lib/profile");
    if (!canQueryLiuren(cat, hourIndex)) {
      return NextResponse.json(
        {
          error: "同一时辰此事已卜过，请静候时辰更替后再问。",
          errorEn: "You've already asked about this during the current time period. Please wait for the next two-hour period.",
          nextAvailable: `Next shichen: ${hourIndex + 1 > 12 ? 1 : hourIndex + 1}`,
        },
        { status: 429 }
      );
    }

    // Save query record
    saveLiurenQuery({
      category: cat,
      palaceIndex: 0,
      hourIndex,
      date: new Date().toISOString().slice(0, 10),
      timestamp: new Date().toISOString(),
    });

    // Everyone gets the full deep reading — no membership gate
    const systemPrompt = getLiurenSystemPrompt(true);
    const userMessage = buildLiurenUserMessage({
      question,
      solarDate,
      timeHHMM,
      gender: gender || undefined,
      category: cat,
    });

    const content = await callDoubao(systemPrompt, userMessage, {
      temperature: 0.8,
      max_tokens: 2000,
    });

    const jsonStr = parseJsonFromLLM(content);
    let result;
    try {
      result = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json({
        error: "豆包返回解析失败，请稍后再试",
        errorEn: "Failed to parse AI response. Please try again.",
        rawContent: jsonStr.slice(0, 500),
      }, { status: 500 });
    }

    return NextResponse.json({
      palaceName: result.palaceName || "",
      palaceNameEn: result.palaceNameEn || "",
      auspiciousness: result.auspiciousness || "",
      element: result.element || "",
      elementEn: result.elementEn || "",
      symbol: result.symbol || "",
      symbolEn: result.symbolEn || "",
      direction: result.direction || "",
      directionEn: result.directionEn || "",
      lunarDate: result.lunarDate || "",
      solarDate: result.solarDate || solarDate,
      timeZhi: result.timeZhi || "",
      calculation: result.calculation || "",
      palaceCharacteristic: result.palaceCharacteristic || "",
      palaceCharacteristicEn: result.palaceCharacteristicEn || "",
      section1_overall: result.section1_overall || "",
      section1_overallEn: result.section1_overallEn || "",
      section2_process: result.section2_process || "",
      section2_processEn: result.section2_processEn || "",
      section3_outcome: result.section3_outcome || "",
      section3_outcomeEn: result.section3_outcomeEn || "",
      section4_advice: result.section4_advice || "",
      section4_adviceEn: result.section4_adviceEn || "",
      oneLineSummary: result.oneLineSummary || "",
      oneLineSummaryEn: result.oneLineSummaryEn || "",
      interpretation: result.interpretation || "",
      interpretationEn: result.interpretationEn || "",
      encouragement: result.encouragement || "",
      encouragementEn: result.encouragementEn || "",
      category: cat,
      level: "deep",
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    console.error("Liuren API error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal server error" },
      { status: 500 }
    );
  }
}
