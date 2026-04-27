"use client";

import { BaziResult, BirthData } from "@/types";
import type { WellnessReport as WellnessReportType } from "@/types";

const ELEMENT_COLORS: Record<string, string> = {
  木: "#4ade80", 火: "#f87171", 土: "#fbbf24", 金: "#f8ebc0", 水: "#60a5fa",
};

const ELEMENT_EMOJI: Record<string, string> = {
  木: "🌿", 火: "🔥", 土: "🏔️", 金: "✨", 水: "💧",
};

function SectionTitle({ emoji, title }: { emoji: string; title: string }) {
  return (
    <h4 className="flex items-center gap-2 text-base font-semibold text-gold-200 mb-3">
      <span>{emoji}</span> {title}
    </h4>
  );
}

export default function WellnessReport({ bazi, birthData, wellness }: { bazi: BaziResult; birthData: BirthData; wellness: WellnessReportType }) {
  const { chart, elements, dayMaster, favorableElements, unfavorableElements } = bazi;

  const elementList: Array<"木" | "火" | "土" | "金" | "水"> = ["木", "火", "土", "金", "水"];
  const maxCount = Math.max(...elementList.map((e) => elements[e]));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <p className="text-xs text-gold-400 uppercase tracking-widest mb-2">Your Wellness Blueprint</p>
        <h2 className="text-2xl font-bold mb-1">
          Welcome home, <span className="gold-text">Clara's friend</span>
        </h2>
        <p className="text-gray-400 text-sm">
          {birthData.year}-{String(birthData.month).padStart(2, "0")}-
          {String(birthData.day).padStart(2, "0")}
          {" · "}{birthData.gender === "male" ? "♂" : "♀"}
        </p>
      </div>

      {/* Blueprint + Constitution */}
      <div className="mystic-card rounded-2xl p-6">
        <p className="text-gray-200 leading-relaxed italic text-center">
          &ldquo;{wellness.blueprint}&rdquo;
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <span className="px-3 py-1.5 rounded-full bg-gold-400/15 text-gold-300 text-sm font-medium">
            {ELEMENT_EMOJI[dayMaster.element]} {dayMaster.element} Constitution
          </span>
          <span className="px-3 py-1.5 rounded-full bg-mystic-700/80 text-gray-300 text-sm">
            {wellness.constitution}
          </span>
        </div>
        <p className="text-gray-400 text-sm text-center mt-3 leading-relaxed">
          {wellness.constitutionExplanation}
        </p>
      </div>

      {/* Five Elements Snapshot */}
      <div className="mystic-card rounded-2xl p-5">
        <h4 className="text-sm font-medium text-gray-400 mb-3 text-center">Your Elemental Balance</h4>
        <div className="space-y-2">
          {elementList.map((el) => (
            <div key={el} className="flex items-center gap-3">
              <span className="w-7 text-sm">{ELEMENT_EMOJI[el]}</span>
              <span className="w-5 text-xs text-gray-500">{el}</span>
              <div className="flex-1 h-3 rounded-full bg-mystic-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${(elements[el] / Math.max(maxCount, 1)) * 100}%`, backgroundColor: ELEMENT_COLORS[el] }}
                />
              </div>
              <span className="text-xs text-gray-400 w-3">{elements[el]}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-4 mt-3 text-xs">
          <span className="text-green-400">Nourish: {favorableElements.map(e => ELEMENT_EMOJI[e] + e).join(", ")}</span>
          <span className="text-gray-500">·</span>
          <span className="text-red-400">Go easy: {unfavorableElements.map(e => ELEMENT_EMOJI[e] + e).join(", ")}</span>
        </div>
      </div>

      {/* === FIVE PILLARS === */}

      {/* 🍽️ Food */}
      <div className="mystic-card rounded-2xl p-6">
        <SectionTitle emoji="🍽️" title="Nourish · 食" />
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Favorable Ingredients</p>
            <div className="flex flex-wrap gap-1.5">
              {wellness.food.favorableIngredients.map((ing) => (
                <span key={ing} className="px-2 py-1 rounded-lg bg-green-400/10 text-green-300 text-xs">{ing}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Better to Limit</p>
            <div className="flex flex-wrap gap-1.5">
              {wellness.food.avoidIngredients.map((ing) => (
                <span key={ing} className="px-2 py-1 rounded-lg bg-red-400/10 text-red-300 text-xs">{ing}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 rounded-xl bg-mystic-700/50">
          <p className="text-xs text-gold-400 font-medium">🍲 {wellness.food.seasonalRecipe.name}</p>
          <p className="text-xs text-gray-400 mt-1">{wellness.food.seasonalRecipe.why}</p>
          <p className="text-xs text-gray-300 mt-1">{wellness.food.seasonalRecipe.briefRecipe}</p>
        </div>
        <p className="text-xs text-gray-500 mt-2">{wellness.food.mealRhythm}</p>
      </div>

      {/* 👗 Clothing */}
      <div className="mystic-card rounded-2xl p-6">
        <SectionTitle emoji="👗" title="Dress · 衣" />
        <div className="flex flex-wrap gap-3 mb-3">
          {wellness.clothing.powerColors.map((c) => (
            <span key={c} className="px-3 py-1.5 rounded-full bg-green-400/10 text-green-300 text-sm font-medium">{c}</span>
          ))}
          <span className="px-3 py-1.5 rounded-full bg-red-400/10 text-red-300 text-sm">Avoid: {wellness.clothing.avoidColors.join(", ")}</span>
        </div>
        <div className="space-y-2">
          {wellness.clothing.occasionGuide.map((og) => (
            <div key={og.occasion} className="flex gap-2 text-sm">
              <span className="text-gray-500 shrink-0">{og.occasion}:</span>
              <span className="text-gray-300">{og.colorTip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 🏠 Home */}
      <div className="mystic-card rounded-2xl p-6">
        <SectionTitle emoji="🏠" title="Nest · 住" />
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div className="flex gap-2"><span className="text-gray-500">Bed:</span><span className="text-gray-300">{wellness.home.bedroomDirection}</span></div>
          <div className="flex gap-2"><span className="text-gray-500">Wealth Corner:</span><span className="text-gray-300">{wellness.home.wealthCorner}</span></div>
        </div>
        <div className="mt-3 space-y-2">
          {wellness.home.crystalPlacement.map((cp) => (
            <div key={cp.room} className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 w-20 shrink-0">{cp.room}:</span>
              <span className="text-gold-300 font-medium">{cp.crystal}</span>
              <span className="text-gray-400">— {cp.purpose}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">{wellness.home.seasonalAdjustment}</p>
      </div>

      {/* 🚶 Travel */}
      <div className="mystic-card rounded-2xl p-6">
        <SectionTitle emoji="🚶" title="Move · 行" />
        <div className="space-y-2 text-sm">
          <div className="flex gap-2"><span className="text-gray-500">Best directions:</span><span className="text-gold-200">{wellness.travel.favorableDirections.join(", ")}</span></div>
          <div className="flex gap-2"><span className="text-gray-500">Prime time:</span><span className="text-gray-300">{wellness.travel.bestTimesForImportant}</span></div>
          <div className="flex gap-2"><span className="text-gray-500">Daily flow:</span><span className="text-gray-300">{wellness.travel.dailyRhythm}</span></div>
        </div>
      </div>

      {/* 🧘 Body */}
      <div className="mystic-card rounded-2xl p-6">
        <SectionTitle emoji="🧘" title="Body · 身" />
        <div className="space-y-3 text-sm">
          <div><span className="text-gray-500">Focus:</span> <span className="text-gray-300">{wellness.body.meridianFocus}</span></div>
          <div className="p-3 rounded-xl bg-mystic-700/50">
            <p className="text-xs text-gold-400 font-medium">Your 2-Minute Ritual</p>
            <p className="text-gray-300 mt-1">{wellness.body.selfCareRitual}</p>
          </div>
          <div><span className="text-gray-500">Emotional rhythm:</span> <span className="text-gray-300">{wellness.body.emotionalCycle}</span></div>
          <div><span className="text-gray-500">Sleep:</span> <span className="text-gray-300">{wellness.body.sleepGuide}</span></div>
        </div>
      </div>

      {/* 💎 Crystal Set */}
      <div className="mystic-card rounded-2xl p-6 glow border-gold-400/30">
        <SectionTitle emoji="💎" title="Your Crystal Prescription" />
        <div className="space-y-3">
          {wellness.crystalSet.map((cs) => (
            <div key={cs.crystal} className="flex items-center gap-3 p-2 rounded-xl bg-mystic-700/40">
              <span className="text-2xl">💎</span>
              <div className="flex-1">
                <p className="font-medium text-white text-sm">{cs.crystal} <span className="text-xs text-gold-400">({cs.element})</span></p>
                <p className="text-xs text-gray-400">{cs.wearing} — {cs.benefit}</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-gold-400/20 text-gold-300 text-xs font-medium hover:bg-gold-400/30 transition-all shrink-0">
                Shop →
              </button>
            </div>
          ))}
        </div>
        <div className="mt-3 p-3 rounded-xl bg-mystic-700/50 flex gap-3">
          <span className="text-2xl">🏺</span>
          <div>
            <p className="font-medium text-white text-sm">{wellness.homeProduct.name}</p>
            <p className="text-xs text-gray-400">{wellness.homeProduct.placement} — {wellness.homeProduct.benefit}</p>
          </div>
        </div>
      </div>

      {/* 2026 Forecast */}
      <div className="mystic-card rounded-2xl p-5 bg-gradient-to-r from-mystic-700/50 to-mystic-800/50">
        <SectionTitle emoji="🐴" title="2026 · Year of the Horse" />
        <p className="text-gray-200 text-sm leading-relaxed">{wellness.forecast2026}</p>
      </div>

      {/* Daily Mantra */}
      <div className="text-center py-6">
        <p className="text-gold-300 text-lg italic font-medium">{wellness.mantra}</p>
        <p className="text-xs text-gray-500 mt-2">Your morning affirmation</p>
      </div>
    </div>
  );
}
