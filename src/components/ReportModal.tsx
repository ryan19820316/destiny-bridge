"use client";

import { useEffect, useRef, useState } from "react";
import type { BaziReport, BirthData } from "@/types";

const CHAPTERS = [
  { id: "basicChart", emoji: "📋", label: "基本命盘", labelEn: "Basic Chart" },
  { id: "destinySummary", emoji: "🌏", label: "命格总论", labelEn: "Destiny Summary" },
  { id: "personality", emoji: "🧠", label: "性格心性", labelEn: "Personality" },
  { id: "career", emoji: "💼", label: "事业运势", labelEn: "Career" },
  { id: "wealth", emoji: "💰", label: "财运分析", labelEn: "Wealth" },
  { id: "relationships", emoji: "💕", label: "感情婚姻", labelEn: "Relationships" },
  { id: "health", emoji: "🫀", label: "健康状况", labelEn: "Health" },
  { id: "fiveElements", emoji: "☯️", label: "五行喜忌", labelEn: "Five Elements" },
  { id: "lifeSummary", emoji: "🔮", label: "一生总结", labelEn: "Life Summary" },
  { id: "tenYearForecast", emoji: "📅", label: "十年预测", labelEn: "10-Year Forecast" },
] as const;

function SectionCard({
  id,
  emoji,
  title,
  children,
  accent = false,
  highlight = false,
}: {
  id: string;
  emoji: string;
  title: string;
  children: React.ReactNode;
  accent?: boolean;
  highlight?: boolean;
}) {
  const bg = highlight
    ? "bg-gradient-to-br from-gold-400/10 to-mystic-800/30 border border-gold-400/25"
    : accent
    ? "bg-mystic-800/40 border border-mystic-700/50"
    : "bg-mystic-800/20";

  return (
    <section id={id} className={`rounded-2xl p-6 ${bg} scroll-mt-6`}>
      <h3 className="flex items-center gap-2 text-lg font-bold text-gold-300 mb-4">
        <span>{emoji}</span> {title}
      </h3>
      {children}
    </section>
  );
}

