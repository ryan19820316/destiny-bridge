/**
 * 三模型对比测试：同一道小六壬题，看速度 + 内容
 *
 * 用法：
 *   npx tsx scripts/compare-models.ts
 *
 * 前置条件：
 *   .env.local 中添加：
 *   DEEPSEEK_API_KEY=sk-xxx
 *   QWEN_API_KEY=sk-xxx
 */

const TEST_QUESTION = "我今天去面试顺利吗？";
const TEST_DATE = "2026-04-30";
const TEST_TIME = "14:30";
const TEST_GENDER = "female";

// 小六壬 system prompt（精简版，通用）
const SYSTEM_PROMPT = `你是东方命理顾问 Clara，答应用户用小六壬占卜的问题。

规则：公历推算 月+日+时 → (月-1+日-1+时-1)%6+1 定宫位。
1大安2留连3速喜4赤口5小吉6空亡。

输出 JSON（只输出 JSON，不输出别的）：
{
  "palaceName": "宫名",
  "fortune": "吉/凶/中等",
  "interpretation": "结合问题解读（50字以内）",
  "advice": "建议（30字以内）"
}`;

interface ModelConfig {
  name: string;
  url: string;
  apiKey: string;
  model: string;
}

interface TestResult {
  model: string;
  timeSec: number;
  output: string;
  error?: string;
}

async function callModel(config: ModelConfig): Promise<TestResult> {
  const t0 = Date.now();
  try {
    const res = await fetch(config.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `问题：${TEST_QUESTION}\n日期：${TEST_DATE} ${TEST_TIME}\n性别：${TEST_GENDER}` },
        ],
        temperature: 0.7,
        max_tokens: 600,
      }),
    });

    if (!res.ok) {
      return {
        model: config.name,
        timeSec: (Date.now() - t0) / 1000,
        output: "",
        error: `${res.status} ${await res.text().catch(() => "")}`,
      };
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "";
    return {
      model: config.name,
      timeSec: (Date.now() - t0) / 1000,
      output: content,
    };
  } catch (e) {
    return {
      model: config.name,
      timeSec: (Date.now() - t0) / 1000,
      output: "",
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

function getEnv(key: string): string {
  return process.env[key] || "";
}

async function main() {
  const models: (ModelConfig | null)[] = [
    getEnv("DOUBAO_API_KEY")
      ? {
          name: "豆包 Doubao",
          url: `${getEnv("DOUBAO_BASE_URL") || "https://ark.cn-beijing.volces.com/api/v3"}/chat/completions`,
          apiKey: getEnv("DOUBAO_API_KEY"),
          model: getEnv("DOUBAO_MODEL") || "doubao-pro-32k",
        }
      : null,
    getEnv("DEEPSEEK_API_KEY")
      ? {
          name: "DeepSeek V3",
          url: "https://api.deepseek.com/chat/completions",
          apiKey: getEnv("DEEPSEEK_API_KEY"),
          model: "deepseek-chat",
        }
      : null,
    getEnv("QWEN_API_KEY")
      ? {
          name: "通义千问 Qwen",
          url: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
          apiKey: getEnv("QWEN_API_KEY"),
          model: "qwen-turbo",
        }
      : null,
  ];

  const active = models.filter(Boolean) as ModelConfig[];
  if (active.length < 2) {
    console.log("至少需要配置 2 个 API key 才能对比。当前仅配置了：");
    active.forEach((m) => console.log(`  ✓ ${m.name}`));
    console.log("\n请注册并在 .env.local 中添加：");
    console.log("  DEEPSEEK_API_KEY=sk-xxx    https://platform.deepseek.com");
    console.log("  QWEN_API_KEY=sk-xxx        https://bailian.console.aliyun.com");
    return;
  }

  console.log(`\n📋 测试问题：${TEST_QUESTION}\n📅 参数：${TEST_DATE} ${TEST_TIME} ${TEST_GENDER}\n`);
  console.log("=" .repeat(60));

  const results = await Promise.all(active.map((m) => callModel(m)));

  for (const r of results) {
    console.log(`\n🏮 ${r.model}`);
    console.log(`⏱️  ${r.timeSec.toFixed(1)}s`);
    if (r.error) {
      console.log(`❌ ${r.error}`);
    } else {
      console.log(`📝 ${r.output}`);
    }
    console.log("—".repeat(40));
  }

  // Speed ranking
  console.log("\n🏆 速度排名：");
  results
    .filter((r) => !r.error)
    .sort((a, b) => a.timeSec - b.timeSec)
    .forEach((r, i) => {
      console.log(`  ${i + 1}. ${r.model} — ${r.timeSec.toFixed(1)}s`);
    });
}

main().catch(console.error);
