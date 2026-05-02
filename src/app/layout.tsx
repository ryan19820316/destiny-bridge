import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BaguaBackground from "@/components/BaguaBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_NAME = "DestinyBridge";
const SITE_URL = "https://destinybridge.app";
const TAGLINE = "Eastern Wellness for Modern Life";
const DESCRIPTION =
  "Personalized daily guidance based on ancient Eastern wisdom. Discover your Ba Zi chart, cast I Ching hexagrams, and get food, clothing, and wellness tips tailored to your energy — all in one place.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    "eastern wellness",
    "daily guidance",
    "i ching",
    "hexagram",
    "ba zi",
    "five elements",
    "feng shui",
    "wellness for moms",
    "holistic living",
    "daily horoscope",
    "energy reading",
    "crystal guide",
    "mindfulness",
    "self care",
    "ancient wisdom",
    "personal growth",
  ],
  authors: [{ name: "DestinyBridge" }],
  creator: "DestinyBridge",
  publisher: "DestinyBridge",
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${TAGLINE}`,
    description: DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DestinyBridge — Eastern Wellness for Modern Life",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${TAGLINE}`,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative">
        <BaguaBackground />
        <div className="relative z-[1] flex flex-col min-h-full">{children}</div>
      </body>
    </html>
  );
}
