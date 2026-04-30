/**
 * 三模型对比测试 — 六爻版
 * 服务端统一装卦，AI 只解读
 *
 * 用法：
 *   npx tsx scripts/compare-models-liuyao.ts
 */

import { buildDivination } from "../src/lib/liuyao/engine";
import type { CoinTossLine } from "../src/lib/liuyao/types";

const TEST_QUESTION = "我今天去面试顺利吗？";
const TEST_DATE = "2026-04-30";
const TEST_GENDER = "female";

// Simulated coin toss lines
const testLines: CoinTossLine[] = [
  { position: 1, type: "yang", isYang: true, isMoving: false },
  { position: 2, type: "yin", isYang: false, isMoving: false },
  { position: 3, type: "oldYang", isYang: true, isMoving: true },
  { position: 4, type: "yin", isYang: false, isMoving: false },
  { position: 5, type: "yang", isYang: true, isMoving: false },
  { position: 6, type: "oldYin", isYang: false, isMoving: true },
];

const [y, m, d] = TEST_DATE.split("-").map(Number);
const divination = buildDivination(testLines, new Date(y, m - 1, d));
const orig = divination.originalHexagram;
const changed = divination.changedHexagram;

// Build pre-computed info (same as API route)
const assembledLinesStr = divination.assembledLines
  .map((l) =>
    `第${l.position}爻：${l.branch}(${l.branchElement}) — ${l.liuqin} — ${l.liushen}` +
    (l.isShi ? " (世爻)" : "") + (l.isYing ? " (应爻)" : "") +
    (l.isMoving ? " [动爻]" : "")
  )
  .join("\n");

const precomputedInfo = [
  `六爻排盘（已由服务端完成，请勿重新计算）：`,
  ``,
  `本卦：${orig.name}（${orig.palace}，属${orig.palaceElement}）`,
  `变卦：${changed.name === orig.name ? "无（静卦）" : changed.name}`,
  `动爻数：${divination.assembledLines.filter(l => l.isMoving).length}`,
  `月建：${divination.monthBranch}`,
  `日辰：${divination.dayStem}${divination.dayBranch}`,
  ``,
  `=== 装卦 ===`,
  assembledLinesStr,
  ``,
  `用户问题：${TEST_QUESTION}`,
  `日期：${TEST_DATE}`,
  `性别：${TEST_GENDER}`,
  `问事：事业/工作 → 用神：官鬼`,
  ``,
  `请给出30字以内的中文解读。`,
].join("\n");

const SYSTEM_PROMPT = `你是东方命理顾问 Clara。卦盘已由服务端装好，你只负责解读。输出简短中文。`;

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
          { role: "user", content: precomputedInfo },
        ],
        temperature: 0.7,
        max_tokens: 300,
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
    return;
  }

  const movingCount = divination.assembledLines.filter(l => l.isMoving).length;
  console.log(`\n📋 测试问题：${TEST_QUESTION}`);
  console.log(`📅 参数：${TEST_DATE} ${TEST_GENDER}`);
  console.log(`🔮 服务端装卦：${orig.name} → ${changed.name !== orig.name ? changed.name : "静卦"} | ${orig.palace} | 动爻${movingCount}个`);
  console.log(`📐 月建：${divination.monthBranch} | 日辰：${divination.dayStem}${divination.dayBranch}\n`);
  console.log("=".repeat(60));

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

  console.log("\n🏆 速度排名：");
  results
    .filter((r) => !r.error)
    .sort((a, b) => a.timeSec - b.timeSec)
    .forEach((r, i) => {
      console.log(`  ${i + 1}. ${r.model} — ${r.timeSec.toFixed(1)}s`);
    });
}

main().catch(console.error);
