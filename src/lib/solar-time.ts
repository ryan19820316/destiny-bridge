// True solar time (真太阳时) correction for Ba Zi hour pillar accuracy.
// Without this, cities far from their timezone meridian can be off by one 时辰.

export interface CityInfo {
  nameZh: string;
  nameEn: string;
  longitude: number;   // degrees east (negative = west)
  timezoneMeridian: number; // standard meridian for the timezone (degrees east)
}

// ~80 major Chinese and international cities
const CITY_DB: CityInfo[] = [
  // === Chinese cities (timezone: UTC+8, meridian 120°E) ===
  { nameZh: "北京", nameEn: "Beijing", longitude: 116.4, timezoneMeridian: 120 },
  { nameZh: "上海", nameEn: "Shanghai", longitude: 121.5, timezoneMeridian: 120 },
  { nameZh: "广州", nameEn: "Guangzhou", longitude: 113.3, timezoneMeridian: 120 },
  { nameZh: "深圳", nameEn: "Shenzhen", longitude: 114.1, timezoneMeridian: 120 },
  { nameZh: "成都", nameEn: "Chengdu", longitude: 104.1, timezoneMeridian: 120 },
  { nameZh: "重庆", nameEn: "Chongqing", longitude: 106.5, timezoneMeridian: 120 },
  { nameZh: "杭州", nameEn: "Hangzhou", longitude: 120.2, timezoneMeridian: 120 },
  { nameZh: "南京", nameEn: "Nanjing", longitude: 118.8, timezoneMeridian: 120 },
  { nameZh: "武汉", nameEn: "Wuhan", longitude: 114.3, timezoneMeridian: 120 },
  { nameZh: "西安", nameEn: "Xi'an", longitude: 108.9, timezoneMeridian: 120 },
  { nameZh: "天津", nameEn: "Tianjin", longitude: 117.2, timezoneMeridian: 120 },
  { nameZh: "苏州", nameEn: "Suzhou", longitude: 120.6, timezoneMeridian: 120 },
  { nameZh: "长沙", nameEn: "Changsha", longitude: 113.0, timezoneMeridian: 120 },
  { nameZh: "郑州", nameEn: "Zhengzhou", longitude: 113.7, timezoneMeridian: 120 },
  { nameZh: "济南", nameEn: "Jinan", longitude: 117.0, timezoneMeridian: 120 },
  { nameZh: "青岛", nameEn: "Qingdao", longitude: 120.4, timezoneMeridian: 120 },
  { nameZh: "大连", nameEn: "Dalian", longitude: 121.6, timezoneMeridian: 120 },
  { nameZh: "沈阳", nameEn: "Shenyang", longitude: 123.4, timezoneMeridian: 120 },
  { nameZh: "哈尔滨", nameEn: "Harbin", longitude: 126.6, timezoneMeridian: 120 },
  { nameZh: "长春", nameEn: "Changchun", longitude: 125.3, timezoneMeridian: 120 },
  { nameZh: "昆明", nameEn: "Kunming", longitude: 102.8, timezoneMeridian: 120 },
  { nameZh: "贵阳", nameEn: "Guiyang", longitude: 106.7, timezoneMeridian: 120 },
  { nameZh: "南宁", nameEn: "Nanning", longitude: 108.4, timezoneMeridian: 120 },
  { nameZh: "福州", nameEn: "Fuzhou", longitude: 119.3, timezoneMeridian: 120 },
  { nameZh: "厦门", nameEn: "Xiamen", longitude: 118.1, timezoneMeridian: 120 },
  { nameZh: "海口", nameEn: "Haikou", longitude: 110.3, timezoneMeridian: 120 },
  { nameZh: "三亚", nameEn: "Sanya", longitude: 109.5, timezoneMeridian: 120 },
  { nameZh: "兰州", nameEn: "Lanzhou", longitude: 103.7, timezoneMeridian: 120 },
  { nameZh: "西宁", nameEn: "Xining", longitude: 101.8, timezoneMeridian: 120 },
  { nameZh: "银川", nameEn: "Yinchuan", longitude: 106.3, timezoneMeridian: 120 },
  { nameZh: "呼和浩特", nameEn: "Hohhot", longitude: 111.7, timezoneMeridian: 120 },
  { nameZh: "乌鲁木齐", nameEn: "Urumqi", longitude: 87.6, timezoneMeridian: 120 },
  { nameZh: "拉萨", nameEn: "Lhasa", longitude: 91.1, timezoneMeridian: 120 },
  { nameZh: "合肥", nameEn: "Hefei", longitude: 117.3, timezoneMeridian: 120 },
  { nameZh: "南昌", nameEn: "Nanchang", longitude: 115.9, timezoneMeridian: 120 },
  { nameZh: "太原", nameEn: "Taiyuan", longitude: 112.5, timezoneMeridian: 120 },
  { nameZh: "石家庄", nameEn: "Shijiazhuang", longitude: 114.5, timezoneMeridian: 120 },
  { nameZh: "台北", nameEn: "Taipei", longitude: 121.5, timezoneMeridian: 120 },
  { nameZh: "香港", nameEn: "Hong Kong", longitude: 114.2, timezoneMeridian: 120 },
  { nameZh: "澳门", nameEn: "Macau", longitude: 113.5, timezoneMeridian: 120 },

  // === East / Southeast Asia ===
  { nameZh: "东京", nameEn: "Tokyo", longitude: 139.7, timezoneMeridian: 135 },
  { nameZh: "首尔", nameEn: "Seoul", longitude: 127.0, timezoneMeridian: 135 },
  { nameZh: "新加坡", nameEn: "Singapore", longitude: 103.8, timezoneMeridian: 120 },
  { nameZh: "吉隆坡", nameEn: "Kuala Lumpur", longitude: 101.7, timezoneMeridian: 120 },
  { nameZh: "曼谷", nameEn: "Bangkok", longitude: 100.5, timezoneMeridian: 105 },
  { nameZh: "马尼拉", nameEn: "Manila", longitude: 121.0, timezoneMeridian: 120 },
  { nameZh: "雅加达", nameEn: "Jakarta", longitude: 106.8, timezoneMeridian: 105 },
  { nameZh: "胡志明市", nameEn: "Ho Chi Minh City", longitude: 106.6, timezoneMeridian: 105 },

  // === North America (UTC-5/-8 etc.) ===
  { nameZh: "纽约", nameEn: "New York", longitude: -74.0, timezoneMeridian: -75 },
  { nameZh: "洛杉矶", nameEn: "Los Angeles", longitude: -118.2, timezoneMeridian: -120 },
  { nameZh: "芝加哥", nameEn: "Chicago", longitude: -87.6, timezoneMeridian: -90 },
  { nameZh: "休斯顿", nameEn: "Houston", longitude: -95.4, timezoneMeridian: -90 },
  { nameZh: "旧金山", nameEn: "San Francisco", longitude: -122.4, timezoneMeridian: -120 },
  { nameZh: "多伦多", nameEn: "Toronto", longitude: -79.4, timezoneMeridian: -75 },
  { nameZh: "温哥华", nameEn: "Vancouver", longitude: -123.1, timezoneMeridian: -120 },
  { nameZh: "西雅图", nameEn: "Seattle", longitude: -122.3, timezoneMeridian: -120 },
  { nameZh: "波士顿", nameEn: "Boston", longitude: -71.1, timezoneMeridian: -75 },
  { nameZh: "华盛顿", nameEn: "Washington DC", longitude: -77.0, timezoneMeridian: -75 },
  { nameZh: "迈阿密", nameEn: "Miami", longitude: -80.2, timezoneMeridian: -75 },
  { nameZh: "达拉斯", nameEn: "Dallas", longitude: -96.8, timezoneMeridian: -90 },
  { nameZh: "亚特兰大", nameEn: "Atlanta", longitude: -84.4, timezoneMeridian: -75 },
  { nameZh: "丹佛", nameEn: "Denver", longitude: -105.0, timezoneMeridian: -105 },
  { nameZh: "菲尼克斯", nameEn: "Phoenix", longitude: -112.1, timezoneMeridian: -105 },
  { nameZh: "拉斯维加斯", nameEn: "Las Vegas", longitude: -115.1, timezoneMeridian: -120 },

  // === Europe (UTC+0/+1) ===
  { nameZh: "伦敦", nameEn: "London", longitude: -0.1, timezoneMeridian: 0 },
  { nameZh: "巴黎", nameEn: "Paris", longitude: 2.3, timezoneMeridian: 15 },
  { nameZh: "柏林", nameEn: "Berlin", longitude: 13.4, timezoneMeridian: 15 },
  { nameZh: "罗马", nameEn: "Rome", longitude: 12.5, timezoneMeridian: 15 },
  { nameZh: "马德里", nameEn: "Madrid", longitude: -3.7, timezoneMeridian: 15 },
  { nameZh: "阿姆斯特丹", nameEn: "Amsterdam", longitude: 4.9, timezoneMeridian: 15 },
  { nameZh: "莫斯科", nameEn: "Moscow", longitude: 37.6, timezoneMeridian: 45 },
  { nameZh: "伊斯坦布尔", nameEn: "Istanbul", longitude: 29.0, timezoneMeridian: 45 },
  { nameZh: "苏黎世", nameEn: "Zurich", longitude: 8.5, timezoneMeridian: 15 },
  { nameZh: "维也纳", nameEn: "Vienna", longitude: 16.4, timezoneMeridian: 15 },
  { nameZh: "斯德哥尔摩", nameEn: "Stockholm", longitude: 18.1, timezoneMeridian: 15 },
  { nameZh: "都柏林", nameEn: "Dublin", longitude: -6.3, timezoneMeridian: 0 },

  // === Oceania ===
  { nameZh: "悉尼", nameEn: "Sydney", longitude: 151.2, timezoneMeridian: 150 },
  { nameZh: "墨尔本", nameEn: "Melbourne", longitude: 145.0, timezoneMeridian: 150 },
  { nameZh: "奥克兰", nameEn: "Auckland", longitude: 174.8, timezoneMeridian: 180 },
  { nameZh: "布里斯班", nameEn: "Brisbane", longitude: 153.0, timezoneMeridian: 150 },

  // === South Asia / Middle East ===
  { nameZh: "迪拜", nameEn: "Dubai", longitude: 55.3, timezoneMeridian: 60 },
  { nameZh: "孟买", nameEn: "Mumbai", longitude: 72.9, timezoneMeridian: 82.5 },
  { nameZh: "新德里", nameEn: "New Delhi", longitude: 77.2, timezoneMeridian: 82.5 },
  { nameZh: "德黑兰", nameEn: "Tehran", longitude: 51.4, timezoneMeridian: 52.5 },
  { nameZh: "利雅得", nameEn: "Riyadh", longitude: 46.7, timezoneMeridian: 45 },

  // === Others ===
  { nameZh: "开普敦", nameEn: "Cape Town", longitude: 18.4, timezoneMeridian: 30 },
  { nameZh: "圣保罗", nameEn: "Sao Paulo", longitude: -46.6, timezoneMeridian: -45 },
  { nameZh: "墨西哥城", nameEn: "Mexico City", longitude: -99.1, timezoneMeridian: -90 },
  { nameZh: "布宜诺斯艾利斯", nameEn: "Buenos Aires", longitude: -58.4, timezoneMeridian: -45 },
];

