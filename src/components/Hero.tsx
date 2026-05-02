"use client";

import { useState } from "react";

type Lang = "zh" | "en";

const T = {
  badge: { zh: "东方智慧 · 现代生活", en: "Eastern Wellness for Modern Life" },
  heading: { zh: "你的", en: "Your" },
  headingHighlight: { zh: "专属生活指南", en: "Wellness Guide" },
  subtitle1: {
    zh: "古老易经智慧 × 人工智能，为你的衣食住行、工作、婚姻、养生提供贴心指引。",
    en: "Ancient I Ching wisdom meets AI — personalized guidance for every aspect of modern life.",
  },
  subtitle2: {
    zh: "让神秘的东方智慧，科学地贴近你的日常生活。",
    en: "Eastern wisdom, grounded in science, woven into your daily life.",
  },
  cta: {
    zh: "用易经开启你人生的第一卦 →",
    en: "Cast Your First Hexagram →",
  },
  trust: { zh: "私密 · 个人 · 只为你", en: "Private · Personal · For You Only" },
  trustNote: {
    zh: "你的个人信息不会离开你的设备。",
    en: "Your personal information never leaves your device.",
  },
};

// 8 trigrams arranged in 先天八卦 (Fu Xi) order around a circle
const BAGUA_TRIGRAMS = [
  { char: "☰", angle: 0,   label: "乾" },
  { char: "☱", angle: 45,  label: "兌" },
  { char: "☲", angle: 90,  label: "離" },
  { char: "☳", angle: 135, label: "震" },
  { char: "☴", angle: 180, label: "巽" },
  { char: "☵", angle: 225, label: "坎" },
  { char: "☶", angle: 270, label: "艮" },
  { char: "☷", angle: 315, label: "坤" },
];

export default function Hero({ lang }: { lang: Lang }) {
  const [mounted] = useState(true);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* === Bagua Ring (CSS-only, no SVG needed) === */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        {/* Outer rings */}
        <div className="bagua-ring w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] md:w-[520px] md:h-[520px]" style={{ animationDelay: "0s" }} />
        <div className="bagua-ring w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] md:w-[620px] md:h-[620px]" style={{ animationDelay: "2s" }} />
        <div className="bagua-ring w-[400px] h-[400px] sm:w-[560px] sm:h-[560px] md:w-[720px] md:h-[720px]" style={{ animationDelay: "4s" }} />

        {/* 8 Trigrams around the outer ring */}
        {mounted && (
          <div className="absolute w-[600px] h-[600px] sm:w-[700px] sm:h-[700px] md:w-[850px] md:h-[850px]">
            {BAGUA_TRIGRAMS.map((t, i) => {
              const angleRad = (t.angle - 90) * (Math.PI / 180); // -90 so top starts at 乾
              const radius = 48; // %
              const x = 50 + radius * Math.cos(angleRad);
              const y = 50 + radius * Math.sin(angleRad);
              return (
                <span
                  key={t.angle}
                  className="absolute text-gold-400"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: `translate(-50%, -50%)`,
                    fontSize: "clamp(1.2rem, 2.5vw, 2rem)",
                    opacity: 0.06,
                    transition: "opacity 4s ease",
                  }}
                >
                  {t.char}
                </span>
              );
            })}
          </div>
        )}

        {/* Yin-Yang center dot */}
        <div className="absolute w-8 h-8 sm:w-12 sm:h-12 rounded-full border border-gold-400/10 flex items-center justify-center">
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gold-400/20" />
        </div>
      </div>

      {/* === Floating trigram decorations === */}
      <span className="trigram-float text-gold-400">☰</span>
      <span className="trigram-float text-gold-400">☲</span>
      <span className="trigram-float text-gold-400">☵</span>
      <span className="trigram-float text-gold-400">☷</span>
      <span className="trigram-float text-jade-300/50">☴</span>
      <span className="trigram-float text-jade-300/50">☶</span>

      {/* === Background glow blobs === */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gold-400/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-jade-400/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-mystic-700/20 rounded-full blur-3xl" />

      {/* === Content === */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-400/30 bg-mystic-800/50 mb-8 animate-fade-in">
          <span className="text-sm">☯</span>
          <span className="text-gold-300 text-sm font-medium">
            {T.badge[lang]}
          </span>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in">
          {T.heading[lang]}{" "}
          <span className="gold-text">{T.headingHighlight[lang]}</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-4 animate-fade-in-delay-1 leading-relaxed">
          {T.subtitle1[lang]}
        </p>

        <p className="text-sm text-gray-400 max-w-lg mx-auto mb-10 animate-fade-in-delay-1">
          {T.subtitle2[lang]}
        </p>

        {/* CTA */}
        <div className="animate-fade-in-delay-2">
          <a
            href="#divination"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-gold-400 to-gold-300 text-mystic-950 font-semibold text-lg hover:from-gold-300 hover:to-gold-200 transition-all duration-300 glow-gold"
          >
            {T.cta[lang]}
          </a>
          <a
            href="#download"
            className="block mt-3 text-gold-400/70 text-sm hover:text-gold-300 transition-colors"
          >
            📱 {lang === "zh" ? "手机用户？下载 App →" : "Prefer mobile? Get the App →"}
          </a>
        </div>

        {/* Trust message */}
        <div className="mt-10 flex flex-col items-center gap-2 text-sm text-gray-400 animate-fade-in-delay-2">
          <div className="flex items-center gap-1.5">
            <span className="text-gold-400 text-lg">☯</span>
            <span>{T.trust[lang]}</span>
          </div>
          <p className="text-xs text-gray-500">
            {T.trustNote[lang]}
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="mt-14 animate-bounce">
          <svg className="w-6 h-6 mx-auto text-gold-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Bottom gradient fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-mystic-950 to-transparent pointer-events-none" />
    </section>
  );
}
