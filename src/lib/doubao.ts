import { readFileSync } from "fs";
import { resolve } from "path";

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

export interface DoubaoOptions {
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: string };
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

  if (options?.response_format) {
    body.response_format = options.response_format;
  }

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
  let jsonStr = content.trim();
  if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  }
  return jsonStr;
}

export function getDoubaoKey(): string {
  return getEnv("DOUBAO_API_KEY");
}
