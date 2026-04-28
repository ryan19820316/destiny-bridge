"use client";

import { useState, useEffect } from "react";
import {
  getProfile,
  isMemberActive,
  getDailyLiurenCount,
  incrementLiurenCount,
  startFreeTrial,
} from "@/lib/profile";
import type { UserProfile } from "@/types";
import type { CoinTossLine, QuestionCategory } from "@/lib/liuyao/types";

// ---- i18n ----
type Lang = "zh" | "en";
const T = {
  categoryLabels: {
    love: { zh: "感情", en: "Love" },
    career: { zh: "事业", en: "Career" },
    wealth: { zh: "财运", en: "Wealth" },
    health: { zh: "健康", en: "Health" },
    daily: { zh: "日常", en: "Daily" },
  } as Record<QuestionCategory, Record<Lang, string>>,
  emoji: { love: "💕", career: "💼", wealth: "💰", health: "🌿", daily: "✨" },
  lineLabel: { 1: { zh: "初爻", en: "L1" }, 2: { zh: "二爻", en: "L2" }, 3: { zh: "三爻", en: "L3" }, 4: { zh: "四爻", en: "L4" }, 5: { zh: "五爻", en: "L5" }, 6: { zh: "上爻", en: "L6" } } as Record<number, Record<Lang, string>>,
  questionLabel: { zh: "你想问什么事？（一事一问）", en: "What's your question? (one topic per reading)" },
  questionPlaceholder: { zh: "例如：这次投资能不能赚？我和他能不能复合？", en: "e.g. Will this investment pay off? Will we get back together?" },
  dateLabel: { zh: "摇卦日期", en: "Divination Date" },
  genderLabel: { zh: "性别", en: "Gender" },
  male: { zh: "男", en: "Male" },
  female: { zh: "女", en: "Female" },
  meditate: { zh: "心中默念所求之事，然后摇动铜钱", en: "Focus on your question in mind, then toss the coins" },
  freeTierNote: { zh: "免费用户每日 1 次快速占卜 · 会员无限深度解读", en: "Free: 1 quick reading/day · Members: unlimited deep readings" },
  tossCoins: { zh: "摇铜钱起卦", en: "Toss Coins" },
  tossing: { zh: "摇第", en: "Toss " },
  tossDone: { zh: "卦成！", en: "Hexagram formed!" },
  hexagramReady: { zh: "卦象已成", en: "Your hexagram is ready" },
  quickReading: { zh: "快速解卦", en: "Quick Reading" },
  aiDeep: { zh: "AI 深度解读", en: "AI Deep Reading" },
  aiDeepMember: { zh: "AI 深度解读（会员）", en: "AI Deep Reading (Member)" },
  retoss: { zh: "重新摇卦", en: "Toss Again" },
  interpreting: { zh: "解卦中，请稍候...", en: "Interpreting your hexagram..." },
  again: { zh: "再卜一卦 →", en: "Ask Another →" },
  hexagram: { zh: "本卦", en: "Original" },
  changed: { zh: "变卦", en: "→ Changes to" },
  staticHexagram: { zh: "静卦", en: "Static" },
  movingLines: { zh: "动爻", en: "Moving lines" },
  movingCount: { zh: "个动爻", en: " moving" },
  shi: { zh: "世", en: "Self" },
  ying: { zh: "应", en: "Other" },
  dailyUsed: { zh: "今日免费占卜次数已用完。升级会员享受无限深度解读。", en: "Today's free reading used. Upgrade to membership for unlimited deep readings." },
  memberExclusive: { zh: "会员专属", en: "Member Only" },
  positionLabel: { zh: "爻位", en: "Pos" },
  symbolLabel: { zh: "爻象", en: "Symbol" },
  branchLabel: { zh: "地支", en: "Branch" },
  liuqinLabel: { zh: "六亲", en: "Relation" },
  liushenLabel: { zh: "六神", en: "Spirit" },
  markersLabel: { zh: "标记", en: "Mark" },
  interpretationTitle: { zh: "解读", en: "Reading" },
  fortuneTitle: { zh: "总体判断", en: "Verdict" },
  timingTitle: { zh: "应期预测", en: "Timing" },
  yongShenTitle: { zh: "用神分析", en: "Focus Spirit" },
  linesTitle: { zh: "六爻排盘", en: "Six Lines" },
  upgradeTitle: { zh: "解锁无限占卜", en: "Unlock Unlimited Readings" },
  upgradeDesc: { zh: "升级Clara会员即可无限使用六爻占卜，并解锁AI深度解读——包含五行分析、行动建议和个性化指导。", en: "Upgrade to Clara Membership for unlimited Liu Yao readings with AI deep interpretation — element analysis, action advice, and personalized guidance." },
  startTrial: { zh: "开始 7 天免费试用 →", en: "Start 7-Day Free Trial →" },
  trialNote: { zh: "之后 $6.99/月。随时取消。", en: "Then $6.99/month. Cancel anytime." },
  freeTierUpsell: { zh: "以上为快速解卦。升级会员解锁 AI 深度解读——五行分析 · 行动建议 · 个性化指导", en: "Quick reading only. Upgrade to unlock AI deep interpretation with element analysis and personalized advice." },
  elementAnalysisTitle: { zh: "五行分析", en: "Element Analysis" },
  actionAdviceTitle: { zh: "行动建议", en: "Action Advice" },
  claraReading: { zh: "Clara 深度解读", en: "Clara Deep Reading" },
  fillQuestion: { zh: "请先填写你的占事", en: "Please enter your question first" },
  fillGender: { zh: "请选择性别", en: "Please select your gender" },
};