// Build lookup maps
const cityByZh = new Map<string, CityInfo>();
const cityByEn = new Map<string, CityInfo>();
for (const c of CITY_DB) {
  cityByZh.set(c.nameZh, c);
  cityByEn.set(c.nameEn.toLowerCase(), c);
}

export function findCity(query: string): CityInfo | undefined {
  const trimmed = query.trim();
  if (!trimmed) return undefined;
  const byZh = cityByZh.get(trimmed);
  if (byZh) return byZh;
  return cityByEn.get(trimmed.toLowerCase());
}

export function getAllCities(): CityInfo[] {
  return CITY_DB;
}

export function searchCities(query: string, limit = 10): CityInfo[] {
  const q = query.trim().toLowerCase();
  if (!q) return CITY_DB.slice(0, limit);
  return CITY_DB.filter(
    (c) => c.nameZh.includes(q) || c.nameEn.toLowerCase().includes(q)
  ).slice(0, limit);
}

// Simplified equation of time (minutes offset) by day of year.
// Accurate within ~2 minutes. From NOAA solar position approximation.
function equationOfTime(dayOfYear: number): number {
  const B = (360 / 365) * (dayOfYear - 81); // degrees
  const B_rad = (B * Math.PI) / 180;
  return 9.87 * Math.sin(2 * B_rad) - 7.53 * Math.cos(B_rad) - 1.5 * Math.sin(B_rad);
}

// Compute true solar hour from clock hour and birthplace city.
// Returns a float (e.g. 13.7 means ~13:42 solar time).
export function getTrueSolarHour(
  clockHour: number,
  city: string,
  month: number,
  day: number,
): number {
  const info = findCity(city);
  if (!info) return clockHour; // unknown city: no correction

  const dayOfYear = dayOfYearFromMD(month, day);

  // Mean solar correction: (local_longitude - timezone_meridian) × 4 min/degree
  const longDiff = info.longitude - info.timezoneMeridian;
  const meanSolarMinutes = longDiff * 4;
  const eotMinutes = equationOfTime(dayOfYear);

  const trueSolarMinutes = clockHour * 60 + meanSolarMinutes + eotMinutes;
  return trueSolarMinutes / 60;
}

function dayOfYearFromMD(month: number, day: number): number {
  const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let doy = day;
  for (let i = 1; i < month; i++) {
    doy += daysInMonth[i];
  }
  return doy;
}
