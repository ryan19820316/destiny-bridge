"use client";

import { DailyGuidance } from "@/types";
import { useState, useEffect } from "react";

export default function DailyGuidanceCard({ birthData }: { birthData: { year: number; month: number; day: number; hour: number; gender: string } | null }) {
  const [guidance, setGuidance] = useState<DailyGuidance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDaily = async () => {
    if (!birthData) return;
    setLoading(true);
    setError(null);
    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await fetch("/api/daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...birthData, date: today }),
      });
      if (!res.ok) throw new Error("Failed to fetch daily guidance");
      const data = await res.json();
      setGuidance(data.dailyGuidance || null);
      if (data.error) setError(data.error);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (birthData) fetchDaily();
  }, []);

  if (!birthData) return null;

  return (
    <div className="mystic-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          ☀️ Today&apos;s <span className="gold-text">Guidance</span>
        </h3>
        <button
          onClick={fetchDaily}
          disabled={loading}
          className="text-xs text-gold-400 hover:text-gold-300 transition-colors"
        >
          {loading ? "Refreshing..." : "↻ Refresh"}
        </button>
      </div>

      {error && !guidance && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
          {error}
          <p className="text-xs mt-1 text-gray-500">Add your Anthropic API key in .env.local to unlock daily guidance.</p>
        </div>
      )}

      {!guidance && !error && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm">Your daily wellness tips — powered by your Ba Zi chart.</p>
          <p className="text-xs text-gray-500 mt-2">Available with <span className="text-gold-400">Monthly Navigator</span> subscription.</p>
        </div>
      )}

      {loading && !guidance && (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 mx-auto mb-3 border-2 border-gold-400/30 border-t-gold-400 rounded-full" />
          <p className="text-gray-400 text-sm">Consulting the energies...</p>
        </div>
      )}

      {guidance && (
        <div className="space-y-4">
          {/* Energy Index */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-mystic-700/40">
            <div className="w-12 h-12 rounded-full bg-mystic-800 flex items-center justify-center text-xl font-bold gold-text">
              {guidance.energyIndex}
            </div>
            <div>
              <p className="text-sm text-gray-200">{guidance.energySummary}</p>
              <div className="flex gap-0.5 mt-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className={`w-2 h-1 rounded-full ${i < guidance.energyIndex ? "bg-gold-400" : "bg-mystic-600"}`} />
                ))}
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {/* Food */}
            <div className="p-3 rounded-xl bg-mystic-700/30">
              <p className="text-xs text-gray-500 mb-1">🍽️ Nourish</p>
              <p className="text-sm font-medium text-gold-200">{guidance.food.ingredient}</p>
              <p className="text-xs text-gray-400 mt-0.5">{guidance.food.tip}</p>
            </div>

            {/* Clothing */}
            <div className="p-3 rounded-xl bg-mystic-700/30">
              <p className="text-xs text-gray-500 mb-1">👗 Dress</p>
              <p className="text-sm font-medium text-gold-200">{guidance.clothing.powerColor}</p>
              <p className="text-xs text-gray-400 mt-0.5">Skip: {guidance.clothing.avoidColor}</p>
            </div>

            {/* Home */}
            <div className="p-3 rounded-xl bg-mystic-700/30">
              <p className="text-xs text-gray-500 mb-1">🏠 Nest</p>
              <p className="text-sm text-gray-200">{guidance.home.quickTask}</p>
              <p className="text-xs text-gray-400 mt-0.5">{guidance.home.crystalTip}</p>
            </div>

            {/* Travel */}
            <div className="p-3 rounded-xl bg-mystic-700/30">
              <p className="text-xs text-gray-500 mb-1">🚶 Move</p>
              <p className="text-sm font-medium text-gold-200">{guidance.travel.direction}</p>
              <p className="text-xs text-gray-400 mt-0.5">Best: {guidance.travel.bestTime}</p>
            </div>
          </div>

          {/* Body + Mantra */}
          <div className="p-3 rounded-xl bg-mystic-700/40">
            <p className="text-xs text-gray-500 mb-1">🧘 Body</p>
            <p className="text-sm text-gray-200">{guidance.body.focus}</p>
            <p className="text-xs text-gold-400 mt-1 italic">{guidance.body.twoMinuteRitual}</p>
          </div>

          <div className="text-center py-2">
            <p className="text-gold-300 text-sm italic">&ldquo;{guidance.mantra}&rdquo;</p>
          </div>
        </div>
      )}
    </div>
  );
}
