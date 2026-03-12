import { useEffect, useState } from "react";

// use an explicit environment variable when the backend runs on a separate
// port. When deployed on Vercel the API lives on the same origin, so the
// default value is an empty string and requests are made relative to `/`.
const API_BASE = import.meta.env.VITE_API_BASE || "";

export default function Home() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [navOpen, setNavOpen] = useState(false);

  // whenever the logo in content changes, update the favicon (cache-busting)
  useEffect(() => {
    if (content?.images?.logo) {
      const link =
        document.querySelector("link[rel~='icon']") ||
        document.createElement("link");
      link.rel = "icon";
      link.href = `/favicon.ico?v=${Date.now()}`;
      document.head.appendChild(link);
    }
  }, [content]);

  useEffect(() => {
    console.log(API_BASE);
    fetch(`${API_BASE}/api/content`)
      .then((res) => res.json())
      .then((data) => {
        setContent(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("تعذر تحميل البيانات");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", direction: "rtl" }}>
        جاري تحميل الموقع...
      </div>
    );
  }

  if (error || !content) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", direction: "rtl" }}>
        {error || "حدث خطأ غير متوقع"}
      </div>
    );
  }

  const waInternational =
    content.social?.waButtonsInternational || "966501234567";
  const waLink = `https://wa.me/${waInternational}`;

  const logoFile = content.images?.logo || "logo.png";
  const logoUrl = `${API_BASE}/images/${logoFile}`;
  const logoEmoji = content.branding?.emoji || "✨";
  const brandName = content.branding?.name || "هاي كير";
  const slogan = content.branding?.slogan || "الجودة والاحترافية في كل خدمة";

  const svcImg = (slot, fallback) => {
    if (slot) return `${API_BASE}/images/${slot}`;
    return fallback;
  };

  return (
    <>
      {/* NAVBAR */}
      <nav id="navbar">
        <div className="logo-wrap">
          <div className="logo-icon">
            {logoUrl ? <img src={logoUrl} alt={brandName} /> : logoEmoji}
          </div>
          <span className="logo-text">{brandName}</span>
        </div>
        <ul className={`nav-links ${navOpen ? "open" : ""}`} id="navLinks">
          <li>
            <a href="#services">خدماتنا</a>
          </li>
          <li>
            <a href="#process">كيف نعمل</a>
          </li>
          <li>
            <a href="#whyus">لماذا نحن</a>
          </li>
          <li>
            <a href="#testimonials">آراء العملاء</a>
          </li>
          <li>
            <a href="#contact" className="nav-cta">
              تواصل معنا
            </a>
          </li>
        </ul>
        <div
          className="hamburger"
          id="hamburger"
          onClick={() => setNavOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">⭐ الجودة والاحترافية في كل خدمة</div>
          <h1>
            نحن <span className="highlight">{brandName}</span>
            <br />
            خدمات تجعل حياتك أسهل
          </h1>
          <p>
            نقدم خدمات متكاملة لنقل الأثاث وتنظيف الفلل وتأجير الألعاب للأطفال
            في المناسبات — بأيدٍ أمينة وخبرة موثوقة.
          </p>
          <div className="hero-btns">
            <a href="#services" className="btn-main">
              🔍 استكشف خدماتنا
            </a>
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="btn-outline-white"
            >
              💬 تواصل واتساب
            </a>
          </div>
          <div className="hero-stats">
            <div className="stat-box">
              <h3>+300</h3>
              <p>عميل سعيد</p>
            </div>
            <div className="stat-box">
              <h3>+5</h3>
              <p>سنوات خبرة</p>
            </div>
            <div className="stat-box">
              <h3>100%</h3>
              <p>رضا مضمون</p>
            </div>
          </div>
        </div>

        <div className="hero-cards">
          <div className="hero-float-card">
            <div className="fc-icon">🚛</div>
            <h4>نقل الأثاث</h4>
          </div>
          <div className="hero-float-card">
            <div className="fc-icon">🏡</div>
            <h4>تنظيف الفلل</h4>
          </div>
          <div className="hero-float-card" style={{ gridColumn: "span 2" }}>
            <div className="fc-icon">🎪</div>
            <h4>تأجير الألعاب للمناسبات</h4>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services" id="services">
        <p className="sec-tag">ما نقدمه</p>
        <h2 className="sec-title">خدماتنا المتميزة</h2>
        <p className="sec-sub">
          نحن متخصصون في تقديم خدمات عالية الجودة تلبي احتياجاتك اليومية
          والمناسباتية باحترافية تامة
        </p>

        <div className="services-grid">
          {/* نقل الأثاث */}
          <div className="svc-card">
            <div className="svc-img-wrap">
              <img
                src={svcImg(
                  content.images?.services?.moving,
                  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
                )}
                alt="نقل الأثاث"
              />
              <div className="svc-img-overlay"></div>
              <span className="svc-img-badge">⭐ الأكثر طلبًا</span>
              <div className="svc-img-icon">🚛</div>
            </div>
            <div className="svc-body">
              <h3>نقل الأثاث</h3>
              <p>
                نوفر خدمة نقل أثاث احترافية وآمنة داخل المدينة وخارجها، مع فريق
                متخصص وسيارات مجهزة لضمان سلامة كل قطعة.
              </p>
              <ul className="svc-features">
                <li>فك وتركيب الأثاث بخبرة</li>
                <li>تغليف محكم لحماية المقتنيات</li>
                <li>سيارات نظيفة ومجهزة</li>
                <li>الالتزام بالمواعيد</li>
                <li>أسعار تنافسية وشفافة</li>
              </ul>
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="svc-btn"
              >
                💬 احجز الآن ←
              </a>
            </div>
          </div>

          {/* تنظيف الفلل */}
          <div className="svc-card">
            <div className="svc-img-wrap">
              <img
                src={svcImg(
                  content.images?.services?.cleaning,
                  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80",
                )}
                alt="تنظيف الفلل"
              />
              <div className="svc-img-overlay"></div>
              <span className="svc-img-badge">✨ تنظيف عميق</span>
              <div className="svc-img-icon">🏡</div>
            </div>
            <div className="svc-body">
              <h3>تنظيف الفلل</h3>
              <p>
                خدمة تنظيف شاملة وعميقة للفلل والمنازل باستخدام أحدث المعدات
                ومواد التنظيف الصديقة للبيئة لنتيجة مبهرة.
              </p>
              <ul className="svc-features">
                <li>تنظيف شامل لجميع الغرف</li>
                <li>تلميع الأرضيات والنوافذ</li>
                <li>تعقيم الحمامات والمطابخ</li>
                <li>إزالة البقع والأتربة العميقة</li>
                <li>فريق نسائي متخصص</li>
              </ul>
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="svc-btn"
              >
                💬 احجزي الآن ←
              </a>
            </div>
          </div>

          {/* تأجير الألعاب */}
          <div className="svc-card">
            <div className="svc-img-wrap">
              <img
                src={svcImg(
                  content.images?.services?.games,
                  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80",
                )}
                alt="تأجير الألعاب للأطفال"
              />
              <div className="svc-img-overlay"></div>
              <span className="svc-img-badge">🎉 للمناسبات</span>
              <div className="svc-img-icon">🎪</div>
            </div>
            <div className="svc-body">
              <h3>تأجير ألعاب الأطفال للمناسبات</h3>
              <p>
                اجعل حفلات أطفالك لا تُنسى! نوفر أجمل الألعاب النفخية والترفيهية
                للأعياد والمناسبات مع التركيب والإزالة.
              </p>
              <ul className="svc-features">
                <li>زحاليق نفخية وقلاع ترفيهية</li>
                <li>ألعاب آمنة ومعتمدة</li>
                <li>توصيل وتركيب وإزالة</li>
                <li>مناسب لجميع المناسبات</li>
                <li>إشراف وضمان السلامة</li>
              </ul>
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="svc-btn"
              >
                💬 احجز المناسبة ←
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="process" id="process">
        <p className="sec-tag">كيف نعمل</p>
        <h2 className="sec-title">خطوات بسيطة للحصول على الخدمة</h2>
        <p className="sec-sub">
          نجعل تجربتك معنا سهلة وسريعة من لحظة تواصلك حتى الانتهاء من الخدمة
        </p>

        <div className="steps-wrap">
          <div className="step-item">
            <div className="step-num">1</div>
            <h3>تواصل معنا</h3>
            <p>
              أرسل لنا رسالة عبر واتساب أو وسائل التواصل الاجتماعي وأخبرنا بما
              تحتاج.
            </p>
          </div>
          <div className="step-item">
            <div className="step-num">2</div>
            <h3>نحدد الموعد</h3>
            <p>نرتب معك الوقت المناسب وندرس تفاصيل الطلب لنضمن أفضل خدمة.</p>
          </div>
          <div className="step-item">
            <div className="step-num">3</div>
            <h3>نصل إليك</h3>
            <p>
              يصل فريقنا المتخصص في الموعد المحدد بالمعدات اللازمة جاهزًا للعمل.
            </p>
          </div>
          <div className="step-item">
            <div className="step-num">4</div>
            <h3>رضاك هو هدفنا</h3>
            <p>
              ننهي العمل على أكمل وجه ولا نغادر إلا بعد أن تكون راضيًا 100%.
            </p>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="whyus" id="whyus">
        <p className="sec-tag">مميزاتنا</p>
        <h2 className="sec-title">لماذا تختار {brandName}؟</h2>
        <p className="sec-sub">
          نحن لا نقدم خدمة فقط، نقدم تجربة تثق بها وتعود إليها
        </p>

        <div className="why-grid">
          <div className="why-card">
            <div
              className="why-icon"
              style={{ background: "rgba(14,165,233,0.1)" }}
            >
              🛡️
            </div>
            <h3>موثوقية عالية</h3>
            <p>
              فريقنا مدرب وموثوق وذو خبرة طويلة تضمن سلامة ممتلكاتك وأمانها
              التام.
            </p>
          </div>
          <div className="why-card">
            <div
              className="why-icon"
              style={{ background: "rgba(16,185,129,0.1)" }}
            >
              ⚡
            </div>
            <h3>سرعة في التنفيذ</h3>
            <p>
              نحترم وقتك ونلتزم بالمواعيد المتفق عليها لإنجاز العمل في الوقت
              المحدد.
            </p>
          </div>
          <div className="why-card">
            <div
              className="why-icon"
              style={{ background: "rgba(245,158,11,0.1)" }}
            >
              💎
            </div>
            <h3>جودة لا تُضاهى</h3>
            <p>
              نستخدم أفضل المعدات والأساليب لضمان نتيجة مُرضية تفوق توقعاتك.
            </p>
          </div>
          <div className="why-card">
            <div
              className="why-icon"
              style={{ background: "rgba(99,102,241,0.1)" }}
            >
              💰
            </div>
            <h3>أسعار مناسبة</h3>
            <p>
              خدمات احترافية بأسعار منافسة وشفافة بدون رسوم مخفية أو مفاجآت.
            </p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials" id="testimonials">
        <p className="sec-tag">آراء العملاء</p>
        <h2 className="sec-title">ماذا يقول عملاؤنا</h2>
        <p className="sec-sub">آراء حقيقية من عملاء كرام وثقوا بخدماتنا</p>

        <div className="test-grid">
          <div className="test-card">
            <div className="test-stars">★★★★★</div>
            <p>
              "خدمة نقل الأثاث كانت ممتازة! الفريق جاء في الوقت المحدد وتعاملوا
              مع الأثاث باحتراف وعناية شديدة. أنصح بهم بشدة!"
            </p>
            <div className="reviewer">
              <div className="rev-avatar">أ</div>
              <div className="rev-info">
                <h4>أبو محمد العتيبي</h4>
                <span>الرياض — نقل أثاث</span>
              </div>
            </div>
          </div>

          <div className="test-card">
            <div className="test-stars">★★★★★</div>
            <p>
              "فيلتي كانت متسخة جدًا بعد التشطيب، جاء فريق هاي كير وتركوها كأنها
              قصر! نظافة عميقة وعمل احترافي رائع."
            </p>
            <div className="reviewer">
              <div className="rev-avatar">ن</div>
              <div className="rev-info">
                <h4>نورة السالم</h4>
                <span>جدة — تنظيف فلل</span>
              </div>
            </div>
          </div>

          <div className="test-card">
            <div className="test-stars">★★★★★</div>
            <p>
              "أجرنا ألعاب لحفلة عيد ميلاد ابني، الأطفال فرحوا كثيراً! التركيب
              والإزالة كان سريعاً والألعاب كانت نظيفة وآمنة. شكراً هاي كير!"
            </p>
            <div className="reviewer">
              <div className="rev-avatar">م</div>
              <div className="rev-info">
                <h4>مها الزهراني</h4>
                <span>الدمام — تأجير ألعاب</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact-section" id="contact">
        <p className="sec-tag">تواصل معنا</p>
        <h2 className="sec-title">نحن هنا لخدمتك</h2>
        <p className="sec-sub">
          تواصل معنا الآن عبر واتساب أو أي منصة تواصل اجتماعي — نرد بسرعة ونرتب
          لك الخدمة في أقرب وقت
        </p>

        <div className="social-contact-grid">
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="social-btn btn-whatsapp"
          >
            <span className="s-icon">💬</span> واتساب
          </a>
          <a
            href={
              content.social?.instagram?.url || "https://instagram.com/hicare"
            }
            target="_blank"
            rel="noreferrer"
            className="social-btn btn-instagram"
          >
            <span className="s-icon">📸</span> إنستقرام
          </a>
          <a
            href={
              content.social?.facebook?.url || "https://facebook.com/hicare"
            }
            target="_blank"
            rel="noreferrer"
            className="social-btn btn-facebook"
          >
            <span className="s-icon">👍</span> فيسبوك
          </a>
          <a
            href={content.social?.tiktok?.url || "https://tiktok.com/@hicare"}
            target="_blank"
            rel="noreferrer"
            className="social-btn btn-tiktok"
          >
            <span className="s-icon">🎵</span> تيك توك
          </a>
          <a
            href={
              content.social?.snapchat?.username
                ? `https://snapchat.com/add/${content.social.snapchat.username}`
                : "https://snapchat.com/add/hicare"
            }
            target="_blank"
            rel="noreferrer"
            className="social-btn btn-snapchat"
          >
            <span className="s-icon">👻</span> سناب شات
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-top">
          <div>
            <div className="logo-wrap" style={{ marginBottom: "0.5rem" }}>
              <div className="logo-icon" style={{ width: 38, height: 38 }}>
                {logoUrl ? <img src={logoUrl} alt={brandName} /> : logoEmoji}
              </div>
              <span className="logo-text">{brandName}</span>
            </div>
            <p className="footer-brand-desc">
              {content.branding?.footerDescription ||
                "نقدم خدمات منزلية ومناسباتية احترافية بجودة عالية وأسعار مناسبة. نقل الأثاث، تنظيف الفلل، وتأجير الألعاب للأطفال — كل ما تحتاجه في مكان واحد."}
            </p>
            <div className="footer-social">
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="f-social-icon"
              >
                💬
              </a>
              <a
                href={
                  content.social?.instagram?.url ||
                  "https://instagram.com/hicare"
                }
                target="_blank"
                rel="noreferrer"
                className="f-social-icon"
              >
                📸
              </a>
              <a
                href={
                  content.social?.facebook?.url || "https://facebook.com/hicare"
                }
                target="_blank"
                rel="noreferrer"
                className="f-social-icon"
              >
                👍
              </a>
              <a
                href={
                  content.social?.tiktok?.url || "https://tiktok.com/@hicare"
                }
                target="_blank"
                rel="noreferrer"
                className="f-social-icon"
              >
                🎵
              </a>
              <a
                href={
                  content.social?.snapchat?.username
                    ? `https://snapchat.com/add/${content.social.snapchat.username}`
                    : "https://snapchat.com/add/hicare"
                }
                target="_blank"
                rel="noreferrer"
                className="f-social-icon"
              >
                👻
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>خدماتنا</h4>
            <ul>
              <li>
                <a href="#services">🚛 نقل الأثاث</a>
              </li>
              <li>
                <a href="#services">🏡 تنظيف الفلل</a>
              </li>
              <li>
                <a href="#services">🎪 تأجير الألعاب</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>تواصل معنا</h4>
            <ul>
              <li>
                <a href={waLink} target="_blank" rel="noreferrer">
                  💬 واتساب
                </a>
              </li>
              <li>
                <a
                  href={
                    content.social?.instagram?.url ||
                    "https://instagram.com/hicare"
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  📸 إنستقرام
                </a>
              </li>
              <li>
                <a
                  href={
                    content.social?.facebook?.url ||
                    "https://facebook.com/hicare"
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  👍 فيسبوك
                </a>
              </li>
              <li>
                <a
                  href={
                    content.social?.tiktok?.url || "https://tiktok.com/@hicare"
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  🎵 تيك توك
                </a>
              </li>
              <li>
                <a
                  href={
                    content.social?.snapchat?.username
                      ? `https://snapchat.com/add/${content.social.snapchat.username}`
                      : "https://snapchat.com/add/hicare"
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  👻 سناب شات
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p>© 2024 {brandName}. جميع الحقوق محفوظة.</p>
          <p>صُنع بـ ❤️ لخدمة عملائنا الكرام</p>
        </div>
      </footer>
    </>
  );
}
