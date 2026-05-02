"use client";

import { useState } from "react";
import Footer from "@/components/Footer";

export default function FeedbackPage() {
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<"bug" | "suggestion" | "other">("suggestion");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  const submit = async () => {
    if (!message.trim() || submitting) return;
    setSubmitting(true);
    setError(false);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim(), category, source: "web" }),
      });
      if (res.ok) {
        setDone(true);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <main className="flex-1 max-w-lg mx-auto px-6 py-20 w-full">
        <h1 className="text-2xl font-bold text-gold-300 mb-2">Feedback</h1>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          DestinyBridge combines Eastern wisdom with AI to provide comprehensive
          life guidance. Help us improve — share your thoughts or report issues.
        </p>

        {done ? (
          <div className="text-center py-8">
            <p className="text-green-400 text-sm mb-4">
              Thank you! Your feedback has been sent.
            </p>
            <button
              onClick={() => { setDone(false); setMessage(""); }}
              className="text-gold-300 text-sm underline hover:text-gold-200"
            >
              Send another
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-3">
              {(["suggestion", "bug", "other"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                    category === cat
                      ? "border-gold-400/30 bg-gold-400/10 text-gold-300"
                      : "border-[#333] bg-[#111] text-gray-400 hover:border-gray-600"
                  }`}
                >
                  {cat === "suggestion" ? "Suggestion" : cat === "bug" ? "Bug" : "Other"}
                </button>
              ))}
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your feedback..."
              rows={5}
              className="w-full bg-[#111] border border-[#333] rounded-xl p-4 text-white text-sm placeholder-gray-500 resize-none focus:outline-none focus:border-gold-400/50"
            />
            {error && (
              <p className="text-red-400 text-sm">Failed to send. Please try again.</p>
            )}
            <button
              onClick={submit}
              disabled={!message.trim() || submitting}
              className="w-full bg-gold-400 text-[#0a0a0a] font-semibold py-3 rounded-xl hover:bg-gold-300 disabled:opacity-40 transition-colors"
            >
              {submitting ? "Sending..." : "Send Feedback"}
            </button>
          </div>
        )}
      </main>
      <Footer lang="en" />
    </div>
  );
}
