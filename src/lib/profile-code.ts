import type { BirthData } from "@/types";

export function encodeProfileCode(data: BirthData): string {
  return btoa(JSON.stringify(data));
}

export function decodeProfileCode(code: string): BirthData | null {
  try {
    const data = JSON.parse(atob(code));
    if (
      typeof data.year === "number" &&
      typeof data.month === "number" &&
      typeof data.day === "number" &&
      typeof data.hour === "number" &&
      (data.gender === "male" || data.gender === "female")
    ) {
      return data as BirthData;
    }
    return null;
  } catch {
    return null;
  }
}
