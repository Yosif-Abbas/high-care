/* eslint-env node */
/* global process */
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import multer from "multer";
import crypto from "crypto";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const app = express();

// determine the project root regardless of where the function is executed
const ROOT_DIR = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  "..",
  "..",
);
const CONTENT_PATH = path.join(ROOT_DIR, "content", "content.json");
const IMAGES_DIR = path.join(ROOT_DIR, "images");

// port configuration is only used when running the file directly
// (Vercel provides its own runtime and ignores this value)
const PORT = process.env.PORT || 3000; // only used when running locally

function hashPassword(pw) {
  return crypto.createHash("sha256").update(pw).digest("hex");
}

function ensureContentFile() {
  if (!fs.existsSync(path.dirname(CONTENT_PATH))) {
    fs.mkdirSync(path.dirname(CONTENT_PATH), { recursive: true });
  }
  if (
    !fs.existsSync(CONTENT_PATH) ||
    fs.readFileSync(CONTENT_PATH, "utf8").trim() === ""
  ) {
    const initial = {
      contact: {
        phones: ["0501234567", "0501234567"],
        emails: ["info@hicare.sa", ""],
        city: "الرياض",
        workDays: "السبت – الخميس",
        workHours: "8 صباحًا – 10 مساءً",
      },
      social: {
        whatsapp: { enabled: true, number: "0501234567" },
        instagram: { enabled: true, url: "https://instagram.com/hicare" },
        facebook: { enabled: true, url: "https://facebook.com/hicare" },
        snapchat: { enabled: true, username: "hicare_sa" },
        tiktok: { enabled: false, url: "" },
        twitter: { enabled: false, url: "" },
        youtube: { enabled: false, url: "" },
        waButtonsInternational: "966501234567",
      },
      branding: {
        name: "هاي كير",
        emoji: "✨",
        footerDescription:
          "نقدم خدمات منزلية ومناسباتية احترافية بجودة عالية وأسعار مناسبة.",
        slogan: "الجودة والاحترافية في كل خدمة",
      },
      images: {
        hero: null,
        logo: "logo.png",
        services: {
          moving: null,
          cleaning: null,
          games: null,
        },
        testimonials: {
          client1: null,
          client2: null,
          client3: null,
        },
      },
      admin: {
        // default password: change-me-1234
        passwordHash: hashPassword("change-me-1234"),
      },
    };
    fs.writeFileSync(CONTENT_PATH, JSON.stringify(initial, null, 2), "utf8");
  } else {
    try {
      const existing = JSON.parse(
        fs.readFileSync(CONTENT_PATH, "utf8") || "{}",
      );
      let changed = false;
      if (!existing.admin || !existing.admin.passwordHash) {
        existing.admin = {
          passwordHash: hashPassword("change-me-1234"),
        };
        changed = true;
      }
      if (!existing.images) {
        existing.images = {};
        changed = true;
      }
      if (!existing.images.logo) {
        existing.images.logo = "logo.png";
        changed = true;
      }
      if (changed) {
        fs.writeFileSync(
          CONTENT_PATH,
          JSON.stringify(existing, null, 2),
          "utf8",
        );
      }
    } catch {
      // ignore errors
    }
  }
}

ensureContentFile();

async function ensureFavicon() {
  const icoPath = path.join(IMAGES_DIR, "favicon.ico");
  if (fs.existsSync(icoPath)) return;
  try {
    const data = readContent();
    const logoFile = data.images?.logo;
    if (logoFile) {
      const logoPath = path.join(IMAGES_DIR, logoFile);
      if (fs.existsSync(logoPath)) {
        try {
          const pngBuf = await sharp(logoPath)
            .resize(256, 256, { fit: "cover" })
            .png()
            .toBuffer();
          const icoBuf = await pngToIco(pngBuf);
          fs.writeFileSync(icoPath, icoBuf);
        } catch (e) {
          console.warn("startup favicon conversion failed", e.message);
        }
      }
    }
  } catch (err) {
    console.warn("could not ensure favicon on boot", err.message);
  }
}

