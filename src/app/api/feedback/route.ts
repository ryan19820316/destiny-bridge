import { NextRequest, NextResponse } from "next/server";
import { mkdir, appendFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, category, source } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      message: message.trim().slice(0, 2000),
      category: category || "other",
      source: source || "unknown",
      timestamp: new Date().toISOString(),
      userAgent: req.headers.get("user-agent") || "unknown",
    };

    // Log for Railway visibility
    console.log("[feedback]", JSON.stringify(entry));

    // Write to JSONL file
    const dataDir = path.join(process.cwd(), "data");
    await mkdir(dataDir, { recursive: true });
    await appendFile(
      path.join(dataDir, "feedbacks.jsonl"),
      JSON.stringify(entry) + "\n",
      "utf-8"
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Feedback API error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
