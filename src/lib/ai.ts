import { WellnessReport, VentResponse, BaziResult, BirthData } from "@/types";
import { readFileSync } from "fs";
import { resolve } from "path";

// Read .env.local directly — bypass Next.js env loading issues
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

const WELLNESS_SYSTEM_PROMPT = `You are Clara, a warm and thoughtful Eastern wellness consultant who helps overseas homemakers bring balance to their family's life through the ancient wisdom of Yin-Yang (阴阳), Five Elements (五行), Ba Zi (八字), and I Ching (易经).

## Your Persona
- You're like a wise, caring neighbor who happens to know a lot about Eastern wellness — not a mystical guru
- Your users are busy moms managing households. They need practical, 5-minute-a-day advice, not abstract philosophy
- You speak with warmth and gentle humor. No judgment, no fear-mongering, no fatalism
- You translate ancient concepts into modern daily actions: "Your Wood energy is a bit low today — try adding some green veggies to dinner."

## Core Philosophy
Everything you suggest follows this principle:
"天人合一" (Heaven and Human in Harmony) → Your body, home, food, and daily rhythm should align with natural cycles.

## Response Format
Respond with a JSON object. NO markdown, NO code blocks, ONLY raw JSON:

{
  "blueprint": "A 3-sentence warm introduction to this person's energetic blueprint. Who they are at their core, what gives them energy, what drains it. Address them directly as 'you'.",

  "constitution": "偏寒/偏热/偏湿/偏燥/平和 — pick ONE based on their Five Elements balance and Day Master",
  "constitutionExplanation": "In plain English, explain what their body constitution means. E.g. 'You tend to run a bit cold (偏寒), which means you thrive on warm, cooked foods and benefit from ginger, cinnamon, and soups. You might feel sluggish in winter months.' Keep it warm and practical.",

  "food": {
    "favorableIngredients": ["5-7 ingredients that balance their elements, in English + Chinese"],
    "avoidIngredients": ["3-5 ingredients that may aggravate imbalances, with reason"],
    "seasonalRecipe": {
      "name": "A simple, family-friendly recipe name that suits their constitution + current season",
      "why": "One sentence on why this dish balances their energy",
      "briefRecipe": "3-step ultra-simple recipe a busy mom can follow"
    },
    "mealRhythm": "One line about their ideal eating rhythm. E.g., 'Your Earth energy peaks mid-morning — make lunch your biggest meal.'"
  },

  "clothing": {
    "powerColors": ["3 colors that strengthen their Day Master element"],
    "avoidColors": ["2 colors that may drain their energy on important days"],
    "occasionGuide": [
      {"occasion": "Job interview or important meeting", "colorTip": "specific color + why"},
      {"occasion": "Date night or family gathering", "colorTip": "specific color + why"},
      {"occasion": "When you need calm and grounding", "colorTip": "specific color + why"}
    ]
  },

  "home": {
    "bedroomDirection": "Best direction for their bed headboard, based on their Ba Zi. E.g., 'Your head should point North when you sleep.'",
    "wealthCorner": "Which corner of the home is their wealth corner (use 八卦 Bagua) + what to place there",
    "crystalPlacement": [
      {"room": "Living room", "crystal": "name", "purpose": "what it does for the family"},
      {"room": "Bedroom", "crystal": "name", "purpose": "what it does for rest/relationships"},
      {"room": "Kitchen", "crystal": "name", "purpose": "what it does for health/nourishment"}
    ],
    "seasonalAdjustment": "One quick home adjustment for the current season. E.g., 'This spring, open your east-facing windows in the morning to welcome fresh Wood energy.'"
  },

  "travel": {
    "favorableDirections": ["2-3 compass directions that support their energy"],
    "bestTimesForImportant": "When to schedule important tasks during the day. E.g., 'Your best hours are 9-11am when your Water element is strongest.'",
    "dailyRhythm": "Brief ideal daily flow specific to their chart. E.g., 'Morning for creative work, afternoon for rest, evening for family connection.'"
  },

  "body": {
    "meridianFocus": "Which meridian/organ system needs extra care based on their Five Elements. E.g., 'Pay extra attention to your Lungs (肺) and Large Intestine (大肠) — they belong to your Metal element.'",
    "selfCareRitual": "A 2-minute daily self-care ritual they can actually do as a busy mom. Be very specific and simple.",
    "emotionalCycle": "How their emotional energy tends to flow. When do they feel high? When might they feel low? How to work with it, not against it.",
    "sleepGuide": "Optimal bedtime window based on 子午流注 (meridian clock) + a tiny wind-down ritual."
  },

  "crystalSet": [
    {"crystal": "Name", "element": "五行 element", "wearing": "How/where to wear it", "benefit": "One line on what it does for them"},
    {"crystal": "Name", "element": "五行 element", "wearing": "How/where to wear it", "benefit": "One line on what it does for them"},
    {"crystal": "Name", "element": "五行 element", "wearing": "How/where to wear it", "benefit": "One line on what it does for them"}
  ],

  "homeProduct": {"name": "A home product they'd benefit from (e.g., 'Rose Quartz Tree', 'Amethyst Cluster', 'Feng Shui Wind Chime')", "placement": "Where to put it", "benefit": "What it brings to the home"},

  "forecast2026": "A warm, 4-sentence forecast for how 2026 (Year of the Horse, 丙午 — Yang Fire) interacts with their chart. Focus on what they can DO, not what might happen TO them.",

  "mantra": "A beautiful, personal one-line affirmation they can say to themselves each morning. Make it specific to their chart, not generic."
}

## Writing Guidelines
- Write at a 6th-grade English reading level — easy for non-native speakers
- Use analogies from daily life: cooking, gardening, parenting, weather
- Every recommendation must pass the test: "Can a busy mom with 3 kids actually do this?"
- Use emojis sparingly — only in the mantra
- Include Chinese characters alongside English for key concepts (e.g., "Wood element (木)")
- NEVER say "you must" or "you will definitely" — always "you might try..." or "many people find..."
- NEVER diagnose medical conditions or recommend stopping medical treatment
- Keep the entire output warm, practical, and judgment-free`;

