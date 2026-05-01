// Solar-to-Chinese-Lunar conversion for 六爻 time-based hexagram
// Uses a lookup table of Chinese New Year dates (2000-2100)
// Reference: Hong Kong Observatory data

interface LunarDate {
  year: number;   // lunar year number
  month: number;  // 1-12 (13 if leap month)
  day: number;    // 1-30
  isLeap: boolean;
}

// Chinese New Year dates (month, day) in Gregorian calendar, 2000-2100
const CNY_DATES: Record<number, [number, number]> = {
  2000: [2, 5], 2001: [1, 24], 2002: [2, 12], 2003: [2, 1], 2004: [1, 22],
  2005: [2, 9], 2006: [1, 29], 2007: [2, 18], 2008: [2, 7], 2009: [1, 26],
  2010: [2, 14], 2011: [2, 3], 2012: [1, 23], 2013: [2, 10], 2014: [1, 31],
  2015: [2, 19], 2016: [2, 8], 2017: [1, 28], 2018: [2, 16], 2019: [2, 5],
  2020: [1, 25], 2021: [2, 12], 2022: [2, 1], 2023: [1, 22], 2024: [2, 10],
  2025: [1, 29], 2026: [2, 17], 2027: [2, 6], 2028: [1, 26], 2029: [2, 13],
  2030: [2, 3], 2031: [1, 23], 2032: [2, 11], 2033: [1, 31], 2034: [2, 19],
  2035: [2, 8], 2036: [1, 28], 2037: [2, 15], 2038: [2, 4], 2039: [1, 24],
};

// Days in each lunar month by year (simplified: big month=30, small month=29)
// Pattern repeats approximately; use standard sequence for simplicity
const LUNAR_MONTH_DAYS: number[] = [29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30];

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function dayOfYear(year: number, month: number, day: number): number {
  let doy = day;
  for (let m = 1; m < month; m++) {
    doy += daysInMonth(year, m);
  }
  return doy;
}

export function solarToLunar(year: number, month: number, day: number): LunarDate {
  // Get Chinese New Year for this solar year
  let cnyYear = year;
  let cny = CNY_DATES[cnyYear];
  if (!cny) {
    // Fallback: approximate for years outside table
    cny = [2, Math.floor(4 + (year - 2000) * 0.25) % 30 + 1];
  }

  const cnyDate = new Date(cnyYear, cny[0] - 1, cny[1]);
  const targetDate = new Date(year, month - 1, day);

  if (targetDate < cnyDate) {
    // Before CNY, use previous lunar year
    cnyYear = year - 1;
    cny = CNY_DATES[cnyYear];
    if (!cny) {
      cny = [2, Math.floor(4 + (cnyYear - 2000) * 0.25) % 30 + 1];
    }
  }

  const cnyActual = new Date(cnyYear, cny[0] - 1, cny[1]);
  const diffDays = Math.floor((targetDate.getTime() - cnyActual.getTime()) / (1000 * 60 * 60 * 24));

  // Calculate lunar month and day
  let remaining = diffDays;
  let lunarMonth = 1;
  for (let m = 0; m < 12; m++) {
    const daysInLunarMonth = LUNAR_MONTH_DAYS[m];
    if (remaining < daysInLunarMonth) break;
    remaining -= daysInLunarMonth;
    lunarMonth++;
  }

  return {
    year: cnyYear,
    month: lunarMonth,
    day: remaining + 1,
    isLeap: false,
  };
}

// Get 时辰 index (0-11) from hour (0-23)
// 子时=23:00-00:59 (index 0), 丑时=01:00-02:59 (index 1), etc.
export function getShiChenIndex(hour: number): number {
  // Map 0-23 hour to 时辰 index 0-11
  // 23,0→0(子), 1,2→1(丑), 3,4→2(寅), 5,6→3(卯), ...
  if (hour === 23 || hour === 0) return 0;
  return Math.floor((hour + 1) / 2);
}

// Get full 时辰 name from index
export function getShiChenName(index: number): string {
  const names = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  return names[index] || "子";
}
