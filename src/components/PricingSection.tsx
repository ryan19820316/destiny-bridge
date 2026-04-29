"use client";

import { useState, useEffect } from "react";
import { createGumroadCheckout, PRICING } from "@/lib/payment";
import { isMemberActive } from "@/lib/profile";

export default function PricingSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const memberActive = mounted && isMemberActive();

  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-2">
          Start Your <span className="gold-text">Wellness Journey</span>
        </h2>
        <p className="text-gray-400 text-center max-w-xl mx-auto mb-4">
          One blueprint to know yourself. Clara membership to stay balanced every day.
        </p>
        <p className="text-xs text-gold-400/70 text-center mb-14">
          7-day money-back guarantee on everything. No risk.
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Plan 1: Bazi Test */}
          <div className="mystic-card rounded-3xl p-7 flex flex-col">
            <div className="inline-block px-3 py-1 rounded-full bg-gold-400/20 text-gold-300 text-xs font-medium mb-3 self-start">
              One-Time Purchase
            </div>
            <h3 className="text-xl font-bold text-white">{PRICING.baziBlueprint.name}</h3>
            <p className="text-xs text-gray-400 mt-1 mb-5">
              Your energetic foundation — know your blueprint
            </p>
            <div className="mb-6">
              <span className="text-3xl font-bold gold-text">${PRICING.baziBlueprint.price}</span>
              <span className="text-gray-400 ml-1">once</span>
            </div>
            <ul className="space-y-2.5 mb-8 flex-1">
              {[
                "Complete Ba Zi chart & Five Elements",
                "Body constitution reading",
                "Food: personalized ingredients & recipe",
                "Home: Feng Shui basics & crystal tips",
                "Body: meridian focus & 2-minute ritual",
                "2026 Year of the Horse forecast",
                "Your personal daily mantra",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-gold-400 mt-0.5 shrink-0">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <a
              href="#get-started"
              className="block text-center py-3.5 px-6 rounded-2xl font-semibold transition-all mt-auto bg-gradient-to-r from-gold-400 to-gold-300 text-mystic-950 hover:from-gold-300 hover:to-gold-200 shadow-md"
            >
              Get Your Blueprint
            </a>
          </div>

          {/* Plan 2: Clara Membership */}
          <div className="rounded-3xl p-7 flex flex-col bg-gradient-to-b from-mystic-700 to-mystic-800 border-2 border-gold-400/50 glow scale-[1.03]">
            <div className="inline-block px-3 py-1 rounded-full bg-gold-400/20 text-gold-300 text-xs font-medium mb-3 self-start">
              {memberActive ? "Active" : "7-Day Free Trial"}
            </div>
            <h3 className="text-xl font-bold text-white">{PRICING.claraMembership.name}</h3>
            <p className="text-xs text-gray-400 mt-1 mb-5">
              Daily wisdom + a warm space to vent
            </p>
            <div className="mb-6">
              <span className="text-3xl font-bold text-gold-300">
                ${PRICING.claraMembership.price}
              </span>
              <span className="text-gray-400 ml-1">/month</span>
            </div>
            <ul className="space-y-2.5 mb-8 flex-1">
              {[
                "Everything in Wellness Blueprint",
                "Daily guidance: food, color, home, body",
                "Talk to Clara — vent & get Eastern wisdom",
                "Personalized to your Ba Zi every time",
                "Feng Shui Shop member discounts",
                "Private — your words stay on your device",
                "Cancel anytime, no questions",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-gold-300 mt-0.5 shrink-0">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <a
              href={`${createGumroadCheckout(PRICING.claraMembership.permalink, "member")}`}
              className="block text-center py-3.5 px-6 rounded-2xl font-semibold transition-all mt-auto bg-cream-100 text-mystic-950 hover:bg-cream-200 shadow-md"
            >
              {memberActive ? "Manage Membership" : "Start Free Trial"}
            </a>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-8 max-w-lg mx-auto leading-relaxed">
          Payments processed securely via Gumroad. Cancel anytime.
          All readings are for personal wellness guidance and entertainment.
          Not medical or psychological advice.
        </p>
      </div>
    </section>
  );
}
