import { NextRequest, NextResponse } from "next/server";
import { callDoubao, safeJsonParse, getDoubaoKey } from "@/lib/doubao";
import { logUsage } from "@/lib/analytics";
import type { CalcType } from "@/types";
import type { CoinTossLine } from "@/lib/liuyao/types";
import { timeBasedTossLines, buildDivination, getFullMonthBranch, getFullDayBranch } from "@/lib/liuyao/engine";
import { getYinyaoTemplates, type YinyaoTemplate } from "@/lib/liuyao/yinyao";
import { buildScriptReference } from "@/lib/liuyao/scripts";
import { getTrueSolarHour } from "@/lib/solar-time";

const CALC_TYPE_LABELS: Record<CalcType, string> = {
  1: "婚姻",
  2: "事业",
  3: "财运",
  4: "具体一事",
  5: "健康",
  6: "子女",
};

const CALC_TYPE_LABELS_EN: Record<CalcType, string> = {
  1: "Marriage",
  2: "Career",
  3: "Wealth",
  4: "Specific Question",
  5: "Health",
  6: "Children",
};

function getYongShen(calcType: CalcType, gender: string): string {
  switch (calcType) {
    case 1: // 婚姻
      return gender === "male" ? "妻财" : "官鬼";
    case 2: // 事业
      return "官鬼";
    case 3: // 财运
      return "妻财";
    case 4: // 具体一事
      return "世爻";
    case 5: // 健康
      return "子孙";
    case 6: // 子女
      return "子孙";
  }
}

