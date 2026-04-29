const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://destiny-bridge-production.up.railway.app";

export function createGumroadCheckout(productPermalink: string, type: "bazi" | "member") {
  const redirectUrl = encodeURIComponent(`${APP_URL}/payment/success?type=${type}`);
  return `https://gumroad.com/l/${productPermalink}?wanted=true&url=${redirectUrl}`;
}

export const PRICING = {
  baziBlueprint: {
    permalink: "bazi-wellness-blueprint",
    price: 9.99,
    name: "Bazi Wellness Blueprint",
    type: "one-time" as const,
  },
  claraMembership: {
    permalink: "clara-membership",
    price: 6.99,
    name: "Clara Membership",
    type: "subscription" as const,
    trialDays: 7,
  },
};

export function savePendingPurchase(data: Record<string, unknown>) {
  localStorage.setItem("pendingPurchase", JSON.stringify(data));
}

export function getPendingPurchase<T = Record<string, unknown>>(): T | null {
  const raw = localStorage.getItem("pendingPurchase");
  if (!raw) return null;
  localStorage.removeItem("pendingPurchase");
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
