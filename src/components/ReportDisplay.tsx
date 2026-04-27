"use client";

import { BaziResult, BirthData } from "@/types";

interface Props {
  bazi: BaziResult;
  birthData: BirthData;
}

const ELEMENT_COLORS: Record<string, string> = {
  木: "#4ade80",
  火: "#f87171",
  土: "#fbbf24",
  金: "#f8ebc0",
  水: "#60a5fa",
};

function PillarLabel({ name, pillar }: { name: string; pillar: { stem: string; branch: string } }) {
  return (
    <div className="text-center">
      <div className="text-xs text-gray-500 uppercase mb-1">{name}</div>
      <div className="text-2xl font-bold gold-text">{pillar.stem}{pillar.branch}</div>
      <div className="text-xs text-gray-400 mt-1">{pillar.stem} {pillar.branch}</div>
    </div>
  );
}

export default function ReportDisplay({ bazi, birthData }: Props) {
  const { chart, elements, dayMaster, favorableElements, unfavorableElements, tenGods, aiReport } = bazi;

  const elementList: Array<"木"|"火"|"土"|"金"|"水"> = ["木", "火", "土", "金", "水"];
  const maxCount = Math.max(...elementList.map((e) => elements[e]));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          Your <span className="gold-text">Destiny Blueprint</span>
        </h2>
        <p className="text-gray-400 text-sm">
          {birthData.year}-{String(birthData.month).padStart(2, "0")}-
          {String(birthData.day).padStart(2, "0")} at {String(birthData.hour).padStart(2, "0")}:00
          {" · "}
          {birthData.gender === "male" ? "♂ Male" : "♀ Female"}
        </p>
      </div>

      {/* Four Pillars */}
      <div className="mystic-card rounded-2xl p-6">
        <h3 className="text-sm font-medium text-gray-400 mb-4 text-center">
          Four Pillars of Destiny
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <PillarLabel name="Year (年)" pillar={chart.year} />
          <PillarLabel name="Month (月)" pillar={chart.month} />
          <PillarLabel name="Day (日)" pillar={chart.day} />
          <PillarLabel name="Hour (时)" pillar={chart.hour} />
        </div>

        {/* Hidden stems */}
        <div className="mt-4 pt-4 border-t border-mystic-600/50">
          <div className="grid grid-cols-4 gap-4 text-center text-xs text-gray-500">
            <div>Hidden: {chart.year.hiddenStems.join(", ")}</div>
            <div>Hidden: {chart.month.hiddenStems.join(", ")}</div>
            <div>Hidden: {chart.day.hiddenStems.join(", ")}</div>
            <div>Hidden: {chart.hour.hiddenStems.join(", ")}</div>
          </div>
        </div>
      </div>

      {/* Day Master + Five Elements */}
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Day Master */}
        <div className="mystic-card rounded-2xl p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Day Master</h3>
          <div className="flex items-center gap-4">
            <span
              className="text-5xl font-bold"
              style={{ color: ELEMENT_COLORS[dayMaster.element] }}
            >
              {dayMaster.stem}
            </span>
            <div>
              <p className="text-lg font-semibold">
                {dayMaster.element} ·{" "}
                <span className="capitalize">{dayMaster.strength}</span>
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Your core self — the element that defines your energy
              </p>
            </div>
          </div>
        </div>

        {/* Five Elements */}
        <div className="mystic-card rounded-2xl p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Five Elements Balance</h3>
          <div className="space-y-2">
            {elementList.map((el) => (
              <div key={el} className="flex items-center gap-3">
                <span className="w-6 text-xs text-gray-500">{el}</span>
                <div className="flex-1 h-4 rounded-full bg-mystic-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(elements[el] / Math.max(maxCount, 1)) * 100}%`,
                      backgroundColor: ELEMENT_COLORS[el],
                    }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-4">{elements[el]}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-3 text-xs">
            <span className="text-green-400">
              Favorable: {favorableElements.join(", ")}
            </span>
            <span className="text-gray-500">·</span>
            <span className="text-red-400">
              Watch: {unfavorableElements.join(", ")}
            </span>
          </div>
        </div>
      </div>

      {/* Ten Gods */}
      <div className="mystic-card rounded-2xl p-6">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Ten Gods (十神)</h3>
        <div className="grid grid-cols-4 gap-3 text-center">
          {tenGods.map((tg) => (
            <div key={tg.pillar}>
              <div className="text-xs text-gray-500 capitalize mb-1">{tg.pillar}</div>
              <div className="text-sm font-medium text-gold-200">{tg.god}</div>
              <div className="text-xs text-gray-400">{tg.element}</div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Report */}
      {aiReport ? (
        <div className="mystic-card rounded-2xl p-6 glow border-gold-400/30">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm font-medium text-gold-300">
              Your Complete Reading
            </span>
            <span className="px-2 py-0.5 rounded-full bg-gold-400/20 text-gold-300 text-xs">
              AI-Generated
            </span>
          </div>

          <div className="space-y-5">
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-1">Overview</h4>
              <p className="text-gray-200 leading-relaxed">{aiReport.summary}</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Personality</h4>
                <p className="text-gray-200 text-sm leading-relaxed">{aiReport.personality}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Career</h4>
                <p className="text-gray-200 text-sm leading-relaxed">{aiReport.career}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Relationships</h4>
                <p className="text-gray-200 text-sm leading-relaxed">{aiReport.relationships}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Health</h4>
                <p className="text-gray-200 text-sm leading-relaxed">{aiReport.health}</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-1">Wealth</h4>
              <p className="text-gray-200 leading-relaxed">{aiReport.wealth}</p>
            </div>
            <div className="p-4 rounded-xl bg-mystic-700/50 border border-mystic-600/50">
              <h4 className="text-sm font-medium text-gold-300 mb-2">
                2026 Year of the Horse Forecast
              </h4>
              <p className="text-gray-200 text-sm leading-relaxed">{aiReport.forecast2026}</p>
            </div>

            {/* Crystal Recommendation */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-mystic-700/50 to-mystic-800/50 border border-gold-400/20">
              <h4 className="text-sm font-medium text-gold-300 mb-2">
                Your Crystal Prescription
              </h4>
              <div className="flex items-start gap-4">
                <span className="text-4xl">💎</span>
                <div>
                  <p className="font-semibold text-white">
                    {aiReport.crystalRecommendation.crystal}
                  </p>
                  <p className="text-xs text-gold-400 mb-1">
                    Element: {aiReport.crystalRecommendation.element}
                  </p>
                  <p className="text-sm text-gray-300">
                    {aiReport.crystalRecommendation.reason}
                  </p>
                  <button className="mt-3 px-4 py-2 rounded-full bg-gold-400/20 text-gold-300 text-sm font-medium hover:bg-gold-400/30 transition-all">
                    Shop This Crystal →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mystic-card rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-lg font-semibold mb-2">Unlock Your Full Reading</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
            See your complete personality analysis, 2026 forecast, career
            guidance, relationship insights, and personalized crystal
            recommendation.
          </p>

          {/* Pricing cards for upgrade */}
          <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-4">
            <div className="p-4 rounded-xl bg-mystic-700/50 border border-gold-400/20 text-left">
              <div className="text-xs text-gold-300 font-medium mb-1">One-Time</div>
              <div className="text-2xl font-bold gold-text mb-2">$19.99</div>
              <p className="text-xs text-gray-400">Full report with PDF download</p>
              <button className="mt-3 w-full py-2 rounded-lg bg-gold-400 text-mystic-950 text-sm font-semibold hover:bg-gold-300 transition-all">
                Buy Report →
              </button>
            </div>
            <div className="p-4 rounded-xl bg-mystic-700/50 border border-mystic-600/50 text-left">
              <div className="text-xs text-gray-400 font-medium mb-1">Monthly</div>
              <div className="text-2xl font-bold text-white mb-2">
                $9.99<span className="text-sm text-gray-400">/mo</span>
              </div>
              <p className="text-xs text-gray-400">Monthly updates + community</p>
              <button className="mt-3 w-full py-2 rounded-lg border border-gold-400/30 text-gold-300 text-sm font-semibold hover:bg-gold-400/10 transition-all">
                Subscribe →
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Payments secured by Lemon Squeezy. Instant access after purchase.
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-center text-xs text-gray-600">
        This reading is for entertainment and personal growth purposes. It does
        not constitute medical, legal, or financial advice.
      </p>
    </div>
  );
}