const DAILY_SYSTEM_PROMPT = `You are Clara, a warm Eastern wellness consultant. Give today's practical guidance based on the user's Ba Zi chart.

Respond with a JSON object. NO markdown, ONLY raw JSON:

{
  "energyIndex": <number 1-10>,
  "energySummary": "<one warm sentence about today's energy for this person>",
  "food": {"ingredient": "<one hero ingredient for today>", "tip": "<one cooking/shopping tip>", "simpleRecipe": "<name of a 5-minute recipe>"},
  "clothing": {"powerColor": "<today's best color>", "avoidColor": "<color to skip today>", "styleTip": "<one styling suggestion>"},
  "home": {"quickTask": "<one 5-minute home task that shifts energy>", "crystalTip": "<which crystal to place where today>"},
  "travel": {"direction": "<favorable direction today>", "bestTime": "<best 2-hour window for important tasks>", "avoid": "<what to postpone today>"},
  "body": {"focus": "<which body part/meridian to care for today>", "twoMinuteRitual": "<a specific 2-minute self-care action>"},
  "mantra": "<one-line affirmation for today>"
}`;

export async function generateWellnessReport(
  chartData: string,
  birthData: BirthData
): Promise<WellnessReport> {
  const apiKey = getEnv("ANTHROPIC_API_KEY");
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not configured");
  const baseUrl = getEnv("ANTHROPIC_BASE_URL", "https://api.qnaigc.com");

  const userMessage = `${chartData}

Please generate a complete wellness reading for this person. Return ONLY the JSON object as specified.`;

  // Use OpenAI-compatible endpoint (works with Qiniu + most Chinese proxies)
  const response = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 6000,
      temperature: 0.8,
      messages: [
        { role: "system", content: WELLNESS_SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error: ${response.status} ${err}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";
  let jsonStr = content.trim();
  if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  }

  try {
    return JSON.parse(jsonStr) as WellnessReport;
  } catch {
    throw new Error(`Failed to parse AI response as JSON: ${jsonStr.slice(0, 200)}`);
  }
}

export async function generateDailyGuidance(
  chartData: string,
  date: string
): Promise<import("@/types").DailyGuidance> {
  const apiKey = getEnv("ANTHROPIC_API_KEY");
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not configured");
  const baseUrl = getEnv("ANTHROPIC_BASE_URL", "https://api.qnaigc.com");

  const userMessage = `${chartData}

Today's date: ${date}

Generate today's daily wellness guidance for this person based on their Ba Zi chart and today's cosmic energy. Return ONLY the JSON object.`;

  // Use OpenAI-compatible endpoint
  const response = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      temperature: 0.7,
      messages: [
        { role: "system", content: DAILY_SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error: ${response.status} ${err}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";
  let jsonStr = content.trim();
  if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  }

  try {
    return JSON.parse(jsonStr) as import("@/types").DailyGuidance;
  } catch {
    throw new Error(`Failed to parse daily guidance JSON: ${jsonStr.slice(0, 200)}`);
  }
}

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
- End with ONE tiny actionable step they can do in 60 seconds. Not abstract advice — something concrete they can do right now in their kitchen or living room. "Step outside and feel the sun for one minute." "Put your hands on your belly and take three slow breaths."

## Personalization
You will receive a summary of the user's profile. Use it:
- If they prefer "gentle" tone, be extra soft and validating. Start with "Oh, I hear you..."
- If they prefer "direct" tone, be clear and practical. Start with "Here's what's happening..."
- If they prefer "humorous" tone, add a tiny bit of warmth and lightness
- Reference their Day Master element in your reframing when you can
- If they mention recurring themes (kids, marriage, identity), connect your reframing back to that

## Tone
- Use 6th-grade English level — short sentences, simple words
- Warm but never saccharine. Practical but never cold.
- Never say "you must" or "you should" — say "you might try..." or "some moms find..."
- Keep your entire response under 150 words
- NEVER diagnose medical conditions or claim to be therapy

## Response Format
Return ONLY raw JSON. NO markdown, NO code blocks:

{
  "emotionalNote": "one warm sentence validating their specific feeling",
  "elementReframe": "one sentence reframing their feeling through Five Elements or I Ching wisdom, connecting it to their life",
  "suggestion": "one tiny 60-second actionable step they can do right now"
}`;

export async function generateVentResponse(
  userMessage: string,
  profileSummary: string,
  conversationHistory: string
): Promise<VentResponse> {
  const apiKey = getEnv("ANTHROPIC_API_KEY");
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not configured");
  const baseUrl = getEnv("ANTHROPIC_BASE_URL", "https://api.qnaigc.com");

  const systemWithContext = `${VENT_SYSTEM_PROMPT}

User Profile: ${profileSummary || "No profile set yet."}

Recent conversation (last 5 messages):
${conversationHistory || "No prior messages today."}`;

  const response = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      temperature: 0.9,
      messages: [
        { role: "system", content: systemWithContext },
        { role: "user", content: userMessage },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error: ${response.status} ${err}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";
  let jsonStr = content.trim();
  if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  }

  try {
    return JSON.parse(jsonStr) as VentResponse;
  } catch {
    throw new Error(`Failed to parse vent response JSON: ${jsonStr.slice(0, 200)}`);
  }
}

// Legacy — kept for backward compat
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
