"use client";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-mystic-700/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-400/30 bg-mystic-800/50 mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
          <span className="text-gold-300 text-sm font-medium">
            Eastern Wellness for Modern Moms
          </span>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in">
          Your Family&apos;s{" "}
          <span className="gold-text">Wellness Guide</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-4 animate-fade-in-delay-1 leading-relaxed">
          Ancient Yin-Yang wisdom meets AI. Get personalized guidance for
          what to cook, how to dress, where to place your crystals —
          and how to care for your whole family&apos;s energy.
        </p>

        <p className="text-sm text-gray-400 max-w-lg mx-auto mb-10 animate-fade-in-delay-1">
          From your birth chart, Clara creates your complete wellness blueprint:
          food, colors, home, daily rhythm, and self-care — all tailored to your
          unique Five Elements constitution.
        </p>

        {/* CTA */}
        <div className="animate-fade-in-delay-2">
          <a
            href="#get-started"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-gold-400 to-gold-300 text-mystic-950 font-semibold text-lg hover:from-gold-300 hover:to-gold-200 transition-all duration-300 shadow-lg hover:shadow-gold-400/25"
          >
            Discover Your Blueprint — $19.99
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>

        {/* Social proof */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 animate-fade-in-delay-2">
          <div className="flex items-center gap-2">
            <span className="text-gold-400 text-lg font-semibold">5,000+</span>
            Moms Guided
          </div>
          <div className="w-px h-4 bg-mystic-600 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-gold-400 text-lg font-semibold">4.9</span>
            ★★★★★
          </div>
          <div className="w-px h-4 bg-mystic-600 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-gold-400 text-lg font-semibold">🥗+🏠+💎</span>
            Food · Home · Crystals
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 animate-bounce">
          <svg className="w-6 h-6 mx-auto text-gold-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
