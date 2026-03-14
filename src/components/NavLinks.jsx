export default function NavLinks({ isMobile, isMenuOpen, onClose }) {
  return (
    <div
      className={`z-100 ${
        isMobile && isMenuOpen
          ? "absolute top-16 left-0 flex w-full flex-col items-center divide-y divide-white bg-[#fffffff5]  shadow-md transition-all"
          : "hidden gap-6 md:flex"
      }`}
    >
      <ul
        className={`navLinks ${isMobile ? "flex flex-col text-center gap-y-2" : "gap-8 md:flex items-center"}`}
        id="navLinks"
      >
        <li>
          <a href="#services" onClick={onClose}>
            خدماتنا
          </a>
        </li>
        <li>
          <a href="#process" onClick={onClose}>
            كيف نعمل
          </a>
        </li>
        <li>
          <a href="#whyus" onClick={onClose}>
            لماذا نحن
          </a>
        </li>
        <li>
          <a href="#testimonials" onClick={onClose}>
            آراء العملاء
          </a>
        </li>
        <li>
          <a
            href="#contact"
            className={`${isMobile ? "" : "nav-cta"}`}
            onClick={onClose}
          >
            تواصل معنا
          </a>
        </li>
      </ul>
    </div>
  );
}
