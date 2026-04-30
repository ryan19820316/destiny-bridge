// 64 Hexagram lookup table with binary indexing
import { HexagramData, PalaceElement, Trigram } from "./types";

// Binary string: index 0 = 初爻 (bottom), index 5 = 上爻 (top)
// "1" = 阳, "0" = 阴

const HEXAGRAMS: HexagramData[] = [
  // ===== 上经 30 卦 =====
  { name: "乾为天", palace: "乾宫", palaceElement: "金", upperTrigram: "乾", lowerTrigram: "乾", binary: "111111", shiPosition: 6, isYouHun: false, isGuiHun: false },
  { name: "坤为地", palace: "坤宫", palaceElement: "土", upperTrigram: "坤", lowerTrigram: "坤", binary: "000000", shiPosition: 6, isYouHun: false, isGuiHun: false },
  { name: "水雷屯", palace: "坎宫", palaceElement: "水", upperTrigram: "坎", lowerTrigram: "震", binary: "100010", shiPosition: 2, isYouHun: false, isGuiHun: false },
  { name: "山水蒙", palace: "离宫", palaceElement: "火", upperTrigram: "艮", lowerTrigram: "坎", binary: "010001", shiPosition: 4, isYouHun: false, isGuiHun: false },
  { name: "水天需", palace: "坤宫", palaceElement: "土", upperTrigram: "坎", lowerTrigram: "乾", binary: "111010", shiPosition: 4, isYouHun: true, isGuiHun: false },
  { name: "天水讼", palace: "离宫", palaceElement: "火", upperTrigram: "乾", lowerTrigram: "坎", binary: "010111", shiPosition: 4, isYouHun: true, isGuiHun: false },
  { name: "地水师", palace: "坎宫", palaceElement: "水", upperTrigram: "坤", lowerTrigram: "坎", binary: "010000", shiPosition: 3, isYouHun: false, isGuiHun: true },
  { name: "水地比", palace: "坤宫", palaceElement: "土", upperTrigram: "坎", lowerTrigram: "坤", binary: "000010", shiPosition: 3, isYouHun: false, isGuiHun: true },
  { name: "风天小畜", palace: "巽宫", palaceElement: "木", upperTrigram: "巽", lowerTrigram: "乾", binary: "111011", shiPosition: 1, isYouHun: false, isGuiHun: false },
  { name: "天泽履", palace: "艮宫", palaceElement: "土", upperTrigram: "乾", lowerTrigram: "兑", binary: "110111", shiPosition: 5, isYouHun: false, isGuiHun: false },
  { name: "地天泰", palace: "坤宫", palaceElement: "土", upperTrigram: "坤", lowerTrigram: "乾", binary: "111000", shiPosition: 3, isYouHun: false, isGuiHun: false },
  { name: "天地否", palace: "乾宫", palaceElement: "金", upperTrigram: "乾", lowerTrigram: "坤", binary: "000111", shiPosition: 3, isYouHun: false, isGuiHun: false },
  { name: "天火同人", palace: "离宫", palaceElement: "火", upperTrigram: "乾", lowerTrigram: "离", binary: "101111", shiPosition: 3, isYouHun: false, isGuiHun: true },
  { name: "火天大有", palace: "乾宫", palaceElement: "金", upperTrigram: "离", lowerTrigram: "乾", binary: "111101", shiPosition: 3, isYouHun: false, isGuiHun: true },
  { name: "地山谦", palace: "兑宫", palaceElement: "金", upperTrigram: "坤", lowerTrigram: "艮", binary: "001000", shiPosition: 5, isYouHun: false, isGuiHun: false },
  { name: "雷地豫", palace: "震宫", palaceElement: "木", upperTrigram: "震", lowerTrigram: "坤", binary: "000100", shiPosition: 1, isYouHun: false, isGuiHun: false },
  { name: "泽雷随", palace: "震宫", palaceElement: "木", upperTrigram: "兑", lowerTrigram: "震", binary: "100110", shiPosition: 3, isYouHun: false, isGuiHun: true },
  { name: "山风蛊", palace: "巽宫", palaceElement: "木", upperTrigram: "艮", lowerTrigram: "巽", binary: "011001", shiPosition: 3, isYouHun: false, isGuiHun: true },
  { name: "地泽临", palace: "坤宫", palaceElement: "土", upperTrigram: "坤", lowerTrigram: "兑", binary: "110000", shiPosition: 2, isYouHun: false, isGuiHun: false },
  { name: "风地观", palace: "乾宫", palaceElement: "金", upperTrigram: "巽", lowerTrigram: "坤", binary: "000011", shiPosition: 4, isYouHun: false, isGuiHun: false },
  { name: "火雷噬嗑", palace: "巽宫", palaceElement: "木", upperTrigram: "离", lowerTrigram: "震", binary: "100101", shiPosition: 5, isYouHun: false, isGuiHun: false },
  { name: "山火贲", palace: "艮宫", palaceElement: "土", upperTrigram: "艮", lowerTrigram: "离", binary: "101001", shiPosition: 1, isYouHun: false, isGuiHun: false },
  { name: "山地剥", palace: "乾宫", palaceElement: "金", upperTrigram: "艮", lowerTrigram: "坤", binary: "000001", shiPosition: 5, isYouHun: false, isGuiHun: false },
  { name: "地雷复", palace: "坤宫", palaceElement: "土", upperTrigram: "坤", lowerTrigram: "震", binary: "100000", shiPosition: 1, isYouHun: false, isGuiHun: false },
  { name: "天雷无妄", palace: "巽宫", palaceElement: "木", upperTrigram: "乾", lowerTrigram: "震", binary: "100111", shiPosition: 4, isYouHun: false, isGuiHun: false },
  { name: "山天大畜", palace: "艮宫", palaceElement: "土", upperTrigram: "艮", lowerTrigram: "乾", binary: "111001", shiPosition: 2, isYouHun: false, isGuiHun: false },
  { name: "山雷颐", palace: "巽宫", palaceElement: "木", upperTrigram: "艮", lowerTrigram: "震", binary: "100001", shiPosition: 4, isYouHun: true, isGuiHun: false },
  { name: "泽风大过", palace: "震宫", palaceElement: "木", upperTrigram: "兑", lowerTrigram: "巽", binary: "011110", shiPosition: 4, isYouHun: true, isGuiHun: false },
  { name: "坎为水", palace: "坎宫", palaceElement: "水", upperTrigram: "坎", lowerTrigram: "坎", binary: "010010", shiPosition: 6, isYouHun: false, isGuiHun: false },
  { name: "离为火", palace: "离宫", palaceElement: "火", upperTrigram: "离", lowerTrigram: "离", binary: "101101", shiPosition: 6, isYouHun: false, isGuiHun: false },

  // ===== 下经 34 卦 =====
  { name: "泽山咸", palace: "兑宫", palaceElement: "金", upperTrigram: "兑", lowerTrigram: "艮", binary: "001110", shiPosition: 3, isYouHun: false, isGuiHun: false },
  { name: "雷风恒", palace: "震宫", palaceElement: "木", upperTrigram: "震", lowerTrigram: "巽", binary: "011100", shiPosition: 3, isYouHun: false, isGuiHun: false },
  { name: "天山遁", palace: "乾宫", palaceElement: "金", upperTrigram: "乾", lowerTrigram: "艮", binary: "001111", shiPosition: 2, isYouHun: false, isGuiHun: false },
  { name: "雷天大壮", palace: "坤宫", palaceElement: "土", upperTrigram: "震", lowerTrigram: "乾", binary: "111100", shiPosition: 4, isYouHun: false, isGuiHun: false },
  { name: "火地晋", palace: "乾宫", palaceElement: "金", upperTrigram: "离", lowerTrigram: "坤", binary: "000101", shiPosition: 4, isYouHun: true, isGuiHun: false },
  { name: "地火明夷", palace: "坎宫", palaceElement: "水", upperTrigram: "坤", lowerTrigram: "离", binary: "101000", shiPosition: 4, isYouHun: true, isGuiHun: false },
  { name: "风火家人", palace: "巽宫", palaceElement: "木", upperTrigram: "巽", lowerTrigram: "离", binary: "101011", shiPosition: 2, isYouHun: false, isGuiHun: false },
  { name: "火泽睽", palace: "艮宫", palaceElement: "土", upperTrigram: "离", lowerTrigram: "兑", binary: "110101", shiPosition: 4, isYouHun: false, isGuiHun: false },
  { name: "水山蹇", palace: "兑宫", palaceElement: "金", upperTrigram: "坎", lowerTrigram: "艮", binary: "001010", shiPosition: 4, isYouHun: false, isGuiHun: false },
  { name: "雷水解", palace: "震宫", palaceElement: "木", upperTrigram: "震", lowerTrigram: "坎", binary: "010100", shiPosition: 2, isYouHun: false, isGuiHun: false },
  { name: "山泽损", palace: "艮宫", palaceElement: "土", upperTrigram: "艮", lowerTrigram: "兑", binary: "110001", shiPosition: 3, isYouHun: false, isGuiHun: false },
  { name: "风雷益", palace: "巽宫", palaceElement: "木", upperTrigram: "巽", lowerTrigram: "震", binary: "100011", shiPosition: 3, isYouHun: false, isGuiHun: false },
  { name: "泽天夬", palace: "坤宫", palaceElement: "土", upperTrigram: "兑", lowerTrigram: "乾", binary: "111110", shiPosition: 5, isYouHun: false, isGuiHun: false },
  { name: "天风姤", palace: "乾宫", palaceElement: "金", upperTrigram: "乾", lowerTrigram: "巽", binary: "011111", shiPosition: 1, isYouHun: false, isGuiHun: false },
  { name: "泽地萃", palace: "兑宫", palaceElement: "金", upperTrigram: "兑", lowerTrigram: "坤", binary: "000110", shiPosition: 2, isYouHun: false, isGuiHun: false },
  { name: "地风升", palace: "震宫", palaceElement: "木", upperTrigram: "坤", lowerTrigram: "巽", binary: "011000", shiPosition: 4, isYouHun: false, isGuiHun: false },
  { name: "泽水困", palace: "兑宫", palaceElement: "金", upperTrigram: "兑", lowerTrigram: "坎", binary: "010110", shiPosition: 1, isYouHun: false, isGuiHun: false },
  { name: "水风井", palace: "震宫", palaceElement: "木", upperTrigram: "坎", lowerTrigram: "巽", binary: "011010", shiPosition: 5, isYouHun: false, isGuiHun: false },
  { name: "泽火革", palace: "坎宫", palaceElement: "水", upperTrigram: "兑", lowerTrigram: "离", binary: "101110", shiPosition: 4, isYouHun: false, isGuiHun: false },
  { name: "火风鼎", palace: "离宫", palaceElement: "火", upperTrigram: "离", lowerTrigram: "巽", binary: "011101", shiPosition: 2, isYouHun: false, isGuiHun: false },
  { name: "震为雷", palace: "震宫", palaceElement: "木", upperTrigram: "震", lowerTrigram: "震", binary: "100100", shiPosition: 6, isYouHun: false, isGuiHun: false },
  { name: "艮为山", palace: "艮宫", palaceElement: "土", upperTrigram: "艮", lowerTrigram: "艮", binary: "001001", shiPosition: 6, isYouHun: false, isGuiHun: false },
  { name: "风山渐", palace: "艮宫", palaceElement: "土", upperTrigram: "巽", lowerTrigram: "艮", binary: "001011", shiPosition: 3, isYouHun: false, isGuiHun: true },
  { name: "雷泽归妹", palace: "兑宫", palaceElement: "金", upperTrigram: "震", lowerTrigram: "兑", binary: "110100", shiPosition: 3, isYouHun: false, isGuiHun: true },
  { name: "雷火丰", palace: "坎宫", palaceElement: "水", upperTrigram: "震", lowerTrigram: "离", binary: "101100", shiPosition: 5, isYouHun: false, isGuiHun: false },
  { name: "火山旅", palace: "离宫", palaceElement: "火", upperTrigram: "离", lowerTrigram: "艮", binary: "001101", shiPosition: 1, isYouHun: false, isGuiHun: false },
  { name: "巽为风", palace: "巽宫", palaceElement: "木", upperTrigram: "巽", lowerTrigram: "巽", binary: "011011", shiPosition: 6, isYouHun: false, isGuiHun: false },
  { name: "兑为泽", palace: "兑宫", palaceElement: "金", upperTrigram: "兑", lowerTrigram: "兑", binary: "110110", shiPosition: 6, isYouHun: false, isGuiHun: false },
  { name: "风水涣", palace: "离宫", palaceElement: "火", upperTrigram: "巽", lowerTrigram: "坎", binary: "010011", shiPosition: 5, isYouHun: false, isGuiHun: false },
  { name: "水泽节", palace: "坎宫", palaceElement: "水", upperTrigram: "坎", lowerTrigram: "兑", binary: "110010", shiPosition: 1, isYouHun: false, isGuiHun: false },
  { name: "风泽中孚", palace: "艮宫", palaceElement: "土", upperTrigram: "巽", lowerTrigram: "兑", binary: "110011", shiPosition: 4, isYouHun: true, isGuiHun: false },
  { name: "雷山小过", palace: "兑宫", palaceElement: "金", upperTrigram: "震", lowerTrigram: "艮", binary: "001100", shiPosition: 4, isYouHun: true, isGuiHun: false },
  { name: "水火既济", palace: "坎宫", palaceElement: "水", upperTrigram: "坎", lowerTrigram: "离", binary: "101010", shiPosition: 3, isYouHun: false, isGuiHun: false },
  { name: "火水未济", palace: "离宫", palaceElement: "火", upperTrigram: "离", lowerTrigram: "坎", binary: "010101", shiPosition: 3, isYouHun: false, isGuiHun: false },
];

// Build lookup map: binary string → HexagramData
const binaryMap = new Map<string, HexagramData>();
for (const h of HEXAGRAMS) {
  binaryMap.set(h.binary, h);
}

export function findHexagramByBinary(binary: string): HexagramData | undefined {
  return binaryMap.get(binary);
}

export function getAllHexagrams(): readonly HexagramData[] {
  return HEXAGRAMS;
}
