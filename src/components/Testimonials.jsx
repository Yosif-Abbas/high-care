export default function Testimonials({ city }) {
  return (
    <section className="testimonials" id="testimonials">
      <p className="sec-tag">آراء العملاء</p>
      <h2 className="sec-title">ماذا يقول عملاؤنا</h2>
      <p className="sec-sub">آراء حقيقية من عملاء كرام وثقوا بخدماتنا</p>

      <div className="test-grid">
        <div className="test-card">
          <div className="test-stars">★★★★★</div>
          <p>
            "خدمة نقل الأثاث كانت ممتازة! الفريق جاء في الوقت المحدد وتعاملوا مع
            الأثاث باحتراف وعناية شديدة. أنصح بهم بشدة!"
          </p>
          <div className="reviewer">
            <div className="rev-avatar">أ</div>
            <div className="rev-info">
              <h4>أبو محمد العتيبي</h4>
              <span>{city} — نقل أثاث</span>
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
              <span>{city} — تنظيف فلل</span>
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
              <span>{city} — تأجير ألعاب</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
