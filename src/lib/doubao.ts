function getEnv(key: string, fallback = ""): string {
  return process.env[key] || fallback;
}

export interface DoubaoOptions {
  temperature?: number;
  max_tokens?: number;
}

export async function callDoubao(
  systemPrompt: string,
  userMessage: string,
  options?: DoubaoOptions
): Promise<string> {
  const apiKey = getEnv("DOUBAO_API_KEY");
  if (!apiKey) throw new Error("DOUBAO_API_KEY is not configured");
  const baseUrl = getEnv("DOUBAO_BASE_URL", "https://ark.cn-beijing.volces.com/api/v3");
  const model = getEnv("DOUBAO_MODEL", "doubao-pro-32k");

  const body: Record<string, unknown> = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.max_tokens ?? 2000,
  };

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Doubao API error: ${response.status} ${err}`);
  }

  const data = await response.json();
  const content: string = data.choices?.[0]?.message?.content || "";
  return content.trim();
}

export function parseJsonFromLLM(content: string): string {
  let text = content.trim();

  // Strategy 1: Extract from markdown code block (anywhere in text)
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    text = fenced[1].trim();
  }

  // Strategy 2: Find the outermost balanced { } or [ ] pair
  if (!text.startsWith("{") && !text.startsWith("[")) {
    const objStart = text.indexOf("{");
    const arrStart = text.indexOf("[");
    const start = objStart === -1 ? arrStart : arrStart === -1 ? objStart : Math.min(objStart, arrStart);
    if (start !== -1) {
      text = extractBalancedBlock(text, start);
    }
  }

  // Strategy 3: If it starts with { or [ but is truncated, try to repair
  text = repairTruncatedJson(text);

  return text;
}

function extractBalancedBlock(input: string, start: number): string {
  const open = input[start];
  const close = open === "{" ? "}" : "]";
  let depth = 0;
  let end = start;
  for (let i = start; i < input.length; i++) {
    if (input[i] === open) depth++;
    else if (input[i] === close) {
      depth--;
      if (depth === 0) { end = i + 1; break; }
    }
  }
  return end > start ? input.slice(start, end) : input.slice(start);
}

function repairTruncatedJson(text: string): string {
  // If the string ends properly, no repair needed
  const trimmed = text.trim();
  if (trimmed.endsWith("}") || trimmed.endsWith("]")) return trimmed;

  // Count open vs close brackets
  let braces = 0, brackets = 0;
  let inString = false, escape = false;
  for (const ch of trimmed) {
    if (escape) { escape = false; continue; }
    if (ch === "\\" && inString) { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === "{") braces++;
    else if (ch === "}") braces--;
    else if (ch === "[") brackets++;
    else if (ch === "]") brackets--;
  }

  let repaired = trimmed;
  // Close strings if open
  if (inString) repaired += '"';
  // Close brackets before braces (standard JSON nesting)
  while (brackets > 0) { repaired += "]"; brackets--; }
  while (braces > 0) { repaired += "}"; braces--; }

  return repaired;
}

export function safeJsonParse<T>(content: string, fallback?: T, label?: string): T {
  const jsonStr = parseJsonFromLLM(content);
  try {
    return JSON.parse(jsonStr) as T;
  } catch (e) {
    // Try stripping trailing commas (common LLM mistake)
    const cleaned = jsonStr.replace(/,\s*([}\]])/g, "$1");
    try {
      return JSON.parse(cleaned) as T;
    } catch {
      if (fallback !== undefined) return fallback;
      const context = label ? ` for ${label}` : "";
      throw new Error(
        `JSON parse failed${context}. Raw (first 300 chars): ${jsonStr.slice(0, 300)}`
      );
    }
  }
}

export async function callDoubaoWithRetry(
  systemPrompt: string,
  userMessage: string,
  options?: DoubaoOptions,
  maxRetries = 1
): Promise<string> {
  let lastErr: Error | null = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const content = await callDoubao(systemPrompt, userMessage, options);
      parseJsonFromLLM(content); // Validate extractable JSON exists
      return content;
    } catch (e) {
      lastErr = e instanceof Error ? e : new Error(String(e));
      if (attempt === maxRetries) break;
    }
  }
  throw lastErr || new Error("callDoubaoWithRetry exhausted retries");
}

export function getDoubaoKey(): string {
  return getEnv("DOUBAO_API_KEY");
}
