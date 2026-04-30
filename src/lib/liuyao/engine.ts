// Liu Yao (六爻) hexagram assembly — server-side, deterministic
import type { Stem, Branch, Element } from "@/types";
import {
  CoinTossLine,
  DivinationResult,
  AssembledLine,
  LiuQin,
  LiuShen,
  PalaceElement,
} from "./types";
import { findHexagramByBinary } from "./hexagrams";

// Inlined from bazi.ts (not exported)
const STEMS: Stem[] = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const BRANCHES: Branch[] = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const BRANCH_ELEMENT: Record<Branch, Element> = {
  子: "水", 丑: "土", 寅: "木", 卯: "木", 辰: "土", 巳: "火",
  午: "火", 未: "土", 申: "金", 酉: "金", 戌: "土", 亥: "水",
};

// ---- 纳甲：卦宫地支口诀 ----
// [inner (初→三), outer (四→上)]
const NAJIA: Record<string, [Branch[], Branch[]]> = {
  "乾宫": [["子", "寅", "辰"], ["午", "申", "戌"]],
  "坎宫": [["寅", "辰", "午"], ["申", "戌", "子"]],
  "艮宫": [["辰", "午", "申"], ["戌", "子", "寅"]],
  "震宫": [["子", "寅", "辰"], ["午", "申", "戌"]],
  "巽宫": [["丑", "亥", "酉"], ["未", "巳", "卯"]],
  "离宫": [["卯", "丑", "亥"], ["酉", "未", "巳"]],
  "坤宫": [["未", "巳", "卯"], ["丑", "亥", "酉"]],
  "兑宫": [["巳", "卯", "丑"], ["亥", "酉", "未"]],
};

// ---- 六神循环 ----
const LIUSHEN_CYCLE: LiuShen[] = ["青龙", "朱雀", "勾陈", "腾蛇", "白虎", "玄武"];

// 日干→六神起始索引
const DAY_STEM_TO_LIUSHEN_START: Record<string, LiuShen> = {
  "甲": "青龙", "乙": "青龙",
  "丙": "朱雀", "丁": "朱雀",
  "戊": "勾陈",
  "己": "腾蛇",
  "庚": "白虎", "辛": "白虎",
  "壬": "玄武", "癸": "玄武",
};

// ---- 五行生克 ----
const ELEMENT_SHENG: Record<Element, Element> = {
  "木": "水", "火": "木", "土": "火", "金": "土", "水": "金", // 生我者
};
const ELEMENT_KE: Record<Element, Element> = {
  "木": "金", "火": "水", "土": "木", "金": "火", "水": "土", // 克我者
};

function elementSheng(me: Element, other: Element): number {
  // Returns: 1=other生me, 0=same, -1=me生other, 99=unrelated克
  if (ELEMENT_SHENG[me] === other) return 1;  // other 生 me
  if (ELEMENT_SHENG[other] === me) return -1; // me 生 other
  if (ELEMENT_KE[me] === other) return -2;   // other 克 me
  if (ELEMENT_KE[other] === me) return 2;    // me 克 other
  return 0; // same
}

// ---- 旬空计算 ----
const XUN_KONG: Record<string, [Branch, Branch]> = {
  "甲子": ["戌", "亥"],
  "甲戌": ["申", "酉"],
  "甲申": ["午", "未"],
  "甲午": ["辰", "巳"],
  "甲辰": ["寅", "卯"],
  "甲寅": ["子", "丑"],
};

function getXunKong(dayStem: Stem, dayBranch: Branch): Branch[] {
  // Find which 旬 the day belongs to
  const stemIdx = STEMS.indexOf(dayStem);
  const branchIdx = BRANCHES.indexOf(dayBranch);
  // The 甲 stem at start of each 旬
  // 旬 start = dayStemIndex - (dayBranchIndex at start)
  // Each 旬 starts with 甲 + a branch
  // 地支序号: 甲子(0,0), 甲戌(0,10), 甲申(0,8), 甲午(0,6), 甲辰(0,4), 甲寅(0,2)
  // The branch of the 甲 at start of this 旬:
  const xunStartBranchIdx = (branchIdx - (stemIdx - 0) + 12) % 12;
  // Actually simpler: find the 旬 by looking at day stem-branch
  // 旬 starts at each 甲 day. The 旬 head 甲X determines empty branches.
  // Find which 甲-day starts this 旬
  const offsetFromJia = stemIdx; // how far from 甲
  // The 甲-branch that heads this 旬
  let jiaBranchIdx = (branchIdx - offsetFromJia + 12) % 12;
  const jiaBranch = BRANCHES[jiaBranchIdx];
  const xunKey = `甲${jiaBranch}`;
  return XUN_KONG[xunKey] || ["戌", "亥"];
}

