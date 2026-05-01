"use client";

import { useState, useEffect, useRef } from "react";
import type { CalcType, LiuYaoFormData, Gender } from "@/types";
import type { CoinTossLine } from "@/lib/liuyao/types";
import { getProfile } from "@/lib/profile";
import { searchCities, findCity } from "@/lib/solar-time";
import type { CityInfo } from "@/lib/solar-time";

type Lang = "zh" | "en";

const CALC_TYPES: { value: CalcType; zh: string; en: string }[] = [
  { value: 1, zh: "婚姻", en: "Marriage" },
  { value: 2, zh: "事业", en: "Career" },
  { value: 3, zh: "财运", en: "Wealth" },
  { value: 4, zh: "具体一事", en: "Specific Question" },
  { value: 5, zh: "健康", en: "Health" },
  { value: 6, zh: "子女", en: "Children" },
];

const T = {
  gender: { zh: "性别", en: "Gender" },
  male: { zh: "男", en: "Male" },
  female: { zh: "女", en: "Female" },
  birthDate: { zh: "出生日期", en: "Birth Date" },
  birthHour: { zh: "出生时辰", en: "Birth Hour" },
  birthplace: { zh: "出生地", en: "Birthplace" },
  birthplacePlaceholder: { zh: "输入城市名搜索...", en: "Search city..." },
  birthplaceHint: { zh: "用于真太阳时校准", en: "For true solar time calibration" },
  calcType: { zh: "测算类型", en: "Divination Type" },
  question: { zh: "具体问题", en: "Your Question" },
  questionPlaceholder: { zh: "请输入你想问的具体问题...", en: "What would you like to ask about?" },
  submit: { zh: "开始测算 ☯", en: "Cast Hexagram ☯" },
  submitting: { zh: "测算中...", en: "Casting..." },
  validation: {
    cityRequired: { zh: "请选择真实的出生城市", en: "Please select a real birthplace city" },
    cityInvalid: { zh: "未找到该城市，请从下拉列表中选择", en: "City not found. Please select from the dropdown" },
    questionRequired: { zh: "请输入你的具体问题", en: "Please enter your question" },
    questionInvalid: { zh: "请输入有意义的问题，不要乱填", en: "Please enter a meaningful question" },
  },
  // Coin toss
  ceremonyTitle: { zh: "掷币仪式", en: "Coin Ritual" },
  ceremonyText: {
    zh: "请准备三枚相同的硬币，静心默想你的问题后，掷下硬币。根据三枚硬币的正背面分布，选择对应的爻象。心诚则灵。",
    en: "Prepare three identical coins. Quietly focus on your question, toss the coins, then select the matching result based on how many tails you see. Sincerity brings accuracy.",
  },
  tossStepTitle: { zh: "第 {n} 次掷币", en: "Toss #{n}" },
  tossStepDesc: { zh: "掷下三枚硬币，记录正背面结果", en: "Toss three coins and record the result" },
  tossGuide: { zh: "如何判断", en: "How to read" },
  tossGuideContent: {
    zh: "三枚硬币掷下后，数「背面」的数量：\n0个背面（全正面）→ 老阳 ━━━ ○\n1个背面 → 少阴 ━ ━\n2个背面 → 少阳 ━━━\n3个背面（全背面）→ 老阴 ━ ━ ×",
    en: "After tossing three coins, count the number of tails:\n0 tails (all heads) → Old Yang ━━━ ○\n1 tail → Yin ━ ━\n2 tails → Yang ━━━\n3 tails (all tails) → Old Yin ━ ━ ×",
  },
  oldYang: { zh: "老阳 ○", en: "Old Yang ○" },
  yang: { zh: "少阳 —", en: "Yang —" },
  yin: { zh: "少阴 - -", en: "Yin - -" },
  oldYin: { zh: "老阴 ×", en: "Old Yin ×" },
  cancel: { zh: "取消", en: "Cancel" },
  retoss: { zh: "重新摇卦", en: "Toss Again" },
  hexagramReady: { zh: "卦象已成", en: "Your hexagram is ready" },
  lineLabel: {
    1: { zh: "初爻", en: "L1" }, 2: { zh: "二爻", en: "L2" }, 3: { zh: "三爻", en: "L3" },
    4: { zh: "四爻", en: "L4" }, 5: { zh: "五爻", en: "L5" }, 6: { zh: "上爻", en: "L6" },
  } as Record<number, Record<Lang, string>>,
};

