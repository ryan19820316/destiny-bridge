import { NextRequest, NextResponse } from "next/server";
import { callDoubao, safeJsonParse, getDoubaoKey } from "@/lib/doubao";
import { calculateXiaoLiuRen, PALACE_DATA } from "@/lib/liuren";
import { saveLiurenQuery, canQueryLiuren } from "@/lib/profile";
import { logUsage } from "@/lib/analytics";
import type { QuestionCategory } from "@/types";

// Lightweight prompt — AI only interprets, no math
const INTERPRET_SYSTEM_PROMPT = `You are Clara, a warm Eastern wellness consultant. A user asks a question and receives a 小六壬 (Xiao Liu Ren) divination result. Your job is to interpret the given result in the context of their question.

- Be warm, practical, and encouraging. No fear-mongering, no fatalism.
- Connect the palace's Five Element and symbolism to actionable daily advice.
- Even with ominous results, frame the answer with what the user CAN do.
- Output BOTH Chinese and English for every text field.

Return ONLY valid JSON:
{
  "palaceCharacteristic": "一句话概括此掌诀的核心特征（中文）",
  "palaceCharacteristicEn": "Core characteristic in English",
  "section1_overall": "整体评估，结合用户的问题给出明确判断（2-3句中文）",
  "section1_overallEn": "Overall assessment in English",
  "section2_process": "过程特点，具体会遇到的状况（3-4条 bullet，中文）",
  "section2_processEn": "Process characteristics in English",
  "section3_outcome": "结果判断（中文）",
  "section3_outcomeEn": "Outcome in English",
  "section4_advice": "具体建议（3-4条中文）",
  "section4_adviceEn": "Actionable advice in English",
  "oneLineSummary": "一句话总结（中文）",
  "oneLineSummaryEn": "One-line summary in English"
}`;

function getHourIndex(hhMM: string): number {
  const h = parseInt(hhMM.split(":")[0], 10);
  if (h >= 23 || h < 1) return 1;
  if (h >= 1 && h < 3) return 2;
  if (h >= 3 && h < 5) return 3;
  if (h >= 5 && h < 7) return 4;
  if (h >= 7 && h < 9) return 5;
  if (h >= 9 && h < 11) return 6;
  if (h >= 11 && h < 13) return 7;
  if (h >= 13 && h < 15) return 8;
  if (h >= 15 && h < 17) return 9;
  if (h >= 17 && h < 19) return 10;
  if (h >= 19 && h < 21) return 11;
  return 12;
}

