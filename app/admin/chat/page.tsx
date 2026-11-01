"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Send,
  User,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Clock,
  CheckCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

interface ChatMessage {
  id: string;
  sender: string;
  role: "customer" | "admin";
  userId?: string;
  text: string;
  time: string;
  createdAt?: string;
}

export default function AdminChatPage() {
  const { user } = useAuth();
  const toast = useToast();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [replyText, setReplyText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load initial messages
  const loadHistory = async () => {
    try {
      const res = await fetch("/api/chat");
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
    } catch {}
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // Connect to WebSocket Server as Admin
  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimer: any;

    function connect() {
      try {
        const wsUrl =
          typeof window !== "undefined" && window.location.hostname
            ? `ws://${window.location.hostname}:3005`
            : "ws://localhost:3005";

        ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
          setIsConnected(true);
          ws.send(
            JSON.stringify({
              type: "REGISTER",
              role: "admin",
              userId: user?.id ? String(user.id) : "admin_1",
              userName: user?.name || "Admin",
            })
          );
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === "INIT_HISTORY" && Array.isArray(data.messages)) {
              if (data.messages.length > 0) setMessages(data.messages);
            } else if (data.type === "NEW_MESSAGE") {
              setMessages((prev) => [...prev, data.message]);
              if (data.message.role === "customer") {
                toast.info(`Mijozdan yangi xabar: "${data.message.text.slice(0, 30)}..."`);
              }
            }
          } catch (e) {}
        };

        ws.onclose = () => {
          setIsConnected(false);
          reconnectTimer = setTimeout(connect, 3000);
        };

        ws.onerror = () => {
          setIsConnected(false);
        };
      } catch (err) {
        setIsConnected(false);
      }
    }

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      if (socketRef.current) socketRef.current.close();
    };
  }, [user?.id, user?.name, toast]);

  const handleSendReply = () => {
    const text = replyText.trim();
    if (!text) return;

    const payload = {
      type: "SEND_MESSAGE",
      sender: user?.name || "WS Admin",
      role: "admin",
      userId: user?.id ? String(user.id) : "admin",
      text,
    };

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
    } else {
      fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((r) => r.json())
        .then((res) => {
          if (res.message) setMessages((prev) => [...prev, res.message]);
        });
    }

    setReplyText("");
  };

  return (
    <div className="p-8 max-w-5xl w-full mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-[#281813]/90 border border-[#fbcfe8]/15 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3b2219] to-[#e07a8b] p-0.5 shadow-lg">
            <div className="w-full h-full rounded-[14px] bg-[#1c0f0a] flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-[#e07a8b]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">
                WS Jonli Chat (Mijozlar bilan aloqa)
              </h1>
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`}
              />
            </div>
            <p className="text-xs text-[#fbcfe8]/70">
              {isConnected
                ? "WebSocket serveri faol. Real-vaqt rejimida xabarlar qabul qilinmoqda."
                : "Serverga ulanmoqda..."}
            </p>
          </div>
        </div>

        <button
          onClick={loadHistory}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#341b12] hover:bg-[#3e2116] border border-[#fbcfe8]/15 text-xs font-bold text-[#fbcfe8] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Yangilash</span>
        </button>
      </div>

      {/* Chat Messages Panel */}
      <div className="rounded-3xl bg-[#25140d]/95 border border-[#fbcfe8]/15 shadow-2xl flex flex-col h-[600px] overflow-hidden">
        
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-[#fbcfe8]/40 space-y-2">
              <MessageSquare className="w-12 h-12 text-[#3b2219]" />
              <p className="text-sm">Hozircha xabarlar mavjud emas.</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isAdminMsg = msg.role === "admin";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAdminMsg ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span
                      className={`text-[11px] font-bold ${
                        isAdminMsg ? "text-[#e07a8b]" : "text-[#c59b6d]"
                      }`}
                    >
                      {isAdminMsg ? `👑 ${msg.sender} (Siz)` : `👤 ${msg.sender}`}
                    </span>
                    <span className="text-[10px] text-[#fbcfe8]/40 font-mono">
                      {msg.time}
                    </span>
                  </div>

                  <div
                    className={`max-w-[75%] px-5 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-lg ${
                      isAdminMsg
                        ? "bg-gradient-to-r from-[#e07a8b] to-[#3b2219] text-white border border-[#fbcfe8]/20 rounded-tr-xs"
                        : "bg-[#351c13] border border-[#fbcfe8]/20 text-[#fdf2f4] rounded-tl-xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendReply();
          }}
          className="p-4 bg-[#1c0f0a] border-t border-[#fbcfe8]/15 flex items-center gap-3"
        >
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Mijozga admin nomidan javob yozing..."
            className="flex-1 px-5 py-3.5 rounded-2xl bg-[#2a1710] border border-[#fbcfe8]/15 text-white placeholder-[#fbcfe8]/40 text-xs sm:text-sm focus:outline-none focus:border-[#e07a8b] transition-all"
          />
          <button
            type="submit"
            disabled={!replyText.trim()}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#e07a8b] to-[#3b2219] hover:opacity-95 text-white font-bold text-xs shadow-xl disabled:opacity-40 transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Javob berish</span>
          </button>
        </form>
      </div>
    </div>
  );
}