type TossType = "oldYang" | "yang" | "yin" | "oldYin";

const TOSS_OPTIONS: { type: TossType; isYang: boolean; isMoving: boolean }[] = [
  { type: "oldYang", isYang: true, isMoving: true },
  { type: "yang", isYang: true, isMoving: false },
  { type: "yin", isYang: false, isMoving: false },
  { type: "oldYin", isYang: false, isMoving: true },
];

interface Props {
  lang: Lang;
  onSubmit: (data: LiuYaoFormData) => void;
  loading: boolean;
}

function LineSymbol({ line }: { line: { isYang: boolean; isMoving: boolean } }) {
  const yangLine = <span className="text-lg text-white">━━━</span>;
  const yinLine = <span className="text-lg text-gray-500">━ ━</span>;
  const movingMark = <span className="text-sm font-bold ml-1">○</span>;
  const changingMark = <span className="text-sm font-bold ml-1">×</span>;

  if (line.isYang && line.isMoving) return <span className="inline-flex items-center">{yangLine}<span className="text-amber-400">{movingMark}</span></span>;
  if (!line.isYang && line.isMoving) return <span className="inline-flex items-center">{yinLine}<span className="text-rose-400">{changingMark}</span></span>;
  if (line.isYang) return <span className="inline-flex items-center">{yangLine}</span>;
  return <span className="inline-flex items-center">{yinLine}</span>;
}

