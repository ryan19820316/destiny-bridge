"use client";

import { generateReferralCode, COMMISSION_TIERS, calculateCommission } from "@/lib/referral";
import { useState } from "react";

export default function ReferralSection({ userId }: { userId?: string }) {
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const id = userId || `user_${Date.now().toString(36)}`;
    const newCode = generateReferralCode(id);
    setCode(newCode);
  };

  const handleCopy = async () => {
    if (!code) return;
    const link = `https://destinybridge.com?ref=${code}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleAmounts = [19.99, 49.99, 99.99];

  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
          Share the <span className="gold-text">Wisdom</span>, Earn Together
        </h2>
        <p className="text-gray-400 text-center max-w-xl mx-auto mb-12">
          When you invite friends to DestinyBridge, you earn on everything they buy — forever. Not just their first purchase.
        </p>

        {/* Commission Tiers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
          {COMMISSION_TIERS.map((tier) => (
            <div key={tier.label} className="mystic-card rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">
                {tier.label === "Seed" ? "🌱" : tier.label === "Bloom" ? "🌸" : tier.label === "Garden" ? "🌳" : "🌲"}
              </div>
              <p className="text-sm font-semibold text-gold-200">{tier.label}</p>
              <p className="text-xl font-bold gold-text">{tier.rate * 100}%</p>
              <p className="text-xs text-gray-500">{tier.minInvites}+ invites</p>
            </div>
          ))}
        </div>

        {/* Earnings calculator */}
        <div className="mystic-card rounded-2xl p-6 max-w-lg mx-auto mb-8">
          <h3 className="text-sm font-medium text-gray-400 mb-4 text-center">
            What you could earn (at 15% commission)
          </h3>
          <div className="space-y-2">
            {sampleAmounts.map((amount) => (
              <div key={amount} className="flex justify-between text-sm">
                <span className="text-gray-300">Friend buys ${amount} report</span>
                <span className="text-gold-300 font-medium">You get ${calculateCommission(amount)}</span>
              </div>
            ))}
            <div className="border-t border-mystic-600 pt-2 mt-2 flex justify-between text-sm">
              <span className="text-gray-300">10 friends buy $49.99/month subscription</span>
              <span className="text-gold-300 font-medium">You get ${calculateCommission(49.99 * 10)}/month</span>
            </div>
          </div>
        </div>

        {/* Generate referral code */}
        <div className="text-center">
          {!code ? (
            <button
              onClick={handleGenerate}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-gold-400 to-gold-300 text-mystic-950 font-semibold hover:from-gold-300 hover:to-gold-200 transition-all"
            >
              Generate My Referral Link →
            </button>
          ) : (
            <div className="mystic-card rounded-2xl p-6 inline-block">
              <p className="text-sm text-gray-400 mb-2">Your referral link:</p>
              <div className="flex items-center gap-3">
                <code className="px-4 py-2 rounded-xl bg-mystic-800 text-gold-300 text-sm font-mono">
                  destinybridge.com?ref={code}
                </code>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-xl bg-gold-400/20 text-gold-300 text-sm font-medium hover:bg-gold-400/30 transition-all"
                >
                  {copied ? "✓ Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Share this link anywhere. We track every purchase and pay out monthly.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
