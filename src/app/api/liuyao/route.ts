import { NextRequest, NextResponse } from "next/server";
import { callDoubao, safeJsonParse, getDoubaoKey } from "@/lib/doubao";
import type { QuestionCategory } from "@/types";
import type { CoinTossLine } from "@/lib/liuyao/types";
import { buildDivination, getFullMonthBranch, getFullDayBranch } from "@/lib/liuyao/engine";

// Lightweight prompt — AI only interprets, no calculation
const INTERPRET_SYSTEM = `You are Clara, a warm, practical Eastern wellness consultant. A user has received a 六爻 (Liu Yao) divination. The hexagram is already assembled server-side. Your job is to interpret it.

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

## Bilingual Output (CRITICAL)
Every text field MUST have both Chinese and English. Natural language in both, not machine translation.

Return ONLY valid JSON:
{
  "hexagramName": "本卦中文名",
  "hexagramNameEn": "Original hexagram English name",
  "changedHexagramName": "变卦中文名（静卦则为空）",
  "changedHexagramNameEn": "Changed hexagram English name (empty if static)",
  "palace": "卦宫名",
  "palaceEn": "Palace in English",
  "palaceElement": "金/木/水/火/土",
  "palaceElementEn": "Metal/Wood/Water/Fire/Earth",
  "isJingGua": true/false,
  "movingLineCount": 0-6,
  "monthBranch": "月建干支，如：壬辰（土）",
  "monthBranchEn": "Month branch e.g. Renchen (Earth)",
  "dayBranch": "日辰干支，如：癸酉（金）",
  "dayBranchEn": "Day branch e.g. Guiyou (Metal)",
  "lines": [
    {
      "position": 1,
      "isYang": true,
      "isMoving": false,
      "branch": "子",
      "branchElement": "水",
      "branchElementEn": "Water",
      "liuqin": "妻财",
      "liuqinEn": "Wealth",
      "liushen": "青龙",
      "liushenEn": "Azure Dragon",
      "isShi": true,
      "isYing": false
    }
  ],
  "yongShen": "用神六亲名",
  "yongShenEn": "Focus spirit in English",
  "yongShenStrength": "用神旺衰描述",
  "yongShenStrengthEn": "Strength assessment in English",
  "section1_shexagramSetup": "起卦排盘段落（中文）",
  "section1_shexagramSetupEn": "Hexagram setup in English",
  "section2_yongShenAnalysis": "用神与旺衰分析（中文）",
  "section2_yongShenAnalysisEn": "Focus spirit analysis in English",
  "section3_hexagramProcess": "卦象与过程（中文）",
  "section3_hexagramProcessEn": "Hexagram process in English",
  "fortuneVerdict": "吉凶判断",
  "fortuneVerdictEn": "Fortune verdict in English",
  "section4_conclusion": "吉凶结论（中文）",
  "section4_conclusionEn": "Fortune conclusion in English",
  "section5_timing": "应期（中文）",
  "section5_timingEn": "Timing in English",
  "section6_risks": "风险提醒（中文）",
  "section6_risksEn": "Risk warnings in English",
  "oneLineSummary": "一句话总结（中文）",
  "oneLineSummaryEn": "One-line summary in English"
}`;

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
    } = body;

    const validCategories: QuestionCategory[] = ["love", "career", "wealth", "health", "daily"];
    const cat: QuestionCategory = validCategories.includes(category) ? category : "daily";

    if (!question || !solarDate || !gender) {
      return NextResponse.json(
        { error: "缺少必填参数：question, solarDate, gender",
          errorEn: "Missing required fields: question, solarDate, gender" },
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

    // Build pre-computed info string
    const assembledLinesStr = divination.assembledLines
      .map((l) =>
        `第${l.position}爻：${l.branch}(${l.branchElement}) — ${l.liuqin} — ${l.liushen}` +
        (l.isShi ? " (世爻)" : "") + (l.isYing ? " (应爻)" : "") +
        (l.isMoving ? " [动爻]" : "")
      )
      .join("\n");

    const hasBirth = birthYear > 0 && birthMonth > 0 && birthDay > 0;
    const birthLine = hasBirth
      ? `出生日期：公历 ${birthYear}年${birthMonth}月${birthDay}日`
      : "";

    const fullMonthBranch = getFullMonthBranch(divDate);
    const fullDayBranch = getFullDayBranch(divDate);

    const precomputedInfo = [
      `六爻排盘（已由服务端完成，请勿重新计算）：`,
      ``,
      `=== 基本卦盘 ===`,
      `本卦：${orig.name}（${orig.palace}，属${orig.palaceElement}）`,
      `变卦：${changed.name === orig.name ? "无（静卦）" : changed.name + "（" + changed.palace + "，属" + changed.palaceElement + "）"}`,
      `静卦/动卦：${divination.isJingGua ? "静卦（无动爻）" : "动卦（" + divination.assembledLines.filter(l => l.isMoving).length + "个动爻）"}`,
      ``,
      `=== 月建日辰 ===`,
      `月建：${fullMonthBranch}`,
      `日辰：${fullDayBranch}`,
      ``,
      `=== 装卦（纳甲 + 六亲 + 六神 + 世应）===`,
      assembledLinesStr,
      ``,
      `=== 占问信息 ===`,
      `用神：${yongShen}（${CATEGORY_LABELS[cat]} → ${yongShen}）`,
      `世爻：第${orig.shiPosition}爻`,
      `应爻：第${((orig.shiPosition + 2) % 6) + 1}爻`,
      ``,
      `用户问题：${question}`,
      `公历日期：${solarDate}`,
      `性别：${gender}`,
      `问事类别：${CATEGORY_LABELS[cat]}`,
      birthLine,
      ``,
      `请基于以上已确定的卦盘数据，结合用户问题和类别领域，给出温暖、实用的中英双语解读。`,
    ].filter(Boolean).join("\n");

    const content = await callDoubao(INTERPRET_SYSTEM, precomputedInfo, {
      temperature: 0.7,
      max_tokens: 2000,
    });

    const result = safeJsonParse<Record<string, unknown>>(content);
    if (!result) {
      return NextResponse.json({
        error: "AI 返回解析失败，请稍后再试",
        errorEn: "Failed to parse AI response. Please try again.",
        rawContent: content.slice(0, 500),
      }, { status: 500 });
    }

    // Merge AI interpretation with server-computed hexagram data
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
