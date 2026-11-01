const { WebSocketServer, WebSocket } = require("ws");
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.WS_PORT || 3005;
const HISTORY_FILE = path.join(__dirname, "..", "data", "chat-history.json");

// Ensure data folder and file exists
function loadMessages() {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      return JSON.parse(fs.readFileSync(HISTORY_FILE, "utf-8"));
    }
  } catch (e) {}
  return [];
}

function saveMessages(msgs) {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(msgs, null, 2), "utf-8");
  } catch (e) {}
}

let messages = loadMessages();

// HTTP server to serve recent messages via REST if needed
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === "/messages" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(messages));
    return;
  }

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WS Chat Server is active.");
});

const wss = new WebSocketServer({ server });

const clients = new Map(); // ws -> { role, userId, userName }

// Quick automated FAQ responses when admin is busy
const FAQ_ANSWERS = {
  "Yetkazib berish qancha vaqt oladi?":
    "Toshkent bo'ylab yetkazib berish 3-6 soat ichida, butun O'zbekiston viloyatlari bo'ylab esa 24 soat ichida bepul yetkaziladi! Kuryer yetib kelishidan oldin sizga qo'ng'iroq qiladi.",
  "Kafolat bormi va qanday shartlarda?":
    "Ha, albatta! WS do'konidagi barcha original mahsulotlarga 1 yillik rasmiy ishlab chiqaruvchi kafolati hamda 14 kunlik to'liq qaytarish/almashtirish kafolati beriladi.",
  "Bo'lib to'lash (muddatli to'lov) mavjudmi?":
    "Ha! Bizda Uzum Nasiya, Anorbank va Zoodpay orqali 3, 6 va 12 oylik foizsiz bo'lib to'lash imkoniyati mavjud. Hech qanday boshlang'ich to'lovsiz rasmiylashtirishingiz mumkin.",
  "Bugun buyurtma bersam qachon keladi?":
    "Bugun soat 18:00 gacha berilgan barcha buyurtmalar bugunning o'zida kuryerga topshiriladi va yetkazib berish jarayoni boshlanadi.",
  "Tovarni almashtirish yoki qaytarish shartlari qanday?":
    "Agar tovar sizga ma'qul kelmasa yoki nuqsoni aniqlansa, 14 kun ichida qadoq saqlangan holda bepul almashtirib olishingiz yoki pulingizni qaytarib olishingiz mumkin.",
};

wss.on("connection", (ws) => {
  // Send initial history
  ws.send(JSON.stringify({ type: "INIT_HISTORY", messages }));

  ws.on("message", (raw) => {
    try {
      const data = JSON.parse(raw.toString());

      if (data.type === "REGISTER") {
        clients.set(ws, {
          role: data.role || "customer",
          userId: data.userId || "guest",
          userName: data.userName || "Mijoz",
        });
        return;
      }

      if (data.type === "SEND_MESSAGE") {
        const newMsg = {
          id: Date.now() + "_" + Math.random().toString(36).slice(2, 7),
          sender: data.sender || "Mijoz",
          role: data.role || "customer", // 'customer' | 'admin'
          userId: data.userId || "guest",
          text: data.text,
          time: new Date().toLocaleTimeString("uz-UZ", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          createdAt: new Date().toISOString(),
        };

        messages.push(newMsg);
        if (messages.length > 200) messages = messages.slice(-200);
        saveMessages(messages);

        // Broadcast to all connected clients (both admins and customers)
        const broadcastPayload = JSON.stringify({
          type: "NEW_MESSAGE",
          message: newMsg,
        });

        for (const [clientWs] of clients) {
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(broadcastPayload);
          }
        }

        // Check if question matches automated FAQ
        if (data.role === "customer" && FAQ_ANSWERS[data.text.trim()]) {
          setTimeout(() => {
            const autoMsg = {
              id: Date.now() + "_auto",
              sender: "WS Konsultant (Admin)",
              role: "admin",
              userId: "admin_auto",
              text: FAQ_ANSWERS[data.text.trim()],
              time: new Date().toLocaleTimeString("uz-UZ", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              createdAt: new Date().toISOString(),
            };

            messages.push(autoMsg);
            saveMessages(messages);

            const autoPayload = JSON.stringify({
              type: "NEW_MESSAGE",
              message: autoMsg,
            });

            for (const [clientWs] of clients) {
              if (clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(autoPayload);
              }
            }
          }, 800);
        }
      }
    } catch (e) {
      console.error("WS error:", e);
    }
  });

  ws.on("close", () => {
    clients.delete(ws);
  });
});

server.listen(PORT, () => {
  console.log(`[WS Live Chat] WebSocket Server running on port ${PORT}`);
});
