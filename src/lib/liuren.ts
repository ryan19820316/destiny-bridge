import { Solar, Lunar } from "lunar-typescript";
import { LiurenPalaceData, LiurenDivination } from "@/types";

const ZHI_TO_INDEX: Record<string, number> = {
  子: 1, 丑: 2, 寅: 3, 卯: 4, 辰: 5, 巳: 6,
  午: 7, 未: 8, 申: 9, 酉: 10, 戌: 11, 亥: 12,
};

const INDEX_TO_ZHI: Record<number, string> = {
  1: "子", 2: "丑", 3: "寅", 4: "卯", 5: "辰", 6: "巳",
  7: "午", 8: "未", 9: "申", 10: "酉", 11: "戌", 12: "亥",
};

export function getHourIndex(date: Date): number {
  const hour = date.getHours();
  if (hour >= 23 || hour < 1) return 1;  // 子
  if (hour >= 1 && hour < 3) return 2;   // 丑
  if (hour >= 3 && hour < 5) return 3;   // 寅
  if (hour >= 5 && hour < 7) return 4;   // 卯
  if (hour >= 7 && hour < 9) return 5;   // 辰
  if (hour >= 9 && hour < 11) return 6;  // 巳
  if (hour >= 11 && hour < 13) return 7; // 午
  if (hour >= 13 && hour < 15) return 8; // 未
  if (hour >= 15 && hour < 17) return 9; // 申
  if (hour >= 17 && hour < 19) return 10;// 酉
  if (hour >= 19 && hour < 21) return 11;// 戌
  return 12; // 亥 (21-23)
}

