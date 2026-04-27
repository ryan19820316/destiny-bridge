"use client";

const plans = [
  {
    name: "Wellness Blueprint",
    price: "$19.99",
    period: "one-time",
    tagline: "Your energetic foundation",
    features: [
      "Complete Ba Zi chart & Five Elements analysis",
      "Body constitution reading (寒热虚实)",
      "Food: personalized ingredients & seasonal recipe",
      "Clothing: power colors & occasion guide",
      "Home: room-by-room Feng Shui & crystal placement",
      "Travel: favorable directions & daily rhythm",
      "Body: meridian focus & 2-minute self-care ritual",
      "3-piece crystal prescription set",
      "2026 Year of the Horse forecast",
      "Downloadable PDF — keep it forever",
    ],
    cta: "Get Your Blueprint",
    href: "#get-started",
    highlighted: true,
  },
  {
    name: "Clara Circle",
    price: "$9.99",
    period: "/month",
    tagline: "Daily wisdom, weekly community",
    features: [
      "Everything in Wellness Blueprint",
      "☀️ Daily guidance: food, color, home, body tips",
      "💬 Weekly live Q&A with Clara",
      "📖 8-week learning course (new module every week)",
      "👥 Accountability pod (matched with 3-4 moms)",
      "📱 Printable cheat sheets for your fridge",
      "🎁 15% off all crystal products",
      "Cancel anytime — no questions asked",
    ],
    cta: "Join the Circle",
    href: "#get-started",
    highlighted: false,
  },
  {
    name: "Family Plan",
    price: "$24.99",
    period: "/month",
    tagline: "For the whole household",
    features: [
      "Everything in Clara Circle",
      "Up to 5 family members' Ba Zi charts",
      "Family energy compatibility report",
      "Weekly family meal plan (balanced for everyone)",
      "Home Feng Shui audit (room-by-room)",
      "Kids' constitution readings",
      "Priority access to new crystal collections",
      "20% commission on referrals (25% at 200+)",
    ],
    cta: "Start Family Plan",
    href: "#get-started",
    highlighted: false,
  },
];

export default function PricingSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-2">
          Start Your <span className="gold-text">Wellness Journey</span>
        </h2>
        <p className="text-gray-400 text-center max-w-xl mx-auto mb-4">
          One-time reading or ongoing guidance — whatever fits your family&apos;s rhythm.
        </p>
        <p className="text-xs text-gold-400/70 text-center mb-16">
          All plans include a 7-day money-back guarantee. No risk.
        </p>

        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 sm:p-8 transition-all flex flex-col ${
                plan.highlighted
                  ? "bg-gradient-to-b from-mystic-700 to-mystic-800 border-2 border-gold-400/50 glow scale-[1.02]"
                  : "mystic-card"
              }`}
            >
              {plan.highlighted && (
                <div className="inline-block px-3 py-1 rounded-full bg-gold-400/20 text-gold-300 text-xs font-medium mb-3 self-start">
                  Start Here
                </div>
              )}
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5 mb-4">{plan.tagline}</p>
              <div className="mb-6">
                <span className="text-3xl font-bold gold-text">{plan.price}</span>
                <span className="text-gray-400 ml-1">{plan.period}</span>
              </div>
              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-gold-400 mt-0.5 shrink-0">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href={plan.href}
                className={`block text-center py-3.5 px-6 rounded-xl font-medium transition-all mt-auto ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-gold-400 to-gold-300 text-mystic-950 hover:from-gold-300 hover:to-gold-200"
                    : "border border-gold-400/30 text-gold-300 hover:bg-gold-400/10"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-600 mt-8">
          Payments processed securely via Lemon Squeezy. Cancel anytime with one click.
          <br />
          All readings are for personal growth and entertainment purposes. Not medical advice.
        </p>
      </div>
    </section>
  );
}
