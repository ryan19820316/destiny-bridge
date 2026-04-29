"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getPendingPurchase } from "@/lib/payment";
import { updateProfile } from "@/lib/profile";

type Status = "loading" | "done" | "error";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const purchaseType = searchParams.get("type") || "bazi";
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const data = getPendingPurchase<{ birthData?: unknown; email?: string }>();

    if (purchaseType === "member") {
      updateProfile({ membershipStatus: "active" });
      setStatus("done");
      return;
    }

    if (purchaseType === "bazi" && data?.birthData) {
      fetch("/api/bazi-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...(data.birthData as Record<string, unknown>), lang: "zh", email: data.email || "" }),
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Report generation queued");
        })
        .then(() => setStatus("done"))
        .catch((e) => {
          setError(e instanceof Error ? e.message : "Report will be retried");
          setStatus("done");
        });
    } else {
      setStatus("done");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-md mx-auto text-center space-y-6">
        {status === "loading" && (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-gold-400/20 flex items-center justify-center">
              <svg className="animate-spin w-8 h-8 text-gold-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <p className="text-gray-400">Generating your report...</p>
          </div>
        )}

        {status === "done" && (
          <div className="space-y-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center text-4xl">
              ✅
            </div>
            <h1 className="text-3xl font-bold text-white">
              {purchaseType === "member" ? "Welcome to the Circle" : "Payment Successful"}
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              {purchaseType === "member"
                ? "Your Clara Membership is now active. Daily five-element guidance, unlimited divinations, and vent chat are all yours."
                : "Your report will be generated and sent to your email shortly. You can close this page now."}
            </p>
            {error && (
              <p className="text-amber-400 text-xs bg-amber-400/10 rounded-lg p-3 border border-amber-400/20">
                {error}
              </p>
            )}
            <a
              href="/"
              className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-gold-400 to-gold-300 text-mystic-950 font-semibold text-lg hover:from-gold-300 hover:to-gold-200 transition-all shadow-lg"
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
