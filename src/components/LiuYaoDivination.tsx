"use client";

import { useState, useEffect } from "react";
import { getProfile, isMemberActive, getDailyLiurenCount } from "@/lib/profile";
import type { UserProfile } from "@/types";
import type {
  CoinTossLine,
  AssembledLine,
  LiuYaoQuickResult,
  LiuYaoDeepResult,
  QuestionCategory,
} from "@/lib/liuyao/types";

const CATEGORIES: { value: QuestionCategory; label: string; emoji: string }[] = [
  { value: "love", label: "感情", emoji: "💕" },
  { value: "career", label: "事业", emoji: "💼" },
  { value: "wealth", label: "财运", emoji: "💰" },
  { value: "health", label: "健康", emoji: "🌿" },
  { value: "daily", label: "日常", emoji: "✨" },
];

const LINE_LABEL: Record<number, string> = { 1: "初", 2: "二", 3: "三", 4: "四", 5: "五", 6: "上" };

function LineSymbol({ line }: { line: { isYang: boolean; isMoving: boolean } }) {
  if (line.isYang && line.isMoving) return <span className="text-amber-400 text-lg">○</span>;
  if (!line.isYang && line.isMoving) return <span className="text-rose-400 text-lg">×</span>;
  if (line.isYang) return <span className="text-white text-lg">—</span>;
  return <span className="text-gray-500 text-lg">- -</span>;
}

