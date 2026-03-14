import { FaWhatsapp } from "react-icons/fa";

export default function Hero({ brandName, slogan, description, whatsappLink }) {
  return (
    <section className="hero" id="home">
      <div className="hero-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="hero-content">
        <div className="hero-badge">⭐ {slogan}</div>
        <h1>
          نحن <span className="highlight">{brandName}</span>
          <br />
          خدمات تجعل حياتك أسهل
        </h1>
        <p>{description}</p>
        <div className="hero-btns">
          <a href="#services" className="btn-main">
            🔍 استكشف خدماتنا
          </a>
          {/* <a target="_blank" rel="noreferrer" className="btn-outline-white"> */}
          {/* </a> */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-white"
          >
            <FaWhatsapp color="#25D366" size={32} />
            تواصل واتساب
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
  );
}
