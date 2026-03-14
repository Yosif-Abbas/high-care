import { useState } from "react";

export default function Navbar({ brandName }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <nav id="navbar">
      <div className="logo-wrap">
        <div className="logo-icon">
          {/* {logoUrl ? <img src={logoUrl} alt={brandName} /> : logoEmoji} */}
          <img src="/logo.png" alt={brandName} />
        </div>
        {/* <span className="logo-text">{brandName}</span> */}
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
  );
}
