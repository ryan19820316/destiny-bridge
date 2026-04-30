import { NextRequest, NextResponse } from "next/server";
import { callDoubao, safeJsonParse, getDoubaoKey } from "@/lib/doubao";
import type { QuestionCategory } from "@/types";
import type { CoinTossLine } from "@/lib/liuyao/types";
import { buildDivination, getFullMonthBranch, getFullDayBranch } from "@/lib/liuyao/engine";

function buildSystemPrompt(lang: "zh" | "en"): string {
  const langInstruction = lang === "en"
    ? `CRITICAL: Output ALL text fields in ENGLISH only. Leave Chinese-only fields (fields WITHOUT 'En' suffix) as empty strings "". The user only reads English.`
    : `CRITICAL: Output ALL text fields in CHINESE only. Leave English fields (fields WITH 'En' suffix) as empty strings "". The user only reads Chinese.`;

  return `You are Clara, a warm, practical Eastern wellness consultant. A user has received a 六爻 (Liu Yao) divination. The hexagram is already assembled server-side. Your job is to interpret it.

## Identity
- Wise, caring neighbor — not a mystical fortune-teller
- Users are busy homemakers managing households
- Translate ancient hexagram wisdom into modern daily advice
- Even with ominous signs, frame the answer with what the user CAN do

## Interpretation Style
- Lead with the hexagram's core message in one warm sentence
- Explain what moving lines mean for the user's specific question
- Give 2-3 concrete suggestions
- End gently — never leave the user feeling doomed

${langInstruction}

Return ONLY valid JSON:
{
  "hexagramName": "本卦名",
  "hexagramNameEn": "English hexagram name",
  "changedHexagramName": "变卦名（静卦为空）",
  "changedHexagramNameEn": "Changed hexagram English name",
  "palace": "卦宫名",
  "palaceEn": "Palace in English",
  "palaceElement": "五行",
  "palaceElementEn": "Element in English",
  "isJingGua": true/false,
  "movingLineCount": 0-6,
  "monthBranch": "月建干支",
  "monthBranchEn": "Month branch in English",
  "dayBranch": "日辰干支",
  "dayBranchEn": "Day branch in English",
  "yongShen": "用神",
  "yongShenEn": "Focus spirit in English",
  "yongShenStrength": "用神旺衰",
  "yongShenStrengthEn": "Strength in English",
  "fortuneVerdict": "吉凶判断",
  "fortuneVerdictEn": "Fortune verdict in English",
  "section1_shexagramSetup": "起卦排盘",
  "section1_shexagramSetupEn": "Setup in English",
  "section2_yongShenAnalysis": "用神分析",
  "section2_yongShenAnalysisEn": "Analysis in English",
  "section3_hexagramProcess": "卦象过程",
  "section3_hexagramProcessEn": "Process in English",
  "section4_conclusion": "吉凶结论",
  "section4_conclusionEn": "Conclusion in English",
  "section5_timing": "应期",
  "section5_timingEn": "Timing in English",
  "section6_risks": "风险提醒",
  "section6_risksEn": "Risks in English",
  "oneLineSummary": "一句话总结",
  "oneLineSummaryEn": "One-line summary in English"
}`;
}

const CATEGORY_LABELS: Record<QuestionCategory, string> = {
  love: "感情/姻缘",
  family: "家庭/子女",
  health: "健康/身体",
  career: "事业/工作",
  daily: "日常/综合运势",
  wealth: "财运/钱财",
};

const YONGSHEN_MAP: Record<string, string> = {
  love: "官鬼",
  career: "官鬼",
  wealth: "妻财",
  health: "子孙",
  daily: "世爻",
};

const LIUQIN_EN: Record<string, string> = {
  "父母": "Parents", "官鬼": "Officer", "妻财": "Wealth",
  "子孙": "Children", "兄弟": "Siblings",
};

const LIUSHEN_EN: Record<string, string> = {
  "青龙": "Azure Dragon", "朱雀": "Vermilion Bird", "勾陈": "Stagnation",
  "腾蛇": "Flying Serpent", "白虎": "White Tiger", "玄武": "Black Tortoise",
};

