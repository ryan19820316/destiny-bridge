import { NextRequest, NextResponse } from "next/server";
import { interpret } from "@/lib/liuyao/interpreter";
import { buildDivination } from "@/lib/liuyao/engine";
import {
  getProfile,
  isMemberActive,
  getDailyLiurenCount,
  incrementLiurenCount,
} from "@/lib/profile";
import { readFileSync } from "fs";
import { resolve } from "path";
import type { QuestionCategory, CoinTossLine } from "@/lib/liuyao/types";

function getEnv(key: string, fallback = ""): string {
  try {
    const envPath = resolve(process.cwd(), ".env.local");
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (trimmed.startsWith(`${key}=`)) {
        return trimmed.slice(key.length + 1).trim();
      }
    }
  } catch {}
  return process.env[key] || fallback;
}

const LIUYAO_SYSTEM_PROMPT = `You are Clara, a warm and thoughtful Eastern wellness consultant helping overseas homemakers through the wisdom of 六爻 (Liu Yao / Wen Wang Gua), an ancient Chinese divination system from the I Ching.

## Your Persona
- You're like a wise, caring neighbor who knows Liu Yao — not a mystical fortune-teller
- Your users are busy moms managing households. They need practical, actionable guidance
- You translate ancient hexagram interpretations into modern daily advice
- You speak with warmth and gentle humor. No judgment, no fear-mongering, no fatalism
- Even with ominous hexagrams, always frame the answer with what the user CAN do

## Interpretation Style
- Lead with the core message of the hexagram in one warm sentence
- Explain what the moving lines suggest about the user's situation
- Give 2-3 concrete, actionable suggestions (what to do, what to avoid)
- End with a gentle, encouraging note — never leave the user feeling doomed

## Response Format
Return valid JSON:
{
  "aiInterpretation": "Warm, comprehensive interpretation in 2-3 paragraphs. Include the hexagram's core message, how it relates to the user's question, and practical guidance.",
  "elementAnalysis": "Analysis of the Five Element dynamics at play — which element dominates, what's in balance or conflict.",
  "actionAdvice": "2-3 bullet-point action items the user can take. Practical, specific, actionable."
}`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const category: QuestionCategory = body.category || "daily";
    const requestDeep = body.deep === true;

    const validCategories: QuestionCategory[] = ["love", "career", "wealth", "health", "daily"];
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const profile = getProfile();
    const memberActive = isMemberActive();

    // Free tier: check daily limit (shared with Xiao Liu Ren — 1 free divination/day total)
    if (!memberActive) {
      const dailyCount = getDailyLiurenCount();
      if (dailyCount >= 1) {
        return NextResponse.json({
          error: "今日免费占卜次数已用完。升级会员享受无限深度解读。",
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
        limited: true,
      }, { status: 402 });
    }

    // Use client-provided lines if available, otherwise toss fresh
    const clientLines: CoinTossLine[] | undefined = body.lines;
    const result = buildDivination(clientLines);
    const quickResult = interpret({ result, questionCategory: category });

    // Deep reading with AI
    if (requestDeep && memberActive) {
      const apiKey = getEnv("ANTHROPIC_API_KEY");
      if (!apiKey) {
        return NextResponse.json({
          ...quickResult,
          aiInterpretation: "AI 解读暂不可用（API Key 未配置）",
          elementAnalysis: "",
          actionAdvice: "",
        });
      }

      const baseUrl = getEnv("ANTHROPIC_BASE_URL", "https://api.qnaigc.com");

      const assembledSummary = quickResult.assembledLines.map((l) =>
        `爻${l.position}: ${l.isYang ? "⚊" : "⚋"} ${l.branch} ${l.liuqin} ${l.liushen}${l.isShi ? " (世)" : ""}${l.isYing ? " (应)" : ""}${l.isMoving ? " [动]" : ""}`
      ).join("\n");

      const categoryLabel: Record<QuestionCategory, string> = {
        love: "感情/姻缘", career: "事业/工作", wealth: "财运/钱财",
        health: "健康/身体", daily: "日常/综合运势",
      };

      const userMessage = [
        `User asks about: ${categoryLabel[category]}`,
        "",
        `本卦: ${quickResult.hexagramName} | 变卦: ${quickResult.changedHexagramName || "无(静卦)"}`,
        `卦宫: ${quickResult.palace}(${quickResult.palaceElement})`,
        `月建: ${result.monthBranch} | 日辰: ${result.dayBranch}`,
        `空亡: ${result.kongWangBranches.join(", ")}`,
        "",
        "六爻排盘:",
        assembledSummary,
        "",
        `Rules-based interpretation: ${quickResult.interpretation}`,
        "",
        "Give a warm, thorough interpretation. If the hexagram looks challenging, find the silver lining and actionable steps. No fatalism.",
      ].join("\n");

      const response = await fetch(`${baseUrl}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: getEnv("ANTHROPIC_MODEL", "claude-sonnet-4-6"),
          messages: [
            { role: "system", content: LIUYAO_SYSTEM_PROMPT },
            { role: "user", content: userMessage },
          ],
          temperature: 0.7,
          max_tokens: 800,
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        console.error("AI API error:", response.status, await response.text());
        return NextResponse.json({
          ...quickResult,
          aiInterpretation: "AI 解读暂时不可用，请稍后再试。",
          elementAnalysis: "",
          actionAdvice: "",
        });
      }

      const aiData = await response.json();
      const aiContent = JSON.parse(aiData.choices[0].message.content);

      return NextResponse.json({
        ...quickResult,
        aiInterpretation: aiContent.aiInterpretation || "",
        elementAnalysis: aiContent.elementAnalysis || "",
        actionAdvice: aiContent.actionAdvice || "",
        level: "deep",
      });
    }

    return NextResponse.json({ ...quickResult, level: "quick" });
  } catch (e) {
    console.error("Liu Yao API error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal error" },
      { status: 500 }
    );
  }
}
