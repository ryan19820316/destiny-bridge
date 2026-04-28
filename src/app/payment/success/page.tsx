"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getPendingPurchase } from "@/lib/payment";
import { updateProfile } from "@/lib/profile";
import { BaziResult, BirthData } from "@/types";
import WellnessReport from "@/components/WellnessReport";

type PurchaseType = "bazi" | "member";
type Status = "loading" | "unlocking" | "done" | "error";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const purchaseType = (searchParams.get("type") || "bazi") as PurchaseType;
  const [status, setStatus] = useState<Status>("loading");
  const [baziResult, setBaziResult] = useState<BaziResult | null>(null);
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const data = getPendingPurchase<{ birthData?: BirthData }>();

    if (purchaseType === "member") {
      updateProfile({ membershipStatus: "active" });
      setStatus("done");
      return;
    }

    if (purchaseType === "bazi" && data?.birthData) {
      setBirthData(data.birthData);
      unlockReport(data.birthData);
    } else {
      setStatus("done");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function unlockReport(birthData: BirthData) {
    setStatus("unlocking");
    try {
      const res = await fetch("/api/bazi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...birthData, generateAI: true }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Report generation failed");
      }
      const result: BaziResult = await res.json();
      setBaziResult(result);
      updateProfile({ baziData: birthData });
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        {status === "loading" && (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-gold-400/20 flex items-center justify-center">
              <svg className="animate-spin w-8 h-8 text-gold-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <p className="text-gray-400">Verifying your payment...</p>
          </div>
        )}

        {status === "unlocking" && (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-gold-400/20 flex items-center justify-center">
              <svg className="animate-spin w-8 h-8 text-gold-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <p className="text-gold-300 font-medium">Payment confirmed!</p>
            <p className="text-gray-400">Clara is writing your personalized wellness blueprint...</p>
          </div>
        )}

        {status === "done" && purchaseType === "member" && (
          <div className="space-y-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-3xl">
              🎉
            </div>
            <h1 className="text-3xl font-bold text-white">Welcome to the Circle</h1>
            <p className="text-gray-400 max-w-md mx-auto">
              Your Clara Membership is now active. Daily five-element guidance, unlimited Xiao Liu Ren deep readings, and vent chat are all yours.
            </p>
            <a
              href="/#clara-membership"
              className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-gold-400 to-gold-300 text-mystic-950 font-semibold text-lg hover:from-gold-300 hover:to-gold-200 transition-all shadow-lg"
            >
              Start Exploring →
            </a>
          </div>
        )}

        {status === "done" && purchaseType === "bazi" && baziResult?.wellnessReport && birthData && (
          <div className="space-y-6 text-left">
            <div className="text-center space-y-3">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-3xl">
                ✨
              </div>
              <h1 className="text-3xl font-bold text-white">Your Blueprint Is Ready</h1>
              <p className="text-gray-400">
                Paid and unlocked. Here is your complete wellness report.
              </p>
            </div>
            <WellnessReport bazi={baziResult} birthData={birthData} wellness={baziResult.wellnessReport} />
            <div className="text-center">
              <a
                href="/#clara-membership"
                className="text-gold-400 hover:text-gold-300 text-sm underline underline-offset-4"
              >
                Continue to Daily Companion →
              </a>
            </div>
          </div>
        )}

        {status === "done" && purchaseType === "bazi" && !baziResult?.wellnessReport && (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-gold-400/20 flex items-center justify-center text-3xl">
              🔮
            </div>
            <h1 className="text-2xl font-bold text-white">Payment Confirmed</h1>
            <p className="text-gray-400">
              Your purchase is complete. Return to the home page and enter your birth details to generate your blueprint.
            </p>
            <a
              href="/#get-started"
              className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-gold-400 to-gold-300 text-mystic-950 font-semibold text-lg hover:from-gold-300 hover:to-gold-200 transition-all shadow-lg"
            >
              Generate My Blueprint →
            </a>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-3xl">
              ⚠
            </div>
            <h1 className="text-2xl font-bold text-white">Something Went Wrong</h1>
            <p className="text-red-400 text-sm">{error}</p>
            <p className="text-gray-400 text-sm">
              Your payment went through, but we could not generate your report. Your birth data is saved — try again from the home page.
            </p>
            <a
              href="/"
              className="inline-block px-8 py-4 rounded-xl bg-mystic-800 border border-mystic-600 text-white font-semibold hover:bg-mystic-700 transition-all"
            >
              Back to Home →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 text-gold-400">
          <svg className="animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
