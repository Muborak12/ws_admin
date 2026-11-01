import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const historyFile = path.join(process.cwd(), "data", "chat-history.json");

function getMessages() {
  try {
    if (fs.existsSync(historyFile)) {
      return JSON.parse(fs.readFileSync(historyFile, "utf-8"));
    }
  } catch (e) {}
  return [];
}

function saveMessages(msgs: any[]) {
  try {
    fs.writeFileSync(historyFile, JSON.stringify(msgs, null, 2), "utf-8");
  } catch (e) {}
}

export async function GET() {
  const msgs = getMessages();
  return NextResponse.json(msgs);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const msgs = getMessages();
    const newMsg = {
      id: Date.now() + "_" + Math.random().toString(36).slice(2, 7),
      sender: data.sender || "Foydalanuvchi",
      role: data.role || "customer",
      userId: data.userId || "guest",
      text: data.text,
      time: new Date().toLocaleTimeString("uz-UZ", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      createdAt: new Date().toISOString(),
    };
    msgs.push(newMsg);
    saveMessages(msgs);
    return NextResponse.json({ success: true, message: newMsg });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
