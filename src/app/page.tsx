"use client";

import { useState, useRef } from "react";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import PricingSection from "@/components/PricingSection";
import BaziForm from "@/components/BaziForm";
import ReportDisplay from "@/components/ReportDisplay";
import WellnessReport from "@/components/WellnessReport";
import DailyGuidanceCard from "@/components/DailyGuidanceCard";
import CommunitySection from "@/components/CommunitySection";
import ReferralSection from "@/components/ReferralSection";
import { BirthData, BaziResult } from "@/types";

export default function Home() {
  const [result, setResult] = useState<BaziResult | null>(null);
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (data: BirthData) => {
    setLoading(true);
    setError(null);
    setBirthData(data);

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
      {/* Hero */}
      <Hero />

      {/* Form Section */}
      <section id="get-started" ref={formRef} className="py-24 px-6">
        <div className="max-w-lg mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">
            Enter Your <span className="gold-text">Birth Details</span>
          </h2>
          <p className="text-gray-400 text-center mb-10">
            Your exact birth time gives the most accurate reading — for you and your family.
          </p>
          <div className="mystic-card rounded-2xl p-6 sm:p-8">
            <BaziForm onSubmit={handleSubmit} loading={loading} />
          </div>
          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Result Section */}
      {result && (
        <section id="result-section" className="py-16 px-6 bg-mystic-900/50">
          <div className="max-w-2xl mx-auto">
            {result.wellnessReport ? (
              <WellnessReport
                bazi={result}
                birthData={birthData!}
                wellness={result.wellnessReport}
              />
            ) : (
              <ReportDisplay bazi={result} birthData={birthData!} />
            )}
          </div>
        </section>
      )}

      {/* Daily Guidance — shown after user has a reading */}
      {birthData && (
        <section className="py-16 px-6">
          <div className="max-w-lg mx-auto">
            <DailyGuidanceCard birthData={birthData} />
          </div>
        </section>
      )}

      {/* Features */}
      <Features />

      {/* Pricing */}
      <PricingSection />

      {/* Community — Clara Circle */}
      <CommunitySection />

      {/* Referral */}
      <ReferralSection />

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-mystic-700/50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-gold-400 text-lg font-semibold">DestinyBridge</span>
            <span className="text-xs text-gray-500 ml-2">v2.0 · Clara Edition</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-gold-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gold-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-gold-300 transition-colors">Contact</a>
          </div>
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} DestinyBridge. Wellness guidance, not medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
