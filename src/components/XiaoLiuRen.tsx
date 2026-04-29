"use client";

import { useState, useEffect } from "react";
import { getProfile } from "@/lib/profile";
import type { UserProfile } from "@/types";

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
  palaceCharacteristic?: string;
  palaceCharacteristicEn?: string;
  section1_overall?: string;
  section1_overallEn?: string;
  section2_process?: string;
  section2_processEn?: string;
  section3_outcome?: string;
  section3_outcomeEn?: string;
  section4_advice?: string;
  section4_adviceEn?: string;
  oneLineSummary?: string;
  oneLineSummaryEn?: string;
  interpretation: string;
  interpretationEn: string;
  encouragement?: string;
  encouragementEn?: string;
  level: "quick" | "deep";
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
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DoubaoLiurenResponse | null>(null);
  const [rateLimited, setRateLimited] = useState<string | null>(null);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

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
    setRateLimited(null);

    try {
      const res = await fetch("/api/liuren", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim(),
          solarDate: getTodayString(),
          timeHHMM: getNowTimeString(),
          category: "daily",
        }),
      });

      if (res.status === 429) {
        const data = await res.json();
        setRateLimited(data.error || data.errorEn || "Rate limited");
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

  if (!profile) {
    return (
      <div className="mystic-card rounded-2xl p-8 text-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mystic-card rounded-2xl p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-mystic-700 flex items-center justify-center text-lg">🔮</div>
        <div>
          <h3 className="font-semibold text-white text-sm">
            {lang === "zh" ? "小六壬掌诀推演" : "Xiao Liu Ren Divination"}
          </h3>
          <p className="text-xs text-gray-500">
            {lang === "zh" ? "一事一问 · 掌诀定乾坤" : "One question · palm decides"}
          </p>
        </div>
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
          onKeyDown={(e) => {
            if (e.key === "Enter") handleQuery();
          }}
          placeholder={lang === "zh" ? "例如：这次项目能不能赚钱？合作能不能成？" : "e.g. Will this project succeed? Is this the right time to move?"}
          maxLength={80}
          className="w-full px-4 py-3 rounded-xl bg-mystic-800/50 border border-mystic-700 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gold-400/40 transition-colors"
        />
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
      {result && !loading && <ResultDisplay result={result} lang={lang} />}
    </div>
  );
}

function ResultDisplay({
  result,
  lang,
}: {
  result: DoubaoLiurenResponse;
  lang: "zh" | "en";
}) {
  const auspColor = AUSPICIOUSNESS_COLOR[result.auspiciousness] || "text-gray-400";
  const name = lang === "en" && result.palaceNameEn ? result.palaceNameEn : result.palaceName;
  const elem = lang === "en" && result.elementEn ? result.elementEn : result.element;
  const sym = lang === "en" && result.symbolEn ? result.symbolEn : result.symbol;
  const dir = lang === "en" && result.directionEn ? result.directionEn : result.direction;
  const hasSections = result.section1_overall || result.section1_overallEn;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Palace header card */}
      <div className="text-center space-y-2 p-4 rounded-xl bg-mystic-800/40">
        <div className="text-5xl">{result.palaceName === "大安" ? "🟢" : result.palaceName === "留连" ? "🟡" : result.palaceName === "速喜" ? "🔴" : result.palaceName === "赤口" ? "⚪" : result.palaceName === "小吉" ? "🔵" : "⚫"}</div>
        <div>
          <h3 className="text-2xl font-bold text-white">
            {name}
            {lang === "zh" && result.palaceNameEn && (
              <span className="text-sm text-gray-400 ml-2">{result.palaceNameEn}</span>
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

      {/* 5-section deep reading template */}
      {hasSections && (
        <div className="space-y-3">
          {(result.palaceCharacteristic || result.palaceCharacteristicEn) && (
            <div className="p-3 rounded-xl bg-mystic-800/30 text-center">
              <p className="text-gold-300/80 text-sm">
                {lang === "en" && result.palaceCharacteristicEn
                  ? result.palaceCharacteristicEn
                  : result.palaceCharacteristic}
              </p>
            </div>
          )}

          {(result.section1_overall || result.section1_overallEn) && (
            <SectionBlock
              number="1"
              title={lang === "zh" ? "整体" : "Overall"}
              content={lang === "en" && result.section1_overallEn ? result.section1_overallEn : (result.section1_overall || "")}
              variant="default"
            />
          )}

          {(result.section2_process || result.section2_processEn) && (
            <SectionBlock
              number="2"
              title={lang === "zh" ? "过程特点" : "Process"}
              content={lang === "en" && result.section2_processEn ? result.section2_processEn : (result.section2_process || "")}
              variant="default"
            />
          )}

          {(result.section3_outcome || result.section3_outcomeEn) && (
            <SectionBlock
              number="3"
              title={lang === "zh" ? "结果" : "Outcome"}
              content={lang === "en" && result.section3_outcomeEn ? result.section3_outcomeEn : (result.section3_outcome || "")}
              variant="accent"
            />
          )}

          {(result.section4_advice || result.section4_adviceEn) && (
            <SectionBlock
              number="4"
              title={lang === "zh" ? "建议" : "Advice"}
              content={lang === "en" && result.section4_adviceEn ? result.section4_adviceEn : (result.section4_advice || "")}
              variant="highlight"
            />
          )}

          {(result.oneLineSummary || result.oneLineSummaryEn) && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-gold-400/10 to-mystic-800/30 border border-gold-400/20 text-center">
              <p className="text-xs text-gold-400/70 mb-1">
                {lang === "zh" ? "一句话总结" : "In One Sentence"}
              </p>
              <p className="text-gold-200 font-medium">
                {lang === "en" && result.oneLineSummaryEn ? result.oneLineSummaryEn : (result.oneLineSummary || "")}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Fallback: plain interpretation */}
      {!hasSections && (
        <div className="p-4 rounded-xl bg-mystic-800/30">
          <p className="text-gray-200 text-sm leading-relaxed">
            {lang === "en" && result.interpretationEn ? result.interpretationEn : result.interpretation}
          </p>
        </div>
      )}
    </div>
  );
}

function SectionBlock({
  number,
  title,
  content,
  variant,
}: {
  number: string;
  title: string;
  content: string;
  variant: "default" | "accent" | "highlight";
}) {
  const bg =
    variant === "highlight"
      ? "bg-gold-400/10 border border-gold-400/20"
      : variant === "accent"
      ? "bg-green-400/5 border border-green-400/15"
      : "bg-mystic-800/30";
  const numColor =
    variant === "highlight"
      ? "text-gold-400"
      : variant === "accent"
      ? "text-green-400"
      : "text-gray-400";

  return (
    <div className={`p-4 rounded-xl ${bg} space-y-2`}>
      <p className={`text-xs font-semibold ${numColor}`}>
        {number}、{title}
      </p>
      <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">{content}</p>
    </div>
  );
}