const ELEMENT_EN: Record<string, string> = {
  "金": "Metal", "水": "Water", "土": "Earth", "火": "Fire", "木": "Wood",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      question,
      lines,
      solarDate,
      gender,
      category,
      birthYear,
      birthMonth,
      birthDay,
      lang,
    } = body;

    const outputLang: "zh" | "en" = lang === "en" ? "en" : "zh";

    const validCategories: QuestionCategory[] = ["love", "career", "wealth", "health", "daily"];
    const cat: QuestionCategory = validCategories.includes(category) ? category : "daily";

    if (!question || !solarDate || !gender) {
      return NextResponse.json(
        { error: "缺少必填参数", errorEn: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!lines || !Array.isArray(lines) || lines.length !== 6) {
      return NextResponse.json(
        { error: "需要6次摇卦结果", errorEn: "6 coin toss results are required" },
        { status: 400 }
      );
    }

    if (!getDoubaoKey()) {
      return NextResponse.json(
        { error: "AI 服务未配置", errorEn: "AI service is not configured" },
        { status: 503 }
      );
    }

    // === SERVER-SIDE HEXAGRAM CONSTRUCTION ===
    const [y, m, d] = solarDate.split("-").map(Number);
    const divDate = new Date(y, m - 1, d);

    const coinLines: CoinTossLine[] = lines.map((l: Record<string, unknown>) => ({
      position: l.position as number,
      type: l.type as CoinTossLine["type"],
      isYang: l.isYang as boolean,
      isMoving: l.isMoving as boolean,
    }));

    const divination = buildDivination(coinLines, divDate);
    const orig = divination.originalHexagram;
    const changed = divination.changedHexagram;
    const yongShen = YONGSHEN_MAP[cat] || "世爻";

    const assembledLinesStr = divination.assembledLines
      .map((l) =>
        `Line ${l.position}: ${l.branch}(${l.branchElement}) - ${l.liuqin} - ${l.liushen}` +
        (l.isShi ? " (Self)" : "") + (l.isYing ? " (Response)" : "") +
        (l.isMoving ? " [Moving]" : "")
      )
      .join("\n");

    const hasBirth = birthYear > 0 && birthMonth > 0 && birthDay > 0;
    const birthLine = hasBirth
      ? `Birth date: ${birthYear}-${birthMonth}-${birthDay}`
      : "";

    const fullMonthBranch = getFullMonthBranch(divDate);
    const fullDayBranch = getFullDayBranch(divDate);

    const langLine = outputLang === "en"
      ? "Output ALL content in ENGLISH ONLY. Leave Chinese fields (without 'En' suffix) empty."
      : "Output ALL content in CHINESE ONLY. Leave English fields (with 'En' suffix) empty.";

    const precomputedInfo = [
      `Hexagram data (pre-computed server-side, DO NOT recalculate):`,
      ``,
      `=== Hexagram ===`,
      `Original: ${orig.name} (${orig.palace}, ${orig.palaceElement})`,
      `Changed: ${changed.name === orig.name ? "None (static)" : changed.name + " (" + changed.palace + ", " + changed.palaceElement + ")"}`,
      `Moving lines: ${divination.assembledLines.filter(l => l.isMoving).length}`,
      ``,
      `=== Calendar ===`,
      `Month branch: ${fullMonthBranch}`,
      `Day branch: ${fullDayBranch}`,
      ``,
      `=== Assembled Lines (Najia + Liuqin + Liushen + Shi/Ying) ===`,
      assembledLinesStr,
      ``,
      `=== Query ===`,
      `Focus spirit: ${yongShen} (category: ${cat})`,
      `Self line: position ${orig.shiPosition}`,
      `Response line: position ${((orig.shiPosition + 2) % 6) + 1}`,
      ``,
      `User question: ${question}`,
      `Date: ${solarDate}`,
      `Gender: ${gender}`,
      birthLine,
      ``,
      langLine,
    ].filter(Boolean).join("\n");

    const content = await callDoubao(buildSystemPrompt(outputLang), precomputedInfo, {
      temperature: 0.7,
      max_tokens: 1200,
    });

    const result = safeJsonParse<Record<string, unknown>>(content);
    if (!result) {
      return NextResponse.json({
        error: "AI 返回解析失败", errorEn: "Failed to parse AI response.",
        rawContent: content.slice(0, 500),
      }, { status: 500 });
    }

    return NextResponse.json({
      hexagramName: result.hexagramName || orig.name,
      hexagramNameEn: result.hexagramNameEn || "",
      changedHexagramName: result.changedHexagramName || (changed.name !== orig.name ? changed.name : ""),
      changedHexagramNameEn: result.changedHexagramNameEn || "",
      palace: result.palace || orig.palace,
      palaceEn: result.palaceEn || "",
      palaceElement: result.palaceElement || orig.palaceElement,
      palaceElementEn: result.palaceElementEn || "",
      isJingGua: result.isJingGua ?? divination.isJingGua,
      movingLineCount: result.movingLineCount ?? divination.assembledLines.filter(l => l.isMoving).length,
      monthBranch: result.monthBranch || fullMonthBranch,
      monthBranchEn: result.monthBranchEn || "",
      dayBranch: result.dayBranch || fullDayBranch,
      dayBranchEn: result.dayBranchEn || "",
      lines: (result.lines as Array<Record<string, unknown>>) || divination.assembledLines.map(l => ({
        position: l.position,
        isYang: l.isYang,
        isMoving: l.isMoving,
        branch: l.branch,
        branchElement: l.branchElement,
        branchElementEn: ELEMENT_EN[l.branchElement] || l.branchElement,
        liuqin: l.liuqin,
        liuqinEn: LIUQIN_EN[l.liuqin] || l.liuqin,
        liushen: l.liushen,
        liushenEn: LIUSHEN_EN[l.liushen] || l.liushen,
        isShi: l.isShi,
        isYing: l.isYing,
      })),
      yongShen: result.yongShen || yongShen,
      yongShenEn: result.yongShenEn || "",
      yongShenStrength: result.yongShenStrength || "",
      yongShenStrengthEn: result.yongShenStrengthEn || "",
      section1_shexagramSetup: result.section1_shexagramSetup || "",
      section1_shexagramSetupEn: result.section1_shexagramSetupEn || "",
      section2_yongShenAnalysis: result.section2_yongShenAnalysis || "",
      section2_yongShenAnalysisEn: result.section2_yongShenAnalysisEn || "",
      section3_hexagramProcess: result.section3_hexagramProcess || "",
      section3_hexagramProcessEn: result.section3_hexagramProcessEn || "",
      fortuneVerdict: result.fortuneVerdict || "",
      fortuneVerdictEn: result.fortuneVerdictEn || "",
      section4_conclusion: result.section4_conclusion || "",
      section4_conclusionEn: result.section4_conclusionEn || "",
      section5_timing: result.section5_timing || "",
      section5_timingEn: result.section5_timingEn || "",
      section6_risks: result.section6_risks || "",
      section6_risksEn: result.section6_risksEn || "",
      oneLineSummary: result.oneLineSummary || "",
      oneLineSummaryEn: result.oneLineSummaryEn || "",
      level: "deep",
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    console.error("Liu Yao API error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal server error" },
      { status: 500 }
    );
  }
}
