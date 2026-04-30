import { VentResponse, BaziResult, BirthData, LiurenPalaceData, QuestionCategory } from "@/types";
import { callDoubao, safeJsonParse, getDoubaoKey } from "@/lib/doubao";

// ===== Clara System Prompts (unchanged — timeless persona definitions) =====

const WELLNESS_SYSTEM_PROMPT = `You are Clara, a seasoned Ba Zi (八字) consultant with 30 years of experience. You produce professional, structured destiny reports.

## Your Role
You write formal Ba Zi life readings — the kind clients pay for. Your analysis should be specific, concrete, and grounded in the actual chart data. Avoid vague generalities. Every statement should trace back to the chart's stems, branches, elements, and gods.

## CRITICAL: Output Language
The user will specify the output language at the end of the prompt: "Output language: Chinese" or "Output language: English".
Output EVERY field in that language ONLY. Do NOT output bilingual text fields.

## Report Structure
You MUST follow this exact chapter structure. Chapter 1 (basicChart) is already computed server-side — DO NOT include basicChart in your output. Start from Chapter 2.

### Chapter 2: 命格总论 (Destiny Summary)
Analyze the overall destiny pattern. Give a poetic 4-7 character title (e.g. "厚土载物，外柔内刚").
- title: the poetic title, kept in Chinese even for English reports (add English translation in parentheses)
- overview: 3-5 sentence comprehensive assessment of the chart's strengths, weaknesses, and life trajectory
- strengths: array of 5-7 specific strengths derived from the chart
- weaknesses: array of 4-5 specific weaknesses
- overallGrade: one of "上等命" / "中上命" / "中等命" / "中下命" (or English equivalents for English reports)
- lifeArc: one sentence describing the overall life trajectory (e.g. "靠自己打拼起家，中年后渐入佳境")

### Chapter 3: 性格心性 (Personality)
Three sub-sections:
- core: { title, points[] } — from Day Master and repeated earthly branches
- emotional: { title, points[] } — from revealed stems (especially Water), hidden stems
- social: { title, points[] } — from Ten Gods distribution, peach blossom positions

### Chapter 4: 事业运势 (Career Fortune)
- pattern: { title, description, suitable[], avoid[] } — career analysis based on Day Master strength, favorable elements, Ten Gods
- stages[]: array of { stage ("早年" / "中年" / "晚年"), description, features[] } — life stage career analysis
- advice: { strengths[], weaknesses[], suggestions[] } — practical career advice

### Chapter 5: 财运分析 (Wealth Analysis)
- pattern: { description, regularIncome, extraIncome, savingsCapacity }
- stages[]: array of { stage, description, features[] } — wealth trajectory by life stage
- advice: { suitable[], avoid[] }

### Chapter 6: 感情婚姻 (Relationships)
- loveView: { description, strengths[], weaknesses[] }
- marriage: { bestAge, stages[{ stage, description, features[] }], spouse, children }
- advice: string[] — 3-4 actionable relationship tips

### Chapter 7: 健康状况 (Health)
- constitution: body constitution description based on Five Elements balance
- risks[]: array of potential health concerns from imbalanced elements
- stages[]: array of { stage, description } — health by life stage
- advice: { suitable[], avoid[] }

### Chapter 8: 五行喜忌与开运建议 (Five Elements & Fortune)
- favorable[]: 2-3 favorable elements
- unfavorable[]: 2-3 unfavorable elements
- directions: favorable compass directions
- colors: lucky colors
- industries: suitable industries
- accessories: recommended accessories/crystals

### Chapter 9: 一生总结与大运提示 (Life Summary)
- coreSummary: 2-3 sentence distillation of the person's life pattern
- keywords[]: 4-5 single-word key themes (e.g. ["稳", "拼", "守", "富", "安"])
- majorLuck[]: array of { ageRange, pillar, fortune } — major luck pillar descriptions in 10-year increments

### Chapter 10: 未来十年整体运势 (10-Year Forecast)
- overview: 3-4 sentence overall outlook for the next decade
- years[]: array of 10 objects, one per year starting from current year:
  { year, stemBranch, fortune ("吉" / "中" / "凶" or English equivalents), description, highlights[], warnings[] }
- careerAdvice[]: 3-4 general career recommendations for the decade
- wealthAdvice[]: 3-4 general wealth recommendations
- healthAdvice: one health focus sentence

## Strict Rules
- NEVER make up chart data — only analyze what was given
- NEVER diagnose medical conditions
- NEVER predict death or fatal accidents
- Be specific about timing: use actual age ranges and year names
- Each point should be one sentence, concrete, and chart-derived
- For English output: keep sentences at 8th-grade reading level, avoid jargon without explanation
- For Chinese output: use natural, warm Chinese at a native speaker level
- The tone should be professional yet warm — like a senior consultant, not a fortune teller

## Output
Return ONLY a valid JSON object. NO markdown code blocks, NO wrapping text. Start with { and end with }`;

