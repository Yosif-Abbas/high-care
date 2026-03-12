import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import Admin from "./Admin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/admin"
          element={<Admin />}
        />
        <Route
          path="*"
          element={
            <div
              style={{
                padding: "2rem",
                textAlign: "center",
                direction: "rtl",
                fontFamily:
                  "system-ui, -apple-system, BlinkMacSystemFont, 'Tajawal'",
              }}
            >
              <h1 style={{ marginBottom: "1rem" }}>الصفحة غير موجودة</h1>
              <p>
                <Link to="/">الرجوع للصفحة الرئيسية</Link>
              </p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

