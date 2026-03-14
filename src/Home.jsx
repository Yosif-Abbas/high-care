import { useEffect, useState } from "react";
import PageLoading from "./components/PageLoading";
import { FaWhatsapp } from "react-icons/fa";

// use an explicit environment variable when the backend runs on a separate
// port. When deployed on Vercel the API lives on the same origin, so the
// default value is an empty string and requests are made relative to `/`.
const API_BASE = import.meta.env.VITE_API_BASE || "";
import Services from "./components/Services";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Work from "./components/Work";
import Whyus from "./components/Whyus";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // whenever the logo in content changes, update the favicon (cache-busting)
  // useEffect(() => {
  //   if (content?.images?.logo) {
  //     const link =
  //       document.querySelector("link[rel~='icon']") ||
  //       document.createElement("link");
  //     link.rel = "icon";
  //     link.href = `/favicon.ico?v=${Date.now()}`;
  //     document.head.appendChild(link);
  //   }
  // }, [content]);

  useEffect(() => {
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
    return <PageLoading />;
  }

  console.log(content);

  if (error || !content) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", direction: "rtl" }}>
        {error || "حدث خطأ غير متوقع"}
      </div>
    );
  }

  const whatsapp = content.social?.whatsapp[0] || "";
  const whatsappLink = `https://wa.me/${whatsapp}`;

  const brandName = content.branding?.name || "هاي كير";
  const slogan = content.branding?.slogan || "الجودة والاحترافية في كل خدمة";

  const description =
    content.branding?.description ||
    "نقدم خدمات متكاملة لنقل الأثاث وتنظيف الفلل وتأجير الألعاب للأطفال في المناسبات — بأيدٍ أمينة وخبرة موثوقة.";

  return (
    <>
      {/* NAVBAR */}
      <Navbar brandName={brandName} />

      {/* HERO */}
      <Hero
        slogan={slogan}
        description={description}
        whatsappLink={whatsappLink}
        brandName={brandName}
      />

      {/* SERVICES */}
      <Services whatsappLink={whatsappLink} />

      {/* HOW IT WORKS */}
      <Work />

      {/* WHY US */}
      <Whyus />

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* CONTACT */}
      <Contact content={content} whatsappLink={whatsappLink} />

      {/* FOOTER */}
      <Footer brandName={brandName} content={content} />
    </>
  );
}