function buildSystemPrompt(
  lang: "zh" | "en",
  calcType: CalcType,
  gender: string,
  question: string | undefined,
  yinyaoTemplates: YinyaoTemplate[],
  scriptRef: string
): string {
  const label = lang === "zh" ? CALC_TYPE_LABELS[calcType] : CALC_TYPE_LABELS_EN[calcType];

  // Build all 3 subtype profiles for the AI to choose from
  const subtypeProfiles = yinyaoTemplates.map((t, i) => {
    const letter = String.fromCharCode(65 + i); // A, B, C
    const archetype = lang === "zh" ? t.archetype : t.archetypeEn;
    const subtypeName = lang === "zh" ? t.subtypeName : t.subtypeNameEn;
    const desc = lang === "zh" ? t.description : t.descriptionEn;
    const traits = lang === "zh" ? t.traits.join("、") : t.traitsEn.join(", ");
    const strengths = lang === "zh" ? t.strengths.join("、") : t.strengthsEn.join(", ");
    const weaknesses = lang === "zh" ? t.weaknesses.join("、") : t.weaknessesEn.join(", ");
    const advice = lang === "zh" ? t.adviceStyle : t.adviceStyleEn;
    return `[Subtype ${letter}] ${subtypeName} - ${archetype}
  Description: ${desc}
  Traits: ${traits}
  Strengths: ${strengths}
  Weaknesses: ${weaknesses}
  Advice Style: ${advice}`;
  }).join("\n\n");

  const langInstruction = lang === "en"
    ? [
        "CRITICAL LANGUAGE RULE: You MUST output in ENGLISH only.",
        "The user does NOT understand Chinese at all.",
        "Every field in the JSON response MUST be written in English.",
        "Do NOT use any Chinese characters, pinyin, or mixed-language text.",
        "Even if the hexagram names are traditionally Chinese, describe them in English.",
      ].join("\n")
    : [
        "CRITICAL LANGUAGE RULE: You MUST output in CHINESE only.",
        "The user does NOT understand English at all.",
        "Every field in the JSON response MUST be written in Chinese.",
        "Do NOT use any English words or mixed-language text.",
      ].join("\n");

  const jsonExample = lang === "en"
    ? `{
  "fortuneVerdict": "Auspicious - steady progress ahead",
  "selectedSubtype": "A/B/C",
  "section1_hexagramSetup": "explain the hexagram setup in English...",
  "section2_yongShenAnalysis": "analyze the focus spirit in English...",
  "section3_hexagramProcess": "interpret the hexagram process in English...",
  "section4_conclusion": "give the conclusion in English...",
  "section5_timing": "discuss timing in English...",
  "section6_risks": "warn about risks in English...",
  "yinyaoAdvice": "give personality advice in English...",
  "oneLineSummary": "one sentence summary in English"
}`
    : `{
  "fortuneVerdict": "吉凶判断",
  "selectedSubtype": "A/B/C",
  "section1_hexagramSetup": "起卦排盘说明",
  "section2_yongShenAnalysis": "用神分析",
  "section3_hexagramProcess": "卦象过程解读",
  "section4_conclusion": "吉凶结论",
  "section5_timing": "应期",
  "section6_risks": "风险提醒",
  "yinyaoAdvice": "性格指引（个性化的生活建议）",
  "oneLineSummary": "一句话总结"
}`;

  return `${langInstruction}

You are Clara, a warm, practical Eastern wellness consultant. A user has received a Liu Yao (六爻) divination. The hexagram is pre-computed. Interpret it with a warm, personality-aware approach.

## Identity
- Wise, caring neighbor — not a mystical fortune-teller
- Users are busy homemakers managing households
- Translate ancient hexagram wisdom into modern daily advice
- Even with ominous signs, frame the answer with what the user CAN do
- Never mention 英耀篇, Ying Yao Pian, or any fortune-telling terminology in your output

## Personality Assessment
The user matches this age+gender group. Below are 3 personality subtypes. Review them, pick the ONE that best matches the user's situation based on the hexagram reading, and integrate it into your interpretation.

${subtypeProfiles}

IMPORTANT: In your response, mention which subtype (A/B/C) and archetype name you selected. Connect the hexagram's message to the user's character traits from that subtype. For example, if the user tends to be impatient (young male - Ambitious), give advice that channels this energy constructively. If they tend to over-sacrifice (middle female - Devoted), remind them to protect their own wellbeing.

## Query Context
- Divination Type: ${label}
- User Gender: ${gender === "male" ? (lang === "zh" ? "男" : "Male") : (lang === "zh" ? "女" : "Female")}
${question ? `- User's Question: ${question}` : ""}

## Interpretation Style
- Lead with the hexagram's core message in one warm sentence
- Connect the hexagram's message to the user's personality traits
- Explain what moving lines mean for the user's specific question and life stage
- Give 2-3 concrete, actionable suggestions that fit their personality
- End gently — never leave the user feeling doomed
- Never use terms like 英耀篇, Ying Yao Pian, or 命格 in your output

## Reference Scripts
Use these professional scripts as style and phrasing reference. Don't copy them verbatim — adapt them to the specific hexagram and user context.

${scriptRef}

${langInstruction}

Return ONLY valid JSON using this exact schema:
${jsonExample}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      gender,
      birthYear,
      birthMonth,
      birthDay,
      birthHour,
      calcType,
      question,
      mode,
      lines,
      sysTime,
      lang,
      birthplaceCity,
    } = body;

    const outputLang: "zh" | "en" = lang === "en" ? "en" : "zh";

    logUsage({
      endpoint: "liuyao",
      category: calcType ? CALC_TYPE_LABELS_EN[calcType] || String(calcType) : undefined,
      lang: outputLang,
      timestamp: new Date().toISOString(),
      ip: req.headers.get("x-forwarded-for") || "",
    });

    if (!gender || !birthYear || !birthMonth || !birthDay || birthHour === undefined || !calcType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!getDoubaoKey()) {
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 503 }
      );
    }

    // === True solar time correction ===
    let correctedBirthHour = birthHour;
    if (birthplaceCity && typeof birthplaceCity === "string" && birthplaceCity.trim()) {
      const solarBirthHour = getTrueSolarHour(birthHour, birthplaceCity, birthMonth, birthDay);
      correctedBirthHour = Math.round(solarBirthHour) % 24;
    }

    // === Hexagram calculation: coin toss or time-based ===
    let coinLines: CoinTossLine[];
    let calcDate: Date;

    if (mode === "coin" && lines && Array.isArray(lines) && lines.length === 6) {
      // Manual coin toss
      coinLines = lines.map((l: Record<string, unknown>) => ({
        position: l.position as number,
        type: l.type as CoinTossLine["type"],
        isYang: l.isYang as boolean,
        isMoving: l.isMoving as boolean,
      }));
      calcDate = sysTime ? new Date(sysTime) : new Date();
    } else if (sysTime) {
      // Time-based
      calcDate = new Date(sysTime);
      if (isNaN(calcDate.getTime())) {
        return NextResponse.json({ error: "Invalid system time" }, { status: 400 });
      }
      coinLines = timeBasedTossLines(calcDate);
    } else {
      return NextResponse.json(
        { error: "Provide either lines (coin toss) or sysTime (time-based)" },
        { status: 400 }
      );
    }

    // Apply solar time correction to calcDate
    if (birthplaceCity && typeof birthplaceCity === "string" && birthplaceCity.trim()) {
      const solarCalcHour = getTrueSolarHour(
        calcDate.getHours(),
        birthplaceCity,
        calcDate.getMonth() + 1,
        calcDate.getDate()
      );
      calcDate.setHours(Math.round(solarCalcHour) % 24);
    }

    const divination = buildDivination(coinLines, calcDate);

    const orig = divination.originalHexagram;
    const changed = divination.changedHexagram;

    // === 英耀篇 ===
    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
    const yinyaoTemplates = getYinyaoTemplates(birthDate, gender);

    // === Script reference ===
    const scriptRef = buildScriptReference(outputLang, calcType as CalcType);

    // === 用神 ===
    const yongShen = getYongShen(calcType as CalcType, gender);

    // === Build pre-computed info for AI ===
    const assembledLinesStr = divination.assembledLines
      .map((l) =>
        `Line ${l.position}: ${l.branch}(${l.branchElement}) - ${l.liuqin} - ${l.liushen}` +
        (l.isShi ? " (Self)" : "") + (l.isYing ? " (Response)" : "") +
        (l.isMoving ? " [Moving]" : "")
      )
      .join("\n");

    const fullMonthBranch = getFullMonthBranch(calcDate);
    const fullDayBranch = getFullDayBranch(calcDate);

    const calcTypeLabel = outputLang === "zh"
      ? CALC_TYPE_LABELS[calcType as CalcType]
      : CALC_TYPE_LABELS_EN[calcType as CalcType];

    const precomputedInfo = [
      `Hexagram data (pre-computed, DO NOT recalculate):`,
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
      `=== Assembled Lines ===`,
      assembledLinesStr,
      ``,
      `=== Query ===`,
      `Focus spirit (用神): ${yongShen}`,
      `Divination type: ${calcTypeLabel}`,
      `Self line: position ${orig.shiPosition}`,
      `Response line: position ${((orig.shiPosition + 2) % 6) + 1}`,
      ``,
      `User question: ${question || "(none)"}`,
      `Gender: ${gender}`,
    ].join("\n");

    const content = await callDoubao(
      buildSystemPrompt(outputLang, calcType as CalcType, gender, question, yinyaoTemplates, scriptRef),
      precomputedInfo,
      { temperature: 0.7, max_tokens: 1200 }
    );

    const result = safeJsonParse<Record<string, unknown>>(content);
    if (!result) {
      return NextResponse.json({
        error: "Failed to parse AI response",
        rawContent: content.slice(0, 500),
      }, { status: 500 });
    }

    // Determine which subtype the AI selected (defaults to A if missing)
    const selectedLetter = (typeof result.selectedSubtype === "string" ? result.selectedSubtype.toUpperCase() : "A");
    const subtypeIndex = selectedLetter === "B" ? 1 : selectedLetter === "C" ? 2 : 0;
    const selectedYinyao = yinyaoTemplates[subtypeIndex] || yinyaoTemplates[0];

    const archetype = outputLang === "zh" ? selectedYinyao.archetype : selectedYinyao.archetypeEn;
    const traits = outputLang === "zh" ? selectedYinyao.traits : selectedYinyao.traitsEn;

    return NextResponse.json({
      hexagramName: orig.name,
      changedHexagramName: changed.name !== orig.name ? changed.name : "",
      palace: orig.palace,
      palaceElement: orig.palaceElement,
      isJingGua: divination.isJingGua,
      movingLineCount: divination.assembledLines.filter(l => l.isMoving).length,
      monthBranch: fullMonthBranch,
      dayBranch: fullDayBranch,
      lines: divination.assembledLines.map(l => ({
        position: l.position,
        isYang: l.isYang,
        isMoving: l.isMoving,
        branch: l.branch,
        branchElement: l.branchElement,
        liuqin: l.liuqin,
        liushen: l.liushen,
        isShi: l.isShi,
        isYing: l.isYing,
      })),
      yongShen,
      yongShenStrength: result.yongShenStrength || "",
      fortuneVerdict: result.fortuneVerdict || "",
      selectedSubtype: result.selectedSubtype || "A",
      section1_hexagramSetup: result.section1_hexagramSetup || "",
      section2_yongShenAnalysis: result.section2_yongShenAnalysis || "",
      section3_hexagramProcess: result.section3_hexagramProcess || "",
      section4_conclusion: result.section4_conclusion || "",
      section5_timing: result.section5_timing || "",
      section6_risks: result.section6_risks || "",
      yinyaoArchetype: archetype,
      yinyaoTraits: traits,
      yinyaoAdvice: result.yinyaoAdvice || "",
      oneLineSummary: result.oneLineSummary || "",
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
