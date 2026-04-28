/** @deprecated Liu Yao interpretation moved to Doubao API. See src/lib/liuyao-prompt.ts */
import type { Branch, Element } from "@/types";

const BRANCH_ELEMENT: Record<Branch, Element> = {
  子: "水", 丑: "土", 寅: "木", 卯: "木", 辰: "土", 巳: "火",
  午: "火", 未: "土", 申: "金", 酉: "金", 戌: "土", 亥: "水",
};
import {
  AssembledLine,
  DivinationResult,
  InterpretationInput,
  QuestionCategory,
  LiuYaoQuickResult,
} from "./types";
// LiuQin imported as type only for YongShenTarget union below
import type { LiuQin } from "./types";

// ---- 用神映射 ----
type YongShenTarget = LiuQin | "世爻" | "应爻";
const CATEGORY_YONGSHEN: Record<QuestionCategory, YongShenTarget[]> = {
  love: ["官鬼", "应爻"],
  career: ["官鬼"],
  wealth: ["妻财"],
  health: ["子孙"],
  daily: ["世爻"],
};

// ---- 地支六合 ----
const LIU_HE: Record<string, string> = {
  "子": "丑", "丑": "子", "寅": "亥", "亥": "寅",
  "卯": "戌", "戌": "卯", "辰": "酉", "酉": "辰",
  "巳": "申", "申": "巳", "午": "未", "未": "午",
};

// ---- 地支六冲 ----
const LIU_CHONG: Record<string, string> = {
  "子": "午", "午": "子", "丑": "未", "未": "丑",
  "寅": "申", "申": "寅", "卯": "酉", "酉": "卯",
  "辰": "戌", "戌": "辰", "巳": "亥", "亥": "巳",
};

// ---- 地支三合 ----
const SAN_HE: Record<string, string[]> = {
  "申": ["子", "辰"], "子": ["申", "辰"], "辰": ["申", "子"],
  "亥": ["卯", "未"], "卯": ["亥", "未"], "未": ["亥", "卯"],
  "寅": ["午", "戌"], "午": ["寅", "戌"], "戌": ["寅", "午"],
  "巳": ["酉", "丑"], "酉": ["巳", "丑"], "丑": ["巳", "酉"],
};

// 五行生克
function sheng(element: Element): Element {
  const map: Record<Element, Element> = { "木": "火", "火": "土", "土": "金", "金": "水", "水": "木" };
  return map[element];
}
function ke(element: Element): Element {
  const map: Record<Element, Element> = { "木": "土", "土": "水", "水": "火", "火": "金", "金": "木" };
  return map[element];
}

// ---- 旺衰判断 ----
function checkLineStrength(
  line: AssembledLine,
  monthBranch: Branch,
  dayBranch: Branch,
): "旺" | "平" | "衰" | "月破" | "日破" {
  const monthEl = BRANCH_ELEMENT[monthBranch] as Element;
  const dayEl = BRANCH_ELEMENT[dayBranch] as Element;
  const lineEl = line.branchElement;

  // 月破: 月支与爻支相冲
  if (LIU_CHONG[line.branch] === monthBranch) return "月破";
  // 日破
  if (LIU_CHONG[line.branch] === dayBranch) return "日破";

  // 旺: 得月或日生扶，或临月/日
  let score = 0;
  if (sheng(monthEl) === lineEl) score += 2;  // 月生
  if (lineEl === monthEl) score += 3;          // 临月
  if (sheng(dayEl) === lineEl) score += 2;     // 日生
  if (lineEl === dayEl) score += 3;            // 临日
  if (ke(monthEl) === lineEl) score -= 2;      // 月克
  if (ke(dayEl) === lineEl) score -= 2;        // 日克

  if (score >= 3) return "旺";
  if (score <= -3) return "衰";
  return "平";
}

// 检查空亡
function isKongWang(branch: Branch, kongWangBranches: Branch[]): boolean {
  return kongWangBranches.includes(branch);
}

// 动爻回头生克
function analyzeHuiTou(movingLine: AssembledLine, changedLine: AssembledLine): string {
  if (changedLine.branchElement === sheng(movingLine.branchElement)) return "回头生";
  if (changedLine.branchElement === ke(movingLine.branchElement)) return "回头克";
  if (LIU_HE[movingLine.branch] === changedLine.branch) return "回头合";
  return "";
}