export default function LiuYaoForm({ lang, onSubmit, loading }: Props) {
  const [mounted, setMounted] = useState(false);
  const [gender, setGender] = useState<Gender>("female");
  const [birthYear, setBirthYear] = useState(1990);
  const [birthMonth, setBirthMonth] = useState(1);
  const [birthDay, setBirthDay] = useState(1);
  const [birthHour, setBirthHour] = useState(12);
  const [calcType, setCalcType] = useState<CalcType>(1);
  const [question, setQuestion] = useState("");
  const [birthplaceCity, setBirthplaceCity] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [cityResults, setCityResults] = useState<CityInfo[]>([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);

  // Validation
  const [validationError, setValidationError] = useState<string | null>(null);

  // Coin toss state
  const [tossStarted, setTossStarted] = useState(false);
  const [tossStep, setTossStep] = useState(0);
  const [tossLines, setTossLines] = useState<CoinTossLine[]>([]);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const p = getProfile();
    if (p.baziData) {
      setBirthYear(p.baziData.year);
      setBirthMonth(p.baziData.month);
      setBirthDay(p.baziData.day);
      setBirthHour(p.baziData.hour);
      setGender(p.baziData.gender);
    }
    setMounted(true);
  }, []);

  const handleCityInput = (query: string) => {
    setCityQuery(query);
    setValidationError(null);
    if (query.trim().length > 0) {
      setCityResults(searchCities(query, 6));
      setShowCityDropdown(true);
      const exactMatch = findCity(query.trim());
      setBirthplaceCity(exactMatch ? exactMatch.nameZh : "");
    } else {
      setCityResults([]);
      setShowCityDropdown(false);
      setBirthplaceCity("");
    }
  };

  const selectCity = (city: CityInfo) => {
    setBirthplaceCity(city.nameZh);
    setCityQuery(lang === "zh" ? city.nameZh : city.nameEn);
    setShowCityDropdown(false);
  };

  const validateForm = (): boolean => {
    // Birthplace must be a real city
    if (!birthplaceCity.trim()) {
      setValidationError(T.validation.cityRequired[lang]);
      return false;
    }
    if (!findCity(birthplaceCity.trim())) {
      setValidationError(T.validation.cityInvalid[lang]);
      return false;
    }
    // Question required for calcType 4
    if (calcType === 4) {
      const q = question.trim();
      if (!q) {
        setValidationError(T.validation.questionRequired[lang]);
        return false;
      }
      if (q.length < 4 || /^[\W\d]+$/.test(q) || /^(.)\1+$/.test(q)) {
        setValidationError(T.validation.questionInvalid[lang]);
        return false;
      }
    }
    setValidationError(null);
    return true;
  };

  const recordToss = (tossType: TossType) => {
    const option = TOSS_OPTIONS.find((o) => o.type === tossType)!;
    const newLine: CoinTossLine = {
      position: tossStep + 1,
      type: tossType,
      isYang: option.isYang,
      isMoving: option.isMoving,
    };
    const newLines = [...tossLines, newLine];
    setTossLines(newLines);
    if (tossStep >= 5) {
      // All 6 tosses done — submit
      onSubmit({
        gender,
        birthYear,
        birthMonth,
        birthDay,
        birthHour,
        calcType,
        question: calcType === 4 ? question : undefined,
        mode: "coin",
        lines: newLines,
        birthplaceCity: birthplaceCity || undefined,
      });
    } else {
      setTossStep(tossStep + 1);
    }
  };

  const cancelToss = () => {
    setTossStarted(false);
    setTossLines([]);
    setTossStep(0);
  };

  if (!mounted) return null;

  const today = new Date().toISOString().slice(0, 10);
  const birthDateStr = `${birthYear}-${String(birthMonth).padStart(2, "0")}-${String(birthDay).padStart(2, "0")}`;

  // Coin toss in progress
  if (tossStarted && !loading) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white font-semibold">
            {T.tossStepTitle[lang].replace("{n}", String(tossStep + 1))}
          </span>
          <span className="text-gray-500 text-xs">{tossStep + 1} / 6</span>
        </div>

        <p className="text-gray-400 text-xs text-center">{T.tossStepDesc[lang]}</p>

        <div className="grid grid-cols-2 gap-3">
          {TOSS_OPTIONS.map((opt) => (
            <button
              key={opt.type}
              type="button"
              onClick={() => recordToss(opt.type)}
              disabled={loading}
              className="p-4 rounded-xl bg-mystic-800/50 border border-mystic-700 hover:border-gold-400/40 hover:bg-mystic-700/30 transition-all text-center space-y-1"
            >
              <div className="text-2xl inline-flex items-center justify-center gap-0.5">
                <span>{opt.type === "oldYang" || opt.type === "yang" ? "━━━" : "━ ━"}</span>
                {opt.type === "oldYang" && <span className="text-amber-400">○</span>}
                {opt.type === "oldYin" && <span className="text-rose-400">×</span>}
              </div>
              <p className="text-white text-sm font-medium">{T[opt.type][lang]}</p>
            </button>
          ))}
        </div>

        <div className="text-center">
          <button
            type="button"
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

        {/* Lines so far — bottom-up: 上爻(top) → 初爻(bottom) */}
        {tossLines.length > 0 && (
          <div className="space-y-[2px] max-w-[180px] mx-auto">
            {Array.from({ length: 6 }, (_, i) => {
              const pos = 6 - i; // render 6→1 (top→bottom)
              const line = tossLines.find(l => l.position === pos);
              return (
                <div key={pos} className={`flex items-center justify-start gap-2 py-1 ${!line ? "opacity-20" : ""}`}>
                  <span className="text-[10px] text-gray-500 w-7 text-right shrink-0">
                    {T.lineLabel[pos]?.[lang] ?? `L${pos}`}
                  </span>
                  {line ? <LineSymbol line={line} /> : <span className="text-gray-700 text-lg">···</span>}
                </div>
              );
            })}
          </div>
        )}

        <button
          type="button"
          onClick={cancelToss}
          className="block mx-auto text-sm text-gray-500 hover:text-gray-400 underline underline-offset-4"
        >
          {T.cancel[lang]}
        </button>
      </div>
    );
  }

  // Default: form
  return (
    <div className="space-y-5">
      {/* Gender */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">{T.gender[lang]}</label>
        <div className="flex gap-3">
          {(["male", "female"] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGender(g)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                gender === g
                  ? "bg-gold-400/15 text-gold-300 border-gold-400/40"
                  : "bg-mystic-800/40 text-gray-400 border-mystic-700/40 hover:border-mystic-600/60"
              }`}
            >
              {g === "male" ? T.male[lang] : T.female[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Birth date */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">{T.birthDate[lang]}</label>
        <input
          type="date"
          value={birthDateStr}
          max={today}
          onChange={(e) => {
            const [y, m, d] = e.target.value.split("-").map(Number);
            if (y) setBirthYear(y);
            if (m) setBirthMonth(m);
            if (d) setBirthDay(d);
          }}
          className="w-full px-4 py-3 rounded-xl bg-mystic-800/60 border border-mystic-700/60 text-white text-sm focus:outline-none focus:border-gold-400/50 transition-colors"
        />
      </div>

      {/* Birth hour */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">{T.birthHour[lang]}</label>
        <select
          value={birthHour}
          onChange={(e) => setBirthHour(Number(e.target.value))}
          className="w-full px-4 py-3 rounded-xl bg-mystic-800/60 border border-mystic-700/60 text-white text-sm focus:outline-none focus:border-gold-400/50 transition-colors"
        >
          {Array.from({ length: 24 }, (_, i) => (
            <option key={i} value={i}>
              {String(i).padStart(2, "0")}:00
              {i === 23 || i === 0 ? ` (${lang === "zh" ? "子时" : "Zi"})` : ""}
              {i % 2 === 1 ? ` (${lang === "zh" ? ["丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"][Math.floor((i-1)/2)] : ["Chou","Yin","Mao","Chen","Si","Wu","Wei","Shen","You","Xu","Hai"][Math.floor((i-1)/2)]}${lang === "zh" ? "时" : ""})` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Birthplace city */}
      <div ref={cityRef} className="relative">
        <label className="block text-sm text-gray-400 mb-2">
          {T.birthplace[lang]}
          <span className="text-xs text-gray-600 ml-1.5">{T.birthplaceHint[lang]}</span>
        </label>
        <input
          type="text"
          value={cityQuery}
          onChange={(e) => handleCityInput(e.target.value)}
          onFocus={() => { if (cityResults.length > 0) setShowCityDropdown(true); }}
          onBlur={() => setTimeout(() => setShowCityDropdown(false), 150)}
          placeholder={T.birthplacePlaceholder[lang]}
          className="w-full px-4 py-3 rounded-xl bg-mystic-800/60 border border-mystic-700/60 text-white text-sm focus:outline-none focus:border-gold-400/50 transition-colors placeholder:text-gray-500"
        />
        {showCityDropdown && cityResults.length > 0 && (
          <div className="absolute z-20 w-full mt-1 bg-mystic-800 border border-mystic-700/60 rounded-xl shadow-lg overflow-hidden">
            {cityResults.map((city) => (
              <button
                key={city.nameZh}
                type="button"
                onClick={() => selectCity(city)}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-gold-400/10 hover:text-white transition-colors"
              >
                {lang === "zh" ? city.nameZh : city.nameEn}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Calc type */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">{T.calcType[lang]}</label>
        <div className="grid grid-cols-3 gap-2">
          {CALC_TYPES.map((ct) => (
            <button
              key={ct.value}
              type="button"
              onClick={() => setCalcType(ct.value)}
              className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                calcType === ct.value
                  ? "bg-gold-400/15 text-gold-300 border-gold-400/40"
                  : "bg-mystic-800/40 text-gray-400 border-mystic-700/40 hover:border-mystic-600/60"
              }`}
            >
              {lang === "zh" ? ct.zh : ct.en}
            </button>
          ))}
        </div>
      </div>

      {/* Question (only for calcType 4) */}
      {calcType === 4 && (
        <div>
          <label className="block text-sm text-gray-400 mb-2">{T.question[lang]}</label>
          <textarea
            value={question}
            onChange={(e) => { setQuestion(e.target.value); setValidationError(null); }}
            placeholder={T.questionPlaceholder[lang]}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-mystic-800/60 border border-mystic-700/60 text-white text-sm focus:outline-none focus:border-gold-400/50 transition-colors placeholder:text-gray-500 resize-none"
          />
        </div>
      )}

      {/* Coin toss ceremony text */}
      <div className="p-4 rounded-xl bg-mystic-800/30 border border-mystic-700/50 text-center space-y-2">
        <p className="text-gold-400 text-sm font-medium">{T.ceremonyTitle[lang]}</p>
        <p className="text-gray-400 text-xs leading-relaxed">{T.ceremonyText[lang]}</p>
      </div>

      {/* Validation error */}
      {validationError && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
          {validationError}
        </div>
      )}

      {/* Submit */}
      <button
        type="button"
        onClick={() => { if (validateForm()) setTossStarted(true); }}
        disabled={loading}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-400 to-gold-300 text-mystic-950 font-semibold text-lg hover:from-gold-300 hover:to-gold-200 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? T.submitting[lang] : T.submit[lang]}
      </button>
    </div>
  );
}
