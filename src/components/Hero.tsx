"use client";

import { useEffect, useState } from "react";
import { getProfile } from "@/lib/profile";

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

export default function Hero() {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const p = getProfile();
    setLang(p.languagePreference === "en" ? "en" : "zh");
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-mystic-700/20 rounded-full blur-3xl" />
        {/* Bagua symbol decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] text-gold-400/[0.03] select-none pointer-events-none">
          ☰☱☲☳☴☵☶☷
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-400/30 bg-mystic-800/50 mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
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
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-gold-400 to-gold-300 text-mystic-950 font-semibold text-lg hover:from-gold-300 hover:to-gold-200 transition-all duration-300 shadow-lg hover:shadow-gold-400/25"
          >
            {T.cta[lang]}
          </a>
        </div>

        {/* Trust message */}
        <div className="mt-10 flex flex-col items-center gap-2 text-sm text-gray-400 animate-fade-in-delay-2">
          <div className="flex items-center gap-1.5">
            <span className="text-gold-400">☯️</span>
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
    </section>
  );
}