const LINE_LABEL_KEYS = [6, 5, 4, 3, 2, 1] as const;

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ---- Line symbol ----
function LineSymbol({ line }: { line: { isYang: boolean; isMoving: boolean } }) {
  if (line.isYang && line.isMoving) return <span className="text-amber-400 text-xl font-bold">○</span>;
  if (!line.isYang && line.isMoving) return <span className="text-rose-400 text-xl font-bold">×</span>;
  if (line.isYang) return <span className="text-white text-xl">━━━</span>;
  return <span className="text-gray-500 text-xl">━ ━</span>;
}

// ---- Hexagram visual ----
function HexagramDisplay({
  lines,
  lang,
}: {
  lines: { isYang: boolean; isMoving: boolean; position: number }[];
  lang: Lang;
}) {
  return (
    <div className="space-y-[2px] max-w-[160px] mx-auto">
      {[...lines].reverse().map((line, i) => {
        const posIdx = 6 - i;
        return (
          <div key={line.position} className="flex items-center justify-center gap-2 py-1">
            <span className="text-[10px] text-gray-500 w-7 text-right shrink-0">
              {T.lineLabel[posIdx]?.[lang] ?? `L${posIdx}`}
            </span>
            <LineSymbol line={line} />
          </div>
        );
      })}
    </div>
  );
}

// Doubao response line type
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
  lines: DoubaoLine[];
  yongShen: string;
  yongShenEn: string;
  yongShenStrength: string;
  yongShenStrengthEn: string;
  movingLineEffects: string;
  movingLineEffectsEn: string;
  shiYingRelation: string;
  shiYingRelationEn: string;
  fortuneVerdict: string;
  fortuneVerdictEn: string;
  timingPrediction: string;
  timingPredictionEn: string;
  interpretation: string;
  interpretationEn: string;
  actionAdvice?: string;
  actionAdviceEn?: string;
  level: "quick" | "deep";
  memberActive: boolean;
  timestamp: string;
}

