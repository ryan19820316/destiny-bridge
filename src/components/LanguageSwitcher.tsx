"use client";

import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "@/lib/profile";

type Lang = "zh" | "en";

interface Props {
  lang: Lang;
  onToggle: (lang: Lang) => void;
}

export default function LanguageSwitcher({ lang, onToggle }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const toggle = () => {
    const next = lang === "zh" ? "en" : "zh";
    updateProfile({ languagePreference: next });
    onToggle(next);
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      className="fixed top-4 right-4 z-50 px-3 py-1.5 rounded-full text-sm font-medium border border-gold-400/30 bg-mystic-800/80 text-gold-300 hover:bg-mystic-700/80 hover:border-gold-400/50 transition-all backdrop-blur-sm"
      aria-label="Toggle language"
    >
      {lang === "zh" ? "EN" : "中"}
    </button>
  );
}