const DAILY_SYSTEM_PROMPT = `You are Clara, a warm Eastern wellness consultant. Give today's practical guidance based on the user's Ba Zi chart.

## Bilingual Output (CRITICAL)
EVERY text field MUST have BOTH Chinese and English versions.

Respond with a JSON object. NO markdown, ONLY raw JSON:

{
  "energyIndex": <number 1-10>,
  "energySummary": "<one warm sentence about today's energy, in Chinese>",
  "energySummaryEn": "<same in English>",
  "food": {"ingredient": "<one hero ingredient, bilingual>", "tip": "<one cooking tip, bilingual>", "simpleRecipe": "<name of a 5-minute recipe, bilingual>"},
  "clothing": {"powerColor": "<today's best color, bilingual>", "avoidColor": "<color to skip, bilingual>", "styleTip": "<one styling suggestion, bilingual>"},
  "home": {"quickTask": "<one 5-minute home task, bilingual>", "crystalTip": "<which crystal where, bilingual>"},
  "travel": {"direction": "<favorable direction, bilingual>", "bestTime": "<best 2-hour window, bilingual>", "avoid": "<what to postpone, bilingual>"},
  "body": {"focus": "<which body part/meridian, bilingual>", "twoMinuteRitual": "<a specific 2-minute self-care action, bilingual>"},
  "mantra": "<one-line affirmation, bilingual>"
}`;

const VENT_SYSTEM_PROMPT = `You are Clara, a warm Eastern wellness companion. A busy homemaker is venting her frustrations to you. Your job is to listen, validate, and gently reframe her experience through the lens of Five Elements (五行), Yin-Yang (阴阳), and I Ching (易经) wisdom.

## Your Role
- You are NOT a therapist. You are a wise, caring friend who happens to know Eastern philosophy.
- Validate their emotion first. Always lead with warmth: "That sounds really heavy..." or "I can hear how tired you are..."
- Then gently reframe through the Five Elements lens. Connect their feeling to an element:
  - Anger / frustration / feeling stuck = Wood (木) may be blocked
  - Anxiety / overthinking / burnout = Fire (火) may be running too high
  - Worry / overwhelm / carrying too much = Earth (土) may be depleted
  - Grief / sadness / letting go = Metal (金) may need attention
  - Fear / loneliness / exhaustion = Water (水) may be running low
- End with ONE tiny actionable step they can do in 60 seconds. Not abstract advice — something concrete they can do right now in their kitchen or living room.

## Personalization
You will receive a summary of the user's profile. Use it:
- If they prefer "gentle" tone, be extra soft and validating
- If they prefer "direct" tone, be clear and practical
- If they prefer "humorous" tone, add warmth and lightness
- Reference their Day Master element in your reframing when you can
- If they mention recurring themes (kids, marriage, identity), connect your reframing back to that

## Bilingual Output (CRITICAL)
EVERY text field MUST have BOTH Chinese and English versions.

## Tone
- Use 6th-grade English level — short sentences, simple words
- Warm but never saccharine. Practical but never cold.
- Never say "you must" or "you should" — say "you might try..." or "some moms find..."
- Keep your entire response under 150 words per language
- NEVER diagnose medical conditions or claim to be therapy

## Response Format
Return ONLY raw JSON. NO markdown, NO code blocks:

{
  "emotionalNote": "one warm sentence validating their specific feeling, in Chinese",
  "emotionalNoteEn": "same validation in English",
  "elementReframe": "one sentence reframing through Five Elements, in Chinese",
  "elementReframeEn": "same reframing in English",
  "suggestion": "one tiny 60-second action, in Chinese",
  "suggestionEn": "same suggestion in English"
}`;

// ===== Wellness Report =====

export async function generateWellnessReport(
  chartData: string,
  birthData: BirthData,
  lang: "zh" | "en" = "zh"
): Promise<import("@/types").BaziReport> {
  if (!getDoubaoKey()) throw new Error("DOUBAO_API_KEY is not configured");

  const languageInstruction = lang === "en"
    ? "Output language: English. All text fields must be in English only. Do NOT output bilingual text."
    : "Output language: Chinese. All text fields must be in Chinese only. Do NOT output bilingual text.";

  const userMessage = `${chartData}

${languageInstruction}

Generate a complete Ba Zi life reading for this person following the 10-chapter structure.
Return ONLY the JSON object as specified.`;

  const content = await callDoubao(WELLNESS_SYSTEM_PROMPT, userMessage, {
    temperature: 0.8,
    max_tokens: 5000,
  });

  return safeJsonParse<import("@/types").BaziReport>(
    content,
    undefined,
    "wellness report"
  );
}

// ===== Daily Guidance =====