// ---- 日期干支计算 ----
function getCurrentDayStemBranch(date?: Date): { stem: Stem; branch: Branch } {
  const now = date || new Date();
  const anchor = new Date(2024, 0, 1); // Jan 1, 2024 = 甲子日
  const anchorStemIdx = 0; // 甲
  const anchorBranchIdx = 0; // 子
  const diffDays = Math.floor((now.getTime() - anchor.getTime()) / (1000 * 60 * 60 * 24));
  const stemIdx = ((anchorStemIdx + diffDays) % 10 + 10) % 10;
  const branchIdx = ((anchorBranchIdx + diffDays) % 12 + 12) % 12;
  return { stem: STEMS[stemIdx], branch: BRANCHES[branchIdx] };
}

function getMonthBranch(date?: Date): Branch {
  const now = date || new Date();
  const month = now.getMonth() + 1; // 1-12
  const branchIdx = (month + 1) % 12;
  return BRANCHES[branchIdx === 0 ? 11 : branchIdx - 1];
}

// 年上起月法：五虎遁
// Solar month → 寅月-index (寅=1)
function getMonthStem(year: number, solarMonth: number): Stem {
  // 甲己之年丙作首，乙庚之岁戊为头
  // 丙辛必定寻庚起，丁壬壬位顺行流，戊癸甲寅好追求
  const yearStemIdx = ((year - 4) % 10 + 10) % 10;
  const firstStems = [2, 4, 6, 8, 0]; // 甲→丙(2), 乙→戊(4), 丙→庚(6), 丁→壬(8), 戊→甲(0)
  const firstStem = firstStems[yearStemIdx % 5] ?? 0;
  // Convert solar month to 寅-index: 寅月≈Feb, so (solarMonth + 11) % 12, 0→12
  const yinIndex = (solarMonth + 11) % 12 || 12;
  const monthStemIdx = (firstStem + yinIndex - 1) % 10;
  return STEMS[monthStemIdx];
}

export function getFullMonthBranch(date?: Date): string {
  const now = date || new Date();
  const solarMonth = now.getMonth() + 1;
  const year = now.getFullYear();
  const stem = getMonthStem(year, solarMonth);
  const branch = getMonthBranch(date);
  const el = BRANCH_ELEMENT[branch];
  return `${stem}${branch}（${el}）`;
}

export function getFullDayBranch(date?: Date): string {
  const { stem, branch } = getCurrentDayStemBranch(date);
  const el = BRANCH_ELEMENT[branch];
  return `${stem}${branch}（${el}）`;
}

// ---- 起卦 ----
export function tossCoins(): CoinTossLine[] {
  const lines: CoinTossLine[] = [];
  for (let pos = 1; pos <= 6; pos++) {
    const coins = [
      Math.random() < 0.5 ? "back" : "face",
      Math.random() < 0.5 ? "back" : "face",
      Math.random() < 0.5 ? "back" : "face",
    ];
    const backs = coins.filter((c) => c === "back").length;
    let type: CoinTossLine["type"];
    let isYang: boolean;
    let isMoving: boolean;
    if (backs === 0) {
      type = "oldYang"; isYang = true; isMoving = true;
    } else if (backs === 1) {
      type = "yin"; isYang = false; isMoving = false;
    } else if (backs === 2) {
      type = "yang"; isYang = true; isMoving = false;
    } else {
      type = "oldYin"; isYang = false; isMoving = true;
    }
    lines.push({ position: pos, type, isYang, isMoving });
  }
  return lines;
}

