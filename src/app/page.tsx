"use client";

import { useState } from "react";
import { BaziResult, BirthData } from "@/types";
import { updateProfile } from "@/lib/profile";
import { savePendingPurchase, createGumroadCheckout, PRICING } from "@/lib/payment";
import Hero from "@/components/Hero";
import BaziForm from "@/components/BaziForm";
import ReportModal from "@/components/ReportModal";
import VentChat from "@/components/VentChat";
import XiaoLiuRen from "@/components/XiaoLiuRen";
import LiuYaoDivination from "@/components/LiuYaoDivination";
import Footer from "@/components/Footer";

const ELEMENT_EMOJI: Record<string, string> = {
  木: "🌿", 火: "🔥", 土: "🏔️", 金: "✨", 水: "💧",
};

function BaziPreview({ result, birthData }: { result: BaziResult; birthData: BirthData }) {
  const { chart, elements, dayMaster, favorableElements, unfavorableElements, tenGods } = result;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="text-center">
        <p className="text-xs text-gold-400 uppercase tracking-widest mb-2">命理八字</p>
        <h2 className="text-2xl font-bold mb-1">
          <span className="gold-text">四柱八字</span>
        </h2>
        <p className="text-gray-400 text-sm">
          {birthData.year}-{String(birthData.month).padStart(2, "0")}-
          {String(birthData.day).padStart(2, "0")}
          {" · "}{birthData.gender === "male" ? "♂" : "♀"}
        </p>
      </div>

      <div className="mystic-card rounded-2xl overflow-hidden">
        <div className="grid grid-cols-4 text-center text-sm">
          {(["year", "month", "day", "hour"] as const).map((p) => (
            <div key={p} className="p-3 border-r border-mystic-700/50 last:border-r-0">
              <p className="text-gray-500 text-xs capitalize mb-1">
                {{ year: "年", month: "月", day: "日", hour: "时" }[p]}
              </p>
              <p className="text-xl font-bold text-white">
                {chart[p].stem}{chart[p].branch}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {ELEMENT_EMOJI[chart[p].stemElement]}{chart[p].stemElement}
                {" + "}
                {ELEMENT_EMOJI[chart[p].branchElement]}{chart[p].branchElement}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                {chart[p].hiddenStems.join(" ")}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="mystic-card rounded-2xl p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">日主</p>
          <p className="text-3xl font-bold text-white">
            {dayMaster.stem}
            <span className="text-lg ml-1 text-gray-400">({ELEMENT_EMOJI[dayMaster.element]}{dayMaster.element})</span>
          </p>
          <p className="text-xs text-gray-500 mt-1 capitalize">{dayMaster.strength}</p>
        </div>
        <div className="mystic-card rounded-2xl p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">五行分布</p>
          <div className="flex justify-center gap-3 text-lg">
            {(Object.keys(elements) as Array<keyof typeof elements>).map((el) => (
              <span key={el} className="text-sm">
                {ELEMENT_EMOJI[el]}
                <span className="text-gray-300 ml-0.5">{elements[el]}</span>
              </span>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-2 text-xs">
            <span className="text-green-400">
              喜: {favorableElements.map(e => ELEMENT_EMOJI[e] + e).join(", ")}
            </span>
            <span className="text-red-400">
              忌: {unfavorableElements.map(e => ELEMENT_EMOJI[e] + e).join(", ")}
            </span>
          </div>
        </div>
      </div>

      <div className="mystic-card rounded-2xl p-4">
        <p className="text-xs text-gray-500 mb-2 text-center">十神</p>
        <div className="flex justify-center gap-4 text-sm">
          {tenGods.map((tg) => (
            <div key={tg.pillar} className="text-center">
              <p className="text-xs text-gray-500 capitalize">
                {{ year: "年", month: "月", day: "日", hour: "时" }[tg.pillar]}
              </p>
              <p className="text-gold-300 font-medium">{tg.god}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Blurred report preview using ReportModal with sample data
function ReportPreview({ lang }: { lang: "zh" | "en" }) {
  return (
    <div className="relative">
      <div className="mystic-card rounded-2xl overflow-hidden" style={{ maxHeight: "500px" }}>
        <ReportModal lang={lang} blurred />
      </div>
      {/* CTA overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-mystic-950/60 backdrop-blur-[1px] rounded-2xl">
        <div className="text-center space-y-3 p-8">
          <p className="text-2xl">🔒</p>
          <p className="text-white font-bold text-lg">
            {lang === "zh" ? "付费后解锁完整报告" : "Purchase to Unlock Full Report"}
          </p>
          <p className="text-gray-400 text-sm max-w-sm">
            {lang === "zh"
              ? "9大章节完整命理分析，含未来十年逐年预测"
              : "9-chapter complete Ba Zi analysis with 10-year yearly forecast"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [result, setResult] = useState<BaziResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"vent" | "liuren" | "liuyao">("liuyao");
  const [showReportSection, setShowReportSection] = useState(false);

  const handleSubmit = async (data: BirthData) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setBirthData(data);

    updateProfile({ baziData: data });

    try {
      const res = await fetch("/api/bazi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, generateAI: false }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Something went wrong");
      }
      const baziResult: BaziResult = await res.json();
      setResult(baziResult);
      setTimeout(() => {
        document.getElementById("report-section")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = () => {
    if (!birthData) return;
    savePendingPurchase({ birthData });
    window.location.href = createGumroadCheckout(PRICING.baziBlueprint.permalink);
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <Hero />

      {/* Divination Section */}
      <section id="divination" className="py-16 px-6 max-w-5xl mx-auto scroll-mt-20">
        <div className="text-center mb-10">
          <p className="text-xs text-gold-400 uppercase tracking-[0.3em] mb-3">用易经开启你人生的第一卦</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            古老的东方智慧，<span className="gold-text">你的现代生活指南</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto text-sm">
            小事快速推算，大事深度占卜。让易经的智慧为你的衣食住行、工作姻缘指明方向。
          </p>
        </div>

        {/* Tabs — only 3 */}
        <div className="flex justify-center gap-1 mb-6">
          {([
            { id: "liuyao", label: "深度占卜", emoji: "☯️", desc: "六爻易经" },
            { id: "liuren", label: "小事快速推算", emoji: "🔮", desc: "小六壬" },
            { id: "vent", label: "向大师倾诉", emoji: "🍵", desc: "情绪树洞" },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-gold-400/20 text-gold-300 border border-gold-400/30"
                  : "bg-mystic-800/50 text-gray-400 hover:bg-mystic-700/50"
              }`}
            >
              <span className="mr-1.5">{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="max-w-2xl mx-auto">
          {activeTab === "liuyao" && <LiuYaoDivination />}
          {activeTab === "liuren" && <XiaoLiuRen />}
          {activeTab === "vent" && <VentChat />}
        </div>

        {/* Bottom hint */}
        <div className="text-center mt-8">
          <button
            onClick={() => setShowReportSection(!showReportSection)}
            className="text-sm text-gray-500 hover:text-gold-400 underline underline-offset-4 transition-colors"
          >
            想要更深入的了解自己？探索你的专属命理报告 →
          </button>
        </div>
      </section>

      {/* Report Purchase Section */}
      {showReportSection && (
        <section id="report-section" className="py-16 px-6 scroll-mt-20 bg-mystic-900/30">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs text-gold-400 uppercase tracking-[0.3em] mb-3">命理全息报告 + 十年预测</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">
                你的专属<span className="gold-text">生命蓝图</span>
              </h2>
              <p className="text-gray-400 max-w-lg mx-auto text-sm">
                基于你的生辰八字，AI 深度分析生成完整命理报告，包含衣食住行全方位建议及未来十年气运预测。付费后自动生成并发送到你的邮箱。
              </p>
            </div>

            {/* Step 1: Input birth data */}
            {!result && (
              <div className="max-w-lg mx-auto">
                <div className="mystic-card rounded-2xl p-6 sm:p-8">
                  <p className="text-sm text-gray-300 text-center mb-6">
                    输入你的出生信息，先预览八字排盘，再决定是否购买完整报告。
                  </p>
                  <BaziForm onSubmit={handleSubmit} loading={loading} />
                  {error && (
                    <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
                      {error}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Show preview + purchase CTA */}
            {result && birthData && (
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                {/* Left: Bazi chart preview */}
                <div>
                  <BaziPreview result={result} birthData={birthData} />
                </div>

                {/* Right: Report preview + purchase */}
                <div className="space-y-6">
                  <ReportPreview lang="zh" />

                  <div className="mystic-card rounded-2xl p-6 text-center space-y-4 border border-gold-400/30">
                    <p className="text-gray-200 font-medium text-lg">
                      解锁完整命理报告 + 十年预测
                    </p>
                    <p className="text-gray-400 text-sm max-w-md mx-auto">
                      包含体质分析、饮食指南、穿搭色彩、家居风水、出行建议、养生自护、水晶推荐、十年气运预测，以及个人专属箴言。PDF 格式发送至你的邮箱。
                    </p>
                    <div className="flex items-center justify-center gap-2 text-gold-300 text-lg font-bold">
                      $9.99 <span className="text-gray-500 text-sm font-normal">一次购买 · 永久查看</span>
                    </div>
                    <button
                      onClick={handleGenerateReport}
                      disabled={aiLoading}
                      className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-gold-400 to-gold-300 text-mystic-950 font-semibold text-lg hover:from-gold-300 hover:to-gold-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {aiLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          正在生成…
                        </span>
                      ) : (
                        "生成我的命理报告 →"
                      )}
                    </button>
                    <p className="text-xs text-gray-500">
                      支付成功后自动生成报告并发送至你的邮箱
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Clara Membership Benefits + App Download */}
      <section id="membership" className="py-16 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs text-gold-400 uppercase tracking-[0.3em] mb-3">会员专属服务</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            加入 Clara <span className="gold-text">会员</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto text-sm">
            解锁每日个性化推荐、无限深度占卜、专属风水首饰推荐，让古老智慧守护你的每一天。
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {[
            {
              emoji: "📅",
              title: "每日衣食住行",
              desc: "根据你的八字，每日推荐食材、穿搭颜色、出行方向、养生重点。",
            },
            {
              emoji: "🔮",
              title: "无限占卜",
              desc: "小六壬、六爻占卜不限次数使用，深度解读为你提供全方位指引。",
            },
            {
              emoji: "🍵",
              title: "情绪树洞",
              desc: "随时倾诉烦恼，结合易经智慧为你疏解情绪、找到方向。",
            },
            {
              emoji: "💎",
              title: "风水首饰推荐",
              desc: "根据当日运势推荐转运首饰，助你调整气场、提升能量。",
            },
            {
              emoji: "📊",
              title: "命理报告 + 十年预测",
              desc: "完整八字分析报告，未来十年五行气运预测，一步到位了解自己。",
            },
            {
              emoji: "🛍️",
              title: "风水好物商城",
              desc: "精选水晶、家居摆件、开运饰品，会员专享折扣价。",
            },
          ].map((item) => (
            <div key={item.title} className="mystic-card rounded-2xl p-5 space-y-2">
              <span className="text-2xl">{item.emoji}</span>
              <h3 className="text-white font-semibold text-sm">{item.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* App download CTA */}
        <div className="mystic-card rounded-2xl p-8 text-center space-y-4 border border-gold-400/20">
          <p className="text-3xl">📱</p>
          <h3 className="text-xl font-bold text-white">下载 Clara APP</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            随时随地获取你的专属生活指引。支持 iOS 和 Android，会员功能全平台同步。
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <button className="px-6 py-3 rounded-xl bg-white text-black font-medium text-sm hover:bg-gray-200 transition-colors">
              App Store
            </button>
            <button className="px-6 py-3 rounded-xl bg-white text-black font-medium text-sm hover:bg-gray-200 transition-colors">
              Google Play
            </button>
          </div>
          <p className="text-xs text-gray-600">即将上线 · 敬请期待</p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
