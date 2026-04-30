"use client";

import { useState, useEffect } from "react";
import { getProfile } from "@/lib/profile";
import type { UserProfile } from "@/types";
import type { CoinTossLine } from "@/lib/liuyao/types";

type Lang = "zh" | "en";

const T = {
  questionLabel: { zh: "你想问什么事？（一事一问）", en: "What's your question? (one topic per reading)" },
  questionPlaceholder: { zh: "例如：这次投资能不能赚？我和他能不能复合？", en: "e.g. Will this investment pay off? Will we get back together?" },
  genderLabel: { zh: "性别", en: "Gender" },
  male: { zh: "男", en: "Male" },
  female: { zh: "女", en: "Female" },
  tossCoins: { zh: "开始掷硬币", en: "Toss Coins" },
  aiDeep: { zh: "AI 深度解读", en: "AI Deep Reading" },
  retoss: { zh: "重新摇卦", en: "Toss Again" },
  interpreting: { zh: "解卦中，请稍候...", en: "Interpreting your hexagram..." },
  again: { zh: "再卜一卦 →", en: "Ask Another →" },
  staticHexagram: { zh: "静卦", en: "Static" },
  movingCount: { zh: "个动爻", en: " moving" },
  shi: { zh: "世", en: "Self" },
  ying: { zh: "应", en: "Other" },
  positionLabel: { zh: "爻位", en: "Pos" },
  symbolLabel: { zh: "爻象", en: "Symbol" },
  branchLabel: { zh: "地支", en: "Branch" },
  liuqinLabel: { zh: "六亲", en: "Relation" },
  liushenLabel: { zh: "六神", en: "Spirit" },
  markersLabel: { zh: "标记", en: "Mark" },
  fortuneTitle: { zh: "总体判断", en: "Verdict" },
  linesTitle: { zh: "六爻排盘", en: "Six Lines" },
  fillQuestion: { zh: "请先填写你的占事", en: "Please enter your question first" },
  fillGender: { zh: "请选择性别", en: "Please select your gender" },
  fillBirth: { zh: "请填写出生日期", en: "Please enter your birth date" },
  birthYearLabel: { zh: "出生年", en: "Birth Year" },
  birthMonthLabel: { zh: "月", en: "Month" },
  birthDayLabel: { zh: "日", en: "Day" },
  birthHint: { zh: "用于八字排盘，结合六爻给出更个性化解读", en: "Used for Ba Zi chart — gives you a more personalized reading" },
  ceremonyTitle: { zh: "掷币仪式", en: "Coin Ritual" },
  ceremonyText: {
    zh: "为了保证准确性，请静心认真默想要占卜的事项，认真完成每一次的掷硬币。硬币越古老越好。请准备三枚相同的硬币，静心默想你的问题后，掷下硬币，根据三枚硬币的正背面分布，选择对应的爻象。",
    en: "For an accurate reading, quietly focus on your question before each toss. Older coins work better. Prepare three identical coins, focus on your question, toss them, then select the matching result based on how many heads/tails you see.",
  },
  tossStepTitle: { zh: "第 {n} 次掷硬币", en: "Toss #{n}" },
  tossStepDesc: { zh: "掷下三枚硬币，记录正背面结果", en: "Toss three coins and record the result" },
  tossGuide: { zh: "如何判断结果", en: "How to read results" },
  tossGuideContent: {
    zh: "三枚硬币掷下后，数「背面」的数量：\n0个背面（全正面）→ 老阳 ○\n1个背面 → 少阳 —\n2个背面 → 少阴 - -\n3个背面（全背面）→ 老阴 ×",
    en: "After tossing three coins, count the number of tails:\n0 tails (all heads) → Old Yang ○\n1 tail → Yang —\n2 tails → Yin - -\n3 tails (all tails) → Old Yin ×",
  },
  hexagramReady: { zh: "卦象已成，请选择解读方式", en: "Your hexagram is ready" },
  oldYang: { zh: "老阳 ○", en: "Old Yang ○" },
  yang: { zh: "少阳 —", en: "Yang —" },
  yin: { zh: "少阴 - -", en: "Yin - -" },
  oldYin: { zh: "老阴 ×", en: "Old Yin ×" },
  cancel: { zh: "取消", en: "Cancel" },
  section1Title: { zh: "起卦排盘", en: "Hexagram Setup" },
  section2Title: { zh: "用神与旺衰（重点）", en: "Focus Spirit & Strength" },
  section3Title: { zh: "卦象与过程", en: "Hexagram & Process" },
  section4Title: { zh: "吉凶结论", en: "Fortune Verdict" },
  section5Title: { zh: "应期", en: "Timing" },
  section6Title: { zh: "风险提醒", en: "Risk Warnings" },
  oneLineSummaryTitle: { zh: "一句话总结", en: "In One Sentence" },
  monthBranchLabel: { zh: "月建", en: "Month Branch" },
  dayBranchLabel: { zh: "日辰", en: "Day Branch" },
  deepReadingTitle: { zh: "Clara 深度解读", en: "Clara Deep Reading" },
  lineLabel: {
    1: { zh: "初爻", en: "L1" }, 2: { zh: "二爻", en: "L2" }, 3: { zh: "三爻", en: "L3" },
    4: { zh: "四爻", en: "L4" }, 5: { zh: "五爻", en: "L5" }, 6: { zh: "上爻", en: "L6" },
  } as Record<number, Record<Lang, string>>,
};

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function LineSymbol({ line }: { line: { isYang: boolean; isMoving: boolean } }) {
  if (line.isYang && line.isMoving) return <span className="text-amber-400 text-xl font-bold">○</span>;
  if (!line.isYang && line.isMoving) return <span className="text-rose-400 text-xl font-bold">×</span>;
  if (line.isYang) return <span className="text-white text-xl">━━━</span>;
  return <span className="text-gray-500 text-xl">━ ━</span>;
}

