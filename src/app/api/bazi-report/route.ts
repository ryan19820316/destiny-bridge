import { calculateBazi, formatChartForAI } from "@/lib/bazi";
import { generateWellnessReport } from "@/lib/ai";
import { NextRequest, NextResponse } from "next/server";

// Compute chapter 1 server-side — no AI needed
function buildBasicChart(baziResult: ReturnType<typeof calculateBazi>, birthData: { year: number; month: number; day: number; hour: number }) {
  const { chart, elements, dayMaster, tenGods } = baziResult;
  const p = (pillar: typeof chart.year) => `${pillar.stem}${pillar.branch}`;

  const zodiacMap: Record<string, string> = {
    "子": "鼠", "丑": "牛", "寅": "虎", "卯": "兔", "辰": "龙", "巳": "蛇",
    "午": "马", "未": "羊", "申": "猴", "酉": "鸡", "戌": "狗", "亥": "猪",
  };

  const nayinMap: Record<string, string> = {
    "甲子": "海中金", "乙丑": "海中金", "丙寅": "炉中火", "丁卯": "炉中火",
    "戊辰": "大林木", "己巳": "大林木", "庚午": "路旁土", "辛未": "路旁土",
    "壬申": "剑锋金", "癸酉": "剑锋金", "甲戌": "山头火", "乙亥": "山头火",
    "丙子": "涧下水", "丁丑": "涧下水", "戊寅": "城头土", "己卯": "城头土",
    "庚辰": "白蜡金", "辛巳": "白蜡金", "壬午": "杨柳木", "癸未": "杨柳木",
    "甲申": "泉中水", "乙酉": "泉中水", "丙戌": "屋上土", "丁亥": "屋上土",
    "戊子": "霹雳火", "己丑": "霹雳火", "庚寅": "松柏木", "辛卯": "松柏木",
    "壬辰": "长流水", "癸巳": "长流水", "甲午": "沙中金", "乙未": "沙中金",
    "丙申": "山下火", "丁酉": "山下火", "戊戌": "平地木", "己亥": "平地木",
  };

  const zodiac = zodiacMap[chart.year.branch] || chart.year.branch;
  const nayinYear = nayinMap[p(chart.year)] || "";
  const nayinMonth = nayinMap[p(chart.month)] || "";
  const nayinDay = nayinMap[p(chart.day)] || "";
  const nayinHour = nayinMap[p(chart.hour)] || "";

  const elementLines = Object.entries(elements)
    .map(([el, count]) => `${el}${count}`)
    .join("、");

  return {
    solarDate: `${birthData.year}年${birthData.month}月${birthData.day}日 ${String(birthData.hour).padStart(2, "0")}:00`,
    lunarDate: `${chart.year.stem}${chart.year.branch}年`,
    fourPillars: `${p(chart.year)} ${p(chart.month)} ${p(chart.day)} ${p(chart.hour)}`,
    dayMaster: `${dayMaster.stem}${dayMaster.element}`,
    dayMasterDesc: nayinDay || `${dayMaster.stem}${dayMaster.element}命`,
    fiveElements: elementLines,
    zodiac,
    nayin: `年${nayinYear} 月${nayinMonth} 日${nayinDay} 时${nayinHour}`,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { year, month, day, hour, gender, lang } = body;

    if (!year || !month || !day || hour === undefined || !gender) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const numYear = Number(year), numMonth = Number(month), numDay = Number(day), numHour = Number(hour);
    if (isNaN(numYear) || isNaN(numMonth) || isNaN(numDay) || isNaN(numHour)) {
      return NextResponse.json({ error: "All date fields must be numbers" }, { status: 400 });
    }
    if (numYear < 1900 || numYear > 2100) {
      return NextResponse.json({ error: "Year must be between 1900 and 2100" }, { status: 400 });
    }

    const outputLang = lang === "en" ? "en" : "zh";

    const birthData = { year: numYear, month: numMonth, day: numDay, hour: numHour, gender };
    const baziResult = calculateBazi(birthData);
    const chartText = formatChartForAI(baziResult, birthData);

    // Chapter 1: server-side, no AI needed
    const basicChart = buildBasicChart(baziResult, birthData);

    // Chapters 2-10: AI interpretation (single language)
    const aiReport = await generateWellnessReport(chartText, birthData, outputLang);

    return NextResponse.json({
      chart: {
        fourPillars: basicChart.fourPillars,
        dayMaster: baziResult.dayMaster,
        elements: baziResult.elements,
        favorableElements: baziResult.favorableElements,
        unfavorableElements: baziResult.unfavorableElements,
        tenGods: baziResult.tenGods,
      },
      report: {
        basicChart,
        ...aiReport,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    console.error("Bazi report API error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal server error" },
      { status: 500 }
    );
  }
}
