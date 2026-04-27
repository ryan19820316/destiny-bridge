import { BirthData, BaziChart, BaziResult, Branch, Element, FiveElementsCount, Gender, Pillar, Stem, TenGod, TenGodResult } from "@/types";

// ---- CONSTANTS ----
const STEMS: Stem[] = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const BRANCHES: Branch[] = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

const STEM_ELEMENT: Record<Stem, Element> = {
  甲: "木", 乙: "木", 丙: "火", 丁: "火", 戊: "土",
  己: "土", 庚: "金", 辛: "金", 壬: "水", 癸: "水",
};

const BRANCH_ELEMENT: Record<Branch, Element> = {
  子: "水", 丑: "土", 寅: "木", 卯: "木", 辰: "土", 巳: "火",
  午: "火", 未: "土", 申: "金", 酉: "金", 戌: "土", 亥: "水",
};

const BRANCH_HIDDEN: Record<Branch, Stem[]> = {
  子: ["癸"],
  丑: ["己", "癸", "辛"],
  寅: ["甲", "丙", "戊"],
  卯: ["乙"],
  辰: ["戊", "乙", "癸"],
  巳: ["丙", "庚", "戊"],
  午: ["丁", "己"],
  未: ["己", "丁", "乙"],
  申: ["庚", "壬", "戊"],
  酉: ["辛"],
  戌: ["戊", "辛", "丁"],
  亥: ["壬", "甲"],
};

const YIN_YANG_STEM: Record<Stem, "阳" | "阴"> = {
  甲: "阳", 乙: "阴", 丙: "阳", 丁: "阴", 戊: "阳",
  己: "阴", 庚: "阳", 辛: "阴", 壬: "阳", 癸: "阴",
};

// Solar term approx dates (month, day) for month boundary detection
interface SolarTerm {
  name: string;
  month: number;
  day: number;
  branchIndex: number; // which earthly branch this period corresponds to
}

// Month branch mapping: 寅=Feb, 卯=Mar, 辰=Apr, 巳=May, 午=Jun, 未=Jul, 申=Aug, 酉=Sep, 戌=Oct, 亥=Nov, 子=Dec, 丑=Jan
// The 12 solar terms that mark month starts (节):
const MONTH_STARTS: SolarTerm[] = [
  { name: "立春", month: 2, day: 4, branchIndex: 2 },  // 寅月 start
  { name: "惊蛰", month: 3, day: 6, branchIndex: 3 },  // 卯月 start
  { name: "清明", month: 4, day: 5, branchIndex: 4 },  // 辰月 start
  { name: "立夏", month: 5, day: 6, branchIndex: 5 },  // 巳月 start
  { name: "芒种", month: 6, day: 6, branchIndex: 6 },  // 午月 start
  { name: "小暑", month: 7, day: 7, branchIndex: 7 },  // 未月 start
  { name: "立秋", month: 8, day: 8, branchIndex: 8 },  // 申月 start
  { name: "白露", month: 9, day: 8, branchIndex: 9 },  // 酉月 start
  { name: "寒露", month: 10, day: 8, branchIndex: 10 }, // 戌月 start
  { name: "立冬", month: 11, day: 7, branchIndex: 11 }, // 亥月 start
  { name: "大雪", month: 12, day: 7, branchIndex: 0 },  // 子月 start
  { name: "小寒", month: 1, day: 6, branchIndex: 1 },   // 丑月 start
];