// ---- 卦象匹配 ----
export function buildDivination(lines?: CoinTossLine[], date?: Date): DivinationResult {
  const coinLines = lines || tossCoins();

  // Build binary for 本卦 (original hexagram)
  const originalBinary = coinLines.map((l) => (l.isYang ? "1" : "0")).join("");

  // Build binary for 变卦 (changed hexagram): moving lines flip
  const changedBinary = coinLines
    .map((l) => (l.isMoving ? (l.isYang ? "0" : "1") : l.isYang ? "1" : "0"))
    .join("");

  const originalHexagram = findHexagramByBinary(originalBinary);
  const changedHexagram = findHexagramByBinary(changedBinary);

  if (!originalHexagram || !changedHexagram) {
    throw new Error(`Hexagram not found: original=${originalBinary} changed=${changedBinary}`);
  }

  const hasMovingLines = coinLines.some((l) => l.isMoving);
  const isJingGua = !hasMovingLines;

  // 日辰 & 月建
  const { stem: dayStem, branch: dayBranch } = getCurrentDayStemBranch(date);
  const monthBranch = getMonthBranch(date);

  // 空亡
  const kongWangBranches = getXunKong(dayStem, dayBranch);

  // 装卦
  const assembledLines = assembleLines(coinLines, originalHexagram, dayStem);

  return {
    originalLines: coinLines,
    changedLines: coinLines.map((l) => {
      if (!l.isMoving) return { ...l };
      return {
        ...l,
        type: l.isYang ? "oldYang" : "oldYin",
        isYang: l.isYang,
        isMoving: true,
      } as CoinTossLine;
    }),
    originalHexagram,
    changedHexagram,
    isJingGua,
    hasMovingLines,
    assembledLines,
    monthBranch,
    dayBranch,
    dayStem,
    kongWangBranches,
  };
}

// ---- 装卦 ----
function assembleLines(
  lines: CoinTossLine[],
  hexagram: { palace: string; shiPosition: number },
  dayStem: Stem,
): AssembledLine[] {
  const palace = hexagram.palace;
  const shiPos = hexagram.shiPosition;
  const yingPos = ((shiPos + 2) % 6) + 1;

  const [innerBranches, outerBranches] = NAJIA[palace];
  const palaceElement = getPalaceElement(palace);

  // 六神起始
  const liushenStart = DAY_STEM_TO_LIUSHEN_START[dayStem] || "青龙";
  const liushenStartIdx = LIUSHEN_CYCLE.indexOf(liushenStart);

  return lines.map((line, idx) => {
    const pos = line.position;
    // 纳甲
    const isInner = pos <= 3;
    const branch = isInner ? innerBranches[pos - 1] : outerBranches[pos - 4];
    const branchElement = BRANCH_ELEMENT[branch] as Element;

    // 六亲
    const liuqin = getLiuQin(palaceElement, branchElement);

    // 六神: from 初爻 upward
    const liushenIdx = (liushenStartIdx + idx) % 6;
    const liushen = LIUSHEN_CYCLE[liushenIdx];

    return {
      position: pos,
      coinType: line.type,
      isYang: line.isYang,
      isMoving: line.isMoving,
      branch,
      branchElement,
      liuqin,
      liushen,
      isShi: pos === shiPos,
      isYing: pos === yingPos,
    };
  });
}

// ---- 辅助函数 ----
function getPalaceElement(palace: string): PalaceElement {
  const map: Record<string, PalaceElement> = {
    "乾宫": "金", "兑宫": "金",
    "坎宫": "水",
    "坤宫": "土", "艮宫": "土",
    "离宫": "火",
    "震宫": "木", "巽宫": "木",
  };
  return map[palace] || "金";
}

function getLiuQin(palaceEl: PalaceElement, branchEl: Element): LiuQin {
  const rel = elementSheng(palaceEl, branchEl);
  if (rel === 1) return "父母";   // branch 生 palace (= 生我)
  if (rel === -2) return "官鬼";  // branch 克 palace (= 克我)
  if (rel === -1) return "子孙";  // palace 生 branch (= 我生)
  if (rel === 2) return "妻财";   // palace 克 branch (= 我克)
  return "兄弟";                   // same element
}

export { getPalaceElement, getLiuQin, getMonthBranch, getCurrentDayStemBranch, getXunKong };