function HexagramDisplay({
  lines,
  lang,
}: {
  lines: { isYang: boolean; isMoving: boolean; position: number }[];
  lang: Lang;
}) {
  return (
    <div className="space-y-[2px] max-w-[160px] mx-auto">
      {[...lines].reverse().map((line) => {
        const posIdx = (6 - [...lines].reverse().indexOf(line));
        return (
          <div key={line.position} className="flex items-center justify-center gap-2 py-1">
            <span className="text-[10px] text-gray-500 w-7 text-right shrink-0">
              {T.lineLabel[line.position]?.[lang] ?? `L${line.position}`}
            </span>
            <LineSymbol line={line} />
          </div>
        );
      })}
    </div>
  );
}

interface DoubaoLine {
  position: number;
  isYang: boolean;
  isMoving: boolean;
  branch: string;
  branchElement: string;
  branchElementEn: string;
  liuqin: string;
  liuqinEn: string;
  liushen: string;
  liushenEn: string;
  isShi: boolean;
  isYing: boolean;
}

interface DoubaoLiuyaoResponse {
  hexagramName: string;
  hexagramNameEn: string;
  changedHexagramName: string;
  changedHexagramNameEn: string;
  palace: string;
  palaceEn: string;
  palaceElement: string;
  palaceElementEn: string;
  isJingGua: boolean;
  movingLineCount: number;
  monthBranch: string;
  monthBranchEn: string;
  dayBranch: string;
  dayBranchEn: string;
  lines: DoubaoLine[];
  yongShen: string;
  yongShenEn: string;
  yongShenStrength: string;
  yongShenStrengthEn: string;
  section1_shexagramSetup?: string;
  section1_shexagramSetupEn?: string;
  section2_yongShenAnalysis?: string;
  section2_yongShenAnalysisEn?: string;
  section3_hexagramProcess?: string;
  section3_hexagramProcessEn?: string;
  fortuneVerdict: string;
  fortuneVerdictEn: string;
  section4_conclusion?: string;
  section4_conclusionEn?: string;
  section5_timing?: string;
  section5_timingEn?: string;
  section6_risks?: string;
  section6_risksEn?: string;
  interpretation: string;
  interpretationEn: string;
  actionAdvice?: string;
  actionAdviceEn?: string;
  oneLineSummary?: string;
  oneLineSummaryEn?: string;
  level: "quick" | "deep";
  memberActive: boolean;
  timestamp: string;
}

