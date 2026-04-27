const features = [
  {
    icon: "🍽️",
    title: "Five Elements Kitchen",
    desc: "Personalized ingredients list and seasonal recipes based on your body constitution. Know what to cook tonight in 30 seconds.",
  },
  {
    icon: "👗",
    title: "Power Color Wardrobe",
    desc: "Daily color guidance for confidence, calm, or connection. What to wear for the school meeting vs. date night.",
  },
  {
    icon: "🏠",
    title: "Room-by-Room Feng Shui",
    desc: "Where to place crystals, mirrors, and plants in each room. Simple 5-minute home energy shifts any busy mom can do.",
  },
  {
    icon: "🧘",
    title: "2-Minute Self-Care Rituals",
    desc: "Meridian-based daily practices that actually fit into a mom's schedule. No yoga mat required.",
  },
  {
    icon: "👨‍👩‍👧‍👦",
    title: "Whole Family Wellness",
    desc: "Get Ba Zi charts for your partner and kids. See how your elements interact — and cook one meal that balances everyone.",
  },
  {
    icon: "💬",
    title: "Clara Circle Community",
    desc: "8-week learning course, weekly live Q&A, and accountability pods with moms on the same journey. You're not alone.",
  },
];

export default function Features() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
          Everything Your{" "}
          <span className="gold-text">Family Needs</span>
        </h2>
        <p className="text-gray-400 text-center max-w-xl mx-auto mb-16">
          Practical Eastern wellness — not abstract philosophy. Every tip is
          tested against one question: &ldquo;Can a busy mom actually do this?&rdquo;
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="mystic-card rounded-2xl p-6 transition-all"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold text-gold-200 mb-2">
                {f.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
