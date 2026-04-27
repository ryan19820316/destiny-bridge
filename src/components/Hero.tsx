"use client";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-cream-50 to-cream-200">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-sage-300/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-earth-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-400/30 bg-cream-100/80 mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
          <span className="text-earth-500 text-sm font-medium">
            Eastern Wisdom for Modern Moms
          </span>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in text-indigo-900">
          Your Family&apos;s{" "}
          <span className="gold-text">Wellness Guide</span>
        </h1>

        <p className="text-lg sm:text-xl text-indigo-800/70 max-w-2xl mx-auto mb-4 animate-fade-in-delay-1 leading-relaxed">
          Ancient Yin-Yang wisdom meets AI. Discover your energetic blueprint —
          then get daily guidance on what to cook, how to feel balanced,
          and where to find a moment of calm.
        </p>

        <p className="text-sm text-earth-500 max-w-lg mx-auto mb-10 animate-fade-in-delay-1">
          From your birth chart, Clara creates your personal wellness blueprint:
          your constitution, your best foods, your home energy, and daily rituals —
          all tailored to your unique Five Elements.
        </p>

        {/* CTA */}
        <div className="animate-fade-in-delay-2">
          <a
            href="#get-started"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-500 text-white font-semibold text-lg hover:from-gold-500 hover:to-gold-400 transition-all duration-300 shadow-lg hover:shadow-gold-400/25"
          >
            Discover Your Blueprint — $9.99
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>

        {/* Trust message (replaces fake social proof) */}
        <div className="mt-10 flex flex-col items-center gap-2 text-sm text-earth-500 animate-fade-in-delay-2">
          <div className="flex items-center gap-1.5">
            <span className="text-gold-400">🛡️</span>
            <span>Private. Personal. Just for you.</span>
          </div>
          <p className="text-xs text-indigo-800/40">
            Your birth data never leaves your device.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="mt-14 animate-bounce">
          <svg className="w-6 h-6 mx-auto text-gold-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
