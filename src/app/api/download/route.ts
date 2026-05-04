import { logDownload } from "@/lib/analytics";
import { NextRequest, NextResponse } from "next/server";

const APK_URL = "https://expo.dev/artifacts/eas/2iNeXXukeVYGfvq3NVJLwB.apk";

export async function GET(req: NextRequest) {
  logDownload({
    timestamp: new Date().toISOString(),
    ip: req.headers.get("x-forwarded-for") || "",
    userAgent: req.headers.get("user-agent") || "",
  });
  return NextResponse.redirect(APK_URL);
}
