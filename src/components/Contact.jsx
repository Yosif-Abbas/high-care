import { FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { FiInstagram } from "react-icons/fi";
import { parsePhoneNumberFromString } from "libphonenumber-js";

function formatPhone(phone) {
  const parsed = parsePhoneNumberFromString(phone, "QA");

  if (!parsed) return phone;

  return parsed.formatInternational();
}

export default function Contact({ content }) {
  return (
    <section className="contact-section" id="contact">
      <p className="sec-tag">تواصل معنا</p>
      <h2 className="sec-title">نحن هنا لخدمتك</h2>
      <p className="sec-sub">
        تواصل معنا الآن عبر واتساب أو أي منصة تواصل اجتماعي — نرد بسرعة ونرتب لك
        الخدمة في أقرب وقت
      </p>

      <div className="social-contact-grid">
        {content.social.whatsapp.map(
          (wa, i) =>
            /^\+?\d{6,15}$/.test(wa) && (
              <a
                key={i}
                href={`https://wa.me/${wa}`}
                target="_blank"
                rel="noreferrer"
                className="social-btn btn-whatsapp"
              >
                <span className="s-icon">
                  <FaWhatsapp color="" size={32} />
                </span>{" "}
                <p className="flex flex-col">
                  <span className="">واتساب</span>
                  <span className="text-[9px] text-gray-100 " dir="ltr">
                    {formatPhone(wa)}
                  </span>
                </p>
              </a>
            ),
        )}
        <a
          href={content.social?.instagram}
          target="_blank"
          rel="noreferrer"
          className="social-btn btn-instagram"
        >
          <span className="s-icon">
            <FiInstagram size={32} />
          </span>{" "}
          إنستقرام
        </a>
        <a
          href={content.social?.facebook}
          target="_blank"
          rel="noreferrer"
          className="social-btn btn-facebook"
        >
          <span className="s-icon">
            <FaFacebookF size={28} />{" "}
          </span>{" "}
          فيسبوك
        </a>
        {/* <a
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
        </a> */}
      </div>
    </section>
  );
}