// ---- 综合断卦 ----
export function interpret(input: InterpretationInput): LiuYaoQuickResult {
  const { result, questionCategory } = input;
  const {
    originalHexagram,
    changedHexagram,
    assembledLines,
    monthBranch,
    dayBranch,
    kongWangBranches,
    isJingGua,
    hasMovingLines,
  } = result;

  const parts: string[] = [];

  // 1. 定用神
  const targetLiuQins = CATEGORY_YONGSHEN[questionCategory];
  let yongshenLines = assembledLines.filter(
    (l) => targetLiuQins.includes(l.liuqin as YongShenTarget)
  );
  // If asking about "应爻", find the ying line
  if (targetLiuQins.includes("应爻")) {
    const yingLine = assembledLines.find((l) => l.isYing);
    if (yingLine) yongshenLines = [...yongshenLines, yingLine];
  }
  if (targetLiuQins.includes("世爻")) {
    const shiLine = assembledLines.find((l) => l.isShi);
    if (shiLine) yongshenLines = [shiLine, ...yongshenLines];
  }

  // Deduplicate and pick the strongest
  const uniqueYongshen = yongshenLines.filter(
    (l, i, arr) => arr.findIndex((x) => x.position === l.position) === i
  );

  // 用神两现: pick the moving one, or the one near 月建日辰
  let primaryYongshen = uniqueYongshen[0];
  if (uniqueYongshen.length > 1) {
    const moving = uniqueYongshen.find((l) => l.isMoving);
    if (moving) primaryYongshen = moving;
    else primaryYongshen = uniqueYongshen[0];
  }

  // 2. 看旺衰
  let yongshenStrength: string;
  let isKong = false;
  if (primaryYongshen) {
    const strength = checkLineStrength(primaryYongshen, monthBranch, dayBranch);
    isKong = isKongWang(primaryYongshen.branch, kongWangBranches);
    yongshenStrength = strength;
    if (isKong) yongshenStrength += "(空亡)";
  } else {
    yongshenStrength = "伏藏(用神不上卦)";
  }

  // 世爻
  const shiLine = assembledLines.find((l) => l.isShi);
  const yingLine = assembledLines.find((l) => l.isYing);

  // 3. 看动爻
  const movingLines = assembledLines.filter((l) => l.isMoving);
  const movingEffects: string[] = [];

  for (const ml of movingLines) {
    if (primaryYongshen) {
      if (ml.position === primaryYongshen.position) {
        // 用神自身动
        if (shiLine && primaryYongshen.position === shiLine.position) {
          movingEffects.push("用神(世爻)自发动，事在主动变化中");
        } else {
          movingEffects.push(`用神发动(${ml.branch}${ml.liuqin})，主事有变动`);
        }
      } else {
        // 其他爻动
        if (sheng(ml.branchElement) === primaryYongshen.branchElement) {
          movingEffects.push(`${ml.liuqin}动生用神，助力吉象`);
        } else if (ke(ml.branchElement) === primaryYongshen.branchElement) {
          movingEffects.push(`${ml.liuqin}动克用神，阻碍凶象`);
        }
      }
    }
  }

  if (isJingGua) {
    movingEffects.push("静卦无动爻，事态平稳，以旺衰定吉凶");
  }

  if (movingLines.length > 2) {
    movingEffects.push(`多爻乱动(${movingLines.length}爻)，主事反复多变`);
  }

  // 4. 看世应
  let shiYingRelation = "";
  if (shiLine && yingLine) {
    const shiEl = shiLine.branchElement;
    const yingEl = yingLine.branchElement;
    if (sheng(shiEl) === yingEl) shiYingRelation = "世生应：我主动助对方，利合作";
    else if (sheng(yingEl) === shiEl) shiYingRelation = "应生世：对方助我，事易成";
    else if (ke(shiEl) === yingEl) shiYingRelation = "世克应：我克对方，利竞争";
    else if (ke(yingEl) === shiEl) shiYingRelation = "应克世：对方克我，事受阻";
    else if (LIU_HE[shiLine.branch] === yingLine.branch) shiYingRelation = "世应相合：双方融洽";
    else if (LIU_CHONG[shiLine.branch] === yingLine.branch) shiYingRelation = "世应相冲：矛盾冲突";
    else shiYingRelation = "世应平：关系一般";
  }

  // 5. 定吉凶
  let conclusion = "";
  if (!primaryYongshen) {
    conclusion = `用神伏藏不上卦，事难成，需待用神出现或引拔`;
  } else if (isKong && yongshenStrength?.includes("衰")) {
    conclusion = `用神${primaryYongshen.liuqin}真空，无力成事`;
  } else if (yongshenStrength?.includes("旺") && movingEffects.some((e) => e.includes("助力"))) {
    conclusion = `用神旺相得助，事易成，吉`;
  } else if (yongshenStrength?.includes("旺") && isJingGua) {
    conclusion = `用神旺相，静卦平稳，慢慢可成`;
  } else if (yongshenStrength?.includes("衰") || yongshenStrength?.includes("破")) {
    conclusion = `用神衰弱，事难成，需待生扶`;
  } else {
    conclusion = `用神平相，需观动爻和世应再定`;
  }

  // 6. 应期提示（简化版）
  let yingQi = "";
  if (isKong) yingQi = `待填实/冲空(${primaryYongshen?.branch})之日`;
  else if (yongshenStrength?.includes("月破")) yingQi = `待填实/合住(${primaryYongshen?.branch})之日`;
  else if (movingLines.length > 0) yingQi = "动爻逢值、逢合之日应";
  else yingQi = "静爻逢值、逢冲之日应";

  const interpretation = [
    `【卦象】${originalHexagram.name}` + (hasMovingLines ? ` → ${changedHexagram.name}` : ""),
    `【卦宫】${originalHexagram.palace}(${originalHexagram.palaceElement}) | 月建${monthBranch} | 日辰${dayBranch}`,
    primaryYongshen ? `【用神】${primaryYongshen.liuqin}(${primaryYongshen.branch}) — ${yongshenStrength}` : `【用神】伏藏`,
    shiYingRelation ? `【世应】${shiYingRelation}` : "",
    movingEffects.length > 0 ? `【动爻】${movingEffects.join("；")}` : "",
    `【吉凶】${conclusion}`,
    `【应期】${yingQi}`,
  ].filter(Boolean).join("\n");

  return {
    hexagramName: originalHexagram.name,
    changedHexagramName: hasMovingLines ? changedHexagram.name : "",
    shiPosition: originalHexagram.shiPosition,
    yingPosition: ((originalHexagram.shiPosition + 2) % 6) + 1,
    palace: originalHexagram.palace,
    palaceElement: originalHexagram.palaceElement,
    assembledLines,
    isJingGua,
    interpretation,
    timestamp: new Date().toISOString(),
  };
}