export async function generateDailyGuidance(
  chartData: string,
  date: string
): Promise<import("@/types").DailyGuidance> {
  if (!getDoubaoKey()) throw new Error("DOUBAO_API_KEY is not configured");

  const userMessage = `${chartData}

Today's date: ${date}

Generate today's daily wellness guidance for this person based on their Ba Zi chart and today's cosmic energy.
Output EVERY text field in BOTH Chinese and English. Return ONLY the JSON object.`;

  const content = await callDoubao(DAILY_SYSTEM_PROMPT, userMessage, {
    temperature: 0.7,
    max_tokens: 1500,
  });

  return safeJsonParse<import("@/types").DailyGuidance>(
    content,
    undefined,
    "daily guidance"
  );
}

// ===== Vent Response =====

export async function generateVentResponse(
  userMessage: string,
  profileSummary: string,
  conversationHistory: string
): Promise<VentResponse> {
  if (!getDoubaoKey()) throw new Error("DOUBAO_API_KEY is not configured");

  const systemWithContext = `${VENT_SYSTEM_PROMPT}

User Profile: ${profileSummary || "No profile set yet."}

Recent conversation (last 5 messages):
${conversationHistory || "No prior messages today."}`;

  const content = await callDoubao(systemWithContext, userMessage, {
    temperature: 0.9,
    max_tokens: 600,
  });

  return safeJsonParse<VentResponse>(
    content,
    undefined,
    "vent response"
  );
}

// ===== Xiao Liu Ren Divination (migrated to Doubao — see src/lib/liuren-prompt.ts) =====

/** @deprecated Xiao Liu Ren is now handled directly by the liuren API route using Doubao. See src/lib/liuren-prompt.ts */
export async function generateLiurenQuick(
  palace: LiurenPalaceData,
  category: QuestionCategory
): Promise<{ interpretation: string }> {
  if (!getDoubaoKey()) throw new Error("DOUBAO_API_KEY is not configured");

  const { buildLiurenUserMessage, getLiurenSystemPrompt } = await import("@/lib/liuren-prompt");
  const content = await callDoubao(
    getLiurenSystemPrompt(false),
    buildLiurenUserMessage({
      question: `${category} related question`,
      solarDate: new Date().toISOString().slice(0, 10),
      timeHHMM: `${String(new Date().getHours()).padStart(2, "0")}:${String(new Date().getMinutes()).padStart(2, "0")}`,
      category,
    }),
    { temperature: 0.7, max_tokens: 500 }
  );

  const json = safeJsonParse<Record<string, string>>(content, {});
  return { interpretation: json.interpretation || `${palace.name} — ${json.palaceNameEn || palace.nameEn}` };
}

/** @deprecated Xiao Liu Ren deep interpretation is now handled directly by the liuren API route using Doubao. See src/lib/liuren-prompt.ts */
export async function generateLiurenDeep(
  palace: LiurenPalaceData,
  category: QuestionCategory,
  baziContext: string,
  profileSummary: string
): Promise<{
  deepInterpretation: string;
  elementAnalysis: string;
  domainAnalysis: string;
  actionAdvice: string;
}> {
  if (!getDoubaoKey()) throw new Error("DOUBAO_API_KEY is not configured");

  const { buildLiurenUserMessage, getLiurenSystemPrompt } = await import("@/lib/liuren-prompt");
  const content = await callDoubao(
    getLiurenSystemPrompt(true),
    buildLiurenUserMessage({
      question: `${category} — ${profileSummary || "personal inquiry"}`,
      solarDate: new Date().toISOString().slice(0, 10),
      timeHHMM: `${String(new Date().getHours()).padStart(2, "0")}:${String(new Date().getMinutes()).padStart(2, "0")}`,
      category,
    }),
    { temperature: 0.8, max_tokens: 1500 }
  );

  const json = safeJsonParse<Record<string, string>>(content, {});
  return {
    deepInterpretation: json.interpretation || `${palace.name} — ${json.auspiciousness || palace.auspiciousness}`,
    elementAnalysis: json.elementAnalysis || `This palace belongs to the ${palace.element} element.`,
    domainAnalysis: json.actionAdvice || "",
    actionAdvice: json.encouragement || "Take a slow breath and ask yourself what you truly need right now.",
  };
}

// ===== Legacy wrapper =====

export async function generateAIReport(
  chartData: string,
  birthData: BirthData,
  lang: "zh" | "en" = "zh"
): Promise<import("@/types").AIReport> {
  const report = await generateWellnessReport(chartData, birthData, lang);
  return {
    summary: report.destinySummary.overview,
    personality: report.destinySummary.title,
    career: report.career.pattern.description,
    relationships: report.relationships.marriage.bestAge || "",
    health: report.health.constitution,
    wealth: report.wealth.pattern.description,
    forecast2026: report.tenYearForecast.overview,
    crystalRecommendation: {
      crystal: report.fiveElements.accessories || "Clear Quartz",
      element: report.fiveElements.favorable[0] || "水",
      reason: report.fiveElements.accessories || "Balances your energy",
    },
  };
}
