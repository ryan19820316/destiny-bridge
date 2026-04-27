// Referral system — simple code generation and commission tracking
// For MVP, uses localStorage. Production should use a DB.

export interface ReferralRecord {
  code: string;
  ownerId: string;
  ownerName: string;
  commissionRate: number; // e.g. 0.15 = 15%
  totalEarnings: number;
  invitees: string[];
  createdAt: string;
}

const COMMISSION_RATE = 0.15; // 15% default

export function generateReferralCode(userId: string): string {
  const prefix = "CLARA";
  const hash = simpleHash(userId).toString(36).toUpperCase().slice(0, 6);
  return `${prefix}${hash}`;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export function calculateCommission(amount: number, rate: number = COMMISSION_RATE): number {
  return Math.round(amount * rate * 100) / 100;
}

// Track referral click (client-side)
export function trackReferralClick(code: string): void {
  if (typeof window === "undefined") return;
  const clicks = JSON.parse(localStorage.getItem("referral_clicks") || "{}");
  clicks[code] = (clicks[code] || 0) + 1;
  localStorage.setItem("referral_clicks", JSON.stringify(clicks));
  // Store in cookie for 30 days
  document.cookie = `ref=${code}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
}

// Get referral code from cookie
export function getReferralFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)ref=([^;]*)/);
  return match ? match[1] : null;
}

// Commission tiers for power users
export const COMMISSION_TIERS = [
  { minInvites: 0, rate: 0.10, label: "Seed" },
  { minInvites: 10, rate: 0.15, label: "Bloom" },
  { minInvites: 50, rate: 0.20, label: "Garden" },
  { minInvites: 200, rate: 0.25, label: "Forest" },
];
