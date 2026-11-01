"use client";

import React, { useState, useEffect } from "react";
import {
  Palette,
  Save,
  Loader2,
  Type,
  Phone,
  UploadCloud,
  Terminal,
  LayoutTemplate,
  Eye,
  EyeOff,
  Layers,
  GitBranch,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface LayoutBlocks {
  announcementBar: { enabled: boolean; title: string };
  heroBanner: { enabled: boolean; title: string };
  categoryChips: { enabled: boolean; title: string };
  filtersBar: { enabled: boolean; title: string };
  productGrid: { enabled: boolean; title: string };
  featuresBar: { enabled: boolean; title: string };
  footer: { enabled: boolean; title: string };
}

export default function AdminSettingsPage() {
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pushingGit, setPushingGit] = useState(false);
  const [gitLogs, setGitLogs] = useState<string[]>([]);

  // Git State
  const [gitRemoteUrl, setGitRemoteUrl] = useState("");
  const [gitBranch, setGitBranch] = useState("main");
  const [gitCommitMsg, setGitCommitMsg] = useState("");
  const [gitInfo, setGitInfo] = useState<{
    hasGit?: boolean;
    remoteUrl?: string;
    branch?: string;
    lastCommit?: string;
  } | null>(null);

  // Settings State
  const [siteName, setSiteName] = useState("WS");
  const [brandTagline, setBrandTagline] = useState("Luxury & Modern E-Commerce");
  const [heroTitle, setHeroTitle] = useState("Eksklyuziv uslub va premium texnologiyalar");
  const [heroSubtitle, setHeroSubtitle] = useState("WS platformasi orqali sara mahsulotlarni xarid qiling.");
  const [announcement, setAnnouncement] = useState("WS maxsus mavsumiy kolleksiyasi va 30% gacha chegirmalar");
  const [phone, setPhone] = useState("+998 71 200 00 00");
  const [email, setEmail] = useState("contact@ws-store.uz");
  const [address, setAddress] = useState("Toshkent shahri, Amir Temur shox ko'chasi, WS Plaza");

  // Colors
  const [primaryBrown, setPrimaryBrown] = useState("#3b2219");
  const [darkEspresso, setDarkEspresso] = useState("#20120d");
  const [softPink, setSoftPink] = useState("#fdf2f4");
  const [accentRose, setAccentRose] = useState("#e07a8b");

  // Layout Blocks (Stitch AI style visual toggles)
  const [blocks, setBlocks] = useState<LayoutBlocks>({
    announcementBar: { enabled: true, title: "Aksiya e'loni" },
    heroBanner: { enabled: true, title: "Bosh banner (Hero)" },
    categoryChips: { enabled: true, title: "Kategoriyalar saralashi" },
    filtersBar: { enabled: true, title: "Filtrlar va saralash paneli" },
    productGrid: { enabled: true, title: "Mahsulotlar katalogi" },
    featuresBar: { enabled: true, title: "Afzalliklar bo'limi (Kafolat, Yetkazish)" },
    footer: { enabled: true, title: "Sayt pastki qismi (Footer)" },
  });

  const loadGitInfo = () => {
    fetch("/api/admin/git-push")
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setGitInfo(data);
          if (data.remoteUrl) setGitRemoteUrl(data.remoteUrl);
          if (data.branch) setGitBranch(data.branch);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadGitInfo();

    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setSiteName(data.siteName || "WS");
          setBrandTagline(data.brandTagline || "Luxury & Modern E-Commerce");
          setHeroTitle(data.heroTitle || "Eksklyuziv uslub va premium texnologiyalar");
          setHeroSubtitle(data.heroSubtitle || "");
          setAnnouncement(data.announcement || "");
          setPhone(data.phone || "+998 71 200 00 00");
          setEmail(data.email || "contact@ws-store.uz");
          setAddress(data.address || "Toshkent shahri, WS Plaza");

          if (data.theme) {
            setPrimaryBrown(data.theme.primaryBrown || "#3b2219");
            setDarkEspresso(data.theme.darkEspresso || "#20120d");
            setSoftPink(data.theme.softPink || "#fdf2f4");
            setAccentRose(data.theme.accentRose || "#e07a8b");
          }

          if (data.blocks) {
            setBlocks(data.blocks);
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleBlock = (key: keyof LayoutBlocks) => {
    setBlocks((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        enabled: !prev[key].enabled,
      },
    }));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        siteName,
        brandTagline,
        heroTitle,
        heroSubtitle,
        announcement,
        phone,
        email,
        address,
        theme: {
          primaryBrown,
          darkEspresso,
          softPink,
          accentRose,
        },
        blocks,
      };

      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Sayt tuzilishi, bloklari va ranglari barcha jildlarga muvaffaqiyatli saqlandi!");
      } else {
        toast.error("Sozlamalarni saqlashda xatolik");
      }
    } catch {
      toast.error("Server bilan aloqada xatolik");
    } finally {
      setSaving(false);
    }
  };

  const handleGitPush = async () => {
    setPushingGit(true);
    setGitLogs(["🚀 Git buyruqlari bajarilmoqda..."]);
    try {
      const res = await fetch("/api/admin/git-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commitMessage:
            gitCommitMsg.trim() ||
            `WS Yangilanishlari: ${new Date().toLocaleString("uz-UZ")}`,
          remoteUrl: gitRemoteUrl.trim() || undefined,
          branch: gitBranch.trim() || "main",
        }),
      });
      const data = await res.json();
      if (data.logs) {
        setGitLogs(data.logs);
      }
      if (data.success) {
        toast.success(data.message || "Gitga muvaffaqiyatli push qilindi!");
        loadGitInfo();
      } else {
        toast.error(data.error || "Git pushda xatolik");
      }
    } catch {
      toast.error("Git amallarida xatolik yuz berdi");
    } finally {
      setPushingGit(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-[#e07a8b] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl w-full mx-auto space-y-8 bg-[#1c0f0a] min-h-screen text-[#fdf2f4]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-[#281813]/90 border border-[#fbcfe8]/15 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3b2219] to-[#e07a8b] p-0.5 shadow-lg">
            <div className="w-full h-full rounded-[14px] bg-[#1c0f0a] flex items-center justify-center">
              <Palette className="w-6 h-6 text-[#e07a8b]" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black text-white">
              Dizayn, Tuzilishi (Layout) & Sozlamalar
            </h1>
            <p className="text-xs text-[#fbcfe8]/70">
              Sayt bloklarini tahrirlash, olib tashlash va Gitga avtomatik push qilish
            </p>
          </div>
        </div>
      </div>

      {/* GitHub / Git Push Section */}
      <div className="p-6 rounded-3xl bg-[#25140d]/90 border border-[#fbcfe8]/15 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[#e07a8b]" />
            GitHub Repozitoriyasi & Avtomatik Push
          </h2>
          {gitInfo?.lastCommit && (
            <span className="text-[11px] font-mono text-[#fbcfe8]/60 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
              So'nggi commit: {gitInfo.lastCommit}
            </span>
          )}
        </div>

        <p className="text-xs text-[#fbcfe8]/70">
          Admin panelda qilingan barcha o'zgarishlar (bloklar, ranglar, matnlar) ushbu tugma orqali to'g'ridan-to'g'ri GitHub repozitoriyangizga push qilinadi.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-[#fbcfe8]/80 mb-1">
              GitHub Repozitoriya URL (Remote origin)
            </label>
            <input
              type="text"
              value={gitRemoteUrl}
              onChange={(e) => setGitRemoteUrl(e.target.value)}
              placeholder="https://github.com/foydalanuvchi/repo-nomi.git"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c0f0a] border border-[#fbcfe8]/15 text-white text-xs font-mono focus:outline-none focus:border-[#e07a8b]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#fbcfe8]/80 mb-1">
              Branch (Filial)
            </label>
            <input
              type="text"
              value={gitBranch}
              onChange={(e) => setGitBranch(e.target.value)}
              placeholder="main"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c0f0a] border border-[#fbcfe8]/15 text-white text-xs font-mono focus:outline-none focus:border-[#e07a8b]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-[#fbcfe8]/80 mb-1">
              Commit xabari (ixtiyoriy)
            </label>
            <input
              type="text"
              value={gitCommitMsg}
              onChange={(e) => setGitCommitMsg(e.target.value)}
              placeholder="WS yangilanishlari: Dizayn va sozlamalar"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c0f0a] border border-[#fbcfe8]/15 text-white text-xs focus:outline-none focus:border-[#e07a8b]"
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleGitPush}
              disabled={pushingGit}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#c59b6d] to-[#8c583e] hover:opacity-95 text-white text-xs font-black shadow-lg shadow-[#8c583e]/30 transition-all disabled:opacity-50 border border-white/20 flex items-center justify-center gap-2"
            >
              {pushingGit ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UploadCloud className="w-4 h-4" />
              )}
              <span>Gitga Avtomatik Push Qilish</span>
            </button>
          </div>
        </div>

        {/* Git Logs Terminal Preview */}
        {gitLogs.length > 0 && (
          <div className="p-4 rounded-2xl bg-[#140b07] border border-[#fbcfe8]/20 font-mono text-xs space-y-1 shadow-inner mt-3">
            <div className="flex items-center gap-2 text-[#e07a8b] font-bold mb-2 pb-1.5 border-b border-[#fbcfe8]/10">
              <Terminal className="w-3.5 h-3.5" />
              <span>Git Operatsiyalari Natijasi:</span>
            </div>
            {gitLogs.map((line, i) => (
              <div key={i} className="text-[#fdf2f4]/80 text-[11px]">
                {line}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* Stitch AI Style: Layout Block Editor */}
        <div className="p-6 rounded-3xl bg-[#25140d]/90 border border-[#fbcfe8]/15 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <LayoutTemplate className="w-4 h-4 text-[#e07a8b]" />
              Sayt Tuzilishi (Layout Bloklari: Yoqish / Olib Tashlash)
            </h2>
            <span className="text-[11px] text-[#fbcfe8]/60 font-medium">
              Xohlagan qismni yoqishingiz yoki o'chirishingiz mumkin
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
            {(Object.keys(blocks) as Array<keyof LayoutBlocks>).map((key) => {
              const b = blocks[key];
              return (
                <div
                  key={key}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    b.enabled
                      ? "bg-[#331a12] border-[#e07a8b]/40 text-white shadow-md"
                      : "bg-[#1f0f0a] border-[#fbcfe8]/10 text-[#fbcfe8]/40 opacity-70"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Layers className="w-4 h-4 text-[#e07a8b] shrink-0" />
                    <span className="text-xs font-bold truncate">{b.title}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleBlock(key)}
                    className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      b.enabled
                        ? "bg-[#e07a8b]/20 text-[#e07a8b] hover:bg-[#e07a8b]/30"
                        : "bg-white/5 text-[#fbcfe8]/40 hover:text-white"
                    }`}
                  >
                    {b.enabled ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Faol</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>O'chirilgan</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Colors Palette Section */}
        <div className="p-6 rounded-3xl bg-[#25140d]/90 border border-[#fbcfe8]/15 shadow-xl space-y-4">
          <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#e07a8b]" />
            Sayt Ranglar Palitrasi (Jigarrang & Och Pushti)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#1c0f0a] border border-[#fbcfe8]/10 space-y-2">
              <label className="block text-[11px] font-bold text-[#fbcfe8]/80">
                Bosh Jigarrang (Primary)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryBrown}
                  onChange={(e) => setPrimaryBrown(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs font-mono font-bold text-white uppercase">
                  {primaryBrown}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#1c0f0a] border border-[#fbcfe8]/10 space-y-2">
              <label className="block text-[11px] font-bold text-[#fbcfe8]/80">
                Quyuq Espresso Foni
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={darkEspresso}
                  onChange={(e) => setDarkEspresso(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs font-mono font-bold text-white uppercase">
                  {darkEspresso}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#1c0f0a] border border-[#fbcfe8]/10 space-y-2">
              <label className="block text-[11px] font-bold text-[#fbcfe8]/80">
                Juda Och Pushti (Soft Pink)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={softPink}
                  onChange={(e) => setSoftPink(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs font-mono font-bold text-white uppercase">
                  {softPink}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#1c0f0a] border border-[#fbcfe8]/10 space-y-2">
              <label className="block text-[11px] font-bold text-[#fbcfe8]/80">
                Atirgul Pushti (Accent Rose)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={accentRose}
                  onChange={(e) => setAccentRose(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs font-mono font-bold text-white uppercase">
                  {accentRose}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Texts & Headings Section */}
        <div className="p-6 rounded-3xl bg-[#25140d]/90 border border-[#fbcfe8]/15 shadow-xl space-y-4">
          <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Type className="w-4 h-4 text-[#e07a8b]" />
            Sayt Matnlari va Sarlavhalari
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#fbcfe8]/80 mb-1.5">
                Sayt Nomi (Brand)
              </label>
              <input
                type="text"
                required
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#1c0f0a] border border-[#fbcfe8]/15 text-white text-xs font-bold focus:outline-none focus:border-[#e07a8b]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#fbcfe8]/80 mb-1.5">
                Qisqa Shior (Tagline)
              </label>
              <input
                type="text"
                value={brandTagline}
                onChange={(e) => setBrandTagline(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#1c0f0a] border border-[#fbcfe8]/15 text-white text-xs focus:outline-none focus:border-[#e07a8b]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#fbcfe8]/80 mb-1.5">
                Asosiy Banner Sarlavhasi (Hero Title)
              </label>
              <input
                type="text"
                required
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#1c0f0a] border border-[#fbcfe8]/15 text-white text-xs font-bold focus:outline-none focus:border-[#e07a8b]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#fbcfe8]/80 mb-1.5">
                Banner Ostidagi Tavsif (Hero Subtitle)
              </label>
              <textarea
                rows={2}
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#1c0f0a] border border-[#fbcfe8]/15 text-white text-xs focus:outline-none focus:border-[#e07a8b] resize-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#fbcfe8]/80 mb-1.5">
                Yuqori Aksiya E'loni (Announcement)
              </label>
              <input
                type="text"
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#1c0f0a] border border-[#fbcfe8]/15 text-white text-xs focus:outline-none focus:border-[#e07a8b]"
              />
            </div>
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="p-6 rounded-3xl bg-[#25140d]/90 border border-[#fbcfe8]/15 shadow-xl space-y-4">
          <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#e07a8b]" />
            Aloqa Ma'lumotlari
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#fbcfe8]/80 mb-1.5">
                Telefon Raqami
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#1c0f0a] border border-[#fbcfe8]/15 text-white text-xs font-mono focus:outline-none focus:border-[#e07a8b]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#fbcfe8]/80 mb-1.5">
                Elektron Pochta (Email)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#1c0f0a] border border-[#fbcfe8]/15 text-white text-xs font-mono focus:outline-none focus:border-[#e07a8b]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#fbcfe8]/80 mb-1.5">
                Do'kon Manzili
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#1c0f0a] border border-[#fbcfe8]/15 text-white text-xs focus:outline-none focus:border-[#e07a8b]"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#e07a8b] to-[#3b2219] hover:opacity-95 text-white font-black text-xs sm:text-sm shadow-xl shadow-[#3b2219]/50 transition-all flex items-center gap-2 disabled:opacity-50 border border-[#fbcfe8]/20"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Barcha O'zgarishlarni Saqlash</span>
          </button>
        </div>
      </form>
    </div>
  );
}
