import { FaWhatsapp } from "react-icons/fa";

export default function Services({ whatsappLink }) {
  return (
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
            <img src="/moving.jpg" alt="نقل الأثاث" />
            <div className="svc-img-overlay"></div>
            <span className="svc-img-badge">⭐ الأكثر طلبًا</span>
            <div className="svc-img-icon">🚛</div>
          </div>
          <div className="svc-body">
            <h2>نقل الأثاث</h2>
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
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="svc-btn"
            >
              <FaWhatsapp color="#25D366" size={20} />
              احجز الآن ←
            </a>
          </div>
        </div>

        {/* تنظيف الفلل */}
        <div className="svc-card">
          <div className="svc-img-wrap">
            <img src="/cleaning.jpg" alt="تنظيف الفلل" />
            <div className="svc-img-overlay"></div>
            <span className="svc-img-badge">✨ تنظيف عميق</span>
            <div className="svc-img-icon">🏡</div>
          </div>
          <div className="svc-body">
            <h2>تنظيف الفلل</h2>
            <p>
              خدمة تنظيف شاملة وعميقة للفلل والمنازل باستخدام أحدث المعدات ومواد
              التنظيف الصديقة للبيئة لنتيجة مبهرة.
            </p>
            <ul className="svc-features">
              <li>تنظيف شامل لجميع الغرف</li>
              <li>تلميع الأرضيات والنوافذ</li>
              <li>تعقيم الحمامات والمطابخ</li>
              <li>إزالة البقع والأتربة العميقة</li>
            </ul>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="svc-btn"
            >
              <FaWhatsapp color="#25D366" size={20} />
              احجز الآن ←
            </a>
          </div>
        </div>

        {/* تأجير الألعاب */}
        <div className="svc-card">
          <div className="svc-img-wrap">
            <img src="/games.png" alt="تأجير الألعاب للأطفال" />
            <div className="svc-img-overlay"></div>
            <span className="svc-img-badge">🎉 للمناسبات</span>
            <div className="svc-img-icon">🎪</div>
          </div>
          <div className="svc-body">
            <h2>تأجير ألعاب الأطفال للمناسبات</h2>
            <p>
              اجعل حفلات أطفالك لا تُنسى! نوفر أجمل الألعاب النفخية والترفيهية
              للأعياد والمناسبات مع التركيب والإزالة.
            </p>
            <ul className="svc-features">
              <li>زحاليق نفخية وقلاع ترفيهية</li>
              <li>ألعاب آمنة ومعتمدة</li>
              <li>توصيل وتركيب وإزالة</li>
              <li>مناسب لجميع المناسبات</li>
            </ul>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="svc-btn"
            >
              <FaWhatsapp color="#25D366" size={20} />
              احجز الآن ←
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
