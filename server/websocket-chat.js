const { WebSocketServer, WebSocket } = require("ws");
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.WS_PORT || 3005;
const HISTORY_FILE = path.join(__dirname, "..", "data", "chat-history.json");

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

  if (req.url === "/clear" && req.method === "POST") {
    messages = [];
    saveMessages([]);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: true }));
    return;
  }

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WS Live Chat Server running.");
});

const wss = new WebSocketServer({ server });
const clients = new Map(); // ws -> client info

wss.on("connection", (ws) => {
  // Send existing history to the newly connected client
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
        const text = data.text?.trim();
        if (!text) return;

        const newMsg = {
          id: data.id || Date.now() + "_" + Math.random().toString(36).slice(2, 8),
          sender: data.sender || (data.role === "admin" ? "WS Admin" : "Mijoz"),
          role: data.role || "customer", // 'customer' yoki 'admin'
          userId: data.userId || "guest",
          text,
          time: new Date().toLocaleTimeString("uz-UZ", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          createdAt: new Date().toISOString(),
        };

        // Dublikat bo'lmasligi uchun tekshirish
        const alreadyExists = messages.some((m) => m.id === newMsg.id);
        if (!alreadyExists) {
          messages.push(newMsg);
          if (messages.length > 300) messages = messages.slice(-300);
          saveMessages(messages);
        }

        // Barcha ulangan klientlarga (mijoz va adminlarga) xabarni yuborish
        const broadcastPayload = JSON.stringify({
          type: "NEW_MESSAGE",
          message: newMsg,
        });

        for (const [clientWs] of clients) {
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(broadcastPayload);
          }
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