export default function LiuYaoDivination() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [category, setCategory] = useState<QuestionCategory>("daily");
  const [phase, setPhase] = useState<"idle" | "tossing" | "revealed" | "loading" | "done" | "error">("idle");
  const [lines, setLines] = useState<CoinTossLine[]>([]);
  const [tossStep, setTossStep] = useState(0);
  const [result, setResult] = useState<LiuYaoQuickResult | LiuYaoDeepResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState<string | null>(null);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  const memberActive = profile ? isMemberActive() : false;
  const dailyFreeUsed = profile ? getDailyLiurenCount() : 0;

  const startToss = () => {
    setError(null);
    setRateLimited(null);
    setResult(null);
    setPhase("tossing");
    setTossStep(0);

    // Animate 6 tosses
    const newLines: CoinTossLine[] = [];
    let step = 0;
    const interval = setInterval(() => {
      const coins = [
        Math.random() < 0.5 ? "back" : "face",
        Math.random() < 0.5 ? "back" : "face",
        Math.random() < 0.5 ? "back" : "face",
      ];
      const backs = coins.filter((c) => c === "back").length;
      let type: CoinTossLine["type"];
      let isYang: boolean;
      let isMoving: boolean;
      if (backs === 0) {
        type = "oldYin"; isYang = false; isMoving = true;
      } else if (backs === 1) {
        type = "yang"; isYang = true; isMoving = false;
      } else if (backs === 2) {
        type = "yin"; isYang = false; isMoving = false;
      } else {
        type = "oldYang"; isYang = true; isMoving = true;
      }
      newLines.push({ position: step + 1, type, isYang, isMoving });
      setLines([...newLines]);
      setTossStep(step + 1);
      step++;

      if (step >= 6) {
        clearInterval(interval);
        setPhase("revealed");
      }
    }, 600);
  };

  const handleQuery = async (deep: boolean) => {
    if (phase === "loading") return;
    setPhase("loading");
    setError(null);

    try {
      const res = await fetch("/api/liuyao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, deep }),
      });

      if (res.status === 429) {
        const data = await res.json();
        setRateLimited(data.error || "请静候时辰更替");
        setPhase("error");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Divination failed");
      }

      const data = await res.json();
      setResult(data);
      setPhase("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setPhase("error");
    }
  };

  const reset = () => {
    setPhase("idle");
    setLines([]);
    setTossStep(0);
    setResult(null);
    setError(null);
    setRateLimited(null);
  };

  // Trigrams from lines
  const upperLines = lines.filter((l) => l.position >= 4);
  const lowerLines = lines.filter((l) => l.position <= 3);

  return (
    <div className="space-y-6">
      {/* Category selector */}
      {phase === "idle" && (
        <>
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category === c.value
                    ? "bg-gold-400/20 text-gold-300 border border-gold-400/40"
                    : "bg-mystic-800/50 text-gray-400 border border-mystic-700 hover:border-mystic-600"
                }`}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>

          <div className="text-center space-y-3">
            <p className="text-gray-400 text-sm">
              心中默念所求之事，然后摇动铜钱
            </p>
            {!memberActive && (
              <p className="text-xs text-gold-400/70">
                免费用户每日 1 次快速占卜 · 会员无限深度解读
              </p>
            )}
            <button
              onClick={startToss}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-gold-400 to-gold-300 text-mystic-950 font-semibold text-lg hover:from-gold-300 hover:to-gold-200 transition-all shadow-lg"
            >
              🪙 摇铜钱起卦
            </button>
          </div>
        </>
      )}

      {/* Tossing animation */}
      {phase === "tossing" && (
        <div className="space-y-4">
          <p className="text-center text-gold-300 font-medium">
            {tossStep < 6 ? `摇第 ${tossStep + 1} 次...` : "卦成！"}
          </p>
          <div className="space-y-2 max-w-xs mx-auto">
            {[5, 4, 3, 2, 1, 0].map((i) => {
              const line = i < lines.length ? lines[i] : null;
              return (
                <div
                  key={i}
                  className={`flex items-center justify-center gap-3 py-2 rounded-lg transition-all ${
                    i === tossStep - 1 ? "bg-gold-400/10 border border-gold-400/30" : ""
                  } ${line ? "" : "opacity-30"}`}
                >
                  <span className="text-xs text-gray-500 w-6">{i + 1 < lines.length ? `${LINE_LABEL[i + 1]}爻` : `${LINE_LABEL[i + 1]}爻`}</span>
                  {line ? (
                    <LineSymbol line={line} />
                  ) : (
                    <span className="text-gray-700 text-lg animate-pulse">···</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Revealed - hexagram preview */}
      {phase === "revealed" && (
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-gold-300 font-medium mb-2">卦象已成</p>
            {/* Upper trigram */}
            <div className="space-y-1 max-w-[120px] mx-auto border border-gold-400/20 rounded-xl p-4 bg-mystic-800/30">
              {[5, 4, 3, 2, 1, 0].map((i) => {
                const line = lines[i];
                return (
                  <div key={i} className="flex items-center justify-center gap-2 text-sm">
                    <span className="text-gray-500 text-xs shrink-0">{LINE_LABEL[i + 1]}爻</span>
                    <LineSymbol line={line} />
                    <span className="text-gray-500 text-xs shrink-0">
                      {line.type === "yang" ? "少阳" : line.type === "yin" ? "少阴" : line.type === "oldYang" ? "老阳" : "老阴"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleQuery(false)}
              className="px-6 py-3 rounded-xl bg-mystic-800 border border-mystic-600 text-white font-semibold hover:bg-mystic-700 transition-all"
            >
              🔮 快速解卦
            </button>
            {memberActive ? (
              <button
                onClick={() => handleQuery(true)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold-400 to-gold-300 text-mystic-950 font-semibold hover:from-gold-300 hover:to-gold-200 transition-all"
              >
                ✨ AI 深度解读
              </button>
            ) : (
              <button
                onClick={() => handleQuery(false)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold-400 to-gold-300 text-mystic-950 font-semibold opacity-50 cursor-not-allowed"
                title="会员专属"
              >
                ✨ AI 深度解读（会员）
              </button>
            )}
          </div>

          <button onClick={reset} className="block mx-auto text-sm text-gray-500 hover:text-gray-400 underline underline-offset-4">
            重新摇卦
          </button>
        </div>
      )}

      {/* Loading */}
      {phase === "loading" && (
        <div className="text-center space-y-4 py-8">
          <div className="mx-auto w-12 h-12 rounded-full bg-gold-400/20 flex items-center justify-center">
            <svg className="animate-spin w-6 h-6 text-gold-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <p className="text-gray-400">解卦中，请稍候...</p>
        </div>
      )}

      {/* Result */}
      {phase === "done" && result && (
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-white">
              {result.hexagramName}
              {result.changedHexagramName && (
                <span className="text-gold-400"> → {result.changedHexagramName}</span>
              )}
            </h3>
            <p className="text-gray-400 text-sm">
              {result.palace}({result.palaceElement})
              {result.isJingGua ? " · 静卦" : " · 有动爻"}
            </p>
          </div>

          {/* Hexagram line display */}
          <div className="mystic-card rounded-2xl p-5 space-y-2 max-w-sm mx-auto">
            <div className="text-xs text-gray-500 mb-2 grid grid-cols-[2rem_2rem_2rem_3rem_4rem_3rem_2rem] gap-1 text-center">
              <span>爻</span><span>象</span><span>地支</span><span>六亲</span><span>六神</span><span>标记</span>
            </div>
            {[...result.assembledLines].reverse().map((l) => (
              <div
                key={l.position}
                className={`grid grid-cols-[2rem_2rem_2rem_3rem_4rem_3rem_2rem] gap-1 text-center items-center text-sm rounded-lg py-1.5 ${
                  l.isMoving ? "bg-gold-400/5" : l.isShi ? "bg-blue-400/5" : l.isYing ? "bg-green-400/5" : ""
                }`}
              >
                <span className="text-gray-500 text-xs">{LINE_LABEL[l.position]}</span>
                <LineSymbol line={l} />
                <span className="text-gray-300 text-xs">{l.branch}</span>
                <span className={`text-xs ${l.liuqin === "官鬼" ? "text-red-400" : l.liuqin === "妻财" ? "text-green-400" : l.liuqin === "子孙" ? "text-blue-400" : l.liuqin === "兄弟" ? "text-orange-400" : "text-purple-400"}`}>
                  {l.liuqin}
                </span>
                <span className="text-gray-500 text-xs">{l.liushen}</span>
                <span className="text-xs">
                  {l.isShi && <span className="text-blue-400">世</span>}
                  {l.isYing && <span className="text-green-400">应</span>}
                </span>
              </div>
            ))}
          </div>

          {/* Interpretation */}
          <div className="mystic-card rounded-2xl p-6 space-y-4">
            <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {result.interpretation}
            </pre>

            {"aiInterpretation" in result && result.aiInterpretation && (
              <>
                <hr className="border-mystic-700" />
                <div className="space-y-3">
                  <h4 className="text-gold-400 font-medium">✨ Clara 深度解读</h4>
                  <p className="text-gray-200 leading-relaxed">{result.aiInterpretation}</p>
                  {result.elementAnalysis && (
                    <div className="p-3 rounded-xl bg-mystic-800/50">
                      <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">五行分析</p>
                      <p className="text-gray-300 text-sm">{result.elementAnalysis}</p>
                    </div>
                  )}
                  {result.actionAdvice && (
                    <div className="p-3 rounded-xl bg-gold-400/5 border border-gold-400/20">
                      <p className="text-xs text-gold-400 uppercase tracking-widest mb-1">行动建议</p>
                      <p className="text-gray-300 text-sm">{result.actionAdvice}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <button
            onClick={reset}
            className="block mx-auto text-sm text-gold-400 hover:text-gold-300 underline underline-offset-4"
          >
            再卜一卦 →
          </button>
        </div>
      )}

      {/* Error */}
      {phase === "error" && (
        <div className="text-center space-y-4">
          <p className="text-red-400">{error || rateLimited}</p>
          <button onClick={reset} className="text-gold-400 hover:text-gold-300 text-sm underline underline-offset-4">
            重新开始
          </button>
        </div>
      )}
    </div>
  );
}
