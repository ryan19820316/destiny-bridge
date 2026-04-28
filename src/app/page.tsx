"use client";

import { useState } from "react";
import { BaziResult, BirthData } from "@/types";
import { updateProfile } from "@/lib/profile";
import { savePendingPurchase, createGumroadCheckout, PRICING } from "@/lib/payment";
import Hero from "@/components/Hero";
import BaziForm from "@/components/BaziForm";
import WellnessReport from "@/components/WellnessReport";
import DailyGuidanceCard from "@/components/DailyGuidanceCard";
import VentChat from "@/components/VentChat";
import PricingSection from "@/components/PricingSection";
import ShopSection from "@/components/ShopSection";
import XiaoLiuRen from "@/components/XiaoLiuRen";
import LiuYaoDivination from "@/components/LiuYaoDivination";
import Footer from "@/components/Footer";

const ELEMENT_EMOJI: Record<string, string> = {
  木: "🌿", 火: "🔥", 土: "🏔️", 金: "✨", 水: "💧",
};

function ChartPreview({ result, birthData }: { result: BaziResult; birthData: BirthData }) {
  const { chart, elements, dayMaster, favorableElements, unfavorableElements, tenGods } = result;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <p className="text-xs text-gold-400 uppercase tracking-widest mb-2">Your Ba Zi Chart</p>
        <h2 className="text-2xl font-bold mb-1">
          <span className="gold-text">Four Pillars</span>
        </h2>
        <p className="text-gray-400 text-sm">
          {birthData.year}-{String(birthData.month).padStart(2, "0")}-
          {String(birthData.day).padStart(2, "0")}
          {" · "}{birthData.gender === "male" ? "♂" : "♀"}
        </p>
      </div>

      {/* Four Pillars Table */}
      <div className="mystic-card rounded-2xl overflow-hidden">
        <div className="grid grid-cols-4 text-center text-sm">
          {(["year", "month", "day", "hour"] as const).map((p) => (
            <div key={p} className="p-3 border-r border-mystic-700/50 last:border-r-0">
              <p className="text-gray-500 text-xs capitalize mb-1">{p}</p>
              <p className="text-xl font-bold text-white">
                {chart[p].stem}{chart[p].branch}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {ELEMENT_EMOJI[chart[p].stemElement]}{chart[p].stemElement}
                {" + "}
                {ELEMENT_EMOJI[chart[p].branchElement]}{chart[p].branchElement}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                {chart[p].hiddenStems.join(" ")}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Day Master + Elements */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="mystic-card rounded-2xl p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Day Master</p>
          <p className="text-3xl font-bold text-white">
            {dayMaster.stem}
            <span className="text-lg ml-1 text-gray-400">({ELEMENT_EMOJI[dayMaster.element]}{dayMaster.element})</span>
          </p>
          <p className="text-xs text-gray-500 mt-1 capitalize">{dayMaster.strength}</p>
        </div>
        <div className="mystic-card rounded-2xl p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Five Elements</p>
          <div className="flex justify-center gap-3 text-lg">
            {(Object.keys(elements) as Array<keyof typeof elements>).map((el) => (
              <span key={el} className="text-sm">
                {ELEMENT_EMOJI[el]}
                <span className="text-gray-300 ml-0.5">{elements[el]}</span>
              </span>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-2 text-xs">
            <span className="text-green-400">
              Nourish: {favorableElements.map(e => ELEMENT_EMOJI[e] + e).join(", ")}
            </span>
            <span className="text-red-400">
              Go easy: {unfavorableElements.map(e => ELEMENT_EMOJI[e] + e).join(", ")}
            </span>
          </div>
        </div>
      </div>

      {/* Ten Gods */}
      <div className="mystic-card rounded-2xl p-4">
        <p className="text-xs text-gray-500 mb-2 text-center">Ten Gods (十神)</p>
        <div className="flex justify-center gap-4 text-sm">
          {tenGods.map((tg) => (
            <div key={tg.pillar} className="text-center">
              <p className="text-xs text-gray-500 capitalize">{tg.pillar}</p>
              <p className="text-gold-300 font-medium">{tg.god}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [result, setResult] = useState<BaziResult | null>(null);
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"daily" | "vent" | "liuren" | "liuyao">("daily");

  const handleSubmit = async (data: BirthData) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setBirthData(data);

    updateProfile({ baziData: data });

    try {
      const res = await fetch("/api/bazi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, generateAI: false }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Something went wrong");
      }
      const baziResult: BaziResult = await res.json();
      setResult(baziResult);
      setTimeout(() => {
        document.getElementById("result-section")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = () => {
    if (!birthData) return;
    savePendingPurchase({ birthData });
    window.location.href = createGumroadCheckout(PRICING.baziBlueprint.permalink);
  };

  return (
    <div className="flex flex-col">
      {/* Module 1: Bazi Test */}
      <Hero />

      <section id="get-started" className="py-12 px-6 scroll-mt-20">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Discover Your <span className="gold-text">Blueprint</span>
            </h2>
            <p className="text-gray-400 text-sm">
              Enter your birth details. Clara will reveal your energetic chart.
            </p>
            <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-gold-400/10">
              <span className="text-xs text-gold-300 font-semibold">$9.99</span>
              <span className="text-xs text-gray-400">one-time · instant delivery</span>
            </div>
          </div>

          <div className="mystic-card rounded-2xl p-6 sm:p-8">
            <BaziForm onSubmit={handleSubmit} loading={loading} />
            {error && (
              <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
                {error}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Result Section */}
      {result && birthData && (
        <section id="result-section" className="py-12 px-6 scroll-mt-20">
          <div className="max-w-2xl mx-auto">
            {result.wellnessReport ? (
              <WellnessReport
                bazi={result}
                birthData={birthData}
                wellness={result.wellnessReport}
              />
            ) : (
              <div className="space-y-6">
                <ChartPreview result={result} birthData={birthData} />
                {/* Generate Full Report CTA */}
                <div className="mystic-card rounded-2xl p-6 text-center space-y-4 glow border-gold-400/30">
                  <p className="text-gray-200 font-medium">
                    Unlock Your Complete Wellness Blueprint
                  </p>
                  <p className="text-gray-400 text-sm max-w-md mx-auto">
                    Get your body constitution, personalized food guide, home Feng Shui tips, 2-minute self-care ritual, and 2026 forecast — all tailored to your chart.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-gold-300 text-lg font-bold">
                    $9.99 <span className="text-gray-500 text-sm font-normal">one-time</span>
                  </div>
                  <button
                    onClick={handleGenerateReport}
                    disabled={aiLoading}
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-gold-400 to-gold-300 text-mystic-950 font-semibold text-lg hover:from-gold-300 hover:to-gold-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {aiLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Clara is writing your report...
                      </span>
                    ) : (
                      "Generate My Wellness Report →"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Module 2: Clara Membership (Daily + Vent + Divination) */}
      <section id="clara-membership" className="py-16 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Your Daily <span className="gold-text">Companion</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto text-sm">
            Daily guidance, a listening ear, and ancient divination — Clara has your back.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-1 mb-6">
          {([
            { id: "daily", label: "Daily Guide", emoji: "📅" },
            { id: "vent", label: "Vent to Clara", emoji: "🍵" },
            { id: "liuren", label: "小六壬 Divination", emoji: "🔮" },
            { id: "liuyao", label: "六爻 I Ching", emoji: "☯️" },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-gold-400/20 text-gold-300 border border-gold-400/30"
                  : "bg-mystic-800/50 text-gray-400 hover:bg-mystic-700/50"
              }`}
            >
              <span className="mr-1.5">{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="max-w-2xl mx-auto">
          {activeTab === "daily" && <DailyGuidanceCard birthData={birthData} />}
          {activeTab === "vent" && <VentChat />}
          {activeTab === "liuren" && <XiaoLiuRen />}
          {activeTab === "liuyao" && <LiuYaoDivination />}
        </div>
      </section>

      {/* Module 3: Feng Shui Shop */}
      <ShopSection />

      {/* Pricing */}
      <PricingSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