ensureFavicon();

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use("/images", express.static(IMAGES_DIR));
app.get("/favicon.ico", (req, res) => {
  const icoPath = path.join(IMAGES_DIR, "favicon.ico");
  if (fs.existsSync(icoPath)) {
    res.sendFile(icoPath);
  } else {
    res.status(404).end();
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, IMAGES_DIR);
  },
  filename: (req, file, cb) => {
    const safeField = (req.body.field || "image").replace(
      /[^a-zA-Z0-9-_]/g,
      "",
    );
    const ext = path.extname(file.originalname) || ".png";
    const ts = Date.now();
    cb(null, `${safeField}-${ts}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

function readContent() {
  const raw = fs.readFileSync(CONTENT_PATH, "utf8");
  return JSON.parse(raw || "{}");
}

function writeContent(data) {
  fs.writeFileSync(CONTENT_PATH, JSON.stringify(data, null, 2), "utf8");
}

// get public content
app.get("/api/content", (req, res) => {
  try {
    const data = readContent();
    // strip admin before sending the response
    const { admin: _admin, ...publicData } = data;
    res.json(publicData);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to read content" });
  }
});

app.post("/api/content", (req, res) => {
  try {
    const existing = readContent();
    const { admin } = existing;
    const updated = { ...existing, ...req.body, admin };
    writeContent(updated);
    res.json({ ok: true, data: updated });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to save content" });
  }
});

function removeOldImage(oldFilename) {
  if (!oldFilename) return;
  const p = path.join(IMAGES_DIR, oldFilename);
  if (fs.existsSync(p)) {
    try {
      fs.unlinkSync(p);
    } catch (e) {
      console.warn("Failed to delete old image:", p, e.message);
    }
  }
}

app.post("/api/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const field = req.body.field;
    if (!field) {
      return res.status(400).json({ error: "Missing field parameter" });
    }

    const data = readContent();
    let filename = req.file.filename;

    if (field === "logo") {
      try {
        const origPath = path.join(IMAGES_DIR, filename);
        const pngBuf = await sharp(origPath)
          .resize(256, 256, { fit: "cover" })
          .png()
          .toBuffer();
        const icoBuf = await pngToIco(pngBuf);
        const icoPath = path.join(IMAGES_DIR, "favicon.ico");
        fs.writeFileSync(icoPath, icoBuf);
      } catch (e) {
        console.warn("Failed to convert logo to favicon.ico", e.message);
      }
    }

    let oldFilename = null;
    if (field === "hero") {
      oldFilename = data.images.hero;
      data.images.hero = filename;
    } else if (field === "logo") {
      oldFilename = data.images.logo;
      data.images.logo = filename;
    } else if (field === "svc-moving") {
      oldFilename = data.images.services.moving;
      data.images.services.moving = filename;
    } else if (field === "svc-cleaning") {
      oldFilename = data.images.services.cleaning;
      data.images.services.cleaning = filename;
    } else if (field === "svc-games") {
      oldFilename = data.images.services.games;
      data.images.services.games = filename;
    } else if (field === "client1") {
      oldFilename = data.images.testimonials.client1;
      data.images.testimonials.client1 = filename;
    } else if (field === "client2") {
      oldFilename = data.images.testimonials.client2;
      data.images.testimonials.client2 = filename;
    } else if (field === "client3") {
      oldFilename = data.images.testimonials.client3;
      data.images.testimonials.client3 = filename;
    } else {
      return res.status(400).json({ error: "Unknown field value" });
    }

    removeOldImage(oldFilename);
    writeContent(data);

    res.json({
      ok: true,
      filename,
      url: `/images/${filename}`,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

app.post("/api/admin/login", (req, res) => {
  try {
    const { password } = req.body || {};
    if (!password) {
      return res.status(400).json({ ok: false, error: "Missing password" });
    }
    const data = readContent();
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
    res.status(500).json({ ok: false, error: "Login failed" });
  }
});

app.post("/api/admin/change-password", (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        ok: false,
        error: "الرجاء إدخال كلمة المرور الحالية والجديدة",
      });
    }
    const data = readContent();
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
    writeContent(data);
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "Change password failed" });
  }
});

// Export the express app so Vercel (or other serverless/runtime) can handle it.
export default app;

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
