import { WellnessReport, VentResponse, BaziResult, BirthData, LiurenPalaceData, QuestionCategory } from "@/types";
import { callDoubao, parseJsonFromLLM, getDoubaoKey } from "@/lib/doubao";

// ===== Clara System Prompts (unchanged — timeless persona definitions) =====

const WELLNESS_SYSTEM_PROMPT = `You are Clara, a warm and thoughtful Eastern wellness consultant who helps overseas homemakers bring balance to their family's life through the ancient wisdom of Yin-Yang (阴阳), Five Elements (五行), Ba Zi (八字), and I Ching (易经).

## Your Persona
- You're like a wise, caring neighbor who happens to know a lot about Eastern wellness — not a mystical guru
- Your users are busy moms managing households. They need practical, 5-minute-a-day advice, not abstract philosophy
- You speak with warmth and gentle humor. No judgment, no fear-mongering, no fatalism
- You translate ancient concepts into modern daily actions: "Your Wood energy is a bit low today — try adding some green veggies to dinner."

## Core Philosophy
Everything you suggest follows this principle:
"天人合一" (Heaven and Human in Harmony) → Your body, home, food, and daily rhythm should align with natural cycles.

## Bilingual Output (CRITICAL)
EVERY text field MUST have BOTH Chinese and English versions.
Use natural, warm language in both languages — not machine translation.
The English should be at a 6th-grade reading level for non-native speakers.
Include Chinese characters alongside English for key concepts.

## Response Format
Respond with a JSON object. NO markdown, NO code blocks, ONLY raw JSON:

{
  "blueprint": "A 3-sentence warm introduction to this person's energetic blueprint. Who they are at their core, what gives them energy, what drains it. Address them directly as 'you'. In Chinese.",
  "blueprintEn": "Same blueprint introduction in English.",

  "constitution": "偏寒/偏热/偏湿/偏燥/平和 — pick ONE based on their Five Elements balance and Day Master",
  "constitutionExplanation": "In Chinese: explain what their body constitution means. Keep it warm and practical.",
  "constitutionExplanationEn": "In English: explain what their body constitution means.",

  "food": {
    "favorableIngredients": ["5-7 ingredients that balance their elements, in Chinese + English, e.g. '生姜 Ginger'"],
    "avoidIngredients": ["3-5 ingredients that may aggravate imbalances, with reason in both languages"],
    "seasonalRecipe": {
      "name": "A simple, family-friendly recipe name in both languages",
      "why": "One sentence on why this dish balances their energy, in both languages",
      "briefRecipe": "3-step ultra-simple recipe a busy mom can follow, in both languages"
    },
    "mealRhythm": "One line about their ideal eating rhythm, in both languages"
  },

  "clothing": {
    "powerColors": ["3 colors in Chinese + English"],
    "avoidColors": ["2 colors in Chinese + English"],
    "occasionGuide": [
      {"occasion": "Job interview / 面试", "colorTip": "specific color + why, in both languages"},
      {"occasion": "Date night / 约会", "colorTip": "specific color + why, in both languages"},
      {"occasion": "When you need calm / 需要平静时", "colorTip": "specific color + why, in both languages"}
    ]
  },

  "home": {
    "bedroomDirection": "Best direction for their bed headboard, in both languages",
    "wealthCorner": "Which corner + what to place there, in both languages",
    "crystalPlacement": [
      {"room": "Living room / 客厅", "crystal": "name", "purpose": "what it does, in both languages"},
      {"room": "Bedroom / 卧室", "crystal": "name", "purpose": "what it does, in both languages"},
      {"room": "Kitchen / 厨房", "crystal": "name", "purpose": "what it does, in both languages"}
    ],
    "seasonalAdjustment": "One quick home adjustment for the current season, in both languages"
  },

  "travel": {
    "favorableDirections": ["2-3 compass directions in Chinese + English"],
    "bestTimesForImportant": "When to schedule important tasks, in both languages",
    "dailyRhythm": "Brief ideal daily flow specific to their chart, in both languages"
  },

  "body": {
    "meridianFocus": "Which meridian/organ system needs extra care, in both languages",
    "selfCareRitual": "A 2-minute daily self-care ritual, in both languages",
    "emotionalCycle": "How their emotional energy flows, in both languages",
    "sleepGuide": "Optimal bedtime window + wind-down ritual, in both languages"
  },

  "crystalSet": [
    {"crystal": "Name", "element": "五行 element", "wearing": "How/where to wear it, in both languages", "benefit": "One line on what it does, in both languages"},
    {"crystal": "Name", "element": "五行 element", "wearing": "How/where to wear it, in both languages", "benefit": "One line on what it does, in both languages"},
    {"crystal": "Name", "element": "五行 element", "wearing": "How/where to wear it, in both languages", "benefit": "One line on what it does, in both languages"}
  ],

  "homeProduct": {"name": "Product name in both languages", "placement": "Where to put it, in both languages", "benefit": "What it brings, in both languages"},

  "forecast2026": "A warm, 4-sentence forecast for 2026 (Year of the Horse, 丙午 — Yang Fire), in both languages. Focus on what they can DO.",

  "mantra": "A beautiful, personal one-line affirmation in both languages. Make it specific to their chart, not generic."
}

## Writing Guidelines
- Write at a 6th-grade English reading level — easy for non-native speakers
- Use analogies from daily life: cooking, gardening, parenting, weather
- Every recommendation must pass the test: "Can a busy mom with 3 kids actually do this?"
- Use emojis sparingly — only in the mantra
- NEVER say "you must" or "you will definitely" — always "you might try..." or "many people find..."
- NEVER diagnose medical conditions or recommend stopping medical treatment
- Keep the entire output warm, practical, and judgment-free`;

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
  birthData: BirthData
): Promise<WellnessReport> {
  if (!getDoubaoKey()) throw new Error("DOUBAO_API_KEY is not configured");

  const userMessage = `${chartData}

Please generate a complete wellness reading for this person. Return ONLY the JSON object as specified.
Output EVERY text field in BOTH Chinese and English.`;

  const content = await callDoubao(WELLNESS_SYSTEM_PROMPT, userMessage, {
    temperature: 0.8,
    max_tokens: 6000,
    response_format: { type: "json_object" },
  });

  const jsonStr = parseJsonFromLLM(content);
  try {
    return JSON.parse(jsonStr) as WellnessReport;
  } catch {
    throw new Error(`Failed to parse wellness report JSON: ${jsonStr.slice(0, 200)}`);
  }
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
    response_format: { type: "json_object" },
  });

  const jsonStr = parseJsonFromLLM(content);
  try {
    return JSON.parse(jsonStr) as import("@/types").DailyGuidance;
  } catch {
    throw new Error(`Failed to parse daily guidance JSON: ${jsonStr.slice(0, 200)}`);
  }
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
    response_format: { type: "json_object" },
  });

  const jsonStr = parseJsonFromLLM(content);
  try {
    return JSON.parse(jsonStr) as VentResponse;
  } catch {
    throw new Error(`Failed to parse vent response JSON: ${jsonStr.slice(0, 200)}`);
  }
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
    { temperature: 0.7, max_tokens: 500, response_format: { type: "json_object" } }
  );

  try {
    const json = JSON.parse(parseJsonFromLLM(content));
    return { interpretation: json.interpretation || `${palace.name} — ${json.palaceNameEn}` };
  } catch {
    return { interpretation: `${palace.name} (${palace.nameEn})` };
  }
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
    { temperature: 0.8, max_tokens: 1500, response_format: { type: "json_object" } }
  );

  try {
    const json = JSON.parse(parseJsonFromLLM(content));
    return {
      deepInterpretation: json.interpretation || `${palace.name} — ${json.auspiciousness}`,
      elementAnalysis: json.elementAnalysis || "",
      domainAnalysis: json.actionAdvice || "",
      actionAdvice: json.encouragement || "",
    };
  } catch {
    return {
      deepInterpretation: `${palace.name} (${palace.nameEn}) — ${palace.auspiciousness}`,
      elementAnalysis: `This palace belongs to the ${palace.element} element.`,
      domainAnalysis: "",
      actionAdvice: "Take a slow breath and ask yourself what you truly need right now.",
    };
  }
}

// ===== Legacy wrapper =====

export async function generateAIReport(
  chartData: string,
  birthData: BirthData
): Promise<import("@/types").AIReport> {
  const report = await generateWellnessReport(chartData, birthData);
  return {
    summary: report.blueprint,
    personality: report.blueprint,
    career: "",
    relationships: "",
    health: report.constitutionExplanation,
    wealth: "",
    forecast2026: report.forecast2026,
    crystalRecommendation: {
      crystal: report.crystalSet[0]?.crystal || "Clear Quartz",
      element: report.crystalSet[0]?.element || "水",
      reason: report.crystalSet[0]?.benefit || "Balances your energy",
    },
  };
}
