import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const USAGE_LOG = path.join(DATA_DIR, "usage.jsonl");
const DOWNLOAD_LOG = path.join(DATA_DIR, "downloads.jsonl");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface UsageEntry {
  endpoint: string;
  category?: string;
  lang?: string;
  timestamp: string;
  ip?: string;
}

export function logUsage(entry: UsageEntry) {
  try {
    ensureDir();
    fs.appendFileSync(USAGE_LOG, JSON.stringify(entry) + "\n");
  } catch {}
}

export function logDownload(entry: { timestamp: string; ip?: string; userAgent?: string }) {
  try {
    ensureDir();
    fs.appendFileSync(DOWNLOAD_LOG, JSON.stringify(entry) + "\n");
  } catch {}
}

export function readUsageLogs(): UsageEntry[] {
  try {
    if (!fs.existsSync(USAGE_LOG)) return [];
    const raw = fs.readFileSync(USAGE_LOG, "utf-8").trim();
    if (!raw) return [];
    return raw.split("\n").map((l) => JSON.parse(l));
  } catch {
    return [];
  }
}

export function readDownloadLogs(): Record<string, unknown>[] {
  try {
    if (!fs.existsSync(DOWNLOAD_LOG)) return [];
    const raw = fs.readFileSync(DOWNLOAD_LOG, "utf-8").trim();
    if (!raw) return [];
    return raw.split("\n").map((l) => JSON.parse(l));
  } catch {
    return [];
  }
}

export function getStats(): {
  totalDownloads: number;
  queriesByEndpoint: Record<string, number>;
  queriesByDay: Record<string, number>;
  recentQueries: UsageEntry[];
} {
  const usage = readUsageLogs();
  const downloads = readDownloadLogs();

  const queriesByEndpoint: Record<string, number> = {};
  const queriesByDay: Record<string, number> = {};

  for (const u of usage) {
    queriesByEndpoint[u.endpoint] = (queriesByEndpoint[u.endpoint] || 0) + 1;
    const day = u.timestamp.slice(0, 10);
    queriesByDay[day] = (queriesByDay[day] || 0) + 1;
  }

  return {
    totalDownloads: downloads.length,
    queriesByEndpoint,
    queriesByDay,
    recentQueries: usage.slice(-100),
  };
}
