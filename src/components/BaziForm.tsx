"use client";

import { BirthData } from "@/types";
import { useState } from "react";

type Lang = "zh" | "en";

interface Props {
  onSubmit: (data: BirthData) => void;
  loading: boolean;
  lang: Lang;
}

const T = {
  gender: { zh: "性别", en: "Gender" },
  male: { zh: "♂ 男", en: "♂ Male" },
  female: { zh: "♀ 女", en: "♀ Female" },
  year: { zh: "年", en: "Year" },
  month: { zh: "月", en: "Month" },
  day: { zh: "日", en: "Day" },
  hour: { zh: "时 (0-23)", en: "Hour (0-23)" },
  hourHint: { zh: "24小时制", en: "24h" },
  hint: {
    zh: "请输入你的出生时间（本地时间），系统会自动转换为八字计算所需的农历时间。",
    en: "Enter your local birth time. We adjust it for Ba Zi calculation.",
  },
  consulting: { zh: "正在排盘…", en: "Consulting the Oracle..." },
  reveal: { zh: "查看我的命盘 →", en: "Reveal Your Blueprint →" },
};

export default function BaziForm({ onSubmit, loading, lang }: Props) {
  const [year, setYear] = useState(1990);
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [hour, setHour] = useState(12);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [errors, setErrors] = useState<string[]>([]);

  const validate = (): boolean => {
    const errs: string[] = [];
    if (year < 1900 || year > 2100) errs.push(
      lang === "zh" ? "年份需在 1900 到 2100 之间" : "Year must be between 1900 and 2100"
    );
    if (month < 1 || month > 12) errs.push(
      lang === "zh" ? "月份需在 1 到 12 之间" : "Month must be between 1 and 12"
    );
    if (day < 1 || day > 31) errs.push(
      lang === "zh" ? "日期需在 1 到 31 之间" : "Day must be between 1 and 31"
    );
    if (hour < 0 || hour > 23) errs.push(
      lang === "zh" ? "小时需在 0 到 23 之间" : "Hour must be between 0 and 23"
    );
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ year, month, day, hour, gender });
  };

  const daysInMonth = new Date(year, month, 0).getDate();
  const dayOptions = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">{T.gender[lang]}</label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setGender("male")}
            className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
              gender === "male"
                ? "border-gold-400 bg-gold-400/10 text-gold-300"
                : "border-mystic-600 bg-mystic-800/50 text-gray-400 hover:border-mystic-500"
            }`}
          >
            {T.male[lang]}
          </button>
          <button
            type="button"
            onClick={() => setGender("female")}
            className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
              gender === "female"
                ? "border-gold-400 bg-gold-400/10 text-gold-300"
                : "border-mystic-600 bg-mystic-800/50 text-gray-400 hover:border-mystic-500"
            }`}
          >
            {T.female[lang]}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{T.year[lang]}</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            min={1900}
            max={2100}
            className="w-full py-3 px-4 rounded-xl bg-mystic-800/80 border border-mystic-600 text-white placeholder-gray-500 transition-all focus:outline-none focus:border-gold-400"
            placeholder="1990"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{T.month[lang]}</label>
          <select
            value={month}
            onChange={(e) => {
              const m = Number(e.target.value);
              setMonth(m);
              if (day > new Date(year, m, 0).getDate()) setDay(1);
            }}
            className="w-full py-3 px-4 rounded-xl bg-mystic-800/80 border border-mystic-600 text-white transition-all appearance-none focus:outline-none focus:border-gold-400"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {String(m).padStart(2, "0")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{T.day[lang]}</label>
          <select
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
            className="w-full py-3 px-4 rounded-xl bg-mystic-800/80 border border-mystic-600 text-white transition-all appearance-none focus:outline-none focus:border-gold-400"
          >
            {dayOptions.map((d) => (
              <option key={d} value={d}>
                {String(d).padStart(2, "0")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {T.hour[lang]}
            <span className="text-gray-500 ml-1 text-xs">{T.hourHint[lang]}</span>
          </label>
          <select
            value={hour}
            onChange={(e) => setHour(Number(e.target.value))}
            className="w-full py-3 px-4 rounded-xl bg-mystic-800/80 border border-mystic-600 text-white transition-all appearance-none focus:outline-none focus:border-gold-400"
          >
            {Array.from({ length: 24 }, (_, i) => i).map((h) => (
              <option key={h} value={h}>
                {String(h).padStart(2, "0")}:00
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-xs text-gray-500">{T.hint[lang]}</p>

      {errors.length > 0 && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30">
          {errors.map((e) => (
            <p key={e} className="text-red-400 text-sm">{e}</p>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-400 to-gold-300 text-mystic-950 font-semibold text-lg hover:from-gold-300 hover:to-gold-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {T.consulting[lang]}
          </span>
        ) : (
          T.reveal[lang]
        )}
      </button>
    </form>
  );
}