function Pill({ label, variant = "default" }: { label: string; variant?: "default" | "good" | "bad" | "gold" }) {
  const colors = {
    default: "bg-mystic-700/80 text-gray-300",
    good: "bg-green-400/10 text-green-300 border border-green-400/20",
    bad: "bg-red-400/10 text-red-300 border border-red-400/20",
    gold: "bg-gold-400/15 text-gold-300 border border-gold-400/25",
  };
  return (
    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${colors[variant]}`}>
      {label}
    </span>
  );
}

function StageBlock({
  stage,
  description,
  features,
}: {
  stage: string;
  description: string;
  features: string[];
}) {
  return (
    <div className="p-4 rounded-xl bg-mystic-900/40 border border-mystic-700/30">
      <p className="text-gold-300 font-semibold text-sm mb-1">{stage}</p>
      <p className="text-gray-400 text-xs mb-2">{description}</p>
      <ul className="space-y-0.5">
        {features.map((f, i) => (
          <li key={i} className="text-gray-300 text-xs flex items-start gap-1.5">
            <span className="text-gold-400/60 mt-0.5 shrink-0">·</span>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ===== Sample data for preview =====
function sampleBaziReport(lang: "zh" | "en"): BaziReport {
  if (lang === "en") {
    return {
      basicChart: {
        solarDate: "March 16, 1982 10:00",
        lunarDate: "Ren-Xu year, 2nd month, 21st day, Si hour",
        fourPillars: "壬戌 癸卯 戊戌 己巳",
        dayMaster: "戊土 (Yang Earth)",
        dayMasterDesc: "Great Desert Earth",
        fiveElements: "Earth dominant (3 Earth), Water 1, Wood 1, Fire 1, Metal weak",
        zodiac: "Dog",
        nayin: "Ocean Water / Gold Foil / Flat Wood / Large Forest Wood",
      },
      destinySummary: {
        title: "厚土载物，外柔内刚 (Steadfast Earth, Gentle Outside, Strong Within)",
        overview: "Your Day Master is Yang Earth, strong and rooted. Finances and authority have strength. Metal is weak but hidden. At your core: steady, pragmatic, resilient. You appear easygoing but hold firm principles. You're deeply loyal with clear boundaries.",
        strengths: ["Trustworthy and reliable", "Strong endurance", "Down-to-earth and diligent", "Takes responsibility well", "Family-oriented and committed", "Good patron relationships"],
        weaknesses: ["Stubborn, slow to adapt", "Internalizes stress", "Occasionally emotional", "Generous to a fault — money leaks through kindness"],
        overallGrade: "Above Average",
        lifeArc: "Self-made, gradually rising after midlife, with peaceful and comfortable later years.",
      },
      personality: {
        core: {
          title: "戊土 Day Master — Steady and Rooted",
          points: ["Calm, pragmatic — pursues real results, not flash", "Strong inner principles — hard to persuade once decided", "Loyal and righteous — deeply committed to family and friends"],
        },
        emotional: {
          title: "癸水 Revealed + 卯木 Wisdom",
          points: ["Keen observer — appears rough but is actually sensitive", "Gentle exterior, steely interior — resilient under pressure", "Slow to anger, but can erupt when pushed too far"],
        },
        social: {
          title: "Interpersonal Style",
          points: ["Attracts mentors, superiors, and female patrons", "Guards against disputes from relatives and acquaintances", "Selective with friends — few but genuine"],
        },
      },
      career: {
        pattern: {
          title: "靠实力吃饭，越老越值钱 (Skill-Based, Growing More Valuable with Age)",
          description: "Earth strong, wealth and authority present, resource star hidden — a classic self-made professional pattern.",
          suitable: ["Real estate / Construction / Engineering", "Management / Administration", "Manufacturing / Agriculture", "Technical roles / Stable organizations"],
          avoid: ["Speculation / High-risk ventures", "Fast-money industries", "Frequent job changes"],
        },
        stages: [
          { stage: "Early Years (0–30)", description: "Foundation-building phase with ups and downs", features: ["Worked hard, steady effort", "Received guidance from mentors", "Built firm roots through perseverance"] },
          { stage: "Midlife (31–50)", description: "Golden period — rising fortune, career breakthrough", features: ["31–40: Strong patron luck, career breakthroughs", "41–50: Career peak, stable position, growing reputation"] },
          { stage: "Later Years (51+)", description: "Stable, comfortable, well-deserved rest", features: ["Career stability and respect", "Financially worry-free", "Filial children, comfortable life"] },
        ],
        advice: { strengths: ["Resilient under pressure", "Strong execution", "Reliable and stable"], weaknesses: ["Stubbornness", "Inflexibility", "Over-worrying"], suggestions: ["Focus deeply on one industry", "Listen to mentors", "Boldly advance during ages 35–45"] },
      },
      wealth: {
        pattern: {
          description: "Earth stores wealth (Xu as treasury). Water and Wood represent wealth. Metal is weak — money may leak.",
          regularIncome: "Stable salary income, steadily rising through midlife",
          extraIncome: "Side income possible but volatile — prefer conservative investments",
          savingsCapacity: "Moderate — generous nature leads to leakage; improves with age",
        },
        stages: [
          { stage: "Early Years (0–30)", description: "Money came and went — hard to accumulate", features: ["Hard-earned money", "High expenses", "Leaked through family and friends"] },
          { stage: "Midlife (31–50)", description: "Wealth takes off — midlife prosperity", features: ["31–40: Income increase, treasury opens", "41–50: Peak wealth, double harvest from income streams"] },
          { stage: "Later Years (51+)", description: "Financially stable and worry-free", features: ["No money worries", "Stable assets", "Comfortable retirement"] },
        ],
        advice: {
          suitable: ["Conservative investments", "Real estate purchases", "Long-term value holdings"],
          avoid: ["Speculation and gambling", "High-risk projects", "Lending money indiscriminately"],
        },
      },
      relationships: {
        loveView: {
          description: "Loyal, family-oriented, devoted — values commitment above all",
          strengths: ["Devoted to partner", "Takes responsibility", "Willing to give and sacrifice"],
          weaknesses: ["Stubborn, poor communicator", "Not naturally romantic", "Prone to silent treatment"],
        },
        marriage: {
          bestAge: "29–35 — the optimal marriage window",
          stages: [
            { stage: "Early Marriage (20–28)", description: "Turbulent, needs adjustment", features: ["Emotional instability", "Personality clashes", "Proceed with caution"] },
            { stage: "Ideal Marriage (29–35)", description: "Most stable and lasting", features: ["Emotionally mature", "Right partner found", "Happily ever after"] },
            { stage: "Midlife Marriage (36+)", description: "Stable companionship", features: ["Family over romance", "Mutual support", "Working together for children"] },
          ],
          spouse: "Gentle, understanding, family-oriented — likely Water or Wood destiny (Rat, Pig, Rabbit, Tiger years)",
          children: "Above-average fortune — filial, sensible, successful; a source of comfort in later years",
        },
        advice: ["Learn to express emotions openly", "Communicate more, argue less", "Respect your partner's perspective", "Stay committed — your marriage can be deeply stable"],
      },
      health: {
        constitution: "Strong physique, robust resistance, quick recovery — no major illnesses in life",
        risks: ["Digestive system", "Neck, shoulders, lumbar spine", "Joints", "Stress-related insomnia and anxiety"],
        stages: [
          { stage: "Early Years (0–30)", description: "Healthy, rarely ill, full of energy" },
          { stage: "Midlife (31–50)", description: "High stress, fatigue risk, digestive and sleep issues — prioritize self-care" },
          { stage: "Later Years (51+)", description: "Manageable health — watch cardiovascular and joint health, maintain routine" },
        ],
        advice: {
          suitable: ["Regular sleep schedule", "Moderate exercise (walking, swimming)", "Light, stomach-friendly diet", "Stress relief practices"],
          avoid: ["Staying up late", "Overeating", "Excessive alcohol", "Internalizing pressure"],
        },
      },
      fiveElements: {
        favorable: ["Fire", "Wood"],
        unfavorable: ["Earth", "Metal"],
        directions: "East, South (Wood and Fire directions); avoid Center, West",
        colors: "Red, Green, Purple (Fire and Wood colors); reduce Yellow, Brown, White",
        industries: "Culture / Education / Media / Internet / Food & Beverage / Energy / Electronics",
        accessories: "Wood accessories, Red crystals, Amethyst, Green Phantom Quartz; limit metal jewelry",
      },
      lifeSummary: {
        coreSummary: "You are a Yang Earth, strong and rooted — the image of thick soil carrying the world. Gentle outside, firm inside. Loyal and committed. Your life follows: steady effort → midlife breakthrough → peaceful prosperity.",
        keywords: ["稳 (Steady)", "拼 (Persevere)", "守 (Preserve)", "富 (Prosper)", "安 (Peace)"],
        majorLuck: [
          { ageRange: "10–19", pillar: "甲辰", fortune: "Steady growth, foundation-building" },
          { ageRange: "20–29", pillar: "乙巳", fortune: "Ups and downs, career exploration" },
          { ageRange: "30–39", pillar: "丙午", fortune: "Strong patron luck, career breakthrough — golden decade" },
          { ageRange: "40–49", pillar: "丁未", fortune: "Career peak, wealth flourishes, power and harvest" },
          { ageRange: "50–59", pillar: "戊申", fortune: "Stable enjoyment, asset preservation, health focus" },
          { ageRange: "60+", pillar: "己酉", fortune: "Peaceful prosperity, filial children, comfortable retirement" },
        ],
      },
      tenYearForecast: {
        overview: "Overall steady upward trajectory — initial resistance gives way to smooth progress. Wealth strengthens year by year. Career achieves breakthroughs. Projects, partnerships, and wealth-seeking all have opportunity.",
        years: [
          { year: 2026, stemBranch: "丙午", fortune: "吉 (Favorable)", description: "Fire flourishes, supporting your body. Patrons are evident, projects land well, income rises steadily.", highlights: ["Strong patron luck", "Project opportunities", "Income growth"], warnings: ["Watch contract details", "Avoid disputes", "Don't expand partnerships blindly"] },
          { year: 2027, stemBranch: "丁未", fortune: "吉 (Favorable)", description: "Stable and favorable. Income thickens, assets preserve value. Good for steady investments.", highlights: ["Income increase", "Asset preservation", "Good for investment"], warnings: ["Family matters distract", "Expenses increase", "Guard against lending"] },
          { year: 2028, stemBranch: "戊申", fortune: "中 (Neutral)", description: "A year of ups and downs — new opportunities, cross-sector cooperation, side income chances appear.", highlights: ["New opportunities", "Cross-sector collaboration", "Side income"], warnings: ["Metal depletes body — stay conservative", "Avoid high-risk speculation"] },
          { year: 2029, stemBranch: "己酉", fortune: "中下 (Below Average)", description: "Stable progress — old projects continue returning money. But pressure mounts.", highlights: ["Steady progress", "Ongoing returns"], warnings: ["High stress", "Sleep and digestion issues", "Office politics"] },
          { year: 2030, stemBranch: "庚戌", fortune: "吉 (Favorable)", description: "Recovery and rise — wealth treasury opens. Real estate and long-term assets are favorable.", highlights: ["Treasury opens", "Real estate favorable", "Long-term assets"], warnings: ["Earth too heavy — avoid exhaustion", "Balance work and rest"] },
          { year: 2031, stemBranch: "辛亥", fortune: "吉 (Favorable)", description: "Good wealth energy — network brings income, clients, and partnership revenue.", highlights: ["Network-driven wealth", "Client growth", "Partnership income"], warnings: ["Water controls body — avoid relationship drama affecting work"] },
          { year: 2032, stemBranch: "壬子", fortune: "中 (Neutral)", description: "Small fluctuations — regular income is stable, passive income increases.", highlights: ["Stable income", "Passive income growth"], warnings: ["Cash flow cycles lengthen", "Reserve liquid funds"] },
          { year: 2033, stemBranch: "癸丑", fortune: "吉 (Favorable)", description: "Steady improvement — resources integrate, status rises, reputation accumulates.", highlights: ["Resource integration", "Status elevation", "Reputation building"], warnings: ["High social expenses", "Control spending"] },
          { year: 2034, stemBranch: "甲寅", fortune: "大吉 (Excellent)", description: "Wood flourishes, dredging earth — THE strongest year of the decade. Career breakthrough, new projects, expansion.", highlights: ["Career breakthrough", "Major new projects", "Entrepreneurial luck", "Wealth expansion"], warnings: ["Take bold action", "Plan expansion now"] },
          { year: 2035, stemBranch: "乙卯", fortune: "吉 (Favorable)", description: "Continued strength — career solidifies, both fame and fortune, long-term returns land.", highlights: ["Career solidification", "Fame and fortune", "Long-term returns"], warnings: ["Keep low profile", "Guard against envy and competition"] },
        ],
        careerAdvice: ["Deepen your expertise in one industry — stability yields the best returns", "Seek advice before major decisions — reduce blind spots", "2034–2035 is your golden window — seize it boldly"],
        wealthAdvice: ["Prioritize stable income — play safely with side investments", "Minimize lending and guarantees — these are your wealth leaks", "Focus on real estate and long-term value assets"],
        healthAdvice: "In midlife, prioritize: spleen-stomach, lumbar spine, joints, sleep, and stress relief. Less late nights, less overwork — sustainable wellness supports lasting success.",
      },
    };
  }

  // Chinese sample
  return {
    basicChart: {
      solarDate: "1982年3月16日 10:00（巳时）",
      lunarDate: "壬戌年 二月廿一 巳时",
      fourPillars: "壬戌　癸卯　戊戌　己巳",
      dayMaster: "戊土",
      dayMasterDesc: "大驿土命",
      fiveElements: "土旺（3土）、水木各1、火1、金极弱（藏微金）",
      zodiac: "狗",
      nayin: "大海水、金箔金、平地木、大林木",
    },
    destinySummary: {
      title: "厚土载物，外柔内刚",
      overview: "你是戊土日主、土旺身强、财官有气、金弱藏暗的命局。核心气质：稳重、务实、抗压强、责任感重；外表随和、内心固执，重情重义、底线清晰。",
      strengths: ["守信可靠、忍耐力强", "做事踏实、能扛事", "顾家、重承诺", "贵人缘不差"],
      weaknesses: ["固执、慢热", "不善变通、容易操心", "压力内化、偶尔情绪化", "漏财心软"],
      overallGrade: "中上命",
      lifeArc: "靠自己打拼起家，中年后渐入佳境，晚年安稳富足，一生'稳中有进、劳而有获'。",
    },
    personality: {
      core: {
        title: "核心性格（戊土日主 + 戌土重重）",
        points: ["沉稳务实：做事不浮夸，重结果、讲效率", "固执有主见：内心原则极强，一旦认定很难被说服", "重情重义：对家人朋友掏心掏肺，但也容易被人情拖累"],
      },
      emotional: {
        title: "情绪与思维（癸水透干 + 卯木藏智）",
        points: ["心思细腻、观察力强：看似粗线条，实则心细、敏感", "外柔内刚：待人温和、善交际，但内心坚韧、不服输", "情绪慢热型：不轻易爆发，积累到临界点会突然爆发"],
      },
      social: {
        title: "人际与处世",
        points: ["贵人缘：中上，易得长辈、上司、女性贵人相助", "小人多来自亲友、熟人、利益纠纷", "交友观：宁缺毋滥，朋友不多但都是真心的"],
      },
    },
    career: {
      pattern: {
        title: "厚土载业，中年起飞",
        description: "土旺身强，财官有气，印星暗藏，属'靠实力吃饭、越老越值钱'的命。",
        suitable: ["地产、建筑、工程、土木", "管理、行政、实体生意", "技术岗、制造业、农业", "稳定单位、国企、管理层"],
        avoid: ["投机、高风险、快钱", "不稳定行业", "频繁换工作"],
      },
      stages: [
        { stage: "早年（0–30岁）", description: "积累期，稳中有波折", features: ["踏实努力、贵人相助", "起伏多、换环境多", "靠自己打拼、根基逐渐稳固"] },
        { stage: "中年（31–50岁）", description: "黄金期，运势上升、事业有成", features: ["31–40岁：贵人运强、事业突破", "41–50岁：事业稳定、地位稳固、财运亨通"] },
        { stage: "晚年（51岁后）", description: "安稳富足、享福之命", features: ["事业稳定、财运不愁", "子女孝顺、生活安逸"] },
      ],
      advice: {
        strengths: ["抗压强、执行力强", "稳重可靠、能扛事", "适合长期深耕"],
        weaknesses: ["固执、不善变通", "容易错失机会", "操心过度、身体易累"],
        suggestions: ["专注深耕一个行业", "多听贵人意见、学会变通", "把握35–45岁黄金期、大胆突破"],
      },
    },
    wealth: {
      pattern: {
        description: "土旺财库（戌为财库）、水木为财、金弱漏财，属'正财稳、偏财有、守财需防漏'。",
        regularIncome: "正财稳、厚、持久，靠努力稳步上升",
        extraIncome: "偏财有机会、但不稳定、适合稳健投资",
        savingsCapacity: "中等，心软、重情、易借钱给别人；中年后逐渐学会理财",
      },
      stages: [
        { stage: "早年（0–30岁）", description: "财来财去、难聚财", features: ["赚钱辛苦、开销大", "易因人情、朋友漏财"] },
        { stage: "中年（31–50岁）", description: "财运起飞、中年暴富", features: ["31–40岁：财运好转、财库渐开", "41–50岁：财运鼎盛、富贵可期"] },
        { stage: "晚年（51岁后）", description: "财运稳定、富足无忧", features: ["不愁钱花、资产稳定", "被动收入可观、享清福"] },
      ],
      advice: {
        suitable: ["稳健理财、买房置业", "长期投资实体、基金", "中年后可适当扩大投资"],
        avoid: ["投机、赌博、高风险投资", "轻信他人、借钱给不靠谱的人", "冲动消费"],
      },
    },
    relationships: {
      loveView: {
        description: "重情重义、顾家、专一、责任感强、对伴侣好、愿意付出",
        strengths: ["专一、责任感强", "顾家、愿意付出"],
        weaknesses: ["固执、不善表达", "慢热、情绪内敛", "容易冷战、不懂浪漫"],
      },
      marriage: {
        bestAge: "29–35岁",
        stages: [
          { stage: "早婚（20–28岁）", description: "易有波折、磨合多", features: ["感情不稳定、争吵多", "早婚需谨慎"] },
          { stage: "适婚（29–35岁）", description: "最佳婚期、稳定长久", features: ["遇到正缘、三观契合", "互相包容、婚姻幸福"] },
          { stage: "中年（36岁后）", description: "婚姻稳固、相濡以沫", features: ["亲情大于爱情", "互相依赖、为子女奋斗"] },
        ],
        spouse: "温柔、体贴、善解人意、顾家、多为水/木命（鼠、猪、兔、虎）",
        children: "子女缘分中上，孝顺、懂事、有出息",
      },
      advice: ["学会表达情感、多沟通", "少冷战、尊重伴侣意见", "顾家专一、婚姻可稳"],
    },
    health: {
      constitution: "体质偏壮、抵抗力强、恢复快、土厚身健",
      risks: ["脾胃、肠胃、消化系统", "肩颈、腰椎、关节", "压力大导致的失眠、焦虑"],
      stages: [
        { stage: "早年（0–30岁）", description: "身体健康、少生病、精力旺盛" },
        { stage: "中年（31–50岁）", description: "压力大、劳累、易有劳损、肠胃不适、需注意养生" },
        { stage: "晚年（51岁后）", description: "健康尚可、需防心脑血管、关节问题" },
      ],
      advice: {
        suitable: ["规律作息、适度运动", "清淡饮食、养胃健脾", "放松心情、减压"],
        avoid: ["熬夜、暴饮暴食", "烟酒过度、过度劳累", "压力内化、久坐不动"],
      },
    },
    fiveElements: {
      favorable: ["火", "木"],
      unfavorable: ["土", "金"],
      directions: "东方、南方（木火方）；忌中央、西方（土金方）",
      colors: "红、绿、紫（火木色）；少用黄、咖、白（土金色）",
      industries: "文化、教育、传媒、互联网、餐饮、能源、电子",
      accessories: "木质、红色、紫水晶、绿幽灵；少戴金属饰品",
    },
    lifeSummary: {
      coreSummary: "你是土旺身强、厚土载物、外柔内刚、重情重义、踏实稳重、劳而有获、中年起飞、晚年安稳的命局。",
      keywords: ["稳", "拼", "守", "富", "安"],
      majorLuck: [
        { ageRange: "10–19", pillar: "甲辰", fortune: "平稳成长、学业/工作打基础" },
        { ageRange: "20–29", pillar: "乙巳", fortune: "奔波起伏、感情波动、事业摸索" },
        { ageRange: "30–39", pillar: "丙午", fortune: "贵人运强、事业突破、财运好转、黄金十年" },
        { ageRange: "40–49", pillar: "丁未", fortune: "事业鼎盛、财运亨通、掌权收获" },
        { ageRange: "50–59", pillar: "戊申", fortune: "稳定享福、资产保值、健康养生" },
        { ageRange: "60岁后", pillar: "己酉", fortune: "安稳富足、享清福、子女孝顺" },
      ],
    },
    tenYearForecast: {
      overview: "整体稳步上行、先阻后顺、财运逐年走强，事业守成有突破。核心优势：抗压强、资源积累足；注意短板：人情耗财、决策固执。",
      years: [
        { year: 2026, stemBranch: "丙午", fortune: "吉", description: "火旺助身，贵人明显、项目落地机会多、正财稳定上涨。", highlights: ["贵人明显", "项目落地机会多", "正财上涨"], warnings: ["注意合同细节", "口舌是非", "不要盲目合伙扩张"] },
        { year: 2027, stemBranch: "丁未", fortune: "吉", description: "收入增厚、资产保值、适合稳健投资。", highlights: ["收入增厚", "资产保值"], warnings: ["家庭琐事分心", "开销变大", "防人情借贷漏财"] },
        { year: 2028, stemBranch: "戊申", fortune: "中", description: "起伏之年，有新机遇、跨界合作、副业机缘。", highlights: ["新机遇", "跨界合作", "副业机缘"], warnings: ["金旺耗身", "决策保守", "忌高风险投机"] },
        { year: 2029, stemBranch: "己酉", fortune: "中下", description: "稳中求进、旧项目持续回款。", highlights: ["稳中求进", "持续回款"], warnings: ["压力大", "睡眠肠胃不佳", "防小人职场竞争"] },
        { year: 2030, stemBranch: "庚戌", fortune: "吉", description: "财库开启、不动产、长期资产有利。", highlights: ["财库开启", "不动产有利"], warnings: ["土太重", "避免过度劳累"] },
        { year: 2031, stemBranch: "辛亥", fortune: "吉", description: "人脉带动财运、客源、合作增收。", highlights: ["人脉带动财运", "合作增收"], warnings: ["水旺克身", "避免感情纠纷拖累事业"] },
        { year: 2032, stemBranch: "壬子", fortune: "中", description: "正财稳固，被动收入增加。", highlights: ["正财稳固", "被动收入增加"], warnings: ["资金周转", "回款周期拉长"] },
        { year: 2033, stemBranch: "癸丑", fortune: "吉", description: "资源整合、地位提升、口碑积累。", highlights: ["资源整合", "地位提升"], warnings: ["人情往来花销大", "严控支出"] },
        { year: 2034, stemBranch: "甲寅", fortune: "大吉", description: "木旺疏土，十年最强一年！事业突破、大利新项目、创业、拓展布局，财源广阔。", highlights: ["事业突破", "大利新项目", "创业拓展", "财源广阔"], warnings: ["大胆规划", "顺势扩张", "关键上升拐点"] },
        { year: 2035, stemBranch: "乙卯", fortune: "吉", description: "事业稳固、名利双收、长期收益落地。", highlights: ["事业稳固", "名利双收"], warnings: ["低调行事", "防眼红小人"] },
      ],
      careerAdvice: ["适合深耕主业、实体、工程、管理", "重大决策多听他人建议", "2034、2035是中年黄金上升期，务必抓住"],
      wealthAdvice: ["正财最优，偏财小玩即可", "少借钱、少担保、少人情捆绑", "适合不动产、长线保值"],
      healthAdvice: "中年阶段重点养护：脾胃、腰椎、关节、睡眠、情绪减压，少熬夜、少劳累，可长久稳运。",
    },
  };
}

export default function ReportModal({
  report,
  birthData,
  lang,
  onClose,
  blurred = false,
}: {
  report?: BaziReport | null;
  birthData?: BirthData | null;
  lang: "zh" | "en";
  onClose?: () => void;
  blurred?: boolean;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState<string>(CHAPTERS[0].id);

  // Use sample data for preview, or real report data
  const data = report || sampleBaziReport(lang);
  const displayLang = lang;

  // Intersection observer for active chapter tracking
  useEffect(() => {
    if (blurred) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveChapter(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    const sections = contentRef.current?.querySelectorAll("section[id]");
    sections?.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [blurred, data]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const isZh = displayLang === "zh";

  return (
    <div className={`${blurred ? "" : "fixed inset-0 z-50 flex items-start justify-center"} bg-mystic-950/95 backdrop-blur-sm overflow-y-auto`}>
      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .report-content, .report-content * { visibility: visible; }
          .report-content { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
          .report-sidebar { display: none !important; }
        }
      `}</style>

      {/* Close / Print bar */}
      {!blurred && (
        <div className="no-print fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-mystic-950/90 backdrop-blur border-b border-mystic-800/50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-mystic-800/80 text-gray-300 text-sm hover:bg-mystic-700 transition-colors"
          >
            ← {isZh ? "返回" : "Back"}
          </button>
          <p className="text-gold-300 font-semibold text-sm">
            {isZh ? "Clara 命理全息报告" : "Clara Ba Zi Holistic Report"}
          </p>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-gold-400/15 text-gold-300 text-sm hover:bg-gold-400/25 transition-colors"
          >
            🖨️ {isZh ? "打印" : "Print"}
          </button>
        </div>
      )}

      <div className={`report-content flex gap-0 max-w-6xl w-full ${blurred ? "" : "mt-14"}`}>
        {/* Sidebar nav */}
        <aside className={`report-sidebar ${blurred ? "hidden" : "hidden lg:block sticky top-16 self-start w-48 shrink-0 py-6 pr-4"}`}>
          <nav className="space-y-0.5">
            {CHAPTERS.map((ch) => (
              <button
                key={ch.id}
                onClick={() => scrollTo(ch.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                  activeChapter === ch.id
                    ? "bg-gold-400/15 text-gold-300 font-medium"
                    : "text-gray-500 hover:text-gray-300 hover:bg-mystic-800/40"
                }`}
              >
                <span className="mr-1.5">{ch.emoji}</span>
                {isZh ? ch.label : ch.labelEn}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile chapter nav (top scroll) */}
        {!blurred && (
          <div className="lg:hidden no-print sticky top-14 z-40 -mx-2 px-2 py-2 bg-mystic-950/90 backdrop-blur border-b border-mystic-800/50 overflow-x-auto">
            <div className="flex gap-1 min-w-max">
              {CHAPTERS.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => scrollTo(ch.id)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-xs transition-all ${
                    activeChapter === ch.id
                      ? "bg-gold-400/15 text-gold-300 font-medium"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {ch.emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div
          ref={contentRef}
          className={`flex-1 min-w-0 py-6 px-4 sm:px-8 space-y-8 ${blurred ? "blur-sm pointer-events-none select-none" : ""}`}
        >
          {/* Report header */}
          <div className="text-center space-y-3 pb-6 border-b border-mystic-700/50">
            <h2 className="text-3xl font-bold gold-text">
              {isZh ? "命理全息报告" : "Ba Zi Holistic Report"}
            </h2>
            <p className="text-gray-500 text-sm">
              {birthData
                ? `${birthData.year}-${String(birthData.month).padStart(2, "0")}-${String(birthData.day).padStart(2, "0")} · ${birthData.gender === "male" ? "♂" : "♀"}`
                : isZh
                ? "1982-03-16 · ♂ 乾造"
                : "1982-03-16 · ♂ Male"}
            </p>
          </div>

          {/* Ch.1: Basic Chart */}
          <SectionCard id="basicChart" emoji="📋" title={isZh ? "基本命盘" : "Basic Chart"}>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="flex gap-2"><span className="text-gray-500 shrink-0">{isZh ? "公历" : "Solar"}:</span><span className="text-gray-200">{data.basicChart.solarDate}</span></div>
              <div className="flex gap-2"><span className="text-gray-500 shrink-0">{isZh ? "农历" : "Lunar"}:</span><span className="text-gray-200">{data.basicChart.lunarDate}</span></div>
              <div className="flex gap-2"><span className="text-gray-500 shrink-0">{isZh ? "四柱" : "Pillars"}:</span><span className="text-gray-200 font-mono">{data.basicChart.fourPillars}</span></div>
              <div className="flex gap-2"><span className="text-gray-500 shrink-0">{isZh ? "日主" : "Day Master"}:</span><span className="text-gold-300 font-semibold">{data.basicChart.dayMaster}</span></div>
              <div className="flex gap-2"><span className="text-gray-500 shrink-0">{isZh ? "纳音" : "Nayin"}:</span><span className="text-gray-200">{data.basicChart.dayMasterDesc}</span></div>
              <div className="flex gap-2"><span className="text-gray-500 shrink-0">{isZh ? "五行" : "Elements"}:</span><span className="text-gray-200">{data.basicChart.fiveElements}</span></div>
              <div className="flex gap-2"><span className="text-gray-500 shrink-0">{isZh ? "生肖" : "Zodiac"}:</span><span className="text-gray-200">{data.basicChart.zodiac}</span></div>
              <div className="flex gap-2"><span className="text-gray-500 shrink-0">{isZh ? "纳音" : "Nayin"}:</span><span className="text-gray-200 text-xs">{data.basicChart.nayin}</span></div>
            </div>
          </SectionCard>

          {/* Ch.2: Destiny Summary */}
          <SectionCard id="destinySummary" emoji="🌏" title={isZh ? "命格总论" : "Destiny Summary"} accent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-xl font-bold gold-text">{data.destinySummary.title}</p>
              </div>
              <p className="text-gray-200 text-sm leading-relaxed">{data.destinySummary.overview}</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-green-400 text-xs font-semibold mb-2">{isZh ? "✅ 优点" : "✅ Strengths"}</p>
                  <ul className="space-y-0.5">
                    {data.destinySummary.strengths.map((s, i) => (
                      <li key={i} className="text-gray-300 text-xs flex gap-1.5"><span className="text-green-400/60">+</span>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-orange-400 text-xs font-semibold mb-2">{isZh ? "⚠️ 短板" : "⚠️ Weaknesses"}</p>
                  <ul className="space-y-0.5">
                    {data.destinySummary.weaknesses.map((s, i) => (
                      <li key={i} className="text-gray-300 text-xs flex gap-1.5"><span className="text-orange-400/60">-</span>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Pill label={data.destinySummary.overallGrade} variant="gold" />
                <span className="text-gray-400 text-xs">{data.destinySummary.lifeArc}</span>
              </div>
            </div>
          </SectionCard>

          {/* Ch.3: Personality */}
          <SectionCard id="personality" emoji="🧠" title={isZh ? "性格心性" : "Personality"}>
            <div className="space-y-4">
              {[
                { key: "core" as const, color: "text-gold-300" },
                { key: "emotional" as const, color: "text-blue-300" },
                { key: "social" as const, color: "text-green-300" },
              ].map(({ key, color }) => (
                <div key={key} className="p-4 rounded-xl bg-mystic-900/40">
                  <p className={`text-sm font-semibold mb-2 ${color}`}>{data.personality[key].title}</p>
                  <ul className="space-y-1">
                    {data.personality[key].points.map((p, i) => (
                      <li key={i} className="text-gray-300 text-xs flex gap-1.5">
                        <span className="text-gray-600 mt-0.5">·</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Ch.4: Career */}
          <SectionCard id="career" emoji="💼" title={isZh ? "事业运势" : "Career Fortune"} accent>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-mystic-900/40">
                <p className="text-gold-300 font-semibold text-sm mb-1">{data.career.pattern.title}</p>
                <p className="text-gray-300 text-xs">{data.career.pattern.description}</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-green-400 text-xs font-semibold mb-1.5">{isZh ? "适合行业" : "Suitable Industries"}</p>
                  <div className="flex flex-wrap gap-1">
                    {data.career.pattern.suitable.map((s, i) => <Pill key={i} label={s} variant="good" />)}
                  </div>
                </div>
                <div>
                  <p className="text-red-400 text-xs font-semibold mb-1.5">{isZh ? "不适合" : "Avoid"}</p>
                  <div className="flex flex-wrap gap-1">
                    {data.career.pattern.avoid.map((s, i) => <Pill key={i} label={s} variant="bad" />)}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {data.career.stages.map((s, i) => <StageBlock key={i} {...s} />)}
              </div>
              <div className="p-4 rounded-xl bg-gold-400/5 border border-gold-400/15">
                <p className="text-gold-300 text-xs font-semibold mb-2">{isZh ? "💡 事业建议" : "💡 Career Advice"}</p>
                <ul className="space-y-0.5">
                  {data.career.advice.suggestions.map((s, i) => (
                    <li key={i} className="text-gray-200 text-xs flex gap-1.5"><span className="text-gold-400/60 mt-0.5">·</span>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </SectionCard>

          {/* Ch.5: Wealth */}
          <SectionCard id="wealth" emoji="💰" title={isZh ? "财运分析" : "Wealth Analysis"} accent>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-mystic-900/40">
                <p className="text-gray-200 text-xs leading-relaxed">{data.wealth.pattern.description}</p>
                <div className="grid grid-cols-3 gap-3 mt-3 text-xs">
                  <div className="text-center p-2 rounded-lg bg-mystic-800/40">
                    <p className="text-gray-500 mb-0.5">{isZh ? "正财" : "Regular Income"}</p>
                    <p className="text-green-300">{data.wealth.pattern.regularIncome}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-mystic-800/40">
                    <p className="text-gray-500 mb-0.5">{isZh ? "偏财" : "Extra Income"}</p>
                    <p className="text-amber-300">{data.wealth.pattern.extraIncome}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-mystic-800/40">
                    <p className="text-gray-500 mb-0.5">{isZh ? "守财" : "Savings"}</p>
                    <p className="text-blue-300">{data.wealth.pattern.savingsCapacity}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {data.wealth.stages.map((s, i) => <StageBlock key={i} {...s} />)}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-green-400/5 border border-green-400/15">
                  <p className="text-green-400 text-xs font-semibold mb-1.5">{isZh ? "宜" : "Recommended"}</p>
                  <ul className="space-y-0.5">
                    {data.wealth.advice.suitable.map((s, i) => (
                      <li key={i} className="text-gray-200 text-xs flex gap-1.5"><span className="text-green-400/60">✓</span>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 rounded-xl bg-red-400/5 border border-red-400/15">
                  <p className="text-red-400 text-xs font-semibold mb-1.5">{isZh ? "忌" : "Avoid"}</p>
                  <ul className="space-y-0.5">
                    {data.wealth.advice.avoid.map((s, i) => (
                      <li key={i} className="text-gray-200 text-xs flex gap-1.5"><span className="text-red-400/60">✕</span>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Ch.6: Relationships */}
          <SectionCard id="relationships" emoji="💕" title={isZh ? "感情婚姻" : "Relationships"}>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-mystic-900/40">
                <p className="text-gray-200 text-xs leading-relaxed">{data.relationships.loveView.description}</p>
                <div className="grid sm:grid-cols-2 gap-3 mt-3">
                  <div>
                    <p className="text-green-400 text-xs font-semibold mb-1">{isZh ? "优势" : "Strengths"}</p>
                    {data.relationships.loveView.strengths.map((s, i) => (
                      <p key={i} className="text-gray-300 text-xs">+ {s}</p>
                    ))}
                  </div>
                  <div>
                    <p className="text-orange-400 text-xs font-semibold mb-1">{isZh ? "短板" : "Weaknesses"}</p>
                    {data.relationships.loveView.weaknesses.map((s, i) => (
                      <p key={i} className="text-gray-300 text-xs">- {s}</p>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-rose-400/5 border border-rose-400/15">
                <p className="text-rose-300 text-sm font-semibold mb-2">
                  {isZh ? "💍 婚姻运势" : "💍 Marriage Fortune"}
                  {data.relationships.marriage.bestAge && (
                    <span className="text-rose-400/70 text-xs ml-2">
                      {isZh ? "最佳婚期" : "Best age"}: {data.relationships.marriage.bestAge}
                    </span>
                  )}
                </p>
                <div className="space-y-3">
                  {data.relationships.marriage.stages.map((s, i) => <StageBlock key={i} {...s} />)}
                </div>
                <div className="mt-3 grid sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex gap-2"><span className="text-gray-500">{isZh ? "配偶" : "Spouse"}:</span><span className="text-gray-200">{data.relationships.marriage.spouse}</span></div>
                  <div className="flex gap-2"><span className="text-gray-500">{isZh ? "子女" : "Children"}:</span><span className="text-gray-200">{data.relationships.marriage.children}</span></div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {data.relationships.advice.map((s, i) => <Pill key={i} label={s} variant="gold" />)}
              </div>
            </div>
          </SectionCard>

          {/* Ch.7: Health */}
          <SectionCard id="health" emoji="🫀" title={isZh ? "健康状况" : "Health"}>
            <div className="space-y-4">
              <p className="text-gray-200 text-sm">{data.health.constitution}</p>
              <div>
                <p className="text-amber-400 text-xs font-semibold mb-1.5">{isZh ? "⚠️ 易患" : "⚠️ Risk Areas"}</p>
                <div className="flex flex-wrap gap-1">
                  {data.health.risks.map((r, i) => <Pill key={i} label={r} variant="bad" />)}
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {data.health.stages.map((s, i) => (
                  <div key={i} className="p-3 rounded-xl bg-mystic-900/40 text-center">
                    <p className="text-gold-300 text-xs font-semibold mb-1">{s.stage}</p>
                    <p className="text-gray-400 text-xs">{s.description}</p>
                  </div>
                ))}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-green-400/5 border border-green-400/15">
                  <p className="text-green-400 text-xs font-semibold mb-1.5">{isZh ? "宜" : "Recommended"}</p>
                  {data.health.advice.suitable.map((s, i) => <p key={i} className="text-gray-200 text-xs">✓ {s}</p>)}
                </div>
                <div className="p-3 rounded-xl bg-red-400/5 border border-red-400/15">
                  <p className="text-red-400 text-xs font-semibold mb-1.5">{isZh ? "忌" : "Avoid"}</p>
                  {data.health.advice.avoid.map((s, i) => <p key={i} className="text-gray-200 text-xs">✕ {s}</p>)}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Ch.8: Five Elements */}
          <SectionCard id="fiveElements" emoji="☯️" title={isZh ? "五行喜忌与开运建议" : "Five Elements & Fortune"} highlight>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-green-400/5 border border-green-400/15 text-center">
                  <p className="text-green-400 text-sm font-semibold mb-2">{isZh ? "喜（有利）" : "Favorable"}</p>
                  <div className="flex justify-center gap-2">
                    {data.fiveElements.favorable.map((f, i) => <Pill key={i} label={f} variant="good" />)}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-red-400/5 border border-red-400/15 text-center">
                  <p className="text-red-400 text-sm font-semibold mb-2">{isZh ? "忌（不利）" : "Unfavorable"}</p>
                  <div className="flex justify-center gap-2">
                    {data.fiveElements.unfavorable.map((f, i) => <Pill key={i} label={f} variant="bad" />)}
                  </div>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="flex gap-2"><span className="text-gray-500">{isZh ? "方位" : "Directions"}:</span><span className="text-gray-200">{data.fiveElements.directions}</span></div>
                <div className="flex gap-2"><span className="text-gray-500">{isZh ? "颜色" : "Colors"}:</span><span className="text-gray-200">{data.fiveElements.colors}</span></div>
                <div className="flex gap-2"><span className="text-gray-500">{isZh ? "行业" : "Industries"}:</span><span className="text-gray-200 text-xs">{data.fiveElements.industries}</span></div>
                <div className="flex gap-2"><span className="text-gray-500">{isZh ? "饰品" : "Accessories"}:</span><span className="text-gray-200 text-xs">{data.fiveElements.accessories}</span></div>
              </div>
            </div>
          </SectionCard>

          {/* Ch.9: Life Summary */}
          <SectionCard id="lifeSummary" emoji="🔮" title={isZh ? "一生总结与大运" : "Life Summary & Luck Cycles"} highlight>
            <div className="space-y-4">
              <p className="text-gray-200 text-sm leading-relaxed text-center">{data.lifeSummary.coreSummary}</p>
              <div className="flex justify-center gap-2">
                {data.lifeSummary.keywords.map((k, i) => (
                  <span key={i} className="px-4 py-2 rounded-full bg-gold-400/15 text-gold-300 text-sm font-bold border border-gold-400/25">{k}</span>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {data.lifeSummary.majorLuck.map((ml, i) => (
                  <div key={i} className="p-3 rounded-xl bg-mystic-900/40 text-center">
                    <p className="text-gold-300 font-semibold text-sm">{ml.ageRange}{isZh ? "岁" : ""}</p>
                    <p className="text-gray-500 text-xs font-mono">{ml.pillar}</p>
                    <p className="text-gray-400 text-xs mt-1">{ml.fortune}</p>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* Ch.10: Ten-Year Forecast */}
          <SectionCard id="tenYearForecast" emoji="📅" title={isZh ? "未来十年整体运势" : "10-Year Forecast"} highlight>
            <div className="space-y-5">
              <p className="text-gray-200 text-sm leading-relaxed">{data.tenYearForecast.overview}</p>

              {/* Year grid */}
              <div className="grid sm:grid-cols-2 gap-3">
                {data.tenYearForecast.years.map((y, i) => {
                  const fortuneColor =
                    y.fortune.includes("大吉") || y.fortune.includes("Excellent") ? "border-green-400/30 bg-green-400/5"
                    : y.fortune.includes("吉") || y.fortune.includes("Favorable") ? "border-green-400/15 bg-green-400/3"
                    : y.fortune.includes("凶") || y.fortune.includes("Below") ? "border-red-400/15 bg-red-400/3"
                    : "border-mystic-700/30 bg-mystic-900/40";
                  return (
                    <div key={y.year} className={`p-4 rounded-xl border ${fortuneColor}`}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-white font-bold text-sm">{y.year}</p>
                        <p className="text-gold-300 font-mono text-xs">{y.stemBranch}</p>
                        <Pill label={y.fortune} variant={y.fortune.includes("吉") || y.fortune.includes("Favorable") || y.fortune.includes("Excellent") ? "good" : y.fortune.includes("凶") || y.fortune.includes("Below") ? "bad" : "default"} />
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed mb-2">{y.description}</p>
                      <div className="grid grid-cols-2 gap-1">
                        <div>
                          {y.highlights.map((h, j) => (
                            <p key={j} className="text-green-400/80 text-[10px]">+ {h}</p>
                          ))}
                        </div>
                        <div>
                          {y.warnings.map((w, j) => (
                            <p key={j} className="text-amber-400/80 text-[10px]">⚠ {w}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-mystic-900/40">
                  <p className="text-blue-300 text-xs font-semibold mb-1.5">💼 {isZh ? "事业" : "Career"}</p>
                  {data.tenYearForecast.careerAdvice.map((s, i) => <p key={i} className="text-gray-300 text-xs">· {s}</p>)}
                </div>
                <div className="p-3 rounded-xl bg-mystic-900/40">
                  <p className="text-green-300 text-xs font-semibold mb-1.5">💰 {isZh ? "财运" : "Wealth"}</p>
                  {data.tenYearForecast.wealthAdvice.map((s, i) => <p key={i} className="text-gray-300 text-xs">· {s}</p>)}
                </div>
                <div className="p-3 rounded-xl bg-mystic-900/40">
                  <p className="text-rose-300 text-xs font-semibold mb-1.5">🫀 {isZh ? "健康" : "Health"}</p>
                  <p className="text-gray-300 text-xs">{data.tenYearForecast.healthAdvice}</p>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Footer */}
          <div className="text-center py-8 border-t border-mystic-700/50">
            <p className="text-gold-300 text-lg italic font-medium">
              {isZh ? "天地人和，顺势而为" : "Heaven, Earth, and Human in Harmony"}
            </p>
            <p className="text-xs text-gray-500 mt-2">Clara · DestinyBridge</p>
          </div>
        </div>
      </div>
    </div>
  );
}
