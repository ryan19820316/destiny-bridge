"use client";

import { useState, useRef, useEffect } from "react";
import { getProfile, addChatMessage, clearDailyChatHistory, isMemberActive, startFreeTrial, updateProfile } from "@/lib/profile";
import type { VentMessage, VentResponse, UserProfile } from "@/types";

export default function VentChat() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<VentMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const p = getProfile();
    setProfile(p);
    setMessages(p.conversationHistory || []);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const memberActive = profile ? isMemberActive() : false;

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

  const handleStartTrial = () => {
    startFreeTrial();
    const p = getProfile();
    setProfile(p);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!profile) {
    return (
      <div className="mystic-card rounded-3xl p-8 text-center">
        <p className="text-indigo-800 text-sm">Loading your profile...</p>
      </div>
    );
  }

  // Not a member
  if (!memberActive) {
    return (
      <div className="mystic-card rounded-3xl p-8 text-center space-y-4">
        <div className="text-4xl">🍵</div>
        <h3 className="text-xl font-bold text-indigo-900">Talk to Clara</h3>
        <p className="text-indigo-800/70 text-sm max-w-md mx-auto leading-relaxed">
          Sometimes you just need someone who listens. Clara uses Eastern wisdom to help you make sense of hard days — no judgment, just warmth.
        </p>
        <p className="text-xs text-earth-500">
          Your words stay on your device. Clara never sees them — only the AI responds, then forgets.
        </p>
        <button
          onClick={handleStartTrial}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-500 text-white font-semibold text-sm hover:from-gold-500 hover:to-gold-400 transition-all shadow-lg"
        >
          Start 7-Day Free Trial
        </button>
        <p className="text-xs text-indigo-800/50">Then $6.99/month. Cancel anytime.</p>
      </div>
    );
  }

  return (
    <div className="mystic-card rounded-3xl p-6 flex flex-col h-[520px]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <div className="w-10 h-10 rounded-full bg-indigo-800 flex items-center justify-center text-lg">
          🍵
        </div>
        <div>
          <h3 className="font-semibold text-indigo-900 text-sm">Clara</h3>
          <p className="text-xs text-earth-500">Your Eastern wellness companion</p>
        </div>
        <button
          onClick={handleClearChat}
          className="ml-auto text-xs text-earth-500 hover:text-rose-500 transition-colors"
          title="Clear today's chat"
        >
          Clear today&rsquo;s chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-3">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-indigo-800/60">
              Tell Clara what&rsquo;s on your mind today...
            </p>
            <p className="text-xs text-indigo-800/40 mt-1">
              Your words stay on your device only.
            </p>
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
            <div className="clara-bubble px-4 py-2.5 text-sm text-cream-100/70 italic">
              Clara is listening...
            </div>
          </div>
        )}
        {error && (
          <div className="text-center text-xs text-rose-500">{error}</div>
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
          placeholder="Tell Clara what's on your mind..."
          className="flex-1 px-4 py-3 rounded-2xl bg-cream-100 border border-cream-300 text-indigo-900 text-sm placeholder:text-earth-400 focus:outline-none focus:border-gold-400 transition-colors"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="px-5 py-3 rounded-2xl bg-indigo-800 text-cream-100 font-medium text-sm hover:bg-indigo-900 disabled:opacity-40 transition-all shrink-0"
        >
          Send
        </button>
      </div>

      {/* Privacy notice */}
      <p className="text-xs text-indigo-800/40 text-center mt-2 shrink-0">
        Your conversations stay on your device. Cleared daily. This is wellness guidance, not therapy.
      </p>
    </div>
  );
}
