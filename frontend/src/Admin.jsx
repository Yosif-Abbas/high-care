import { useEffect, useState } from "react";
import "./admin.css";

// use an explicit environment variable when the backend runs on a separate
// port. When deployed on Vercel the API lives on the same origin, so the
// default value is an empty string and requests are made relative to `/`.
const API_BASE = import.meta.env.VITE_API_BASE || "";

export default function Admin() {
  const [content, setContent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [pwdCurrent, setPwdCurrent] = useState("");
  const [pwdNew, setPwdNew] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");

  useEffect(() => {
    if (!authorized) return;
    fetch(`${API_BASE}/api/content`)
      .then((res) => res.json())
      .then(setContent)
      .catch(() => setMessage("تعذر تحميل البيانات"));
  }, [authorized]);

  const updateField = (path, value) => {
    setContent((prev) => {
      if (!prev) return prev;
      const clone = structuredClone(prev);
      const parts = path.split(".");
      let obj = clone;
      for (let i = 0; i < parts.length - 1; i++) {
        obj = obj[parts[i]];
      }
      obj[parts[parts.length - 1]] = value;
      return clone;
    });
  };

  const save = () => {
    if (!content) return;
    setSaving(true);
    setMessage("");
    fetch(`${API_BASE}/api/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    })
      .then((r) => r.json())
      .then(() => setMessage("تم الحفظ في content.json"))
      .catch(() => setMessage("فشل الحفظ"))
      .finally(() => setSaving(false));
  };

  const handleLogin = () => {
    setLoginError("");
    fetch(`${API_BASE}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: loginPassword }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (!res.ok) {
          setLoginError(res.error || "كلمة المرور غير صحيحة");
          return;
        }
        setAuthorized(true);
        setLoginPassword("");
      })
      .catch(() => setLoginError("تعذر الاتصال بالسيرفر"));
  };

  const handleChangePassword = () => {
    setPwdMsg("");
    fetch(`${API_BASE}/api/admin/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: pwdCurrent,
        newPassword: pwdNew,
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (!res.ok) {
          setPwdMsg(res.error || "فشل تغيير كلمة المرور");
          return;
        }
        setPwdMsg("تم تغيير كلمة المرور بنجاح ✅");
        setPwdCurrent("");
        setPwdNew("");
      })
      .catch(() => setPwdMsg("تعذر الاتصال بالسيرفر"));
  };

  const uploadImage = (field, file) => {
    if (!file) return;
    const fd = new FormData();
    fd.append("field", field);
    fd.append("image", file);
    setMessage("");
    fetch(`${API_BASE}/api/upload-image`, {
      method: "POST",
      body: fd,
    })
      .then((r) => r.json())
      .then((res) => {
        if (!res.ok) throw new Error();
        setMessage("تم رفع الصورة وحذف القديمة (إن وجدت)");
        // refresh content
        return fetch(`${API_BASE}/api/content`).then((r2) => r2.json());
      })
      .then(setContent)
      .catch(() => setMessage("فشل رفع الصورة"));
  };

  if (!authorized) {
    return (
      <div
        className="admin-page"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="admin-card" style={{ maxWidth: 360, width: "100%" }}>
          <h2 style={{ marginBottom: "0.8rem" }}>🔐 تسجيل دخول المسؤول</h2>
          <p
            style={{
              fontSize: "0.85rem",
              color: "#94a3b8",
              marginBottom: "0.9rem",
            }}
          >
            أدخل كلمة المرور للدخول إلى لوحة التحكم.
          </p>
          <label>
            <div className="admin-field-label">كلمة المرور</div>
            <input
              type="password"
              className="admin-input"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </label>
          {loginError && (
            <div
              style={{
                color: "#fca5a5",
                fontSize: "0.8rem",
                marginTop: "0.4rem",
              }}
            >
              {loginError}
            </div>
          )}
          <button
            className="admin-btn admin-btn-primary"
            style={{
              marginTop: "0.9rem",
              width: "100%",
              justifyContent: "center",
            }}
            onClick={handleLogin}
          >
            دخول
          </button>
          {/* <p style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.7rem" }}>
            كلمة المرور الافتراضية: <code>change-me-1234</code> ثم يمكنك تغييرها من داخل اللوحة.
          </p> */}
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", direction: "rtl" }}>
        جاري تحميل لوحة التحكم...
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-navbar">
        <div className="admin-nav-brand">
          <div className="admin-nav-logo">
            {content.images?.logo ? (
              <img
                src={`${API_BASE}/images/${content.images.logo}`}
                alt={content.branding.name}
              />
            ) : (
              content.branding.emoji
            )}
          </div>
          <div className="admin-nav-text">
            <h2>{content.branding.name}</h2>
            <span>لوحة التحكم</span>
          </div>
        </div>
        <div className="admin-nav-actions">
          <button
            className="admin-btn admin-btn-primary"
            onClick={save}
            disabled={saving}
          >
            {saving ? "جاري الحفظ..." : "💾 حفظ"}
          </button>
        </div>
      </header>

      <main className="admin-main">
        {message && <div className="admin-message">{message}</div>}

        <section className="admin-grid-two">
          <div className="admin-card">
            <h2>📞 معلومات التواصل</h2>
            <div className="admin-fields">
              <Field
                label="رقم الهاتف الرئيسي"
                value={content.contact.phones[0]}
                onChange={(v) => {
                  const next = [...content.contact.phones];
                  next[0] = v;
                  updateField("contact.phones", next);
                }}
              />
              <Field
                label="رقم واتساب (اختياري)"
                value={content.contact.phones[1] || ""}
                onChange={(v) => {
                  const next = [...content.contact.phones];
                  next[1] = v;
                  updateField("contact.phones", next);
                }}
              />
              <Field
                label="البريد الإلكتروني"
                value={content.contact.emails[0]}
                onChange={(v) =>
                  updateField("contact.emails", [v, content.contact.emails[1]])
                }
              />
              <Field
                label="المدينة / المنطقة"
                value={content.contact.city}
                onChange={(v) => updateField("contact.city", v)}
              />
            </div>
          </div>

          <div className="admin-card">
            <h2>✨ الهوية</h2>
            <div className="admin-fields">
              <Field
                label="اسم الشركة"
                value={content.branding.name}
                onChange={(v) => updateField("branding.name", v)}
              />
              {/* <Field
                label="الإيموجي"
                value={content.branding.emoji}
                onChange={(v) => updateField("branding.emoji", v)}
              /> */}
              <Field
                label="الشعار النصي"
                value={content.branding.slogan}
                onChange={(v) => updateField("branding.slogan", v)}
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="admin-section-title">
            🖼️ صور أساسية (رفع صورة جديدة يحذف القديمة تلقائيًا)
          </h2>
          <div className="admin-images-grid">
            <ImageSlot
              label="نقل الأثاث"
              filename={content.images.services.moving}
              onFile={(f) => uploadImage("svc-moving", f)}
            />
            <ImageSlot
              label="تنظيف الفلل"
              filename={content.images.services.cleaning}
              onFile={(f) => uploadImage("svc-cleaning", f)}
            />
            <ImageSlot
              label="تأجير الألعاب"
              filename={content.images.services.games}
              onFile={(f) => uploadImage("svc-games", f)}
            />
            <ImageSlot
              label="شعار الموقع (سيُستخدم أيضًا كأيقونة المتصفح)"
              filename={content.images.logo}
              onFile={(f) => uploadImage("logo", f)}
            />
          </div>
        </section>

        <section>
          <h2 className="admin-section-title">🔑 تغيير كلمة مرور المسؤول</h2>
          <div className="admin-card" style={{ maxWidth: 480 }}>
            <div className="admin-fields">
              <Field
                label="كلمة المرور الحالية"
                value={pwdCurrent}
                onChange={setPwdCurrent}
              />
              <Field
                label="كلمة المرور الجديدة"
                value={pwdNew}
                onChange={setPwdNew}
              />
            </div>
            {pwdMsg && (
              <p
                style={{
                  fontSize: "0.8rem",
                  marginTop: "0.6rem",
                  color: pwdMsg.includes("✅") ? "#4ade80" : "#fca5a5",
                }}
              >
                {pwdMsg}
              </p>
            )}
            <button
              className="admin-btn admin-btn-primary"
              style={{ marginTop: "0.9rem" }}
              onClick={handleChangePassword}
            >
              حفظ كلمة المرور الجديدة
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label>
      <div className="admin-field-label">{label}</div>
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="admin-input"
      />
    </label>
  );
}

function ImageSlot({ label, filename, onFile }) {
  const url = filename ? `${API_BASE}/images/${filename}` : null;
  return (
    <div className="admin-img-slot">
      <div className="admin-img-slot-label">{label}</div>
      {url ? (
        <img src={url} alt={label} className="admin-img-preview" />
      ) : (
        <div className="admin-img-empty">لا توجد صورة بعد</div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onFile(e.target.files?.[0] || null)}
        className="admin-img-input"
      />
    </div>
  );
}
