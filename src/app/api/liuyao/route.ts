import { NextRequest, NextResponse } from "next/server";
import { callDoubao, safeJsonParse, getDoubaoKey } from "@/lib/doubao";
import { buildLiuyaoUserMessage, getLiuyaoSystemPrompt, formatTossResults } from "@/lib/liuyao-prompt";
import type { QuestionCategory } from "@/types";
import type { CoinTossLine } from "@/lib/liuyao/types";

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

    // Format toss results for prompt
    const tossText = formatTossResults(lines as Array<{ position: number; type: string }>);

    // Everyone gets the full deep reading — no membership gate
    const systemPrompt = getLiuyaoSystemPrompt(true);
    const userMessage = buildLiuyaoUserMessage({
      question,
      tossResults: tossText,
      solarDate,
      gender,
      category: cat,
      birthYear: birthYear || 0,
      birthMonth: birthMonth || 0,
      birthDay: birthDay || 0,
    });

    const content = await callDoubao(systemPrompt, userMessage, {
      temperature: 0.7,
      max_tokens: 2000,
    });

    const result = safeJsonParse<Record<string, unknown>>(content);
    if (!result) {
      return NextResponse.json({
        error: "豆包返回解析失败，请稍后再试",
        errorEn: "Failed to parse AI response. Please try again.",
        rawContent: content.slice(0, 500),
      }, { status: 500 });
    }

    return NextResponse.json({
      hexagramName: result.hexagramName || "",
      hexagramNameEn: result.hexagramNameEn || "",
      changedHexagramName: result.changedHexagramName || "",
      changedHexagramNameEn: result.changedHexagramNameEn || "",
      palace: result.palace || "",
      palaceEn: result.palaceEn || "",
      palaceElement: result.palaceElement || "",
      palaceElementEn: result.palaceElementEn || "",
      isJingGua: result.isJingGua ?? true,
      movingLineCount: result.movingLineCount ?? 0,
      monthBranch: result.monthBranch || "",
      monthBranchEn: result.monthBranchEn || "",
      dayBranch: result.dayBranch || "",
      dayBranchEn: result.dayBranchEn || "",
      lines: result.lines || [],
      yongShen: result.yongShen || "",
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
      interpretation: result.interpretation || "",
      interpretationEn: result.interpretationEn || "",
      actionAdvice: result.actionAdvice || "",
      actionAdviceEn: result.actionAdviceEn || "",
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
