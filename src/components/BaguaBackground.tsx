"use client";

import { useEffect, useState } from "react";

// SVG 太极八卦图 — fixed background decoration
export default function BaguaBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const cx = 300;
  const cy = 300;
  const R = 260; // outer circle radius
  const trigramR = R - 36; // radius for trigram placement
  const innerR = 60; // yin-yang radius

  // 先天八卦: top (乾) clockwise
  const trigrams = ["☰", "☱", "☲", "☳", "☷", "☶", "☵", "☴"];

  // Yin-Yang S-curve path (right/upper half = yang/light)
  const yinYangPath = `
    M ${cx},${cy - innerR}
    A ${innerR},${innerR} 0 0,1 ${cx},${cy + innerR}
    A ${innerR / 2},${innerR / 2} 0 0,0 ${cx},${cy}
    A ${innerR / 2},${innerR / 2} 0 0,1 ${cx},${cy - innerR}
    Z
  `;

  const trigramPositions = trigrams.map((_, i) => {
    const angle = (i * 45 - 90) * (Math.PI / 180);
    return {
      x: cx + trigramR * Math.cos(angle),
      y: cy + trigramR * Math.sin(angle),
    };
  });

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center pointer-events-none select-none"
      style={{ zIndex: 0 }}
    >
      <svg
        viewBox="0 0 600 600"
        className="w-[min(85vh,85vw)] h-[min(85vh,85vw)] max-w-[560px] max-h-[560px]"
        style={{ opacity: 0.06 }}
      >
        {/* Outer rings */}
        <circle cx={cx} cy={cy} r={R + 12} fill="none" stroke="#d4a853" strokeWidth="0.5" />
        <circle cx={cx} cy={cy} r={R + 6} fill="none" stroke="#d4a853" strokeWidth="0.3" />
        <circle cx={cx} cy={cy} r={R - 6} fill="none" stroke="#d4a853" strokeWidth="0.5" />

        {/* Radial lines to trigrams */}
        {trigramPositions.map((p, i) => (
          <line
            key={`line-${i}`}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="#d4a853"
            strokeWidth="0.3"
          />
        ))}

        {/* Trigram characters */}
        {trigrams.map((t, i) => {
          const p = trigramPositions[i];
          return (
            <text
              key={i}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#d4a853"
              fontSize="28"
            >
              {t}
            </text>
          );
        })}

        {/* Tai Ji (Yin-Yang) center */}
        <circle cx={cx} cy={cy} r={innerR} fill="none" stroke="#d4a853" strokeWidth="0.8" />
        {/* Yin half (dark/left) — full circle as base */}
        <circle cx={cx} cy={cy} r={innerR} fill="none" />
        {/* Yang half (light/right) — S-curve */}
        <path d={yinYangPath} fill="#d4a853" fillOpacity="0.5" />
        {/* Yang dot in yin (bottom - dark area, light dot) */}
        <circle cx={cx} cy={cy + innerR / 2} r={innerR / 6} fill="#d4a853" fillOpacity="0.7" />
        {/* Yin dot in yang (top - light area, dark dot) */}
        <circle cx={cx} cy={cy - innerR / 2} r={innerR / 6} fill="#0a0614" fillOpacity="0.5" />
      </svg>
    </div>
  );
}
