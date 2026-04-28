import { NextRequest, NextResponse } from "next/server";
import { callDoubao, parseJsonFromLLM, getDoubaoKey } from "@/lib/doubao";
import { buildLiuyaoUserMessage, getLiuyaoSystemPrompt, formatTossResults } from "@/lib/liuyao-prompt";
import {
  getProfile,
  isMemberActive,
  getDailyLiurenCount,
  incrementLiurenCount,
} from "@/lib/profile";
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
      deep,
    } = body;

    const validCategories: QuestionCategory[] = ["love", "career", "wealth", "health", "daily"];
    const cat: QuestionCategory = validCategories.includes(category) ? category : "daily";
    const requestDeep = deep === true;

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

    const profile = getProfile();
    const memberActive = isMemberActive();

    // Free tier: check daily limit
    if (!memberActive) {
      const dailyCount = getDailyLiurenCount();
      if (dailyCount >= 1) {
        return NextResponse.json({
          error: "今日免费占卜次数已用完。升级会员享受无限深度解读。",
          errorEn: "Free daily divination limit reached. Upgrade for unlimited deep readings.",
          limited: true,
          dailyFreeUsed: dailyCount,
        }, { status: 429 });
      }
      incrementLiurenCount();
    }

    // Free tier: no deep reading
    if (requestDeep && !memberActive) {
      return NextResponse.json({
        error: "深度解读需要会员。免费用户可使用快速解读。",
        errorEn: "Deep reading requires membership. Free users can use quick reading.",
        limited: true,
      }, { status: 402 });
    }

    // Format toss results for prompt
    const tossText = formatTossResults(lines as Array<{ position: number; type: string }>);

    const systemPrompt = getLiuyaoSystemPrompt(requestDeep && memberActive);
    const userMessage = buildLiuyaoUserMessage({
      question,
      tossResults: tossText,
      solarDate,
      gender,
      category: cat,
    });

    const maxTokens = (requestDeep && memberActive) ? 4000 : 1000;

    const content = await callDoubao(systemPrompt, userMessage, {
      temperature: 0.7,
      max_tokens: maxTokens,
      response_format: { type: "json_object" },
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
      lines: result.lines || [],
      yongShen: result.yongShen || "",
      yongShenEn: result.yongShenEn || "",
      yongShenStrength: result.yongShenStrength || "",
      yongShenStrengthEn: result.yongShenStrengthEn || "",
      movingLineEffects: result.movingLineEffects || "",
      movingLineEffectsEn: result.movingLineEffectsEn || "",
      shiYingRelation: result.shiYingRelation || "",
      shiYingRelationEn: result.shiYingRelationEn || "",
      fortuneVerdict: result.fortuneVerdict || "",
      fortuneVerdictEn: result.fortuneVerdictEn || "",
      timingPrediction: result.timingPrediction || "",
      timingPredictionEn: result.timingPredictionEn || "",
      interpretation: result.interpretation || "",
      interpretationEn: result.interpretationEn || "",
      actionAdvice: result.actionAdvice || "",
      actionAdviceEn: result.actionAdviceEn || "",
      level: (requestDeep && memberActive) ? "deep" : "quick",
      memberActive,
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
