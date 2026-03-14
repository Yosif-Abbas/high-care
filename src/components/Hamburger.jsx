import { useState } from "react";

export default function Hamburger() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div>
      <div
        className="hamburger flex flex-col cursor-pointer gap-1.25 md:hidden"
        id="hamburger"
        onClick={() => setNavOpen((v) => !v)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      
    </div>
  );
}
