"use client";

import { useState, useEffect } from "react";
import { getProfile, isMemberActive, getDailyLiurenCount, startFreeTrial } from "@/lib/profile";
import type { UserProfile, QuestionCategory } from "@/types";

const CATEGORIES: { value: QuestionCategory; label: string; labelEn: string; emoji: string }[] = [
  { value: "love", label: "感情", labelEn: "Love", emoji: "💕" },
  { value: "family", label: "家庭", labelEn: "Family", emoji: "🏠" },
  { value: "health", label: "健康", labelEn: "Health", emoji: "🌿" },
  { value: "career", label: "事业", labelEn: "Career", emoji: "💼" },
  { value: "daily", label: "日常", labelEn: "Daily", emoji: "✨" },
];

// New Doubao response shape
interface DoubaoLiurenResponse {
  palaceName: string;
  palaceNameEn: string;
  auspiciousness: string;
  element: string;
  elementEn: string;
  symbol: string;
  symbolEn: string;
  direction: string;
  directionEn: string;
  lunarDate: string;
  solarDate: string;
  timeZhi: string;
  calculation: string;
  interpretation: string;
  interpretationEn: string;
  elementAnalysis?: string;
  elementAnalysisEn?: string;
  actionAdvice?: string;
  actionAdviceEn?: string;
  encouragement?: string;
  encouragementEn?: string;
  category: QuestionCategory;
  level: "quick" | "deep";
  memberActive: boolean;
  timestamp: string;
}