const CATEGORY_LABELS: Record<QuestionCategory, string> = {
  love: "感情/爱情",
  family: "家庭/孩子",
  health: "健康/身体",
  career: "事业/工作",
  daily: "日常/综合运势",
  wealth: "财运/钱财",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, solarDate, timeHHMM, gender, category } = body;

    const validCategories: QuestionCategory[] = ["love", "family", "health", "career", "daily"];
    const cat: QuestionCategory = validCategories.includes(category) ? category : "daily";

    logUsage({
      endpoint: "liuren",
      category: cat,
      lang: question ? undefined : "en",
      timestamp: new Date().toISOString(),
      ip: req.headers.get("x-forwarded-for") || "",
    });

    if (!question || !solarDate || !timeHHMM) {
      return NextResponse.json(
        { error: "缺少必填参数：question, solarDate, timeHHMM", errorEn: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!getDoubaoKey()) {
      return NextResponse.json(
        { error: "AI 服务未配置", errorEn: "AI service is not configured" },
        { status: 503 }
      );
    }

    const hourIndex = getHourIndex(timeHHMM);

    // Anti-abuse check
    if (!canQueryLiuren(cat, hourIndex)) {
      return NextResponse.json(
        {
          error: "同一时辰此事已卜过，请静候时辰更替后再问。",
          errorEn: "You've already asked about this during the current time period.",
          nextAvailable: `Next shichen: ${hourIndex + 1 > 12 ? 1 : hourIndex + 1}`,
        },
        { status: 429 }
      );
    }

    // === SERVER-SIDE XIAO LIU REN CALCULATION ===
    const [y, m, d] = solarDate.split("-").map(Number);
    const [hh, mm] = timeHHMM.split(":").map(Number);
    const calcDate = new Date(y, m - 1, d, hh, mm);
    const divination = calculateXiaoLiuRen(calcDate);
    const palace = divination.palace;

    const calculationStr = `农历${divination.lunarMonth}月 + ${divination.lunarDay}日 + ${divination.timeZhi}时(${divination.hourIndex}) => (${divination.lunarMonth}-1)+(${divination.lunarDay}-1)+(${divination.hourIndex}-1) = ${(divination.lunarMonth-1)+(divination.lunarDay-1)+(divination.hourIndex-1)}, %6 = ${((divination.lunarMonth-1)+(divination.lunarDay-1)+(divination.hourIndex-1))%6}, +1 = ${divination.palaceIndex} → ${palace.name}`;

    // Save query record
    saveLiurenQuery({
      category: cat,
      palaceIndex: divination.palaceIndex,
      hourIndex,
      date: new Date().toISOString().slice(0, 10),
      timestamp: new Date().toISOString(),
    });

    // === AI INTERPRETATION ===
    const precomputedInfo = [
      `小六壬推算结果（已确定，请勿重新计算）：`,
      `- 掌诀：${palace.name}（第${divination.palaceIndex}宫）`,
      `- 吉凶：${palace.auspiciousness}`,
      `- 五行：${palace.element}`,
      `- 神兽：${palace.symbol}`,
      `- 方向：${palace.direction}`,
      `- 颜色：${palace.color}`,
      `- 核心特征：${palace.classicVerse}`,
      `- 此宫在"${CATEGORY_LABELS[cat]}"领域的参考：${palace.domains[cat as keyof typeof palace.domains] || palace.classicVerse}`,
      ``,
      `用户问题：${question}`,
      `公历日期：${solarDate}`,
      `时间：${timeHHMM}`,
      gender ? `性别：${gender}` : "",
      `问事方向：${CATEGORY_LABELS[cat]}`,
      ``,
      `请基于以上已确定的掌诀结果，结合用户问题和类别领域，给出温暖、实用的中英双语解读。`,
    ].filter(Boolean).join("\n");

    const content = await callDoubao(INTERPRET_SYSTEM_PROMPT, precomputedInfo, {
      temperature: 0.8,
      max_tokens: 1000,
    });

    const aiResult = safeJsonParse<Record<string, string>>(content);
    if (!aiResult) {
      return NextResponse.json({
        error: "AI 返回解析失败，请稍后再试",
        errorEn: "Failed to parse AI response. Please try again.",
        rawContent: content.slice(0, 500),
      }, { status: 500 });
    }

    return NextResponse.json({
      palaceName: palace.name,
      palaceNameEn: palace.nameEn,
      auspiciousness: palace.auspiciousness,
      element: palace.element,
      elementEn: palace.element,
      symbol: palace.symbol,
      symbolEn: palace.symbol,
      direction: palace.direction,
      directionEn: palace.directionEn,
      lunarDate: divination.lunarDateStr,
      solarDate,
      timeZhi: divination.timeZhi,
      calculation: calculationStr,
      palaceCharacteristic: aiResult.palaceCharacteristic || "",
      palaceCharacteristicEn: aiResult.palaceCharacteristicEn || "",
      section1_overall: aiResult.section1_overall || "",
      section1_overallEn: aiResult.section1_overallEn || "",
      section2_process: aiResult.section2_process || "",
      section2_processEn: aiResult.section2_processEn || "",
      section3_outcome: aiResult.section3_outcome || "",
      section3_outcomeEn: aiResult.section3_outcomeEn || "",
      section4_advice: aiResult.section4_advice || "",
      section4_adviceEn: aiResult.section4_adviceEn || "",
      oneLineSummary: aiResult.oneLineSummary || "",
      oneLineSummaryEn: aiResult.oneLineSummaryEn || "",
      interpretation: "",
      interpretationEn: "",
      encouragement: "",
      encouragementEn: "",
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
