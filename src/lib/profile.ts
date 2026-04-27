import { UserProfile, VentMessage, LiurenQueryRecord, QuestionCategory } from "@/types";

const PROFILE_KEY = "destinybridge_profile";

export const DEFAULT_PROFILE: UserProfile = {
  name: "",
  nickname: "",
  baziData: null,
  preferredTone: "gentle",
  recurringThemes: [],
  languagePreference: "en",
  membershipStatus: "free",
  trialStartDate: null,
  lastChatClearDate: "",
  conversationHistory: [],
  liurenDailyCount: 0,
  lastLiurenDate: "",
  liurenHistory: [],
};

export function getProfile(): UserProfile {
  if (typeof window === "undefined") return { ...DEFAULT_PROFILE };
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    const parsed = JSON.parse(raw) as UserProfile;
    return { ...DEFAULT_PROFILE, ...parsed };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function updateProfile(partial: Partial<UserProfile>): UserProfile {
  const current = getProfile();
  const merged = { ...current, ...partial };
  saveProfile(merged);
  return merged;
}

export function clearProfile(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PROFILE_KEY);
}

export function clearDailyChatHistory(): void {
  const profile = getProfile();
  profile.conversationHistory = [];
  profile.lastChatClearDate = new Date().toISOString().slice(0, 10);
  saveProfile(profile);
}

export function addChatMessage(msg: VentMessage): void {
  const profile = getProfile();
  const today = new Date().toISOString().slice(0, 10);
  if (profile.lastChatClearDate !== today) {
    profile.conversationHistory = [];
    profile.lastChatClearDate = today;
  }
  profile.conversationHistory.push(msg);
  saveProfile(profile);
}

export function isMemberActive(): boolean {
  const profile = getProfile();
  if (profile.membershipStatus === "active") return true;
  if (profile.membershipStatus === "trial" && profile.trialStartDate) {
    const start = new Date(profile.trialStartDate);
    const now = new Date();
    const days = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    return days <= 7;
  }
  return false;
}

export function getTrialDaysRemaining(): number {
  const profile = getProfile();
  if (!profile.trialStartDate) return 0;
  const start = new Date(profile.trialStartDate);
  const now = new Date();
  const elapsed = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.ceil(7 - elapsed));
}

export function startFreeTrial(): void {
  updateProfile({
    membershipStatus: "trial",
    trialStartDate: new Date().toISOString(),
  });
}

export function activateMembership(): void {
  updateProfile({ membershipStatus: "active" });
}

export function getDailyLiurenCount(): number {
  const profile = getProfile();
  const today = new Date().toISOString().slice(0, 10);
  if (profile.lastLiurenDate !== today) {
    profile.liurenDailyCount = 0;
    profile.lastLiurenDate = today;
    profile.liurenHistory = [];
    saveProfile(profile);
    return 0;
  }
  return profile.liurenDailyCount;
}

export function incrementLiurenCount(): number {
  const profile = getProfile();
  const today = new Date().toISOString().slice(0, 10);
  if (profile.lastLiurenDate !== today) {
    profile.liurenDailyCount = 0;
    profile.lastLiurenDate = today;
    profile.liurenHistory = [];
  }
  profile.liurenDailyCount += 1;
  saveProfile(profile);
  return profile.liurenDailyCount;
}

export function canQueryLiuren(category: QuestionCategory, hourIndex: number): boolean {
  const profile = getProfile();
  const today = new Date().toISOString().slice(0, 10);
  if (profile.lastLiurenDate !== today) return true;
  return !profile.liurenHistory.some(
    (r) => r.category === category && r.hourIndex === hourIndex && r.date === today
  );
}

export function saveLiurenQuery(record: LiurenQueryRecord): void {
  const profile = getProfile();
  const today = new Date().toISOString().slice(0, 10);
  if (profile.lastLiurenDate !== today) {
    profile.liurenHistory = [];
    profile.lastLiurenDate = today;
  }
  profile.liurenHistory.push(record);
  if (profile.liurenHistory.length > 10) {
    profile.liurenHistory = profile.liurenHistory.slice(-10);
  }
  saveProfile(profile);
}

export function getLiurenHistory(): LiurenQueryRecord[] {
  const profile = getProfile();
  const today = new Date().toISOString().slice(0, 10);
  if (profile.lastLiurenDate !== today) return [];
  return profile.liurenHistory.slice(-3).reverse();
}

export function buildProfileSummary(profile: UserProfile): string {
  const parts: string[] = [];
  if (profile.nickname) parts.push(`User's name: ${profile.nickname}`);
  if (profile.preferredTone) parts.push(`Preferred tone: ${profile.preferredTone}`);
  if (profile.recurringThemes.length > 0) {
    parts.push(`Recurring life themes: ${profile.recurringThemes.join(", ")}`);
  }
  if (profile.baziData) {
    parts.push(
      `Born: ${profile.baziData.year}-${profile.baziData.month}-${profile.baziData.day}, gender: ${profile.baziData.gender}`
    );
  }
  return parts.join(". ");
}