export const PALACE_DATA: Record<number, LiurenPalaceData> = {
  1: {
    index: 1,
    name: "大安",
    nameEn: "Great Peace",
    auspiciousness: "大吉",
    element: "木",
    direction: "东",
    directionEn: "East",
    symbol: "青龙",
    color: "青/绿",
    emoji: "🐉",
    classicVerse: "大安事事昌，求谋在东方。失物去不远，宅舍保安康。",
    domains: {
      love: "感情平和稳定，但可能缺乏激情。已婚者家庭和睦，单身者不急不躁。",
      family: "家庭和睦，宅舍保安康。适合处理日常家务，不宜大动干戈。",
      wealth: "财运平稳可守成，不宜激进扩张。西南方求财有利。",
      career: "工作稳定受肯定，宜守不宜攻。不宜换工作或做重大改变。",
      health: "身体无大碍，注意四肢和肝胆保养，避免过劳饮食不当。",
      travel: "出行平安但不出彩，不宜远行。行人身未动。",
      lostItems: "失物未走远，在附近可寻，西南方向找找。",
    },
  },
  2: {
    index: 2,
    name: "留连",
    nameEn: "Lingering",
    auspiciousness: "小凶",
    element: "土",
    direction: "四角",
    directionEn: "Four Corners",
    symbol: "腾蛇",
    color: "黑",
    emoji: "🐍",
    classicVerse: "留连事难成，求谋日未明。官事只宜缓，去者来回程。",
    domains: {
      love: "沟通不畅，关系暧昧不清。容易冷战，一方过于强势。婚事难成。",
      family: "家事纠缠难解，沟通困难。孩子问题或长辈意见不合，宜缓不宜急。",
      wealth: "钱财难求，易因他人破财。不要投资或扩大规模。",
      career: "小人作祟，上司刁难。凡事遇阻，动作宜缓不宜急。",
      health: "消化系统、肾脏问题。精神压力大导致身体不适，慢性病难愈。",
      travel: "出行易因小人破财，合作不成。行者迟迟不归。",
      lostItems: "难寻回，窃者已转移。南方急寻可能有线索。",
    },
  },
  3: {
    index: 3,
    name: "速喜",
    nameEn: "Swift Joy",
    auspiciousness: "中吉",
    element: "火",
    direction: "南",
    directionEn: "South",
    symbol: "朱雀",
    color: "红",
    emoji: "🐦",
    classicVerse: "速喜喜来临，求财向南行。失物申未午，逢人路上寻。",
    domains: {
      love: "喜讯传得快。新恋情火热进展，已婚者注意不要让激情变争执。婚事有喜。",
      family: "家中有喜讯传来，孩子有好消息。家庭聚会气氛热烈，但注意不要因小事争吵。",
      wealth: "财运来得快去得快，见好就收。南方求财。先得后失或先失后得。",
      career: "工作喜庆顺利，有升职机会。注意文书细节，避免粗心失误。",
      health: "注意心脏、血液循环、头部。及时处理无大碍。慢性病或与心脏有关。",
      travel: "出行有喜，行者即至。旅途顺利，好消息来得快。",
      lostItems: "可寻回，路上问人。申、未、午方向找找。",
    },
  },
  4: {
    index: 4,
    name: "赤口",
    nameEn: "Red Mouth",
    auspiciousness: "中凶",
    element: "金",
    direction: "西",
    directionEn: "West",
    symbol: "白虎",
    color: "白",
    emoji: "🐯",
    classicVerse: "赤口主口舌，官非切要防。失物急去寻，行人有惊慌。",
    domains: {
      love: "口舌争执多，女方身体可能欠佳。婚事难就，易争吵分手。",
      family: "家庭口舌是非多，夫妻争执、亲子冲突。慎防言语伤人，少说为妙。",
      wealth: "大起大落，钱难赚。易破财，小心官司导致的财务损失。",
      career: "武职/体力工作尚可，文职遇阻。慎防口舌是非和官司。",
      health: "注意血光之灾！胸、支气管问题。传染病风险。重症危险。",
      travel: "行者惊慌有难。注意交通安全，防车祸骨折。远离车马。",
      lostItems: "急寻！找到时可能牵涉虚假证词。西方搜索。",
    },
  },
  5: {
    index: 5,
    name: "小吉",
    nameEn: "Small Fortune",
    auspiciousness: "小吉",
    element: "水",
    direction: "北",
    directionEn: "North",
    symbol: "六合",
    color: "黄",
    emoji: "🕊️",
    classicVerse: "小吉最吉昌，路上好商量。阴人来报喜，失物在坤方。",
    domains: {
      love: "桃花运旺！单身易通过介绍认识。已婚者和合美满。'阴人来报喜'，大吉。",
      family: "家庭和合美满。女性亲属带来好消息。家人之间商量事情特别顺利。",
      wealth: "财运可得，可能通过他人帮助获得。交易顺利昌盛，最利求财。",
      career: "工作顺利，注意财务处理及下属沟通。合作顺畅，官运好。",
      health: "注意肝胆消化。无大问题。慢性病需祈祷调理。总体安康。",
      travel: "大吉出行！四方通达无灾。行者即至，出行有财利。",
      lostItems: "西南方（坤方）可寻回。",
    },
  },
  6: {
    index: 6,
    name: "空亡",
    nameEn: "Empty Void",
    auspiciousness: "大凶",
    element: "土",
    direction: "中央",
    directionEn: "Center",
    symbol: "勾陈",
    color: "黄",
    emoji: "🌫️",
    classicVerse: "空亡事不祥，阴人多乖张。求财无利益，行人有灾殃。",
    domains: {
      love: "大争吵，可能有第三者或外力干扰。感情空虚黑暗，难以维系。",
      family: "家庭气氛低沉，阴人（女性亲属）多生事端。家事落空，计划难成。",
      wealth: "钱财几乎无法获取。保守为上，做好被偷盗的防范。'宁在村中坐，莫往远处行'。",
      career: "工作受损，易被陷害拖累。无法做决定，方向迷失。",
      health: "脾胃、神经系统问题。可能涉及灵体干扰。重症极其危险。慢性病需约5月调理。",
      travel: "出行者路途遇难，可能永远不达。大忌出行。防金属器具所伤。",
      lostItems: "无法寻回，彻底消失，寻找无益。",
    },
  },
};

export function calculateXiaoLiuRen(date?: Date): LiurenDivination {
  const now = date || new Date();

  const solar = Solar.fromYmd(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const lunar: Lunar = solar.getLunar();
  const lunarMonth = lunar.getMonth();
  const lunarDay = lunar.getDay();

  const hourIndex = getHourIndex(now);
  const timeZhi = INDEX_TO_ZHI[hourIndex];

  // Main formula: ((month-1) + (day-1) + (hour-1)) % 6 + 1
  const palaceIndex = ((lunarMonth - 1) + (lunarDay - 1) + (hourIndex - 1)) % 6 + 1;

  const lunarMonthStr = lunar.getMonthInChinese();
  const lunarDayStr = lunar.getDayInChinese();

  return {
    palaceIndex,
    palace: PALACE_DATA[palaceIndex],
    lunarMonth,
    lunarDay,
    lunarDateStr: `农历${lunarMonthStr}月${lunarDayStr}日`,
    timeZhi,
    hourIndex,
  };
}