// ---- Main component ----
export default function LiuYaoDivination() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [category, setCategory] = useState<QuestionCategory>("daily");
  const [question, setQuestion] = useState("");
  const [solarDate, setSolarDate] = useState(getTodayString());
  const [gender, setGender] = useState<"男" | "女" | null>(null);
  const [phase, setPhase] = useState<
    "idle" | "tossing" | "revealed" | "loading" | "done" | "error" | "limit"
  >("idle");
  const [lines, setLines] = useState<CoinTossLine[]>([]);
  const [tossStep, setTossStep] = useState(0);
  const [result, setResult] = useState<DoubaoLiuyaoResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState<string | null>(null);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  const memberActive = profile ? isMemberActive() : false;
  const dailyFreeUsed = profile ? getDailyLiurenCount() : 0;
  const lang: Lang = profile?.languagePreference === "en" ? "en" : "zh";

  const startToss = () => {
    if (!memberActive && dailyFreeUsed >= 1) return;
    if (!question.trim()) {
      setError(T.fillQuestion[lang]);
      return;
    }
    if (!gender) {
      setError(T.fillGender[lang]);
      return;
    }
    setError(null);
    setRateLimited(null);
    setResult(null);
    setPhase("tossing");
    setTossStep(0);

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

    if (!memberActive) {
      const dailyCount = getDailyLiurenCount();
      if (dailyCount >= 1) {
        setPhase("limit");
        return;
      }
      incrementLiurenCount();
    }

    setPhase("loading");
    setError(null);

    try {
      const res = await fetch("/api/liuyao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim(),
          lines,
          solarDate,
          gender: gender || "未填",
          category,
          deep,
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
    const p = getProfile();
    setProfile(p);
    const updatedCount = getDailyLiurenCount();
    const isMember = isMemberActive();

    if (!isMember && updatedCount >= 1) {
      setPhase("limit");
    } else {
      setPhase("idle");
    }
    setLines([]);
    setTossStep(0);
    setResult(null);
    setError(null);
    setRateLimited(null);
  };

  const handleStartTrial = () => {
    startFreeTrial();
    setProfile(getProfile());
  };

  // ---- Limit state ----
  if (phase === "limit") {
    return (
      <div className="mystic-card rounded-2xl p-8 text-center space-y-4">
        <div className="text-4xl">☯️</div>
        <h3 className="text-xl font-bold text-white">
          {lang === "zh" ? "今日免费次数已用完" : "Today's Free Reading Used"}
        </h3>
        <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">{T.upgradeDesc[lang]}</p>

        <div className="grid grid-cols-2 gap-3 text-left max-w-md mx-auto mt-4">
          <div className="bg-mystic-800/50 rounded-xl p-3 text-xs space-y-1">
            <p className="text-gray-400 font-medium">{lang === "zh" ? "快速解卦（免费）" : "Quick Reading (Free)"}</p>
            <p className="text-gray-500">{lang === "zh" ? "✓ 六爻排盘 + 解卦" : "✓ Full hexagram chart"}</p>
            <p className="text-gray-500">{lang === "zh" ? "✓ 吉凶判断 + 应期" : "✓ Fortune verdict + timing"}</p>
            <p className="text-gray-500">{lang === "zh" ? "✕ 每天仅1次" : "✕ 1 per day only"}</p>
          </div>
          <div className="bg-gold-400/5 border border-gold-400/20 rounded-xl p-3 text-xs space-y-1">
            <p className="text-gold-300 font-medium">{lang === "zh" ? "深度解读（会员）" : "Deep Reading (Member)"}</p>
            <p className="text-gold-300/70">{lang === "zh" ? "✓ 以上全部" : "✓ Everything above"}</p>
            <p className="text-gold-300/70">{lang === "zh" ? "✓ AI 深度解读" : "✓ AI deep interpretation"}</p>
            <p className="text-gold-300/70">{lang === "zh" ? "✓ 五行分析 + 行动建议" : "✓ Element analysis + advice"}</p>
            <p className="text-gold-300/70">{lang === "zh" ? "✓ 无限使用" : "✓ Unlimited readings"}</p>
          </div>
        </div>

        {!memberActive && (
          <>
            <button
              onClick={handleStartTrial}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold-400 to-gold-300 text-mystic-950 font-semibold text-sm hover:from-gold-300 hover:to-gold-200 transition-all shadow-lg"
            >
              {T.startTrial[lang]}
            </button>
            <p className="text-xs text-gray-500">{T.trialNote[lang]}</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Idle: inputs + toss button */}
      {phase === "idle" && (
        <>
          {/* Question input */}
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

          {/* Date + Gender row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-gray-500">{T.dateLabel[lang]}</label>
              <input
                type="date"
                value={solarDate}
                onChange={(e) => setSolarDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-mystic-800/50 border border-mystic-700 text-white text-sm focus:outline-none focus:border-gold-400/40 transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">{T.genderLabel[lang]}</label>
              <div className="flex gap-1">
                {(["男", "女"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(gender === g ? null : g)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
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
          </div>

          {/* Category selector */}
          <div className="flex flex-wrap justify-center gap-2">
            {(Object.keys(T.categoryLabels) as QuestionCategory[]).map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category === c
                    ? "bg-gold-400/20 text-gold-300 border border-gold-400/40"
                    : "bg-mystic-800/50 text-gray-400 border border-mystic-700 hover:border-mystic-600"
                }`}
              >
                {T.emoji[c]} {T.categoryLabels[c][lang]}
              </button>
            ))}
          </div>

          <div className="text-center space-y-3">
            <p className="text-gray-400 text-sm">{T.meditate[lang]}</p>
            {!memberActive && dailyFreeUsed >= 1 ? (
              <p className="text-xs text-amber-400/80">{T.dailyUsed[lang]}</p>
            ) : (
              !memberActive && (
                <p className="text-xs text-gold-400/70">{T.freeTierNote[lang]}</p>
              )
            )}
            <button
              onClick={startToss}
              disabled={!memberActive && dailyFreeUsed >= 1}
              className={`px-8 py-4 rounded-xl bg-gradient-to-r from-gold-400 to-gold-300 text-mystic-950 font-semibold text-lg hover:from-gold-300 hover:to-gold-200 transition-all shadow-lg ${
                !memberActive && dailyFreeUsed >= 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              🪙 {T.tossCoins[lang]}
            </button>
          </div>
        </>
      )}

      {/* Tossing animation */}
      {phase === "tossing" && (
        <div className="space-y-4">
          <p className="text-center text-gold-300 font-medium">
            {tossStep < 6
              ? `${T.tossing[lang]}${lang === "zh" ? `第 ${tossStep + 1} 次` : `#${tossStep + 1}`}...`
              : T.tossDone[lang]}
          </p>
          <div className="space-y-2 max-w-xs mx-auto">
            {LINE_LABEL_KEYS.map((pos, idx) => {
              const line = idx < lines.length ? lines[idx] : null;
              return (
                <div
                  key={pos}
                  className={`flex items-center justify-center gap-3 py-2 rounded-lg transition-all ${
                    idx === tossStep - 1 ? "bg-gold-400/10 border border-gold-400/30" : ""
                  } ${line ? "" : "opacity-30"}`}
                >
                  <span className="text-xs text-gray-500 w-7 text-right">
                    {T.lineLabel[pos]?.[lang] ?? `L${pos}`}
                  </span>
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

      {/* Revealed: hexagram preview */}
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
              onClick={() => handleQuery(false)}
              className="px-6 py-3 rounded-xl bg-mystic-800 border border-mystic-600 text-white font-semibold hover:bg-mystic-700 transition-all"
            >
              🔮 {T.quickReading[lang]}
            </button>
            {memberActive ? (
              <button
                onClick={() => handleQuery(true)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold-400 to-gold-300 text-mystic-950 font-semibold hover:from-gold-300 hover:to-gold-200 transition-all"
              >
                ✨ {T.aiDeep[lang]}
              </button>
            ) : (
              <button
                disabled
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold-400 to-gold-300 text-mystic-950 font-semibold opacity-50 cursor-not-allowed text-sm"
                title={T.memberExclusive[lang]}
              >
                ✨ {T.aiDeepMember[lang]}
              </button>
            )}
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
          {/* Header */}
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
            {/* Show both names if in Chinese mode for reference */}
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

          {/* Interpretation */}
          <div className="mystic-card rounded-2xl p-6 space-y-4">
            {/* Plain-language interpretation */}
            <div className="p-4 rounded-xl bg-gold-400/5 border border-gold-400/15">
              <p className="text-gray-200 text-sm leading-relaxed">
                {lang === "en" && result.interpretationEn ? result.interpretationEn : result.interpretation}
              </p>
            </div>

            {/* Fortune verdict */}
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

            {/* Timing */}
            {(result.timingPrediction || result.timingPredictionEn) && (
              <div className="p-3 rounded-xl bg-mystic-800/30">
                <p className="text-xs text-gray-500 mb-1">{T.timingTitle[lang]}</p>
                <p className="text-gray-300 text-sm">
                  {lang === "en" && result.timingPredictionEn ? result.timingPredictionEn : result.timingPrediction}
                </p>
              </div>
            )}

            {/* Deep interpretation sections */}
            {result.level === "deep" && (
              <>
                <hr className="border-mystic-700" />
                <h4 className="text-gold-400 font-medium">✨ {T.claraReading[lang]}</h4>

                {/* Yong Shen */}
                {(result.yongShen || result.yongShenEn) && (
                  <div className="p-3 rounded-xl bg-mystic-800/30">
                    <p className="text-xs text-gray-500 mb-1">{T.yongShenTitle[lang]}</p>
                    <p className="text-gray-300 text-sm">
                      {lang === "en" && result.yongShenEn ? result.yongShenEn : result.yongShen}
                      {(result.yongShenStrength || result.yongShenStrengthEn) && (
                        <span className="text-gray-500">
                          {" — "}
                          {lang === "en" && result.yongShenStrengthEn
                            ? result.yongShenStrengthEn
                            : result.yongShenStrength}
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {/* Moving line effects */}
                {(result.movingLineEffects || result.movingLineEffectsEn) && (
                  <div className="p-3 rounded-xl bg-mystic-800/30">
                    <p className="text-xs text-gray-500 mb-1">{T.movingLines[lang]}</p>
                    <p className="text-gray-300 text-sm">
                      {lang === "en" && result.movingLineEffectsEn
                        ? result.movingLineEffectsEn
                        : result.movingLineEffects}
                    </p>
                  </div>
                )}

                {/* Action advice */}
                {(result.actionAdvice || result.actionAdviceEn) && (
                  <div className="p-3 rounded-xl bg-gold-400/5 border border-gold-400/20">
                    <p className="text-xs text-gold-400 font-medium mb-1">{T.actionAdviceTitle[lang]}</p>
                    <p className="text-gray-300 text-sm">
                      {lang === "en" && result.actionAdviceEn ? result.actionAdviceEn : result.actionAdvice}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Free tier upsell */}
          {!memberActive && (
            <div className="p-4 rounded-xl bg-gold-400/5 border border-gold-400/15 text-center space-y-2">
              <p className="text-xs text-gray-400">{T.freeTierUpsell[lang]}</p>
              <button
                onClick={handleStartTrial}
                className="px-4 py-2 rounded-lg bg-gold-400/15 text-gold-300 text-xs font-semibold hover:bg-gold-400/25 transition-all"
              >
                {T.startTrial[lang]}
              </button>
            </div>
          )}

          {/* Ask another */}
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
