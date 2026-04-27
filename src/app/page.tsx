"use client";

import { useState } from "react";
import { BaziResult, BirthData } from "@/types";
import { updateProfile } from "@/lib/profile";
import Hero from "@/components/Hero";
import BaziForm from "@/components/BaziForm";
import WellnessReport from "@/components/WellnessReport";
import DailyGuidanceCard from "@/components/DailyGuidanceCard";
import VentChat from "@/components/VentChat";
import PricingSection from "@/components/PricingSection";
import ShopSection from "@/components/ShopSection";
import Footer from "@/components/Footer";

export default function Home() {
  const [result, setResult] = useState<BaziResult | null>(null);
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        body: JSON.stringify(data),
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

  return (
    <div className="flex flex-col">
      {/* Module 1: Bazi Test */}
      <Hero />

      <section id="get-started" className="py-12 px-6 scroll-mt-20">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-indigo-900 mb-2">
              Discover Your <span className="gold-text">Blueprint</span>
            </h2>
            <p className="text-earth-500 text-sm">
              Enter your birth details. Clara will reveal your energetic chart.
            </p>
            <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-gold-400/10">
              <span className="text-xs text-gold-500 font-semibold">$9.99</span>
              <span className="text-xs text-earth-500">one-time · instant delivery</span>
            </div>
          </div>

          <div className="mystic-card rounded-3xl p-6 sm:p-8">
            <BaziForm onSubmit={handleSubmit} loading={loading} />
            {error && (
              <div className="mt-4 p-4 rounded-2xl bg-rose-400/10 border border-rose-400/30 text-rose-500 text-sm text-center">
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
              <div className="mystic-card rounded-3xl p-8 text-center">
                <p className="text-indigo-800/60 text-sm">
                  Your report is being prepared...
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Module 2: Clara Membership (Daily + Vent) */}
      <section id="clara-membership" className="py-16 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-indigo-900 mb-3">
            Your Daily <span className="gold-text">Companion</span>
          </h2>
          <p className="text-earth-500 max-w-lg mx-auto text-sm">
            Clara helps you start each day with balance — and she&apos;s always here when you need to vent.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <DailyGuidanceCard birthData={birthData} />
          <VentChat />
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
