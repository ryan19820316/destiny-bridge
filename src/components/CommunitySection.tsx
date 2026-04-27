"use client";

import { useState } from "react";

const LEARNING_MODULES = [
  { week: 1, title: "The Five Elements in Your Kitchen", desc: "How to stock your pantry according to Wood, Fire, Earth, Metal, Water — and cook one balancing meal." },
  { week: 2, title: "Reading Your Family's Energy Map", desc: "Calculate your partner's and kids' Ba Zi charts. See how your elements interact as a family." },
  { week: 3, title: "Feng Shui for Every Room", desc: "Room-by-room guide: where to place crystals, mirrors, plants, and what to remove." },
  { week: 4, title: "Dressing with the Five Elements", desc: "Build a capsule wardrobe based on your power colors. What to wear for confidence, calm, or connection." },
  { week: 5, title: "The Meridian Clock & Your Family's Rhythm", desc: "When should each family member wake, eat, work, and rest? Based on their Ba Zi." },
  { week: 6, title: "Seasonal Living: Spring & Summer", desc: "How to align your home, meals, and activities with spring Wood and summer Fire energy." },
  { week: 7, title: "Seasonal Living: Autumn & Winter", desc: "Working with Metal and Water seasons. Immune-boosting foods and cozy home rituals." },
  { week: 8, title: "Becoming Your Family's Wellness Guide", desc: "Putting it all together — create a monthly wellness rhythm for your whole household." },
];

export default function CommunitySection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
          Join the <span className="gold-text">Clara Circle</span>
        </h2>
        <p className="text-gray-400 text-center max-w-xl mx-auto mb-12">
          A learning community for moms who want to bring Eastern wellness into their family&apos;s daily life — one small ritual at a time.
        </p>

        {/* 8-Week Learning Path */}
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {LEARNING_MODULES.map((mod) => (
            <div key={mod.week} className="mystic-card rounded-xl p-4 flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-400/15 flex items-center justify-center text-gold-300 font-semibold text-sm shrink-0">
                {mod.week}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gold-200">{mod.title}</h4>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{mod.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Community Features */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {[
            { icon: "💬", title: "Weekly Live Q&A", desc: "Every Thursday, Clara answers your family wellness questions." },
            { icon: "📖", title: "Printable Guides", desc: "Beautiful one-page cheat sheets for your fridge or mirror." },
            { icon: "👥", title: "Accountability Pods", desc: "Matched with 3-4 moms at similar stages for daily check-ins." },
          ].map((f) => (
            <div key={f.title} className="mystic-card rounded-xl p-5 text-center">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h4 className="text-sm font-semibold text-gold-200 mb-1">{f.title}</h4>
              <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Signup */}
        <div className="mystic-card rounded-2xl p-8 text-center max-w-lg mx-auto glow">
          <h3 className="text-xl font-semibold mb-2">Start Your Journey</h3>
          <p className="text-gray-400 text-sm mb-6">
            Free members get weekly tips. Premium members unlock the full 8-week course + live Q&A.
          </p>
          {!subscribed ? (
            <form
              onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }}
              className="flex gap-3 max-w-sm mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 py-3 px-4 rounded-xl bg-mystic-800 border border-mystic-600 text-white text-sm"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold-400 to-gold-300 text-mystic-950 font-semibold text-sm hover:from-gold-300 hover:to-gold-200 transition-all"
              >
                Join Free →
              </button>
            </form>
          ) : (
            <div className="text-green-400 text-sm">
              ✓ Welcome to the circle! Check your inbox.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
