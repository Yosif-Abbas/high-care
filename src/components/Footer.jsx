import parsePhoneNumberFromString from "libphonenumber-js";
import { FaFacebookF, FaRegCopyright, FaWhatsapp } from "react-icons/fa";
import { FiInstagram } from "react-icons/fi";

function formatPhone(phone) {
  const parsed = parsePhoneNumberFromString(phone, "QA");

  if (!parsed) return phone;

  return parsed.formatInternational();
}

export default function Footer({ brandName, content }) {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="footer-top">
        <div>
          <div className="logo-wrap" style={{ marginBottom: "0.5rem" }}>
            <div className="logo-icon" style={{ width: 38, height: 38 }}>
              <img src="/logo.png" alt={brandName} />
            </div>
            <span className="logo-text">{brandName}</span>
          </div>
          <p className="footer-brand-desc">
            {content.branding?.description ||
              "نقدم خدمات منزلية ومناسباتية احترافية بجودة عالية وأسعار مناسبة. نقل الأثاث، تنظيف الفلل، وتأجير الألعاب للأطفال — كل ما تحتاجه في مكان واحد."}
          </p>
          
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
            {content.social.whatsapp.map(
              (wa, i) =>
                /^\+?\d{6,15}$/.test(wa) && (
                  <li key={i}>
                    <a
                      href={`https://wa.me/${wa}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="s-icon">
                        <FaWhatsapp size={20} />
                      </span>{" "}
                      <p className="flex flex-col">
                        <span className="">واتساب</span>
                        <span className="text-[7px] text-gray-100 " dir="ltr">
                          {formatPhone(wa)}
                        </span>
                      </p>
                    </a>
                  </li>
                ),
            )}
            <li>
              <a
                href={content.social?.instagram}
                target="_blank"
                rel="noreferrer"
              >
                <span className="s-icon">
                  <FiInstagram size={20} />
                </span>{" "}
                إنستقرام
              </a>
            </li>
            <li>
              <a
                href={content.social?.facebook}
                target="_blank"
                rel="noreferrer"
              >
                <span className="s-icon">
                  <FaFacebookF size={20} />{" "}
                </span>{" "}
                فيسبوك
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom">
        <p className="flex items-center gap-x-1">
          <span>
            <FaRegCopyright />
          </span>
          {year} {brandName}. جميع الحقوق محفوظة.
        </p>
        <p>صُنع بـ ❤️ لخدمة عملائنا الكرام</p>
      </div>
    </footer>
  );
}
