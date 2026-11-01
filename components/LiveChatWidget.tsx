"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  CheckCheck,
  Bot,
  UserCheck,
  HelpCircle,
  Minimize2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface ChatMessage {
  id: string;
  sender: string;
  role: "customer" | "admin";
  userId?: string;
  text: string;
  time: string;
  createdAt?: string;
}

const QUICK_QUESTIONS = [
  "Yetkazib berish qancha vaqt oladi?",
  "Kafolat bormi va qanday shartlarda?",
  "Bo'lib to'lash (muddatli to'lov) mavjudmi?",
  "Bugun buyurtma bersam qachon keladi?",
  "Tovarni almashtirish yoki qaytarish shartlari qanday?",
];

export default function LiveChatWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Load history from API route on mount
  useEffect(() => {
    fetch("/api/chat")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setMessages(data);
        } else {
          // Welcome default greeting
          setMessages([
            {
              id: "welcome",
              sender: "WS Konsultant",
              role: "admin",
              text: "Assalomu alaykum! WS rasmiy do'koniga xush kelibsiz. Sizga mahsulot tanlashda yoki yetkazib berishda qanday yordam bera olamiz? Quyidagi tayyor savollardan birini tanlashingiz yoki o'zingiz yozishingiz mumkin.",
              time: new Date().toLocaleTimeString("uz-UZ", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ]);
        }
      })
      .catch(() => {});
  }, []);

  // Connect to WebSocket server
  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimeout: any;

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
              role: "customer",
              userId: user?.id ? String(user.id) : "guest_" + Math.random().toString(36).slice(2, 6),
              userName: user?.name || "Mijoz",
            })
          );
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === "INIT_HISTORY" && Array.isArray(data.messages)) {
              if (data.messages.length > 0) {
                setMessages(data.messages);
              }
            } else if (data.type === "NEW_MESSAGE") {
              setMessages((prev) => [...prev, data.message]);
              if (!isOpen) {
                setUnreadCount((c) => c + 1);
              }
            }
          } catch (e) {}
        };

        ws.onclose = () => {
          setIsConnected(false);
          // Auto reconnect after 3 seconds
          reconnectTimeout = setTimeout(connect, 3000);
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
      clearTimeout(reconnectTimeout);
      if (socketRef.current) socketRef.current.close();
    };
  }, [user?.id, user?.name, isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const payload = {
      type: "SEND_MESSAGE",
      sender: user?.name || "Mijoz",
      role: "customer",
      userId: user?.id ? String(user.id) : "guest",
      text,
    };

    // If WS connected
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
    } else {
      // Fallback: send via REST API
      fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((r) => r.json())
        .then((res) => {
          if (res.message) {
            setMessages((prev) => [...prev, res.message]);
          }
        });
    }

    setInputText("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setUnreadCount(0);
          }}
          className="relative group p-4 rounded-3xl bg-gradient-to-tr from-[#3b2219] via-[#4d2c20] to-[#e07a8b] text-[#fdf2f4] shadow-2xl shadow-[#3b2219]/60 hover:scale-105 active:scale-95 transition-all duration-300 border border-[#fce7ea]/25 flex items-center gap-3"
          title="WS Jonli Yordamchi"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6 text-[#fdf2f4]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#3b2219]" />
          </div>
          <span className="text-xs font-bold tracking-wide hidden sm:inline text-white">
            WS Yordamchi
          </span>

          {unreadCount > 0 && (
            <span className="absolute -top-2 -left-2 px-2 py-0.5 rounded-full bg-[#e07a8b] text-white text-[10px] font-black shadow-lg animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-96 h-[550px] rounded-3xl bg-[#281813]/95 backdrop-blur-2xl border border-[#fbcfe8]/20 shadow-2xl flex flex-col justify-between overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#3b2219] via-[#46281e] to-[#281813] border-b border-[#fbcfe8]/15 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#e07a8b] to-[#c59b6d] p-0.5 shadow-lg">
                <div className="w-full h-full rounded-[14px] bg-[#281813] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#fbcfe8]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black tracking-tight text-white">
                    WS Jonli Chat
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[11px] text-[#fbcfe8]/70">
                  {isConnected ? "Admin & Konsultant onlayn" : "Ulanmoqda..."}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-[#fbcfe8]/70 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
            {messages.map((msg) => {
              const isMe = msg.role === "customer";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-semibold text-[#fbcfe8]/60">
                      {isMe ? "Siz" : msg.sender || "WS Admin"}
                    </span>
                    <span className="text-[9px] text-white/30 font-mono">
                      {msg.time}
                    </span>
                  </div>

                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-md ${
                      isMe
                        ? "bg-gradient-to-r from-[#e07a8b] to-[#cf6274] text-white rounded-tr-xs"
                        : "bg-[#3e241b] border border-[#fbcfe8]/15 text-[#fdf2f4] rounded-tl-xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions / FAQ Options Chips */}
          <div className="p-3 bg-[#20120d]/80 border-t border-[#fbcfe8]/10 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#fbcfe8]/80">
              <HelpCircle className="w-3.5 h-3.5 text-[#e07a8b]" />
              <span>Tezkor savol tanlash:</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {QUICK_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="px-3 py-1.5 rounded-xl bg-[#3b2219]/90 hover:bg-[#e07a8b] hover:text-white border border-[#fbcfe8]/20 text-[#fbcfe8] text-[11px] whitespace-nowrap transition-all duration-200 active:scale-95"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#281813] border-t border-[#fbcfe8]/15 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Savolingizni yozing..."
              className="flex-1 px-4 py-2.5 rounded-2xl bg-[#1b0d09] border border-[#fbcfe8]/15 text-[#fdf2f4] placeholder-[#fbcfe8]/40 text-xs focus:outline-none focus:border-[#e07a8b] transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-2xl bg-gradient-to-r from-[#e07a8b] to-[#3b2219] hover:opacity-90 text-white shadow-lg disabled:opacity-40 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
