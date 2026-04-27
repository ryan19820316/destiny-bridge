"use client";

import { BirthData, BaziResult } from "@/types";
import { useState } from "react";

interface Props {
  onSubmit: (data: BirthData) => void;
  loading: boolean;
}

export default function BaziForm({ onSubmit, loading }: Props) {
  const [year, setYear] = useState(1990);
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [hour, setHour] = useState(12);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [errors, setErrors] = useState<string[]>([]);

  const validate = (): boolean => {
    const errs: string[] = [];
    if (year < 1900 || year > 2100) errs.push("Year must be between 1900 and 2100");
    if (month < 1 || month > 12) errs.push("Month must be between 1 and 12");
    if (day < 1 || day > 31) errs.push("Day must be between 1 and 31");
    if (hour < 0 || hour > 23) errs.push("Hour must be between 0 and 23");
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ year, month, day, hour, gender });
  };

  // Generate day options based on month
  const daysInMonth = new Date(year, month, 0).getDate();
  const dayOptions = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Gender Toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
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
            ♂ Male
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
            ♀ Female
          </button>
        </div>
      </div>

      {/* Date inputs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            min={1900}
            max={2100}
            className="w-full py-3 px-4 rounded-xl bg-mystic-800/80 border border-mystic-600 text-white placeholder-gray-500 transition-all"
            placeholder="1990"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Month</label>
          <select
            value={month}
            onChange={(e) => {
              const m = Number(e.target.value);
              setMonth(m);
              if (day > new Date(year, m, 0).getDate()) setDay(1);
            }}
            className="w-full py-3 px-4 rounded-xl bg-mystic-800/80 border border-mystic-600 text-white transition-all appearance-none"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {String(m).padStart(2, "0")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Day</label>
          <select
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
            className="w-full py-3 px-4 rounded-xl bg-mystic-800/80 border border-mystic-600 text-white transition-all appearance-none"
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
            Hour (0-23)
            <span className="text-gray-500 ml-1 text-xs">24h</span>
          </label>
          <select
            value={hour}
            onChange={(e) => setHour(Number(e.target.value))}
            className="w-full py-3 px-4 rounded-xl bg-mystic-800/80 border border-mystic-600 text-white transition-all appearance-none"
          >
            {Array.from({ length: 24 }, (_, i) => i).map((h) => (
              <option key={h} value={h}>
                {String(h).padStart(2, "0")}:00
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Time zone note */}
      <p className="text-xs text-gray-500">
        Enter your local birth time. We convert it for Ba Zi calculation.
      </p>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30">
          {errors.map((e) => (
            <p key={e} className="text-red-400 text-sm">{e}</p>
          ))}
        </div>
      )}

      {/* Submit */}
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
            Consulting the Oracle...
          </span>
        ) : (
          "Reveal Your Destiny →"
        )}
      </button>
    </form>
  );
}
