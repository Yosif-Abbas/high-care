/* eslint-env node */
/* global process */
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { Buffer } from "buffer";

import "dotenv/config";

const app = express();

// determine the project root regardless of where the function is executed
const ROOT_DIR = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  "..",

  "..",
);
const CONTENT_PATH = path.join(ROOT_DIR, "content", "content.json");
// static asset directory for user-uploaded images – now stored under public
const IMAGES_DIR = path.join(ROOT_DIR, "public");

// port configuration is only used when running the file directly
// (Vercel provides its own runtime and ignores this value)
const PORT = process.env.PORT || 3000; // only used when running locally

function hashPassword(pw) {
  return crypto.createHash("sha256").update(pw).digest("hex");
}

function ensureContentFile() {
  // local file maintenance is discouraged; the CMS (GitHub) should own the
  // file. if no token is configured we simply log a warning but do not try to
  // create or mutate the file automatically.
  if (!process.env.GITHUB_TOKEN) {
    console.warn(
      "GITHUB_TOKEN not set – content.json must exist and be edited manually.",
    );
    return;
  }
  // when a token exists we assume GitHub has the correct file; nothing to do
}

ensureContentFile();

// favicon generation disabled; images are managed statically via GitHub CMS

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use("/images", express.static(IMAGES_DIR));
// keep favicon route as earlier
app.get("/favicon.ico", (req, res) => {
  const icoPath = path.join(IMAGES_DIR, "favicon.ico");
  if (fs.existsSync(icoPath)) {
    res.sendFile(icoPath);
  } else {
    res.status(404).end();
  }
});

// image upload handling removed; static images only

// fetch content.json either locally (dev) or from GitHub (prod)
// async function readContent() {
//   if (!process.env.GITHUB_TOKEN) {
//     throw new Error("GITHUB_TOKEN required to read content.json");
//   }
//   const repo = process.env.GITHUB_REPOSITORY;
//   const branch = process.env.GITHUB_BRANCH || "main";
//   const url = `https://raw.githubusercontent.com/${repo}/${branch}/content/content.json?t=${Date.now()}`;
//   const resp = await fetch(url, { cache: "no-store" });
//   if (!resp.ok) {
//     throw new Error(`failed to fetch content from GitHub: ${resp.status}`);
//   }
//   const text = await resp.text();
//   return JSON.parse(text || "{}");
// }

async function readContent() {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN required to read content.json");
  }

  const repo = process.env.GITHUB_REPOSITORY; // e.g. "Yosif-Abbas/high-care"
  const branch = process.env.GITHUB_BRANCH || "main";

  const url =
    `https://api.github.com/repos/${repo}/contents/content/content.json` +
    `?ref=${branch}&t=${Date.now()}`;

  // https://api.github.com/repos/Yosif-Abbas/high-care/contents/content/content.json?ref=main&t=15616513215

  const resp = await fetch(url, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
    },
  });

  if (!resp.ok) {
    throw new Error(`failed to fetch content from GitHub: ${resp.status}`);
  }

  const data = await resp.json();

  const decoded = Buffer.from(data.content, "base64").toString("utf8");

  return JSON.parse(decoded || "{}");
}

// write using GitHub API when possible, otherwise fall back to filesystem
async function writeContent(data) {
  // always push to GitHub; without a token the CMS cannot be updated.
  if (!process.env.GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN required to modify content.json");
  }
  await commitContent(data);
}

// commit a JSON blob to the repository via GitHub REST API
async function commitContent(data) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN not set");
  const repo = process.env.GITHUB_REPOSITORY;
  if (!repo) throw new Error("GITHUB_REPOSITORY env not set");
  const branch = process.env.GITHUB_BRANCH || "main";
  const pathInRepo = "content/content.json";
  const apiBase = `https://api.github.com/repos/${repo}/contents/${pathInRepo}`;

  let sha;
  try {
    const resp = await fetch(`${apiBase}?ref=${branch}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    });
    if (resp.ok) {
      const info = await resp.json();
      sha = info.sha;
    } else if (resp.status !== 404) {
      const errText = await resp.text();
      throw new Error(
        `GitHub API error getting sha: ${resp.status} ${errText}`,
      );
    }
  } catch (e) {
    console.error("failed to fetch existing file info", e.message);
  }

  const contentBase64 = Buffer.from(JSON.stringify(data, null, 2)).toString(
    "base64",
  );
  const body = {
    message: "Update content.json via admin panel",
    content: contentBase64,
    branch,
  };
  if (sha) body.sha = sha;

  const putRes = await fetch(apiBase, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!putRes.ok) {
    const errText = await putRes.text();
    throw new Error(`GitHub commit failed: ${putRes.status} ${errText}`);
  }
  return await putRes.json();
}

// get public content
app.get("/api/content", async (req, res) => {
  try {
    res.setHeader("cache", "no-store");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.removeHeader("ETag");

    const data = await readContent();
    // strip admin before sending the response
    const { admin: _admin, ...publicData } = data;
    res.json(publicData);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to read content" });
  }
});

app.post("/api/content", async (req, res) => {
  try {
    const existing = await readContent();
    const { admin } = existing;
    const updated = { ...existing, ...req.body, admin };
    await writeContent(updated);
    res.json({ ok: true, data: updated });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || "Failed to save content" });
  }
});

// removeOldImage helper no longer needed since uploads are disabled

// upload-image endpoint removed; static images are managed by GitHub CMS

app.post("/api/admin/login", async (req, res) => {
  try {
    const { password } = req.body || {};
    if (!password) {
      return res.status(400).json({ ok: false, error: "Missing password" });
    }
    const data = await readContent();
    const expected = data.admin?.passwordHash;
    if (!expected) {
      return res.status(500).json({ ok: false, error: "Admin not configured" });
    }
    const incoming = hashPassword(password);
    if (incoming !== expected) {
      return res
        .status(401)
        .json({ ok: false, error: "كلمة المرور غير صحيحة" });
    }
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: e.message || "Login failed" });
  }
});

app.post("/api/admin/change-password", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        ok: false,
        error: "الرجاء إدخال كلمة المرور الحالية والجديدة",
      });
    }
    const data = await readContent();
    const expected = data.admin?.passwordHash;
    if (!expected) {
      return res.status(500).json({ ok: false, error: "Admin not configured" });
    }
    if (hashPassword(currentPassword) !== expected) {
      return res
        .status(401)
        .json({ ok: false, error: "كلمة المرور الحالية غير صحيحة" });
    }
    data.admin.passwordHash = hashPassword(newPassword);
    await writeContent(data);
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ ok: false, error: e.message || "Change password failed" });
  }
});

// Export the express app so Vercel (or other serverless/runtime) can handle it.
export default app;

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
