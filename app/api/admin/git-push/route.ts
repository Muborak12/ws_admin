import { NextResponse } from "next/server";
import { exec } from "child_process";
import util from "util";
import fs from "fs";
import path from "path";

const execPromise = util.promisify(exec);

// Find working git root
function getGitWorkingDir(): string {
  const candidates = [
    process.cwd(),
    "C:\\Users\\Hp\\Desktop\\WS-Store",
    "C:\\Users\\Hp\\Desktop\\xon-bozor\\xon-bozor",
    "C:\\Users\\Hp\\Desktop\\WS-Admin",
  ];
  for (const cand of candidates) {
    if (fs.existsSync(cand) && fs.existsSync(path.join(cand, ".git"))) {
      return cand;
    }
  }
  return process.cwd();
}

export async function GET() {
  const cwd = getGitWorkingDir();
  const info: {
    hasGit: boolean;
    cwd: string;
    remoteUrl: string;
    branch: string;
    lastCommit: string;
    status: string;
  } = {
    hasGit: fs.existsSync(path.join(cwd, ".git")),
    cwd,
    remoteUrl: "",
    branch: "main",
    lastCommit: "",
    status: "",
  };

  if (!info.hasGit) {
    return NextResponse.json(info);
  }

  try {
    const { stdout: remoteOut } = await execPromise("git remote get-url origin", { cwd });
    info.remoteUrl = remoteOut.trim();
  } catch {
    info.remoteUrl = "";
  }

  try {
    const { stdout: branchOut } = await execPromise("git branch --show-current", { cwd });
    info.branch = branchOut.trim() || "main";
  } catch {
    // fallback
  }

  try {
    const { stdout: logOut } = await execPromise("git log -1 --oneline", { cwd });
    info.lastCommit = logOut.trim();
  } catch {
    // fallback
  }

  try {
    const { stdout: statusOut } = await execPromise("git status --short", { cwd });
    info.status = statusOut.trim();
  } catch {
    // fallback
  }

  return NextResponse.json(info);
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const message =
      body.commitMessage ||
      `WS Admin yangilanishlari: ${new Date().toLocaleString("uz-UZ")}`;
    const targetBranch = body.branch || "main";
    const remoteUrl = body.remoteUrl?.trim();

    const cwd = getGitWorkingDir();
    const logs: string[] = [];

    logs.push(`📂 Git ishchi jildi: ${cwd}`);

    // Check if git is initialized
    const gitDir = path.join(cwd, ".git");
    if (!fs.existsSync(gitDir)) {
      try {
        await execPromise(`git init -b ${targetBranch}`, { cwd });
        logs.push(`✓ Git repozitoriyasi ishga tushirildi (git init -b ${targetBranch})`);
      } catch (e: any) {
        logs.push(`! git init: ${e.message}`);
      }
    }

    // Configure remote origin if provided
    if (remoteUrl) {
      try {
        await execPromise("git remote get-url origin", { cwd });
        await execPromise(`git remote set-url origin "${remoteUrl}"`, { cwd });
        logs.push(`✓ Masofaviy manzil yangilandi: origin -> ${remoteUrl}`);
      } catch {
        try {
          await execPromise(`git remote add origin "${remoteUrl}"`, { cwd });
          logs.push(`✓ Yangi masofaviy manzil qo'shildi: origin -> ${remoteUrl}`);
        } catch (e: any) {
          logs.push(`! git remote: ${e.message}`);
        }
      }
    }

    // 1. Git add
    try {
      const { stdout: addOut } = await execPromise("git add .", { cwd });
      if (addOut) logs.push(addOut.trim());
      logs.push("✓ Barcha o'zgarishlar indeksga qo'shildi (git add .)");
    } catch (e: any) {
      logs.push(`! git add: ${e.message}`);
    }

    // 2. Git commit
    let committed = false;
    try {
      const cleanMsg = message.replace(/"/g, '\\"');
      const { stdout: commitOut } = await execPromise(
        `git commit -m "${cleanMsg}"`,
        { cwd }
      );
      if (commitOut) logs.push(commitOut.trim());
      logs.push(`✓ Commit yaratildi: "${message}"`);
      committed = true;
    } catch (e: any) {
      if (e.message?.includes("nothing to commit")) {
        logs.push("ℹ Indeksda yangi o'zgarishlar yo'q (nothing to commit).");
        committed = true;
      } else {
        logs.push(`! git commit: ${e.message}`);
      }
    }

    // 3. Ensure branch name
    try {
      await execPromise(`git branch -M ${targetBranch}`, { cwd });
    } catch {
      // fallback
    }

    // 4. Git push
    let pushed = false;
    try {
      const { stdout: pushOut, stderr: pushErr } = await execPromise(
        `git push -u origin ${targetBranch}`,
        { cwd, timeout: 35000 }
      );
      if (pushOut) logs.push(pushOut.trim());
      if (pushErr) logs.push(pushErr.trim());
      logs.push(`✓ Muvaffaqiyatli GitHub repozitoriyasiga push qilindi (${targetBranch})!`);
      pushed = true;
    } catch (e: any) {
      if (e.message?.includes("fatal: No configured push destination") || e.message?.includes("does not appear to be a git repository")) {
        logs.push("ℹ Masofaviy GitHub repozitoriyasi manzili (remote origin) topilmadi. Iltimos, GitHub repository URL kiriting.");
      } else {
        logs.push(`! git push: ${e.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      pushed,
      committed,
      message: pushed
        ? "Barcha o'zgarishlar GitHub repozitoriyasiga muvaffaqiyatli yuborildi (push)!"
        : "O'zgarishlar mahalliy Git commit sifatida saqlandi.",
      logs,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Git amallarida kutilmagan xatolik yuz berdi",
      },
      { status: 500 }
    );
  }
}
