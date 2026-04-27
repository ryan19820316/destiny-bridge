"use client";

import { useState, useEffect } from "react";
import { getProfile, isMemberActive, getDailyLiurenCount, startFreeTrial } from "@/lib/profile";
import type { UserProfile, QuestionCategory, LiurenPalaceData, LiurenDeepResult, LiurenQuickResult } from "@/types";

const CATEGORIES: { value: QuestionCategory; label: string; emoji: string }[] = [
  { value: "love", label: "感情", emoji: "💕" },
  { value: "family", label: "家庭", emoji: "🏠" },
  { value: "health", label: "健康", emoji: "🌿" },
  { value: "career", label: "事业", emoji: "💼" },
  { value: "daily", label: "日常", emoji: "✨" },
];

const AUSPICIOUSNESS_COLOR: Record<string, string> = {
  "大吉": "text-green-400",
  "中吉": "text-green-300",
  "小吉": "text-blue-300",
  "小凶": "text-orange-400",
  "中凶": "text-red-400",
  "大凶": "text-red-500",
};

export default function XiaoLiuRen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [category, setCategory] = useState<QuestionCategory>("daily");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LiurenQuickResult | LiurenDeepResult | null>(null);
  const [level, setLevel] = useState<"quick" | "deep" | null>(null);
  const [limited, setLimited] = useState(false);
  const [rateLimited, setRateLimited] = useState<string | null>(null);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  const memberActive = profile ? isMemberActive() : false;
  const dailyFreeUsed = profile ? getDailyLiurenCount() : 0;

  const handleQuery = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setLevel(null);
    setLimited(false);
    setRateLimited(null);

    try {
      const res = await fetch("/api/liuren", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category }),
      });

      if (res.status === 429) {
        const data = await res.json();
        setRateLimited(data.error || "请静候时辰更替");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      const data = await res.json();

      if (data.limited) {
        setLimited(true);
        setLoading(false);
        return;
      }

      setResult(data);
      setLevel(data.level);
      // Refresh profile to update daily count
      setProfile(getProfile());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again?");
    } finally {
      setLoading(false);
    }
  };

  const handleStartTrial = () => {
    startFreeTrial();
    setProfile(getProfile());
  };

  if (!profile) {
    return (
      <div className="mystic-card rounded-2xl p-8 text-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  // Free tier, daily limit exhausted
  if (!memberActive && limited) {
    return (
      <div className="mystic-card rounded-2xl p-8 text-center space-y-4">
        <div className="text-4xl">🔮</div>
        <h3 className="text-xl font-bold text-white">今日免费次数已用完</h3>
        <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
          小六壬速断每天可免费使用1次。升级Clara会员即可无限使用，并解锁深度全盘推演——包含五行生克分析、三域详解和每日行动建议。
        </p>

        {/* Comparison table */}
        <div className="grid grid-cols-2 gap-3 text-left max-w-md mx-auto mt-4">
          <div className="bg-mystic-800/50 rounded-xl p-3 text-xs space-y-1">
            <p className="text-gray-400 font-medium">🔮 小六壬速断（免费）</p>
            <p className="text-gray-500">✓ 掌诀名称 + 吉凶</p>
            <p className="text-gray-500">✓ 一句话提示</p>
            <p className="text-gray-500">✕ 每天仅1次</p>
          </div>
          <div className="bg-gold-400/5 border border-gold-400/20 rounded-xl p-3 text-xs space-y-1">
            <p className="text-gold-300 font-medium">🔮 深度全盘推演（会员）</p>
            <p className="text-gold-300/70">✓ 小六壬掌诀解读</p>
            <p className="text-gold-300/70">✓ 五行生克分析</p>
            <p className="text-gold-300/70">✓ 三域详解 + 行动建议</p>
            <p className="text-gold-300/70">✓ 无限使用</p>
          </div>
        </div>

        <button
          onClick={handleStartTrial}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold-400 to-gold-300 text-mystic-950 font-semibold text-sm hover:from-gold-300 hover:to-gold-200 transition-all shadow-lg"
        >
          Start 7-Day Free Trial
        </button>
        <p className="text-xs text-gray-500">Then $6.99/month. Cancel anytime.</p>
      </div>
    );
  }

  return (
    <div className="mystic-card rounded-2xl p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-mystic-700 flex items-center justify-center text-lg">
          🔮
        </div>
        <div>
          <h3 className="font-semibold text-white text-sm">
            {memberActive ? "深度全盘推演" : "小六壬速断"}
          </h3>
          <p className="text-xs text-gray-500">
            {memberActive
              ? "小六壬 + 八字五行 + 节气综合推演"
              : "每日1次免费 · 小六壬掌诀速断"}
          </p>
        </div>
        {memberActive && (
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-gold-400/15 text-gold-300 border border-gold-400/20">
            Clara Member
          </span>
        )}
        {!memberActive && dailyFreeUsed < 1 && (
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-mystic-700 text-gray-400">
            今日剩余 {1 - dailyFreeUsed} 次
          </span>
        )}
      </div>

      {/* Category selector */}
      <div className="space-y-2">
        <p className="text-xs text-gray-500">你想问什么方向？</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setCategory(cat.value);
                setResult(null);
                setError(null);
                setRateLimited(null);
              }}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                category === cat.value
                  ? "bg-gold-400/20 text-gold-300 border border-gold-400/30"
                  : "bg-mystic-800/50 text-gray-400 hover:bg-mystic-700/50"
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Query button */}
      <button
        onClick={handleQuery}
        disabled={loading}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-400 to-gold-300 text-mystic-950 font-semibold text-base hover:from-gold-300 hover:to-gold-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {memberActive ? "正在全盘推演..." : "起卦中..."}
          </span>
        ) : (
          "起卦 →"
        )}
      </button>

      {/* Rate limited message */}
      {rateLimited && (
        <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-300 text-sm text-center">
          {rateLimited}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      {/* Loading state while waiting for AI */}
      {loading && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-400">
            {memberActive
              ? "Clara正在结合你的八字和节气做全盘推演..."
              : "Clara正在解读掌诀..."}
          </p>
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <ResultDisplay result={result} level={level} memberActive={memberActive} />
      )}

      {/* Free tier upgrade CTA after viewing result */}
      {result && !memberActive && level === "quick" && (
        <div className="p-4 rounded-xl bg-gold-400/5 border border-gold-400/15 text-center space-y-2">
          <p className="text-xs text-gray-400">
            以上为小六壬速断。升级会员解锁 <span className="text-gold-300">深度全盘推演</span>——五行生克 · 三域详解 · 每日行动
          </p>
          <button
            onClick={handleStartTrial}
            className="px-4 py-2 rounded-lg bg-gold-400/15 text-gold-300 text-xs font-semibold hover:bg-gold-400/25 transition-all"
          >
            Start 7-Day Free Trial →
          </button>
        </div>
      )}
    </div>
  );
}