// ---- DAY PILLAR CALCULATION ----
// Reference: 1900-01-01 = 甲戌 day (index 10 in 60-day cycle)
function daysFrom1900(y: number, m: number, d: number): number {
  // Use JS Date for accurate day counting
  const target = new Date(y, m - 1, d);
  const ref = new Date(1900, 0, 1);
  const diffMs = target.getTime() - ref.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function getDayPillar(y: number, m: number, d: number): Pillar {
  const days = daysFrom1900(y, m, d);
  // 1900-01-01 was 甲戌: stem_index=0, branch_index=10
  const stemIdx = (((days % 10) + 10) % 10); // (0 + days) mod 10
  const branchIdx = (((days % 12) + 12 + 10) % 12); // (10 + days) mod 12
  const stem = STEMS[stemIdx];
  const branch = BRANCHES[branchIdx];
  return {
    stem,
    branch,
    stemElement: STEM_ELEMENT[stem],
    branchElement: BRANCH_ELEMENT[branch],
    hiddenStems: BRANCH_HIDDEN[branch],
  };
}

// ---- YEAR PILLAR ----
// 1984 = 甲子 (index 0)
// Year stem-branch changes at 立春 (Feb 4), not Jan 1
function getYearPillar(y: number, m: number, d: number): Pillar {
  // If before 立春, use previous year's pillar
  let effectiveYear = y;
  if (m < 2 || (m === 2 && d < 4)) {
    effectiveYear = y - 1;
  }
  const offset = effectiveYear - 1984;
  const stemIdx = ((offset % 10) + 10) % 10;
  const branchIdx = ((offset % 12) + 12) % 12;
  const stem = STEMS[stemIdx];
  const branch = BRANCHES[branchIdx];
  return {
    stem,
    branch,
    stemElement: STEM_ELEMENT[stem],
    branchElement: BRANCH_ELEMENT[branch],
    hiddenStems: BRANCH_HIDDEN[branch],
  };
}

// ---- MONTH PILLAR ----
// Month stem is determined by year stem
// 甲/己 year → 寅月 stem = 丙 (index 2)
// 乙/庚 year → 寅月 stem = 戊 (index 4)
// 丙/辛 year → 寅月 stem = 庚 (index 6)
// 丁/壬 year → 寅月 stem = 壬 (index 8)
// 戊/癸 year → 寅月 stem = 甲 (index 0)
const YEAR_STEM_TO_FIRST_MONTH: Record<number, number> = {
  0: 2, // 甲 → 丙寅
  5: 2, // 己 → 丙寅
  1: 4, // 乙 → 戊寅
  6: 4, // 庚 → 戊寅
  2: 6, // 丙 → 庚寅
  7: 6, // 辛 → 庚寅
  3: 8, // 丁 → 壬寅
  8: 8, // 壬 → 壬寅
  4: 0, // 戊 → 甲寅
  9: 0, // 癸 → 甲寅
};

function getMonthPillar(yearStemIdx: number, m: number, d: number): Pillar {
  // Find which month branch we're in based on solar terms
  // Iterate forward to find the LAST solar term on or before the target date
  let branchIdx = 1; // default 丑月 (before 小寒 Jan 6)
  for (const st of MONTH_STARTS) {
    if (m > st.month || (m === st.month && d >= st.day)) {
      branchIdx = st.branchIndex;
    } else {
      break;
    }
  }

  // Month stem: first month stem offset + (branch_index - 2)
  const firstMonthStem = YEAR_STEM_TO_FIRST_MONTH[yearStemIdx] ?? 0;
  // 寅 is index 2, so month offset from 寅 = branchIdx - 2
  const offset = ((branchIdx - 2) + 12) % 12;
  const stemIdx = (firstMonthStem + offset) % 10;

  const stem = STEMS[stemIdx];
  const branch = BRANCHES[branchIdx];
  return {
    stem,
    branch,
    stemElement: STEM_ELEMENT[stem],
    branchElement: BRANCH_ELEMENT[branch],
    hiddenStems: BRANCH_HIDDEN[branch],
  };
}

// ---- HOUR PILLAR ----
// 2-hour blocks: 子(23-01), 丑(01-03), 寅(03-05)... 亥(21-23)
function getHourBranchIndex(hour: number): number {
  // Map 0-23 hour to branch index
  if (hour === 23 || hour === 0) return 0; // 子
  if (hour === 1 || hour === 2) return 1;  // 丑
  if (hour === 3 || hour === 4) return 2;  // 寅
  if (hour === 5 || hour === 6) return 3;  // 卯
  if (hour === 7 || hour === 8) return 4;  // 辰
  if (hour === 9 || hour === 10) return 5; // 巳
  if (hour === 11 || hour === 12) return 6; // 午
  if (hour === 13 || hour === 14) return 7; // 未
  if (hour === 15 || hour === 16) return 8; // 申
  if (hour === 17 || hour === 18) return 9; // 酉
  if (hour === 19 || hour === 20) return 10; // 戌
  return 11; // 亥 (21-22)
}

// Hour stem depends on day stem
// 甲/己 day → 子 hour starts with 甲 (index 0)
// 乙/庚 day → 子 hour starts with 丙 (index 2)
// 丙/辛 day → 子 hour starts with 戊 (index 4)
// 丁/壬 day → 子 hour starts with 庚 (index 6)
// 戊/癸 day → 子 hour starts with 壬 (index 8)
const DAY_STEM_TO_FIRST_HOUR: Record<number, number> = {
  0: 0, 5: 0, // 甲/己 → 甲子
  1: 2, 6: 2, // 乙/庚 → 丙子
  2: 4, 7: 4, // 丙/辛 → 戊子
  3: 6, 8: 6, // 丁/壬 → 庚子
  4: 8, 9: 8, // 戊/癸 → 壬子
};

function getHourPillar(dayStemIdx: number, hour: number): Pillar {
  const branchIdx = getHourBranchIndex(hour);
  const firstHourStem = DAY_STEM_TO_FIRST_HOUR[dayStemIdx] ?? 0;
  const stemIdx = (firstHourStem + branchIdx) % 10;
  const stem = STEMS[stemIdx];
  const branch = BRANCHES[branchIdx];
  return {
    stem,
    branch,
    stemElement: STEM_ELEMENT[stem],
    branchElement: BRANCH_ELEMENT[branch],
    hiddenStems: BRANCH_HIDDEN[branch],
  };
}

// ---- FIVE ELEMENTS COUNT ----
function countElements(chart: BaziChart): FiveElementsCount {
  const count: FiveElementsCount = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  const pillars = [chart.year, chart.month, chart.day, chart.hour];
  for (const p of pillars) {
    count[p.stemElement]++;
    count[p.branchElement]++;
  }
  return count;
}

// ---- DAY MASTER ANALYSIS ----
function analyzeDayMaster(chart: BaziChart): {
  stem: Stem;
  element: Element;
  strength: string;
} {
  const dm = chart.day.stem;
  const el = STEM_ELEMENT[dm];
  const elements = countElements(chart);

  // Simple strength heuristic:
  // Same element as day master gives strength
  // Element that generates day master gives strength
  const generating: Record<Element, Element> = {
    木: "水", 火: "木", 土: "火", 金: "土", 水: "金",
  };

  const selfCount = elements[el];
  const generatorCount = elements[generating[el]];
  const totalSupport = selfCount + generatorCount;

  let strength: string;
  if (totalSupport >= 5) strength = "strong";
  else if (totalSupport >= 3) strength = "balanced";
  else strength = "weak";

  return { stem: dm, element: el, strength };
}

// ---- FAVORABLE / UNFAVORABLE ELEMENTS ----
function determineFavorable(dmElement: Element, strength: string): {
  favorable: Element[];
  unfavorable: Element[];
} {
  const generating: Record<Element, Element> = {
    木: "水", 火: "木", 土: "火", 金: "土", 水: "金",
  };
  const controlling: Record<Element, Element> = {
    木: "金", 火: "水", 土: "木", 金: "火", 水: "土",
  };
  const weakening: Record<Element, Element> = {
    木: "火", 火: "土", 土: "金", 金: "水", 水: "木",
  };
  const all: Element[] = ["木", "火", "土", "金", "水"];

  if (strength === "strong") {
    // Need to weaken: controlling element + weakening element
    return {
      favorable: [controlling[dmElement], weakening[dmElement]],
      unfavorable: [dmElement, generating[dmElement]],
    };
  } else if (strength === "weak") {
    // Need to strengthen: same element + generating element
    return {
      favorable: [dmElement, generating[dmElement]],
      unfavorable: [controlling[dmElement], weakening[dmElement]],
    };
  } else {
    // Balanced: slightly prefer generating
    return {
      favorable: [generating[dmElement]],
      unfavorable: [controlling[dmElement]],
    };
  }
}

// ---- TEN GODS ----
// Compare each pillar's stem with day master stem
function calculateTenGods(chart: BaziChart): TenGodResult[] {
  const dmStem = chart.day.stem;
  const dmStemIdx = STEMS.indexOf(dmStem);
  const dmYinYang = YIN_YANG_STEM[dmStem];
  const dmElement = STEM_ELEMENT[dmStem];

  const pillarNames = ["year", "month", "day", "hour"];
  const pillars = [chart.year, chart.month, chart.day, chart.hour];
  const results: TenGodResult[] = [];

  // Five-element relationships
  const sameAs: Element = dmElement;
  const generatedBy: Record<Element, Element> = {
    木: "水", 火: "木", 土: "火", 金: "土", 水: "金",
  };
  const generatesInto: Record<Element, Element> = {
    木: "火", 火: "土", 土: "金", 金: "水", 水: "木",
  };
  const controlledBy: Record<Element, Element> = {
    木: "金", 火: "水", 土: "木", 金: "火", 水: "土",
  };
  const controlsInto: Record<Element, Element> = {
    木: "土", 火: "金", 土: "水", 金: "木", 水: "火",
  };

  for (let i = 0; i < 4; i++) {
    const p = pillars[i];
    const pElement = STEM_ELEMENT[p.stem];
    const pYinYang = YIN_YANG_STEM[p.stem];
    const sameYY = dmYinYang === pYinYang;

    let god: TenGod;

    if (pElement === sameAs) {
      god = sameYY ? "比肩" : "劫财";
    } else if (pElement === generatedBy[dmElement]) {
      god = sameYY ? "正印" : "偏印";
    } else if (pElement === generatesInto[dmElement]) {
      god = sameYY ? "食神" : "伤官";
    } else if (pElement === controlledBy[dmElement]) {
      god = sameYY ? "正官" : "七杀";
    } else if (pElement === controlsInto[dmElement]) {
      god = sameYY ? "正财" : "偏财";
    } else {
      god = "比肩"; // fallback
    }

    results.push({ pillar: pillarNames[i], god, element: pElement });
  }

  return results;
}

// ---- MAIN CALCULATION ----
export function calculateBazi(data: BirthData): BaziResult {
  const { year, month, day, hour, gender } = data;

  const yearPillar = getYearPillar(year, month, day);
  const yearStemIdx = STEMS.indexOf(yearPillar.stem);
  const monthPillar = getMonthPillar(yearStemIdx, month, day);
  const dayPillar = getDayPillar(year, month, day);
  const dayStemIdx = STEMS.indexOf(dayPillar.stem);
  const hourPillar = getHourPillar(dayStemIdx, hour);

  const chart: BaziChart = {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
  };

  const elements = countElements(chart);
  const dayMaster = analyzeDayMaster(chart);
  const { favorable, unfavorable } = determineFavorable(
    dayMaster.element,
    dayMaster.strength
  );
  const tenGods = calculateTenGods(chart);

  return {
    chart,
    elements,
    dayMaster,
    favorableElements: favorable,
    unfavorableElements: unfavorable,
    tenGods,
  };
}

// ---- FORMAT CHART FOR AI ----
export function formatChartForAI(result: BaziResult, birthData: BirthData): string {
  const { chart, elements, dayMaster, favorableElements, unfavorableElements, tenGods } = result;
  const p = (pillar: Pillar) => `${pillar.stem}${pillar.branch}`;

  return `## User's Bazi Chart

**Birth Date:** ${birthData.year}-${birthData.month}-${birthData.day} ${birthData.hour}:00
**Gender:** ${birthData.gender === "male" ? "Male" : "Female"}

### Four Pillars
| Pillar | Stem-Branch | Hidden Stems |
|--------|-------------|---------------|
| Year (年) | ${p(chart.year)} | ${chart.year.hiddenStems.join(", ")} |
| Month (月) | ${p(chart.month)} | ${chart.month.hiddenStems.join(", ")} |
| Day (日) | ${p(chart.day)} | ${chart.day.hiddenStems.join(", ")} |
| Hour (时) | ${p(chart.hour)} | ${chart.hour.hiddenStems.join(", ")} |

### Day Master
**${dayMaster.stem}** (${dayMaster.element}) — Strength: **${dayMaster.strength}**

### Five Elements Distribution
木: ${"■".repeat(elements["木"])} ${elements["木"]}
火: ${"■".repeat(elements["火"])} ${elements["火"]}
土: ${"■".repeat(elements["土"])} ${elements["土"]}
金: ${"■".repeat(elements["金"])} ${elements["金"]}
水: ${"■".repeat(elements["水"])} ${elements["水"]}

### Favorable Elements: ${favorableElements.join(", ")}
### Unfavorable Elements: ${unfavorableElements.join(", ")}

### Ten Gods
${tenGods.map(tg => `- ${tg.pillar} pillar: **${tg.god}** (${tg.element})`).join("\n")}`;
}
