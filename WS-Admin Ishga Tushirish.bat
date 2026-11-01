@echo off
chcp 65001 > nul
title WS - Admin Boshqaruv Paneli
color 0e
cls
echo =====================================================================
echo              WS - ADMIN BOSHQARUV PANELI
echo =====================================================================
echo.
echo  [1] WS-Admin katalogiga o'tilmoqda...
cd /d "%~dp0"

echo  [2] Brauzerda Admin Panel ochilmoqda: http://localhost:3002/admin
start http://localhost:3002/admin

echo.
echo  =====================================================================
echo   ADMIN LOGIN MA'LUMOTLARI:
echo   - Email:   admin@shop.uz
echo   - Parol:   admin123
echo.
echo   FUNKSIYALAR:
echo   - 💬 Jonli Chat: Mijozlar bilan real-vaqtda yozishish (/admin/chat)
echo   - 🎨 Dizayn & Bloklar: Sayt ranglari va bloklarini o'zgartirish (/admin/settings)
echo   - 🚀 Git Auto Push: Saytni to'g'ridan-to'g'ri Gitga push qilish tugmasi
echo   - 📦 Mahsulotlar & Kategoriyalar CRUD
echo   - 🛒 Buyurtmalar statusini o'zgartirish
echo  =====================================================================
echo.
echo  [3] Admin Serveri ishga tushmoqda (Port 3002)...
echo.

node ./node_modules/next/dist/bin/next dev -p 3002
pause
