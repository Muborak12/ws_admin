import { NextResponse } from "next/server";
import { exec } from "child_process";
import util from "util";

const execPromise = util.promisify(exec);

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const message =
      body.commitMessage ||
      `WS Admin yangilanishlari: ${new Date().toLocaleString("uz-UZ")}`;

    const logs: string[] = [];

    // 1. Git add
    try {
      const { stdout: addOut } = await execPromise("git add .", {
        cwd: process.cwd(),
      });
      if (addOut) logs.push(addOut);
      logs.push("✓ Barcha o'zgarishlar git indeksiga qo'shildi (git add .)");
    } catch (e: any) {
      logs.push(`! git add xabari: ${e.message}`);
    }

    // 2. Git commit
    try {
      const { stdout: commitOut } = await execPromise(
        `git commit -m "${message.replace(/"/g, '\\"')}"`,
        { cwd: process.cwd() }
      );
      if (commitOut) logs.push(commitOut);
      logs.push(`✓ Commit yaratildi: "${message}"`);
    } catch (e: any) {
      if (e.message?.includes("nothing to commit")) {
        logs.push("ℹ Hech qanday yangi o'zgarish yo'q (nothing to commit).");
      } else {
        logs.push(`! git commit: ${e.message}`);
      }
    }

    // 3. Git push
    let pushed = false;
    try {
      const { stdout: pushOut, stderr: pushErr } = await execPromise(
        "git push",
        { cwd: process.cwd(), timeout: 30000 }
      );
      if (pushOut) logs.push(pushOut);
      if (pushErr) logs.push(pushErr);
      logs.push("✓ Muvaffaqiyatli masofaviy repozitoriyga push qilindi (git push)!");
      pushed = true;
    } catch (e: any) {
      logs.push(
        `ℹ Git push: ${
          e.message?.includes("fatal: No configured push destination")
            ? "Remote repo (masofaviy manzil) sozlanmagan, lekin mahalliy commit muvaffaqiyatli saqlandi."
            : e.message
        }`
      );
    }

    return NextResponse.json({
      success: true,
      pushed,
      message: pushed
        ? "O'zgarishlar GitHub/Git repozitoriyasiga muvaffaqiyatli yuborildi!"
        : "Mahalliy commit muvaffaqiyatli saqlandi.",
      logs,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Git amallarida xatolik yuz berdi",
      },
      { status: 500 }
    );
  }
}