const AUSPICIOUSNESS_COLOR: Record<string, string> = {
  "大吉": "text-green-400",
  "中吉": "text-green-300",
  "小吉": "text-blue-300",
  "小凶": "text-orange-400",
  "中凶": "text-red-400",
  "大凶": "text-red-500",
};

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getNowTimeString(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function XiaoLiuRen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [category, setCategory] = useState<QuestionCategory>("daily");
  const [question, setQuestion] = useState("");
  const [solarDate, setSolarDate] = useState(getTodayString());
  const [timeHHMM, setTimeHHMM] = useState(getNowTimeString());
  const [gender, setGender] = useState<"男" | "女" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DoubaoLiurenResponse | null>(null);
  const [limited, setLimited] = useState(false);
  const [rateLimited, setRateLimited] = useState<string | null>(null);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  const memberActive = profile ? isMemberActive() : false;
  const dailyFreeUsed = profile ? getDailyLiurenCount() : 0;
  const lang = profile?.languagePreference === "en" ? "en" : "zh";

  const handleQuery = async () => {
    if (loading) return;
    if (!question.trim()) {
      setError(lang === "zh" ? "请输入你的占事" : "Please enter your question");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    setLimited(false);
    setRateLimited(null);

    try {
      const res = await fetch("/api/liuren", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim(),
          solarDate,
          timeHHMM,
          gender,
          category,
        }),
      });

      if (res.status === 429) {
        const data = await res.json();
        if (data.limited) {
          setLimited(true);
        } else {
          setRateLimited(data.error || data.errorEn || "Rate limited");
        }
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || data.errorEn || "Something went wrong");
      }

      const data: DoubaoLiurenResponse = await res.json();
      setResult(data);
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
        <h3 className="text-xl font-bold text-white">
          {lang === "zh" ? "今日免费次数已用完" : "Today's Free Reading Used"}
        </h3>
        <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
          {lang === "zh"
            ? "小六壬速断每天可免费使用1次。升级Clara会员即可无限使用，并解锁深度全盘推演。"
            : "Free Xiao Liu Ren readings are limited to 1 per day. Upgrade to Clara Membership for unlimited use with deep multi-dimensional analysis."}
        </p>

        <div className="grid grid-cols-2 gap-3 text-left max-w-md mx-auto mt-4">
          <div className="bg-mystic-800/50 rounded-xl p-3 text-xs space-y-1">
            <p className="text-gray-400 font-medium">{lang === "zh" ? "小六壬速断（免费）" : "Quick Reading (Free)"}</p>
            <p className="text-gray-500">{lang === "zh" ? "✓ 掌诀名称 + 吉凶" : "✓ Palace name + fortune"}</p>
            <p className="text-gray-500">{lang === "zh" ? "✓ 一句话提示" : "✓ One-sentence reading"}</p>
            <p className="text-gray-500">{lang === "zh" ? "✕ 每天仅1次" : "✕ 1 per day only"}</p>
          </div>
          <div className="bg-gold-400/5 border border-gold-400/20 rounded-xl p-3 text-xs space-y-1">
            <p className="text-gold-300 font-medium">{lang === "zh" ? "深度全盘推演（会员）" : "Deep Reading (Member)"}</p>
            <p className="text-gold-300/70">{lang === "zh" ? "✓ 掌诀解读" : "✓ Palace interpretation"}</p>
            <p className="text-gold-300/70">{lang === "zh" ? "✓ 五行生克分析" : "✓ Five Element analysis"}</p>
            <p className="text-gold-300/70">{lang === "zh" ? "✓ 行动建议" : "✓ Action advice"}</p>
            <p className="text-gold-300/70">{lang === "zh" ? "✓ 无限使用" : "✓ Unlimited readings"}</p>
          </div>
        </div>

        <button
          onClick={handleStartTrial}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold-400 to-gold-300 text-mystic-950 font-semibold text-sm hover:from-gold-300 hover:to-gold-200 transition-all shadow-lg"
        >
          {lang === "zh" ? "开始 7 天免费试用 →" : "Start 7-Day Free Trial →"}
        </button>
        <p className="text-xs text-gray-500">
          {lang === "zh" ? "之后 $6.99/月。随时取消。" : "Then $6.99/month. Cancel anytime."}
        </p>
      </div>
    );
  }

  return (
    <div className="mystic-card rounded-2xl p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-mystic-700 flex items-center justify-center text-lg">🔮</div>
        <div>
          <h3 className="font-semibold text-white text-sm">
            {memberActive
              ? (lang === "zh" ? "深度全盘推演" : "Deep Full Reading")
              : (lang === "zh" ? "小六壬速断" : "Xiao Liu Ren Quick")}
          </h3>
          <p className="text-xs text-gray-500">
            {memberActive
              ? (lang === "zh" ? "小六壬 + 五行 + 节气综合推演" : "XLR + Five Elements + Solar Term")
              : (lang === "zh" ? "每日1次免费 · 小六壬掌诀速断" : "1 free/day · Quick palm reading")}
          </p>
        </div>
        {memberActive && (
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-gold-400/15 text-gold-300 border border-gold-400/20">
            Clara Member
          </span>
        )}
        {!memberActive && dailyFreeUsed < 1 && (
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-mystic-700 text-gray-400">
            {lang === "zh" ? `今日剩余 ${1 - dailyFreeUsed} 次` : `${1 - dailyFreeUsed} remaining today`}
          </span>
        )}
      </div>

      {/* Question input */}
      <div className="space-y-1">
        <label className="text-xs text-gray-500">
          {lang === "zh" ? "你想问什么事？" : "What's your question?"}
        </label>
        <input
          type="text"
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value);
            setResult(null);
            setError(null);
          }}
          placeholder={lang === "zh" ? "例如：这次项目能不能赚钱？合作能不能成？" : "e.g. Will this project be profitable? Is this partnership right?"}
          maxLength={80}
          className="w-full px-4 py-3 rounded-xl bg-mystic-800/50 border border-mystic-700 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gold-400/40 transition-colors"
        />
      </div>

      {/* Date + Time row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-gray-500">
            {lang === "zh" ? "公历日期" : "Date"}
          </label>
          <input
            type="date"
            value={solarDate}
            onChange={(e) => setSolarDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-mystic-800/50 border border-mystic-700 text-white text-sm focus:outline-none focus:border-gold-400/40 transition-colors"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-500">
            {lang === "zh" ? "具体时间" : "Time"}
          </label>
          <input
            type="time"
            value={timeHHMM}
            onChange={(e) => setTimeHHMM(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-mystic-800/50 border border-mystic-700 text-white text-sm focus:outline-none focus:border-gold-400/40 transition-colors"
          />
        </div>
      </div>

      {/* Gender (optional) */}
      <div className="space-y-1">
        <label className="text-xs text-gray-500">
          {lang === "zh" ? "性别（可选）" : "Gender (optional)"}
        </label>
        <div className="flex gap-2">
          {(["男", "女"] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGender(gender === g ? null : g)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                gender === g
                  ? "bg-gold-400/20 text-gold-300 border border-gold-400/30"
                  : "bg-mystic-800/50 text-gray-400 hover:bg-mystic-700/50 border border-mystic-700"
              }`}
            >
              {g === "男" ? (lang === "zh" ? "男" : "Male") : (lang === "zh" ? "女" : "Female")}
            </button>
          ))}
        </div>
      </div>

      {/* Category selector */}
      <div className="space-y-2">
        <p className="text-xs text-gray-500">
          {lang === "zh" ? "问事方向" : "Category"}
        </p>
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
              {cat.emoji} {lang === "en" ? cat.labelEn : cat.label}
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
            {lang === "zh" ? "起卦中..." : "Casting..."}
          </span>
        ) : (
          lang === "zh" ? "起卦 →" : "Cast →"
        )}
      </button>

      {/* Rate limited */}
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

      {/* Loading */}
      {loading && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-400">
            {lang === "zh" ? "Clara正在起小六壬掌诀..." : "Clara is casting Xiao Liu Ren..."}
          </p>
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <ResultDisplay result={result} lang={lang} memberActive={memberActive} />
      )}

      {/* Free tier upsell */}
      {result && !memberActive && result.level === "quick" && (
        <div className="p-4 rounded-xl bg-gold-400/5 border border-gold-400/15 text-center space-y-2">
          <p className="text-xs text-gray-400">
            {lang === "zh"
              ? "以上为小六壬速断。升级会员解锁 深度全盘推演——五行生克 · 行动建议 · 个性化指导"
              : "Quick reading shown. Upgrade to unlock deep analysis — Five Elements · Action advice · Personalized guidance"}
          </p>
          <button
            onClick={handleStartTrial}
            className="px-4 py-2 rounded-lg bg-gold-400/15 text-gold-300 text-xs font-semibold hover:bg-gold-400/25 transition-all"
          >
            {lang === "zh" ? "开始 7 天免费试用 →" : "Start 7-Day Free Trial →"}
          </button>
        </div>
      )}
    </div>
  );
}

function ResultDisplay({
  result,
  lang,
  memberActive,
}: {
  result: DoubaoLiurenResponse;
  lang: "zh" | "en";
  memberActive: boolean;
}) {
  const auspColor = AUSPICIOUSNESS_COLOR[result.auspiciousness] || "text-gray-400";
  const name = lang === "en" && result.palaceNameEn ? result.palaceNameEn : result.palaceName;
  const elem = lang === "en" && result.elementEn ? result.elementEn : result.element;
  const sym = lang === "en" && result.symbolEn ? result.symbolEn : result.symbol;
  const dir = lang === "en" && result.directionEn ? result.directionEn : result.direction;
  const interp = lang === "en" && result.interpretationEn ? result.interpretationEn : result.interpretation;
  const elemAnalysis = lang === "en" && result.elementAnalysisEn ? result.elementAnalysisEn : (result.elementAnalysis || "");
  const advice = lang === "en" && result.actionAdviceEn ? result.actionAdviceEn : (result.actionAdvice || "");
  const encourage = lang === "en" && result.encouragementEn ? result.encouragementEn : (result.encouragement || "");

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Palace card */}
      <div className="text-center space-y-2 p-4 rounded-xl bg-mystic-800/40">
        <div className="text-5xl">{result.palaceName === "大安" ? "🟢" : result.palaceName === "留连" ? "🟡" : result.palaceName === "速喜" ? "🔴" : result.palaceName === "赤口" ? "⚪" : result.palaceName === "小吉" ? "🔵" : "⚫"}</div>
        <div>
          <h3 className="text-2xl font-bold text-white">
            {name}
            {lang === "zh" && result.palaceNameEn && (
              <span className="text-sm text-gray-400 ml-2">{result.palaceNameEn}</span>
            )}
            {lang === "en" && result.palaceName && result.palaceNameEn !== result.palaceName && (
              <span className="text-sm text-gray-400 ml-2">{result.palaceName}</span>
            )}
          </h3>
          <p className={`text-sm font-semibold ${auspColor}`}>
            {result.auspiciousness}
            {" · "}
            {elem}{" · "}{dir}{" · "}{sym}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {result.lunarDate} · {result.timeZhi}
          </p>
        </div>
      </div>

      {/* Calculation (collapsible) */}
      {result.calculation && (
        <details className="group">
          <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-400">
            {lang === "zh" ? "计算过程" : "Calculation"}
          </summary>
          <p className="text-gray-500 text-xs mt-1 p-2 rounded-lg bg-mystic-800/30">{result.calculation}</p>
        </details>
      )}

      {/* Interpretation */}
      <div className="p-4 rounded-xl bg-mystic-800/30">
        <p className="text-gray-200 text-sm leading-relaxed">{interp}</p>
      </div>

      {/* Deep sections */}
      {result.level === "deep" && (
        <div className="space-y-3">
          {elemAnalysis && (
            <div className="p-4 rounded-xl bg-mystic-800/30">
              <p className="text-xs text-gold-400 mb-2 font-medium">
                {lang === "zh" ? "五行生克分析" : "Five Element Analysis"}
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">{elemAnalysis}</p>
            </div>
          )}

          {advice && (
            <div className="p-4 rounded-xl bg-gold-400/10 border border-gold-400/20">
              <p className="text-xs text-gold-400 mb-2 font-medium">
                {lang === "zh" ? "行动建议" : "Action Advice"}
              </p>
              <p className="text-gold-200 text-sm leading-relaxed">{advice}</p>
            </div>
          )}

          {encourage && (
            <p className="text-xs text-gray-400 text-center italic">{encourage}</p>
          )}
        </div>
      )}
    </div>
  );
}