function ResultDisplay({
  result,
  level,
  memberActive,
}: {
  result: LiurenQuickResult | LiurenDeepResult;
  level: "quick" | "deep" | null;
  memberActive: boolean;
}) {
  const { palace, lunarDateStr, timeZhi } = result;
  const auspColor = AUSPICIOUSNESS_COLOR[palace.auspiciousness] || "text-gray-400";

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Palace card */}
      <div className="text-center space-y-2 p-4 rounded-xl bg-mystic-800/40">
        <div className="text-5xl">{palace.emoji}</div>
        <div>
          <h3 className="text-2xl font-bold text-white">
            {palace.name}
            <span className="text-sm text-gray-400 ml-2">{palace.nameEn}</span>
          </h3>
          <p className={`text-sm font-semibold ${auspColor}`}>
            {palace.auspiciousness}
            {" · "}
            {palace.element}元素 · {palace.direction}方 · {palace.symbol}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {lunarDateStr} · {timeZhi}时
          </p>
        </div>
      </div>

      {/* Quick interpretation */}
      {level === "quick" && "interpretation" in result && (
        <div className="p-4 rounded-xl bg-mystic-800/30">
          <p className="text-gray-200 text-sm leading-relaxed">
            {result.interpretation}
          </p>
        </div>
      )}

      {/* Deep interpretation */}
      {level === "deep" && "deepInterpretation" in result && (
        <div className="space-y-3">
          {/* Main interpretation */}
          <div className="p-4 rounded-xl bg-mystic-800/30">
            <p className="text-xs text-gold-400 mb-2 font-medium">掌诀解读</p>
            <p className="text-gray-200 text-sm leading-relaxed">
              {(result as LiurenDeepResult).deepInterpretation}
            </p>
          </div>

          {/* Element analysis */}
          <div className="p-4 rounded-xl bg-mystic-800/30">
            <p className="text-xs text-gold-400 mb-2 font-medium">五行生克分析</p>
            <p className="text-gray-300 text-sm leading-relaxed">
              {(result as LiurenDeepResult).elementAnalysis}
            </p>
          </div>

          {/* Domain analysis */}
          <div className="p-4 rounded-xl bg-mystic-800/30">
            <p className="text-xs text-gold-400 mb-2 font-medium">专题分析</p>
            <p className="text-gray-300 text-sm leading-relaxed">
              {(result as LiurenDeepResult).domainAnalysis}
            </p>
          </div>

          {/* Action advice */}
          <div className="p-4 rounded-xl bg-gold-400/10 border border-gold-400/20">
            <p className="text-xs text-gold-400 mb-2 font-medium">今日行动建议</p>
            <p className="text-gold-200 text-sm leading-relaxed">
              {(result as LiurenDeepResult).actionAdvice}
            </p>
          </div>
        </div>
      )}

      {/* Verse */}
      <p className="text-xs text-gray-600 text-center italic">
        &ldquo;{palace.classicVerse}&rdquo;
      </p>
    </div>
  );
}
