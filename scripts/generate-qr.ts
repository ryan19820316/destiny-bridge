import QRCode from "qrcode";
import sharp from "sharp";
import { writeFileSync, readFileSync } from "fs";

const url = "https://destiny-bridge-production.up.railway.app";

async function main() {
  const svg = await QRCode.toString(url, {
    type: "svg",
    width: 1024,
    margin: 2,
    color: { dark: "#d4a240", light: "#0b0b10" },
  });
  writeFileSync("public/qr-website.svg", svg);
  console.log("Generated public/qr-website.svg");

  await sharp(Buffer.from(svg)).png().toFile("public/qr-website.png");
  console.log("Generated public/qr-website.png (1024x1024)");
}

main().catch(console.error);
