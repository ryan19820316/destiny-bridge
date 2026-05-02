"use client";

import { useState, useEffect, useRef } from "react";
import { getProfile } from "@/lib/profile";
import type { LiuYaoFormData, LiuYaoResult } from "@/types";
import Hero from "@/components/Hero";
import LiuYaoForm from "@/components/LiuYaoForm";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";

type Lang = "zh" | "en";

const LIUQIN_ICONS: Record<string, string> = {
  "父母": "📚", "官鬼": "⚖️", "妻财": "💰",
  "子孙": "👶", "兄弟": "🤝",
};

const LIUQIN_EN: Record<string, string> = {
  "父母": "Parents", "官鬼": "Officer", "妻财": "Wealth",
  "子孙": "Children", "兄弟": "Siblings",
};

const LIUSHEN_EN: Record<string, string> = {
  "青龙": "Azure Dragon", "朱雀": "Vermilion Bird", "勾陈": "Stagnation",
  "腾蛇": "Flying Serpent", "白虎": "White Tiger", "玄武": "Black Tortoise",
};

function ResultDisplay({ result, lang }: { result: LiuYaoResult; lang: Lang }) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <p className="text-xs text-gold-400 uppercase tracking-widest">
          {lang === "zh" ? "六爻测算结果" : "Liu Yao Divination Result"}
        </p>
        <h2 className="text-2xl font-bold">
          <span className="gold-text">{result.hexagramName}</span>
        </h2>
        {result.changedHexagramName && (
          <p className="text-gold-300 text-sm">
            {lang === "zh" ? "变卦" : "Changed →"} {result.changedHexagramName}
          </p>
        )}
        <p className="text-gray-500 text-xs">
          {result.palace} · {result.palaceElement} · {result.monthBranch} · {result.dayBranch}
          {result.isJingGua && ` · ${lang === "zh" ? "静卦" : "Static"}`}
        </p>
      </div>

      {/* Fortune verdict */}
      <div className="mystic-card rounded-2xl p-5 text-center">
        <p className="text-lg font-bold text-gold-300">{result.fortuneVerdict}</p>
        {result.oneLineSummary && (
          <p className="text-sm text-gray-400 mt-2 italic">"{result.oneLineSummary}"</p>
        )}
      </div>

      {/* Lines table */}
      <div className="mystic-card rounded-2xl overflow-hidden">
        <div className="grid grid-cols-7 text-xs text-gray-500 border-b border-mystic-700/50 bg-mystic-800/30">
          <div className="p-2 text-center">{lang === "zh" ? "爻" : "Pos"}</div>
          <div className="p-2 text-center">{lang === "zh" ? "阴阳" : "Y/Y"}</div>
          <div className="p-2 text-center">{lang === "zh" ? "地支" : "Branch"}</div>
          <div className="p-2 text-center">{lang === "zh" ? "六亲" : "Liu Qin"}</div>
          <div className="p-2 text-center">{lang === "zh" ? "六神" : "Liu Shen"}</div>
          <div className="p-2 text-center">{lang === "zh" ? "世应" : "S/Y"}</div>
          <div className="p-2 text-center">{lang === "zh" ? "动" : "Mov"}</div>
        </div>
        {[...result.lines].reverse().map((l) => (
          <div
            key={l.position}
            className={`grid grid-cols-7 text-sm border-b border-mystic-700/30 last:border-0 ${
              l.isShi ? "bg-gold-400/5" : l.isYing ? "bg-jade-400/5" : ""
            } ${l.isMoving ? "bg-gold-400/10" : ""}`}
          >
            <div className="p-2.5 text-center text-gray-300">{l.position}</div>
            <div className="p-2.5 text-center">{l.isYang ? "⚊" : "⚋"}{l.isMoving ? "○" : ""}</div>
            <div className="p-2.5 text-center text-gray-300">
              {l.branch}
              <span className="text-xs text-gray-500 ml-0.5">({l.branchElement})</span>
            </div>
            <div className="p-2.5 text-center text-gray-300">
              {lang === "zh" ? l.liuqin : LIUQIN_EN[l.liuqin] || l.liuqin}
            </div>
            <div className="p-2.5 text-center text-gray-400 text-xs">
              {lang === "zh" ? l.liushen : LIUSHEN_EN[l.liushen] || l.liushen}
            </div>
            <div className="p-2.5 text-center text-sm">
              {l.isShi && <span className="text-gold-400">{lang === "zh" ? "世" : "S"}</span>}
              {l.isYing && <span className="text-jade-400">{lang === "zh" ? "应" : "R"}</span>}
            </div>
            <div className="p-2.5 text-center">
              {l.isMoving && <span className="text-gold-400 font-bold">○</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Yong Shen */}
      <div className="mystic-card rounded-2xl p-4 text-center">
        <p className="text-xs text-gray-500 mb-1">{lang === "zh" ? "用神" : "Focus Spirit"}</p>
        <p className="text-gold-300 font-bold text-lg">{result.yongShen}</p>
        {result.yongShenStrength && (
          <p className="text-sm text-gray-400 mt-1">{result.yongShenStrength}</p>
        )}
      </div>

      {/* Interpretation sections */}
      <div className="space-y-4">
        {([
          { key: "section1_hexagramSetup" as const, labelZh: "起卦排盘", labelEn: "Hexagram Setup" },
          { key: "section2_yongShenAnalysis" as const, labelZh: "用神分析", labelEn: "Focus Spirit Analysis" },
          { key: "section3_hexagramProcess" as const, labelZh: "卦象过程", labelEn: "Hexagram Process" },
          { key: "section4_conclusion" as const, labelZh: "吉凶结论", labelEn: "Conclusion" },
          { key: "section5_timing" as const, labelZh: "应期", labelEn: "Timing" },
          { key: "section6_risks" as const, labelZh: "风险提醒", labelEn: "Risks & Cautions" },
        ] as const).map(({ key, labelZh, labelEn }) => {
          const content = result[key] as string;
          if (!content) return null;
          return (
            <div key={key} className="mystic-card rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-gold-400 mb-3">
                {lang === "zh" ? labelZh : labelEn}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
            </div>
          );
        })}
      </div>

      {/* Personality traits section */}
      {(result.yinyaoTraits.length > 0 || result.yinyaoAdvice) && (
        <div className="mystic-card rounded-2xl p-5 border border-gold-400/20">
          <h3 className="text-sm font-semibold text-gold-400 mb-3">
            {lang === "zh" ? "性格分析" : "Personality Analysis"}
          </h3>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {result.yinyaoTraits.map((t: string, i: number) => (
              <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-gold-400/10 text-gold-300 border border-gold-400/20">
                {t}
              </span>
            ))}
          </div>
          {result.yinyaoAdvice && (
            <p className="text-gray-300 text-sm leading-relaxed italic border-t border-mystic-700/50 pt-3 mt-2">
              {result.yinyaoAdvice}
            </p>
          )}
        </div>
      )}

      {/* Timestamp */}
      <p className="text-center text-xs text-gray-600">
        {new Date(result.timestamp).toLocaleString()}
      </p>
    </div>
  );
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LiuYaoResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const lastFormDataRef = useRef<LiuYaoFormData | null>(null);
  const langResultCache = useRef<Record<string, LiuYaoResult>>({});

  useEffect(() => {
    const p = getProfile();
    setLang(p.languagePreference === "en" ? "en" : "zh");
    setMounted(true);
  }, []);

  const handleLangToggle = (newLang: Lang) => {
    setLang(newLang);
    if (result && lastFormDataRef.current) {
      const cached = langResultCache.current[newLang];
      if (cached) {
        setResult(cached);
      } else {
        handleSubmit(lastFormDataRef.current, newLang);
      }
    }
  };

  const handleSubmit = async (data: LiuYaoFormData, forceLang?: Lang) => {
    const submitLang = forceLang ?? lang;
    const isNew = !forceLang;
    lastFormDataRef.current = data;
    setLoading(true);
    setError(null);
    if (isNew) {
      setResult(null);
      langResultCache.current = {};
    }

    try {
      const res = await fetch("/api/liuyao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, lang: submitLang }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Something went wrong");
      }
      const liuyaoResult: LiuYaoResult = await res.json();
      setResult(liuyaoResult);
      langResultCache.current[submitLang] = liuyaoResult;

      if (isNew) {
        setTimeout(() => {
          document.getElementById("result-section")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 200);

        // Pre-fetch the other language in background for instant switching
        const otherLang: Lang = submitLang === "en" ? "zh" : "en";
        fetch("/api/liuyao", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, lang: otherLang }),
        })
          .then((r) => (r.ok ? r.json() : null))
          .then((r: LiuYaoResult | null) => {
            if (r) langResultCache.current[otherLang] = r;
          })
          .catch(() => {});
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col">
      <LanguageSwitcher lang={lang} onToggle={handleLangToggle} />

      {/* Hero */}
      <Hero lang={lang} />

      {/* Trigram Divider */}
      <div className="trigram-divider max-w-xs mx-auto pb-8">☰ ☷ ☵ ☲</div>

      {/* Liu Yao Section */}
      <section id="divination" className="py-16 px-6 max-w-5xl mx-auto scroll-mt-20">
        <div className="text-center mb-10">
          <p className="text-xs text-gold-400 uppercase tracking-[0.3em] mb-3">
            {lang === "zh" ? "六爻时间起卦" : "Liu Yao Time-Based Casting"}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            {lang === "zh" ? (
              <>古老的东方智慧，<span className="gold-text">你的现代生活指南</span></>
            ) : (
              <>Ancient Eastern wisdom, <span className="gold-text">your modern life compass</span></>
            )}
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto text-sm">
            {lang === "zh"
              ? "基于你的出生时间自动起卦，结合性格分析，为你的婚姻、事业、财运、健康提供深度指引。"
              : "Automatic hexagram casting based on your birth time, with personality analysis for deep guidance on marriage, career, wealth, and health."}
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="mystic-card rounded-2xl p-6 sm:p-8">
            <LiuYaoForm key={lang} lang={lang} onSubmit={handleSubmit} loading={loading} />
            {error && (
              <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Result */}
        {result && (
          <div id="result-section" className="mt-12 max-w-2xl mx-auto scroll-mt-20">
            <ResultDisplay result={result} lang={lang} />
          </div>
        )}
      </section>

      {/* Membership Section */}
      <section id="membership" className="py-16 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs text-gold-400 uppercase tracking-[0.3em] mb-3">
            {lang === "zh" ? "会员专属服务" : "Member Exclusive Benefits"}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            {lang === "zh" ? (
              <>加入 Clara <span className="gold-text">会员</span></>
            ) : (
              <>Join <span className="gold-text">Clara</span> Membership</>
            )}
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto text-sm">
            {lang === "zh"
              ? "解锁每日个性化推荐、无限深度占卜、专属风水首饰推荐，让古老智慧守护你的每一天。"
              : "Unlock daily personalized recommendations, unlimited divinations, and feng shui accessory picks. Let ancient wisdom guide your every day."}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {([
            {
              emoji: "📅",
              zh: "每日衣食住行",
              en: "Daily Life Guide",
              descZh: "根据你的八字，每日推荐食材、穿搭颜色、出行方向、养生重点。",
              descEn: "Daily food, outfit colors, travel directions, and wellness tips based on your Ba Zi chart.",
            },
            {
              emoji: "🔮",
              zh: "无限占卜",
              en: "Unlimited Divination",
              descZh: "六爻占卜不限次数使用，深度解读为你提供全方位指引。",
              descEn: "Unlimited Liu Yao readings with in-depth interpretations for full guidance.",
            },
            {
              emoji: "🍵",
              zh: "情绪树洞",
              en: "Wellness Companion",
              descZh: "随时倾诉烦恼，结合易经智慧为你疏解情绪、找到方向。",
              descEn: "Share your thoughts anytime and find clarity through the lens of Eastern wisdom.",
            },
            {
              emoji: "💎",
              zh: "风水首饰推荐",
              en: "Feng Shui Accessories",
              descZh: "根据当日运势推荐转运首饰，助你调整气场、提升能量。",
              descEn: "Daily accessory picks aligned with your energy to boost your luck and aura.",
            },
            {
              emoji: "📊",
              zh: "命理报告 + 十年预测",
              en: "Full Report + 10-Year Forecast",
              descZh: "完整八字分析报告，未来十年五行气运预测，一步到位了解自己。",
              descEn: "Complete Ba Zi analysis with a 10-year element forecast to understand yourself deeply.",
            },
            {
              emoji: "🛍️",
              zh: "风水好物商城",
              en: "Feng Shui Shop",
              descZh: "精选水晶、家居摆件、开运饰品，会员专享折扣价。",
              descEn: "Curated crystals, home decor, and lucky charms at member-exclusive discounts.",
            },
          ] as const).map((item) => (
            <div key={item.zh} className="mystic-card rounded-2xl p-5 space-y-2">
              <span className="text-2xl">{item.emoji}</span>
              <h3 className="text-white font-semibold text-sm">
                {lang === "zh" ? item.zh : item.en}
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                {lang === "zh" ? item.descZh : item.descEn}
              </p>
            </div>
          ))}
        </div>

        {/* App download CTA */}
        <div id="download" className="mystic-card rounded-2xl p-8 text-center space-y-4 border border-gold-400/20 scroll-mt-20">
          <p className="text-3xl">📱</p>
          <h3 className="text-xl font-bold text-white">
            {lang === "zh" ? "下载 DestinyBridge APP" : "Download DestinyBridge App"}
          </h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            {lang === "zh"
              ? "随时随地获取你的专属生活指引。扫描二维码或在手机上打开链接，用 Expo Go 即刻体验。"
              : "Access your personalized life guide anytime. Scan the QR code or open the link on your phone to try it instantly via Expo Go."}
          </p>
          {/* QR Code for Expo Go */}
          <div className="flex justify-center">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent("exp://exp.host/@destinybridge/destiny-bridge")}`}
              alt="Expo Go QR Code"
              className="rounded-xl bg-white p-2 w-[180px] h-[180px]"
            />
          </div>
          <a
            href="exp://exp.host/@destinybridge/destiny-bridge"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-400 text-[#0a0a0a] font-semibold text-sm hover:bg-gold-300 transition-colors"
          >
            Open in Expo Go
          </a>
          <div className="flex justify-center gap-4 pt-2">
            <button className="px-4 py-2 rounded-xl border border-gray-600 text-gray-500 text-xs cursor-not-allowed">
              App Store — Soon
            </button>
            <button className="px-4 py-2 rounded-xl border border-gray-600 text-gray-500 text-xs cursor-not-allowed">
              Google Play — Soon
            </button>
          </div>
          <p className="text-xs text-gray-500">
            {lang === "zh"
              ? "无需审核即可体验 · App Store / Google Play 即将上线"
              : "Try now via Expo Go · App Store & Google Play coming soon"}
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer lang={lang} />
    </div>
  );
}
