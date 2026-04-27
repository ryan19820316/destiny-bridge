"use client";

import { DailyGuidance } from "@/types";
import { useState, useEffect } from "react";
import { isMemberActive, startFreeTrial } from "@/lib/profile";

interface Props {
  birthData: { year: number; month: number; day: number; hour: number; gender: string } | null;
}

export default function DailyGuidanceCard({ birthData }: Props) {
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
    if (birthData && isMemberActive()) fetchDaily();
  }, []);

  if (!birthData) return null;

  const memberActive = isMemberActive();

  if (!memberActive) {
    return (
      <div className="mystic-card rounded-2xl p-8 text-center space-y-4">
        <div className="text-4xl">☀️</div>
        <h3 className="text-xl font-bold text-white">Daily Wellness Guidance</h3>
        <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
          Every morning, Clara prepares your personal energy report — what to eat, what to wear, and how to find balance today.
        </p>
        <button
          onClick={() => {
            startFreeTrial();
            window.location.reload();
          }}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold-400 to-gold-300 text-mystic-950 font-semibold text-sm hover:from-gold-300 hover:to-gold-200 transition-all shadow-lg"
        >
          Start 7-Day Free Trial
        </button>
        <p className="text-xs text-gray-500">Then $6.99/month. Cancel anytime.</p>
      </div>
    );
  }

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
        </div>
      )}

      {!guidance && !error && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm">Tap refresh to get today&apos;s guidance.</p>
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
            <div className="p-3 rounded-xl bg-mystic-700/30">
              <p className="text-xs text-gray-500 mb-1">🍽️ Nourish</p>
              <p className="text-sm font-medium text-gold-200">{guidance.food.ingredient}</p>
              <p className="text-xs text-gray-400 mt-0.5">{guidance.food.tip}</p>
            </div>
            <div className="p-3 rounded-xl bg-mystic-700/30">
              <p className="text-xs text-gray-500 mb-1">👗 Dress</p>
              <p className="text-sm font-medium text-gold-200">{guidance.clothing.powerColor}</p>
              <p className="text-xs text-gray-400 mt-0.5">Skip: {guidance.clothing.avoidColor}</p>
            </div>
            <div className="p-3 rounded-xl bg-mystic-700/30">
              <p className="text-xs text-gray-500 mb-1">🏠 Nest</p>
              <p className="text-sm text-gray-200">{guidance.home.quickTask}</p>
              <p className="text-xs text-gray-400 mt-0.5">{guidance.home.crystalTip}</p>
            </div>
            <div className="p-3 rounded-xl bg-mystic-700/30">
              <p className="text-xs text-gray-500 mb-1">🚶 Move</p>
              <p className="text-sm font-medium text-gold-200">{guidance.travel.direction}</p>
              <p className="text-xs text-gray-400 mt-0.5">Best: {guidance.travel.bestTime}</p>
            </div>
          </div>

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
