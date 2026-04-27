export type Stem = "甲" | "乙" | "丙" | "丁" | "戊" | "己" | "庚" | "辛" | "壬" | "癸";
export type Branch = "子" | "丑" | "寅" | "卯" | "辰" | "巳" | "午" | "未" | "申" | "酉" | "戌" | "亥";
export type Element = "木" | "火" | "土" | "金" | "水";
export type YinYang = "阳" | "阴";
export type TenGod = "比肩" | "劫财" | "食神" | "伤官" | "正财" | "偏财" | "正官" | "七杀" | "正印" | "偏印";
export type Gender = "male" | "female";
export type Constitution = "偏寒" | "偏热" | "偏湿" | "偏燥" | "平和";

export interface Pillar {
  stem: Stem;
  branch: Branch;
  stemElement: Element;
  branchElement: Element;
  hiddenStems: Stem[];
}

export interface BaziChart {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
}

export interface FiveElementsCount {
  木: number; 火: number; 土: number; 金: number; 水: number;
}

export interface TenGodResult {
  pillar: string;
  god: TenGod;
  element: Element;
}

// ---- NEW: Wellness-Focused AI Report ----
export interface WellnessReport {
  // Core Bazi insight (one-time purchase)
  blueprint: string;
  constitution: Constitution;
  constitutionExplanation: string;

  // Five Pillars of Daily Life
  food: {
    favorableIngredients: string[];
    avoidIngredients: string[];
    seasonalRecipe: { name: string; why: string; briefRecipe: string };
    mealRhythm: string;
  };
  clothing: {
    powerColors: string[];
    avoidColors: string[];
    occasionGuide: { occasion: string; colorTip: string }[];
  };
  home: {
    bedroomDirection: string;
    wealthCorner: string;
    crystalPlacement: { room: string; crystal: string; purpose: string }[];
    seasonalAdjustment: string;
  };
  travel: {
    favorableDirections: string[];
    bestTimesForImportant: string;
    dailyRhythm: string;
  };
  body: {
    meridianFocus: string;
    selfCareRitual: string;
    emotionalCycle: string;
    sleepGuide: string;
  };

  // Crystal & Product Recommendations
  crystalSet: { crystal: string; element: string; wearing: string; benefit: string }[];
  homeProduct: { name: string; placement: string; benefit: string };

  // 2026 Forecast
  forecast2026: string;

  // Daily mantra
  mantra: string;
}

// ---- Daily Guidance ----
export interface DailyGuidance {
  date: string;
  lunarDate: string;
  energyIndex: number; // 1-10
  energySummary: string;
  food: { ingredient: string; tip: string; simpleRecipe: string };
  clothing: { powerColor: string; avoidColor: string; styleTip: string };
  home: { quickTask: string; crystalTip: string };
  travel: { direction: string; bestTime: string; avoid: string };
  body: { focus: string; twoMinuteRitual: string };
  mantra: string;
}

// ---- Referral & Community ----
export interface ReferralCode {
  code: string;
  ownerId: string;
  totalInvites: number;
  totalCommission: number;
  invitees: { id: string; joinedAt: string; totalSpent: number }[];
}

export interface FamilyGroup {
  id: string;
  name: string;
  ownerId: string;
  members: { userId: string; relationship: string; baziResult?: BaziResult }[];
  createdAt: string;
}

// ---- Legacy (kept for backward compat) ----
export interface AIReport {
  summary: string;
  personality: string;
  career: string;
  relationships: string;
  health: string;
  wealth: string;
  forecast2026: string;
  crystalRecommendation: { crystal: string; element: string; reason: string };
}

export interface BaziResult {
  chart: BaziChart;
  elements: FiveElementsCount;
  dayMaster: { stem: Stem; element: Element; strength: string };
  favorableElements: Element[];
  unfavorableElements: Element[];
  tenGods: TenGodResult[];
  aiReport?: AIReport;
  wellnessReport?: WellnessReport;
}

export interface BirthData {
  year: number;
  month: number;
  day: number;
  hour: number;
  gender: Gender;
}
