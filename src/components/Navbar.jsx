import { useEffect, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import Hamburger from "./Hamburger";
import { GiHamburgerMenu } from "react-icons/gi";
import NavLinks from "./NavLinks";
export default function Navbar({ brandName }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    () => setIsMenuOpen(false);
  }, []);

  return (
    <nav id="navbar">
      <div className="logo-wrap">
        <div className="logo-icon">
          {/* {logoUrl ? <img src={logoUrl} alt={brandName} /> : logoEmoji} */}
          <img src="/logo.png" alt={brandName} />
        </div>
        {/* <span className="logo-text">{brandName}</span> */}
      </div>

      <button
        className="cursor-pointer text-3xl md:hidden"
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        <GiHamburgerMenu />
      </button>
      <NavLinks
        isMobile={isMobile}
        isMenuOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </nav>
  );
}
