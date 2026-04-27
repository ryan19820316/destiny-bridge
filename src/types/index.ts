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

// ---- Wellness Report (one-time purchase) ----
export interface WellnessReport {
  blueprint: string;
  constitution: Constitution;
  constitutionExplanation: string;

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

  crystalSet: { crystal: string; element: string; wearing: string; benefit: string }[];
  homeProduct: { name: string; placement: string; benefit: string };
  forecast2026: string;
  mantra: string;
}

// ---- Daily Guidance ----
export interface DailyGuidance {
  date: string;
  lunarDate: string;
  energyIndex: number;
  energySummary: string;
  food: { ingredient: string; tip: string; simpleRecipe: string };
  clothing: { powerColor: string; avoidColor: string; styleTip: string };
  home: { quickTask: string; crystalTip: string };
  travel: { direction: string; bestTime: string; avoid: string };
  body: { focus: string; twoMinuteRitual: string };
  mantra: string;
}

// ---- User Profile (localStorage-based) ----
export interface UserProfile {
  name: string;
  nickname: string;
  baziData: BirthData | null;
  preferredTone: "gentle" | "direct" | "humorous";
  recurringThemes: string[];
  languagePreference: "en" | "zh";
  membershipStatus: "free" | "trial" | "active" | "expired";
  trialStartDate: string | null;
  lastChatClearDate: string;
  conversationHistory: VentMessage[];
}

export interface VentMessage {
  role: "user" | "clara";
  content: string;
  timestamp: string;
}

export interface VentResponse {
  emotionalNote: string;
  elementReframe: string;
  suggestion: string;
}

// ---- Feng Shui Shop ----
export interface ShopProduct {
  id: string;
  name: string;
  category: "crystals" | "home-decor" | "jewelry" | "tea-herbs";
  description: string;
  price: number;
  memberPrice: number | null;
  affiliateUrl: string;
  imageEmoji: string;
  element: Element;
}

// ---- Legacy ----
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
