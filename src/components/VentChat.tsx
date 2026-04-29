"use client";

import { useState, useRef, useEffect } from "react";
import { getProfile, addChatMessage, clearDailyChatHistory } from "@/lib/profile";
import type { VentMessage, VentResponse, UserProfile } from "@/types";

type Lang = "zh" | "en";

const T = {
  loading: { zh: "加载中…", en: "Loading your profile..." },
  title: { zh: "向 Clara 倾诉", en: "Talk to Clara" },
  subtitle: { zh: "把今天的心事告诉 Clara，她用东方智慧帮你梳理情绪。没有评判，只有温暖。", en: "Sometimes you just need someone who listens. Clara uses Eastern wisdom to help you make sense of hard days — no judgment, just warmth." },
  privacyNote: { zh: "你的对话仅保存在你的设备上。这是身心健康指引，不是心理治疗。", en: "Your conversations stay on your device. This is wellness guidance, not therapy." },
  companion: { zh: "你的东方生活陪伴", en: "Your Eastern wellness companion" },
  clearChat: { zh: "清除今日对话", en: "Clear today's chat" },
  emptyHint: { zh: "今天想和 Clara 聊些什么呢…", en: "Tell Clara what's on your mind today..." },
  emptyPrivacy: { zh: "你的对话仅保存在你的设备上。", en: "Your words stay on your device only." },
  listening: { zh: "Clara 正在倾听…", en: "Clara is listening..." },
  placeholder: { zh: "和 Clara 说说你的心事…", en: "Tell Clara what's on your mind..." },
  send: { zh: "发送", en: "Send" },
};

export default function VentChat() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<VentMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>("en");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const p = getProfile();
    setProfile(p);
    setMessages(p.conversationHistory || []);
    setLang(p.languagePreference === "en" ? "en" : "zh");
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading || !profile) return;
    const userMsg: VentMessage = {
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    addChatMessage(userMsg);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const freshProfile = getProfile();
      const res = await fetch("/api/vent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.content,
          profile: freshProfile,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Something went wrong");
      }

      const data: VentResponse = await res.json();
      const claraMsg: VentMessage = {
        role: "clara",
        content: `${data.emotionalNote}\n\n${data.elementReframe}\n\n${data.suggestion}`,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, claraMsg]);
      addChatMessage(claraMsg);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again?");
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    clearDailyChatHistory();
    setMessages([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!profile) {
    return (
      <div className="mystic-card rounded-2xl p-8 text-center">
        <p className="text-gray-400 text-sm">{T.loading[lang]}</p>
      </div>
    );
  }

  return (
    <div className="mystic-card rounded-2xl p-6 flex flex-col h-[520px]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <div className="w-10 h-10 rounded-full bg-mystic-700 flex items-center justify-center text-lg">
          🍵
        </div>
        <div>
          <h3 className="font-semibold text-white text-sm">Clara</h3>
          <p className="text-xs text-gray-500">{T.companion[lang]}</p>
        </div>
        <button
          onClick={handleClearChat}
          className="ml-auto text-xs text-gray-500 hover:text-red-400 transition-colors"
          title={lang === "zh" ? "清除今日对话" : "Clear today's chat"}
        >
          {T.clearChat[lang]}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-3">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400">{T.emptyHint[lang]}</p>
            <p className="text-xs text-gray-500 mt-1">{T.emptyPrivacy[lang]}</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user" ? "user-bubble" : "clara-bubble"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="clara-bubble px-4 py-2.5 text-sm text-gray-400 italic">
              {T.listening[lang]}
            </div>
          </div>
        )}
        {error && (
          <div className="text-center text-xs text-red-400">{error}</div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={T.placeholder[lang]}
          className="flex-1 px-4 py-3 rounded-xl bg-mystic-800/80 border border-mystic-600 text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-400 transition-colors text-sm"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="px-5 py-3 rounded-xl bg-mystic-700 text-white font-medium text-sm hover:bg-mystic-600 disabled:opacity-40 transition-all shrink-0"
        >
          {T.send[lang]}
        </button>
      </div>

      {/* Privacy notice */}
      <p className="text-xs text-gray-600 text-center mt-2 shrink-0">
        {T.privacyNote[lang]}
      </p>
    </div>
  );
}