function SectionBlock({
  number,
  title,
  content,
  highlight,
  accent,
  warn,
}: {
  number: string;
  title: string;
  content: string;
  highlight?: boolean;
  accent?: boolean;
  warn?: boolean;
  lang?: Lang;
}) {
  const bg = highlight
    ? "bg-gold-400/5 border border-gold-400/15"
    : accent
    ? "bg-green-400/5 border border-green-400/15"
    : warn
    ? "bg-amber-500/5 border border-amber-500/15"
    : "bg-mystic-800/30";
  const numColor = highlight
    ? "text-gold-300"
    : accent
    ? "text-green-400"
    : warn
    ? "text-amber-400"
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

type Phase = "idle" | "manual-toss" | "revealed" | "loading" | "done" | "error";

type TossType = "oldYang" | "yang" | "yin" | "oldYin";

const TOSS_DESC: Record<TossType, Record<Lang, string>> = {
  oldYang: { zh: "全正面 · 阳动变阴", en: "All heads · will change to yin" },
  yang: { zh: "一背二正 · 阳不变", en: "1 tail 2 heads · stable yang" },
  yin: { zh: "二背一正 · 阴不变", en: "2 tails 1 head · stable yin" },
  oldYin: { zh: "全背面 · 阴动变阳", en: "All tails · will change to yang" },
};

const TOSS_OPTIONS: { type: TossType; isYang: boolean; isMoving: boolean }[] = [
  { type: "oldYang", isYang: true, isMoving: true },
  { type: "yang", isYang: true, isMoving: false },
  { type: "yin", isYang: false, isMoving: false },
  { type: "oldYin", isYang: false, isMoving: true },
];

export default function LiuYaoDivination() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [question, setQuestion] = useState("");
  const [gender, setGender] = useState<"男" | "女" | null>(null);
  const [birthYear, setBirthYear] = useState(1990);
  const [birthMonth, setBirthMonth] = useState(1);
  const [birthDay, setBirthDay] = useState(1);
  const [phase, setPhase] = useState<Phase>("idle");
  const [lines, setLines] = useState<CoinTossLine[]>([]);
  const [tossStep, setTossStep] = useState(0);
  const [result, setResult] = useState<DoubaoLiuyaoResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const p = getProfile();
    setProfile(p);
    if (p.baziData) {
      setBirthYear(p.baziData.year);
      setBirthMonth(p.baziData.month);
      setBirthDay(p.baziData.day);
    }
  }, []);

  const lang: Lang = profile?.languagePreference === "en" ? "en" : "zh";

  const startManualToss = () => {
    if (!question.trim()) {
      setError(T.fillQuestion[lang]);
      return;
    }
    if (!gender) {
      setError(T.fillGender[lang]);
      return;
    }
    if (!birthYear || !birthMonth || !birthDay) {
      setError(T.fillBirth[lang]);
      return;
    }
    setError(null);
    setRateLimited(null);
    setResult(null);
    setLines([]);
    setTossStep(0);
    setPhase("manual-toss");
    setShowGuide(false);
  };

  const recordToss = (tossType: TossType) => {
    const option = TOSS_OPTIONS.find((o) => o.type === tossType)!;
    const newLine: CoinTossLine = {
      position: tossStep + 1,
      type: tossType,
      isYang: option.isYang,
      isMoving: option.isMoving,
    };
    const newLines = [...lines, newLine];
    setLines(newLines);

    if (tossStep >= 5) {
      setPhase("revealed");
    } else {
      setTossStep(tossStep + 1);
    }
  };

  const cancelToss = () => {
    setPhase("idle");
    setLines([]);
    setTossStep(0);
  };

  const handleQuery = async () => {
    if (phase === "loading") return;

    setPhase("loading");
    setError(null);

    try {
      const res = await fetch("/api/liuyao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim(),
          lines,
          solarDate: getTodayString(),
          gender: gender || "未填",
          category: "daily",
          birthYear,
          birthMonth,
          birthDay,
          lang,
        }),
      });

      if (res.status === 429 || res.status === 402) {
        const data = await res.json();
        setRateLimited(data.error || data.errorEn || "Rate limited");
        setPhase("error");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || data.errorEn || "Divination failed");
      }

      const data: DoubaoLiuyaoResponse = await res.json();
      setResult(data);
      setPhase("done");
      setProfile(getProfile());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setPhase("error");
    }
  };

  const reset = () => {
    setProfile(getProfile());
    setPhase("idle");
    setLines([]);
    setTossStep(0);
    setResult(null);
    setError(null);
    setRateLimited(null);
  };

  return (
    <div className="space-y-6">
      {/* Idle: inputs */}
      {phase === "idle" && (
        <>
          {/* Question */}
          <div className="space-y-1">
            <label className="text-xs text-gray-500">{T.questionLabel[lang]}</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={T.questionPlaceholder[lang]}
              maxLength={80}
              className="w-full px-4 py-3 rounded-xl bg-mystic-800/50 border border-mystic-700 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gold-400/40 transition-colors"
            />
          </div>

          {/* Gender */}
          <div className="space-y-1">
            <label className="text-xs text-gray-500">{T.genderLabel[lang]}</label>
            <div className="flex gap-2">
              {(["男", "女"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(gender === g ? null : g)}
                  className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                    gender === g
                      ? "bg-gold-400/20 text-gold-300 border border-gold-400/30"
                      : "bg-mystic-800/50 text-gray-400 hover:bg-mystic-700/50 border border-mystic-700"
                  }`}
                >
                  {g === "男" ? T.male[lang] : T.female[lang]}
                </button>
              ))}
            </div>
          </div>

          {/* Birth date */}
          <div className="space-y-1">
            <label className="text-xs text-gray-500">{T.birthYearLabel[lang]}{" · "}{T.birthMonthLabel[lang]}{" · "}{T.birthDayLabel[lang]}</label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                value={birthYear}
                onChange={(e) => setBirthYear(Number(e.target.value))}
                min={1900}
                max={2100}
                placeholder="1990"
                className="w-full px-3 py-2.5 rounded-xl bg-mystic-800/50 border border-mystic-700 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gold-400/40 transition-colors"
              />
              <select
                value={birthMonth}
                onChange={(e) => {
                  const m = Number(e.target.value);
                  setBirthMonth(m);
                  if (birthDay > new Date(birthYear, m, 0).getDate()) setBirthDay(1);
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-mystic-800/50 border border-mystic-700 text-white text-sm focus:outline-none focus:border-gold-400/40 transition-colors appearance-none"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>{String(m).padStart(2, "0")}{lang === "zh" ? "月" : ""}</option>
                ))}
              </select>
              <select
                value={birthDay}
                onChange={(e) => setBirthDay(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-mystic-800/50 border border-mystic-700 text-white text-sm focus:outline-none focus:border-gold-400/40 transition-colors appearance-none"
              >
                {Array.from({ length: new Date(birthYear, birthMonth, 0).getDate() }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>{String(d).padStart(2, "0")}{lang === "zh" ? "日" : ""}</option>
                ))}
              </select>
            </div>
            <p className="text-[10px] text-gray-600">{T.birthHint[lang]}</p>
          </div>

          {/* Ceremonial note */}
          <div className="p-4 rounded-xl bg-mystic-800/30 border border-mystic-700/50 text-center space-y-2">
            <p className="text-gold-400 text-sm font-medium">🪙 {T.ceremonyTitle[lang]}</p>
            <p className="text-gray-400 text-xs leading-relaxed">
              {T.ceremonyText[lang]}
            </p>
          </div>

          {/* Toss button */}
          <div className="text-center space-y-3">
            <button
              onClick={startManualToss}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-gold-400 to-gold-300 text-mystic-950 font-semibold text-lg hover:from-gold-300 hover:to-gold-200 transition-all shadow-lg"
            >
              🪙 {T.tossCoins[lang]}
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
              {error}
            </div>
          )}
        </>
      )}

      {/* Manual toss step-by-step */}
      {phase === "manual-toss" && (
        <div className="space-y-5">
          {/* Progress */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-white font-semibold">
              {T.tossStepTitle[lang].replace("{n}", String(tossStep + 1))}
            </span>
            <span className="text-gray-500 text-xs">{tossStep + 1} / 6</span>
          </div>

          <p className="text-gray-400 text-xs text-center">
            {T.tossStepDesc[lang]}
          </p>

          {/* Toss result buttons */}
          <div className="grid grid-cols-2 gap-3">
            {TOSS_OPTIONS.map((opt) => (
              <button
                key={opt.type}
                onClick={() => recordToss(opt.type)}
                className="p-4 rounded-xl bg-mystic-800/50 border border-mystic-700 hover:border-gold-400/40 hover:bg-mystic-700/30 transition-all text-center space-y-1"
              >
                <div className="text-2xl">
                  {opt.type === "oldYang" ? "○" : opt.type === "yang" ? "━━━" : opt.type === "yin" ? "━ ━" : "×"}
                </div>
                <p className="text-white text-sm font-medium">
                  {T[opt.type][lang]}
                </p>
                <p className="text-gray-500 text-[10px]">
                  {TOSS_DESC[opt.type][lang]}
                </p>
              </button>
            ))}
          </div>

          {/* Toss guide toggle */}
          <div className="text-center">
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="text-xs text-gray-500 hover:text-gold-400 underline underline-offset-4 transition-colors"
            >
              {T.tossGuide[lang]}
            </button>
            {showGuide && (
              <div className="mt-3 p-3 rounded-xl bg-mystic-800/40 border border-mystic-700/50 text-xs text-gray-400 leading-relaxed whitespace-pre-line text-left">
                {T.tossGuideContent[lang]}
              </div>
            )}
          </div>

          {/* So-far display */}
          {lines.length > 0 && (
            <div className="space-y-[2px] max-w-[160px] mx-auto">
              {lines.map((line) => (
                <div key={line.position} className="flex items-center justify-center gap-2 py-1">
                  <span className="text-[10px] text-gray-500 w-7 text-right shrink-0">
                    {T.lineLabel[line.position][lang]}
                  </span>
                  <LineSymbol line={line} />
                </div>
              ))}
              {Array.from({ length: 6 - lines.length }).map((_, i) => (
                <div key={`empty-${i}`} className="flex items-center justify-center gap-2 py-1 opacity-20">
                  <span className="text-[10px] text-gray-600 w-7 text-right shrink-0">
                    {T.lineLabel[i + lines.length + 1]?.[lang] ?? `L${i + lines.length + 1}`}
                  </span>
                  <span className="text-gray-700 text-lg">···</span>
                </div>
              ))}
            </div>
          )}

          {/* Cancel */}
          <button
            onClick={cancelToss}
            className="block mx-auto text-sm text-gray-500 hover:text-gray-400 underline underline-offset-4"
          >
            {T.cancel[lang]}
          </button>
        </div>
      )}

      {/* Revealed: hexagram preview + action buttons */}
      {phase === "revealed" && (
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-gold-300 font-medium mb-3">{T.hexagramReady[lang]}</p>
            <HexagramDisplay lines={lines} lang={lang} />

            {lines.filter((l) => l.isMoving).length > 0 && (
              <p className="text-xs text-amber-400/70 mt-2">
                {lines.filter((l) => l.isMoving).length}{T.movingCount[lang]}
                {": "}
                {lines.filter((l) => l.isMoving).map((l) => T.lineLabel[l.position][lang]).join(", ")}
              </p>
            )}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleQuery()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold-400 to-gold-300 text-mystic-950 font-semibold hover:from-gold-300 hover:to-gold-200 transition-all"
            >
              ✨ {T.aiDeep[lang]}
            </button>
          </div>

          <button
            onClick={reset}
            className="block mx-auto text-sm text-gray-500 hover:text-gray-400 underline underline-offset-4"
          >
            {T.retoss[lang]}
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
          <p className="text-gray-400">{T.interpreting[lang]}</p>
        </div>
      )}

      {/* Result */}
      {phase === "done" && result && (
        <div className="space-y-6">
          <div className="mystic-card rounded-2xl p-6 text-center space-y-4">
            <h3 className="text-2xl font-bold text-white">
              {lang === "en" && result.hexagramNameEn ? result.hexagramNameEn : result.hexagramName}
              {result.changedHexagramName && (
                <span className="text-gold-400">
                  {" → "}
                  {lang === "en" && result.changedHexagramNameEn
                    ? result.changedHexagramNameEn
                    : result.changedHexagramName}
                </span>
              )}
            </h3>
            {lang === "zh" && result.hexagramNameEn && (
              <p className="text-xs text-gray-500">
                {result.hexagramNameEn}
                {result.changedHexagramNameEn && ` → ${result.changedHexagramNameEn}`}
              </p>
            )}
            <p className="text-gray-400 text-sm">
              {lang === "en" && result.palaceEn ? result.palaceEn : result.palace}
              ({lang === "en" && result.palaceElementEn ? result.palaceElementEn : result.palaceElement})
              {result.isJingGua
                ? ` · ${T.staticHexagram[lang]}`
                : ` · ${result.movingLineCount}${T.movingCount[lang]}`}
            </p>

            {/* Month/Day branch */}
            {(result.monthBranch || result.dayBranch) && (
              <div className="flex justify-center gap-4 text-xs text-gray-500">
                <span>{T.monthBranchLabel[lang]}：{lang === "en" && result.monthBranchEn ? result.monthBranchEn : result.monthBranch}</span>
                <span>{T.dayBranchLabel[lang]}：{lang === "en" && result.dayBranchEn ? result.dayBranchEn : result.dayBranch}</span>
              </div>
            )}

            <HexagramDisplay lines={result.lines} lang={lang} />
          </div>

          {/* Six lines table */}
          <div className="mystic-card rounded-2xl p-5">
            <h4 className="text-xs text-gray-500 uppercase tracking-widest mb-3 text-center">
              {T.linesTitle[lang]}
            </h4>
            <div className="text-xs text-gray-500 mb-2 grid grid-cols-[2rem_2rem_2.5rem_3rem_4rem_3rem] gap-1 text-center">
              <span>{T.positionLabel[lang]}</span>
              <span>{T.symbolLabel[lang]}</span>
              <span>{T.branchLabel[lang]}</span>
              <span>{T.liuqinLabel[lang]}</span>
              <span>{T.liushenLabel[lang]}</span>
              <span>{T.markersLabel[lang]}</span>
            </div>
            {[...result.lines].reverse().map((l) => (
              <div
                key={l.position}
                className={`grid grid-cols-[2rem_2rem_2.5rem_3rem_4rem_3rem] gap-1 text-center items-center text-sm rounded-lg py-1.5 ${
                  l.isMoving
                    ? "bg-gold-400/5 border border-gold-400/10"
                    : l.isShi
                    ? "bg-blue-400/5"
                    : l.isYing
                    ? "bg-green-400/5"
                    : ""
                }`}
              >
                <span className="text-gray-500 text-xs">{T.lineLabel[l.position]?.[lang] ?? `L${l.position}`}</span>
                <LineSymbol line={l} />
                <span className="text-gray-300 text-xs">
                  {lang === "en" && l.branchElementEn ? `${l.branch}` : l.branch}
                </span>
                <span
                  className={`text-xs ${
                    l.liuqin === "官鬼" || l.liuqin === "Officer"
                      ? "text-red-400"
                      : l.liuqin === "妻财" || l.liuqin === "Wealth"
                      ? "text-green-400"
                      : l.liuqin === "子孙" || l.liuqin === "Children"
                      ? "text-blue-400"
                      : l.liuqin === "兄弟" || l.liuqin === "Brothers"
                      ? "text-orange-400"
                      : "text-purple-400"
                  }`}
                >
                  {lang === "en" && l.liuqinEn ? l.liuqinEn : l.liuqin}
                </span>
                <span className="text-gray-500 text-xs">
                  {lang === "en" && l.liushenEn ? l.liushenEn : l.liushen}
                </span>
                <span className="text-xs flex justify-center gap-0.5">
                  {l.isShi && <span className="text-blue-400">{T.shi[lang]}</span>}
                  {l.isYing && <span className="text-green-400">{T.ying[lang]}</span>}
                </span>
              </div>
            ))}
          </div>

          {/* Deep reading: 7-section template format */}
          {result.level === "deep" && (
            <div className="mystic-card rounded-2xl p-6 space-y-5">
              <h4 className="text-gold-400 font-semibold text-center">✨ {T.deepReadingTitle[lang]}</h4>

              {/* Section 1: Hexagram Setup */}
              {(result.section1_shexagramSetup || result.section1_shexagramSetupEn) && (
                <SectionBlock
                  number="一"
                  title={T.section1Title[lang]}
                  content={lang === "en" && result.section1_shexagramSetupEn ? result.section1_shexagramSetupEn : (result.section1_shexagramSetup || "")}
                  lang={lang}
                />
              )}

              {/* Section 2: Yong Shen Analysis */}
              {(result.section2_yongShenAnalysis || result.section2_yongShenAnalysisEn) && (
                <SectionBlock
                  number="二"
                  title={T.section2Title[lang]}
                  content={lang === "en" && result.section2_yongShenAnalysisEn ? result.section2_yongShenAnalysisEn : (result.section2_yongShenAnalysis || "")}
                  highlight
                  lang={lang}
                />
              )}

              {/* Section 3: Hexagram Process */}
              {(result.section3_hexagramProcess || result.section3_hexagramProcessEn) && (
                <SectionBlock
                  number="三"
                  title={T.section3Title[lang]}
                  content={lang === "en" && result.section3_hexagramProcessEn ? result.section3_hexagramProcessEn : (result.section3_hexagramProcess || "")}
                  lang={lang}
                />
              )}

              {/* Section 4: Conclusion */}
              {(result.section4_conclusion || result.section4_conclusionEn) && (
                <SectionBlock
                  number="四"
                  title={T.section4Title[lang]}
                  content={lang === "en" && result.section4_conclusionEn ? result.section4_conclusionEn : (result.section4_conclusion || "")}
                  accent
                  lang={lang}
                />
              )}

              {/* Section 5: Timing */}
              {(result.section5_timing || result.section5_timingEn) && (
                <SectionBlock
                  number="五"
                  title={T.section5Title[lang]}
                  content={lang === "en" && result.section5_timingEn ? result.section5_timingEn : (result.section5_timing || "")}
                  lang={lang}
                />
              )}

              {/* Section 6: Risks */}
              {(result.section6_risks || result.section6_risksEn) && (
                <SectionBlock
                  number="六"
                  title={T.section6Title[lang]}
                  content={lang === "en" && result.section6_risksEn ? result.section6_risksEn : (result.section6_risks || "")}
                  warn
                  lang={lang}
                />
              )}

              {/* One-Line Summary */}
              {(result.oneLineSummary || result.oneLineSummaryEn) && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-gold-400/10 to-mystic-800/30 border border-gold-400/20 text-center">
                  <p className="text-xs text-gold-400/70 mb-1">{T.oneLineSummaryTitle[lang]}</p>
                  <p className="text-gold-200 font-medium">
                    {lang === "en" && result.oneLineSummaryEn ? result.oneLineSummaryEn : (result.oneLineSummary || "")}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Quick reading: simple interpretation */}
          {result.level !== "deep" && (
            <div className="mystic-card rounded-2xl p-6 space-y-4">
              <div className="p-4 rounded-xl bg-gold-400/5 border border-gold-400/15">
                <p className="text-gray-200 text-sm leading-relaxed">
                  {lang === "en" && result.interpretationEn ? result.interpretationEn : result.interpretation}
                </p>
              </div>

              {(result.fortuneVerdict || result.fortuneVerdictEn) && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-mystic-800/30">
                  <span className="text-xs text-gray-500">{T.fortuneTitle[lang]}:</span>
                  <span className={`font-semibold text-sm ${
                    (result.fortuneVerdictEn || result.fortuneVerdict).includes("Favorable") || result.fortuneVerdict.includes("吉")
                      ? "text-green-400"
                      : (result.fortuneVerdictEn || result.fortuneVerdict).includes("Unfavorable") || result.fortuneVerdict.includes("凶")
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}>
                    {lang === "en" && result.fortuneVerdictEn ? result.fortuneVerdictEn : result.fortuneVerdict}
                  </span>
                </div>
              )}

              {(result.section5_timing || result.section5_timingEn) && (
                <div className="p-3 rounded-xl bg-mystic-800/30">
                  <p className="text-xs text-gray-500 mb-1">{T.section5Title[lang]}</p>
                  <p className="text-gray-300 text-sm">
                    {lang === "en" && result.section5_timingEn ? result.section5_timingEn : (result.section5_timing || "")}
                  </p>
                </div>
              )}
            </div>
          )}

          <button
            onClick={reset}
            className="block mx-auto text-sm text-gold-400 hover:text-gold-300 underline underline-offset-4"
          >
            {T.again[lang]}
          </button>
        </div>
      )}

      {/* Error */}
      {phase === "error" && (
        <div className="text-center space-y-4">
          <p className="text-red-400">{error || rateLimited}</p>
          <button
            onClick={reset}
            className="text-gold-400 hover:text-gold-300 text-sm underline underline-offset-4"
          >
            {lang === "zh" ? "重新开始" : "Start Over"}
          </button>
        </div>
      )}
    </div>
  );
}
