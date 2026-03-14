export default function Whyus({ brandName }) {
  return (
    <section className="whyus" id="whyus">
      <p className="sec-tag">مميزاتنا</p>
      <h2 className="sec-title">
        لماذا تختار <span className="highlight">{brandName}</span>؟
      </h2>
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
            فريقنا مدرب وموثوق وذو خبرة طويلة تضمن سلامة ممتلكاتك وأمانها التام.
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
          <p>نستخدم أفضل المعدات والأساليب لضمان نتيجة مُرضية تفوق توقعاتك.</p>
        </div>
        <div className="why-card">
          <div
            className="why-icon"
            style={{ background: "rgba(99,102,241,0.1)" }}
          >
            💰
          </div>
          <h3>أسعار مناسبة</h3>
          <p>خدمات احترافية بأسعار منافسة وشفافة بدون رسوم مخفية أو مفاجآت.</p>
        </div>
      </div>
    </section>
  );
}
