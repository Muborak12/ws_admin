import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const configPath = path.join(process.cwd(), "data", "site-config.json");

export async function GET() {
  try {
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, "utf-8");
      return NextResponse.json(JSON.parse(data));
    }
  } catch (err) {
    // fallback
  }
  return NextResponse.json({
    siteName: "WS",
    heroTitle: "Eksklyuziv uslub va premium texnologiyalar",
    heroSubtitle: "WS platformasi orqali sara mahsulotlarni xarid qiling.",
    announcement: "Mavsumiy chegirmalar davom etmoqda",
    phone: "+998 71 200 00 00",
    email: "contact@ws-store.uz",
    theme: {
      primaryBrown: "#3b2219",
      darkEspresso: "#23140f",
      softPink: "#fdf2f4",
      whisperPink: "#fae5e9",
      accentRose: "#e07a8b",
      goldAccent: "#c59b6d",
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    fs.writeFileSync(configPath, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ success: true, config: body });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Sozlamalarni saqlashda xatolik" },
      { status: 500 }
    );
  }
}
