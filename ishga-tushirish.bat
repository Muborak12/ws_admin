@echo off
chcp 65001 > nul
title XON BOZOR - Zamonaviy E-Commerce & Admin Panel
color 0b
cls
echo =====================================================================
echo              XON BOZOR - E-COMMERCE & ADMIN PANEL
echo =====================================================================
echo.
echo  [1] Brauzer ochilmoqda: http://localhost:3000
start http://localhost:3000

echo.
echo  =====================================================================
echo   TEST HISOBLARI:
echo   - ADMIN:  admin@shop.uz  / parol: admin123  (Avtomatik /admin ga o'tadi)
echo   - MIJOZ:  user@shop.uz   / parol: user123   (Asosiy do'konga o'tadi)
echo  =====================================================================
echo.
echo  [2] Next.js Dev Server ishga tushirilmoqda...
echo.

npm run dev
pause
