import { UserProfile, VentMessage } from "@/types";

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
