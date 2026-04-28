import type { Stem, Branch, Element } from "@/types";

export type LiuYaoLineType = "yang" | "yin" | "oldYang" | "oldYin";
export type LiuQin = "父母" | "官鬼" | "妻财" | "子孙" | "兄弟";
export type LiuShen = "青龙" | "朱雀" | "勾陈" | "腾蛇" | "白虎" | "玄武";
export type PalaceElement = "金" | "水" | "土" | "火" | "木";
export type QuestionCategory = "love" | "career" | "wealth" | "health" | "daily";
export type Trigram = "乾" | "兑" | "离" | "震" | "巽" | "坎" | "艮" | "坤";

export interface CoinTossLine {
  position: number;    // 1-6, bottom to top
  type: LiuYaoLineType;
  isYang: boolean;     // true for yang (—), false for yin (--)
  isMoving: boolean;   // true for oldYang/oldYin (○/×)
}

export interface HexagramData {
  name: string;
  palace: string;       // 卦宫 name: "乾宫", "坎宫" etc.
  palaceElement: PalaceElement;
  upperTrigram: Trigram;
  lowerTrigram: Trigram;
  binary: string;       // 6-bit "1"/"0" string, bottom to top
  shiPosition: number;  // 1-6
  isYouHun: boolean;
  isGuiHun: boolean;
}

export interface AssembledLine {
  position: number;       // 1-6
  coinType: LiuYaoLineType;
  isYang: boolean;
  isMoving: boolean;
  // 装卦
  branch: Branch;         // 纳甲地支
  branchElement: Element;
  liuqin: LiuQin;
  liushen: LiuShen;
  // 标记
  isShi: boolean;
  isYing: boolean;
}

export interface DivinationResult {
  // 起卦
  originalLines: CoinTossLine[];
  changedLines: CoinTossLine[];
  // 本卦
  originalHexagram: HexagramData;
  // 变卦 (may be same as 本卦 if no moving lines)
  changedHexagram: HexagramData;
  isJingGua: boolean;       // 静卦 (no moving lines)
  hasMovingLines: boolean;
  // 装卦
  assembledLines: AssembledLine[];  // 6 assembled lines for 本卦
  // 月建日辰
  monthBranch: Branch;
  dayBranch: Branch;
  dayStem: Stem;
  // 空亡
  kongWangBranches: Branch[];
}

export interface InterpretationInput {
  result: DivinationResult;
  questionCategory: QuestionCategory;
}

export interface LiuYaoQuickResult {
  hexagramName: string;
  changedHexagramName: string;
  shiPosition: number;
  yingPosition: number;
  palace: string;
  palaceElement: PalaceElement;
  assembledLines: AssembledLine[];
  isJingGua: boolean;
  interpretation: string;
  timestamp: string;
}

export interface LiuYaoDeepResult extends LiuYaoQuickResult {
  aiInterpretation: string;
  elementAnalysis: string;
  actionAdvice: string;
}
