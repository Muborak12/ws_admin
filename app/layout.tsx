import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import LiveChatWidget from "@/components/LiveChatWidget";

export const metadata: Metadata = {
  title: "WS — Luxury E-Commerce & Smart Store",
  description:
    "WS zamonaviy do'koni. Eng sara smartfonlar, flagman noutbuklar va eksklyuziv aksessuarlar. Rasmiy kafolat va bepul yetkazib berish.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#20120d",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className="scroll-smooth">
      <body className="bg-[#20120d] text-[#fdf2f4] min-h-screen antialiased selection:bg-[#e07a8b] selection:text-white font-sans">
        <Providers>
          {children}
          {/* Real-time WebSocket Live Chat for Customers */}
          <LiveChatWidget />
        </Providers>
      </body>
    </html>
  );
}
