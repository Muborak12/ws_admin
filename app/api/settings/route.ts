import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const targetPaths = [
  path.join(process.cwd(), "data", "site-config.json"),
  "C:\\Users\\Hp\\Desktop\\WS-Store\\data\\site-config.json",
  "C:\\Users\\Hp\\Desktop\\WS-Admin\\data\\site-config.json",
  "C:\\Users\\Hp\\Desktop\\xon-bozor\\xon-bozor\\data\\site-config.json",
];

export async function GET() {
  for (const cfgPath of targetPaths) {
    try {
      if (fs.existsSync(cfgPath)) {
        const raw = fs.readFileSync(cfgPath, "utf-8");
        return NextResponse.json(JSON.parse(raw));
      }
    } catch {
      // Continue to next path
    }
  }

  return NextResponse.json({
    siteName: "WS",
    brandTagline: "Luxury & Modern E-Commerce",
    heroTitle: "Eksklyuziv uslub va premium texnologiyalar",
    heroSubtitle: "WS platformasi orqali eng sara mahsulotlarni xarid qiling.",
    announcement: "WS maxsus mavsumiy kolleksiyasi va 30% gacha chegirmalar",
    phone: "+998 71 200 00 00",
    email: "contact@ws-store.uz",
    address: "Toshkent shahri, WS Plaza",
    theme: {
      primaryBrown: "#3b2219",
      darkEspresso: "#20120d",
      softPink: "#fdf2f4",
      whisperPink: "#fae5e9",
      accentRose: "#e07a8b",
      goldAccent: "#c59b6d",
    },
    blocks: {
      announcementBar: { enabled: true, title: "Aksiya e'loni" },
      heroBanner: { enabled: true, title: "Bosh banner (Hero)" },
      categoryChips: { enabled: true, title: "Kategoriyalar saralashi" },
      filtersBar: { enabled: true, title: "Filtrlar va saralash paneli" },
      productGrid: { enabled: true, title: "Mahsulotlar katalogi" },
      featuresBar: { enabled: true, title: "Afzalliklar bo'limi (Kafolat, Yetkazish)" },
      footer: { enabled: true, title: "Sayt pastki qismi (Footer)" },
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const jsonStr = JSON.stringify(body, null, 2);

    let savedCount = 0;
    for (const cfgPath of targetPaths) {
      try {
        const dir = path.dirname(cfgPath);
        if (fs.existsSync(dir) || cfgPath.includes(process.cwd())) {
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          fs.writeFileSync(cfgPath, jsonStr, "utf-8");
          savedCount++;
        }
      } catch {
        // Continue saving to others
      }
    }

    return NextResponse.json({
      success: true,
      config: body,
      syncedLocations: savedCount,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Sozlamalarni saqlashda xatolik" },
      { status: 500 }
    );
  }
}
