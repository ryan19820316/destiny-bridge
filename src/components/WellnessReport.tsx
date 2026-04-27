"use client";

import { BaziResult, BirthData } from "@/types";
import type { WellnessReport as WellnessReportType } from "@/types";

const ELEMENT_COLORS: Record<string, string> = {
  木: "#6b7d4e", 火: "#c97b6b", 土: "#b08968", 金: "#c9a84c", 水: "#60a5fa",
};

const ELEMENT_EMOJI: Record<string, string> = {
  木: "🌿", 火: "🔥", 土: "🏔️", 金: "✨", 水: "💧",
};

function SectionTitle({ emoji, title }: { emoji: string; title: string }) {
  return (
    <h4 className="flex items-center gap-2 text-base font-semibold text-gold-500 mb-3">
      <span>{emoji}</span> {title}
    </h4>
  );
}

export default function WellnessReport({
  bazi,
  birthData,
  wellness,
}: {
  bazi: BaziResult;
  birthData: BirthData;
  wellness: WellnessReportType;
}) {
  const { chart, elements, dayMaster, favorableElements, unfavorableElements } = bazi;

  const elementList: Array<"木" | "火" | "土" | "金" | "水"> = [
    "木", "火", "土", "金", "水",
  ];
  const maxCount = Math.max(...elementList.map((e) => elements[e]));

  return (
    <div className="space-y-5 animate-fade-in text-indigo-900">
      {/* Header */}
      <div className="text-center">
        <p className="text-xs text-gold-500 uppercase tracking-widest mb-2">
          Your Wellness Blueprint
        </p>
        <h2 className="text-2xl font-bold mb-1">
          Welcome, <span className="gold-text">Clara&apos;s friend</span>
        </h2>
        <p className="text-earth-500 text-sm">
          {birthData.year}-{String(birthData.month).padStart(2, "0")}-
          {String(birthData.day).padStart(2, "0")}
          {" · "}
          {birthData.gender === "male" ? "♂" : "♀"}
        </p>
      </div>

      {/* Blueprint + Constitution */}
      <div className="mystic-card rounded-3xl p-6">
        <p className="text-indigo-800 leading-relaxed italic text-center">
          &ldquo;{wellness.blueprint}&rdquo;
        </p>
        <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
          <span className="px-3 py-1.5 rounded-full bg-cream-200 text-gold-500 text-sm font-medium">
            {ELEMENT_EMOJI[dayMaster.element]} {dayMaster.element} Constitution
          </span>
          <span className="px-3 py-1.5 rounded-full bg-indigo-800/5 text-indigo-800/70 text-sm">
            {wellness.constitution}
          </span>
        </div>
        <p className="text-indigo-800/60 text-sm text-center mt-3 leading-relaxed">
          {wellness.constitutionExplanation}
        </p>
      </div>

      {/* Five Elements Snapshot */}
      <div className="mystic-card rounded-3xl p-5">
        <h4 className="text-sm font-medium text-earth-500 mb-3 text-center">
          Your Elemental Balance
        </h4>
        <div className="space-y-2">
          {elementList.map((el) => (
            <div key={el} className="flex items-center gap-3">
              <span className="w-7 text-sm">{ELEMENT_EMOJI[el]}</span>
              <span className="w-5 text-xs text-indigo-800/60">{el}</span>
              <div className="flex-1 h-3 rounded-full bg-cream-200 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(elements[el] / Math.max(maxCount, 1)) * 100}%`,
                    backgroundColor: ELEMENT_COLORS[el],
                  }}
                />
              </div>
              <span className="text-xs text-earth-500 w-3">{elements[el]}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-4 mt-3 text-xs">
          <span className="text-sage-500">
            Nourish: {favorableElements.map((e) => ELEMENT_EMOJI[e] + e).join(", ")}
          </span>
          <span className="text-indigo-800/30">·</span>
          <span className="text-rose-500">
            Go easy: {unfavorableElements.map((e) => ELEMENT_EMOJI[e] + e).join(", ")}
          </span>
        </div>
      </div>

      {/* 🍽️ Food */}
      <div className="mystic-card rounded-3xl p-6">
        <SectionTitle emoji="🍽️" title="Nourish · 食" />
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-earth-500 mb-1">
              Favorable Ingredients
            </p>
            <div className="flex flex-wrap gap-1.5">
              {wellness.food.favorableIngredients.map((ing) => (
                <span
                  key={ing}
                  className="px-2 py-1 rounded-xl bg-sage-300/20 text-sage-500 text-xs"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-earth-500 mb-1">Better to Limit</p>
            <div className="flex flex-wrap gap-1.5">
              {wellness.food.avoidIngredients.map((ing) => (
                <span
                  key={ing}
                  className="px-2 py-1 rounded-xl bg-rose-400/10 text-rose-500 text-xs"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 rounded-2xl bg-cream-200/60">
          <p className="text-xs text-gold-500 font-medium">
            🍲 {wellness.food.seasonalRecipe.name}
          </p>
          <p className="text-xs text-indigo-800/60 mt-1">
            {wellness.food.seasonalRecipe.why}
          </p>
          <p className="text-xs text-indigo-800/80 mt-1">
            {wellness.food.seasonalRecipe.briefRecipe}
          </p>
        </div>
        <p className="text-xs text-earth-500 mt-2">
          {wellness.food.mealRhythm}
        </p>
      </div>

      {/* 🏠 Home */}
      <div className="mystic-card rounded-3xl p-6">
        <SectionTitle emoji="🏠" title="Nest · 住" />
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div className="flex gap-2">
            <span className="text-earth-500">Bed:</span>
            <span className="text-indigo-800/80">
              {wellness.home.bedroomDirection}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="text-earth-500">Wealth Corner:</span>
            <span className="text-indigo-800/80">
              {wellness.home.wealthCorner}
            </span>
          </div>
        </div>
        <p className="text-xs text-earth-500 mt-3">
          {wellness.home.seasonalAdjustment}
        </p>
      </div>

      {/* 🧘 Body */}
      <div className="mystic-card rounded-3xl p-6">
        <SectionTitle emoji="🧘" title="Body · 身" />
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-earth-500">Focus:</span>{" "}
            <span className="text-indigo-800/80">
              {wellness.body.meridianFocus}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-cream-200/60">
            <p className="text-xs text-gold-500 font-medium">
              Your 2-Minute Ritual
            </p>
            <p className="text-indigo-800/80 mt-1">
              {wellness.body.selfCareRitual}
            </p>
          </div>
          <div>
            <span className="text-earth-500">Emotional rhythm:</span>{" "}
            <span className="text-indigo-800/80">
              {wellness.body.emotionalCycle}
            </span>
          </div>
          <div>
            <span className="text-earth-500">Sleep:</span>{" "}
            <span className="text-indigo-800/80">
              {wellness.body.sleepGuide}
            </span>
          </div>
        </div>
      </div>

      {/* 💎 Featured Crystal */}
      {wellness.crystalSet.length > 0 && (
        <div className="mystic-card rounded-3xl p-6 glow">
          <SectionTitle emoji="💎" title="Your Crystal Companion" />
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-cream-200/60">
            <span className="text-3xl">💎</span>
            <div>
              <p className="font-medium text-indigo-900 text-sm">
                {wellness.crystalSet[0].crystal}{" "}
                <span className="text-xs text-gold-500">
                  ({wellness.crystalSet[0].element})
                </span>
              </p>
              <p className="text-xs text-indigo-800/60">
                {wellness.crystalSet[0].wearing} —{" "}
                {wellness.crystalSet[0].benefit}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 🏺 Home Product */}
      <div className="mystic-card rounded-3xl p-5 bg-gradient-to-r from-cream-200/60 to-cream-100/80">
        <div className="flex gap-3">
          <span className="text-2xl">🏺</span>
          <div>
            <p className="font-medium text-indigo-900 text-sm">
              {wellness.homeProduct.name}
            </p>
            <p className="text-xs text-indigo-800/60">
              {wellness.homeProduct.placement} — {wellness.homeProduct.benefit}
            </p>
          </div>
        </div>
      </div>

      {/* 2026 Forecast */}
      <div className="mystic-card rounded-3xl p-5">
        <SectionTitle emoji="🐴" title="2026 · Year of the Horse" />
        <p className="text-indigo-800/80 text-sm leading-relaxed">
          {wellness.forecast2026}
        </p>
      </div>

      {/* Daily Mantra */}
      <div className="text-center py-6">
        <p className="text-gold-500 text-lg italic font-medium">
          {wellness.mantra}
        </p>
        <p className="text-xs text-earth-500 mt-2">Your morning affirmation</p>
      </div>
    </div>
  );
}
