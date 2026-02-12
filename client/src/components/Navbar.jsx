// src/components/Navbar.jsx
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/api";
import { useState, useEffect, useMemo } from "react";
import CardNav from "./CardNav";

const Navbar = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [theme, setTheme] = useState("light");
  const token = localStorage.getItem("token");

  async function getUser() {
    if (token) {
      try {
        const user = await getCurrentUser(token);
        setCurrentUser(user);
        localStorage.setItem("user", JSON.stringify(user));
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    }
  }

  useEffect(() => {
    getUser();
  }, [token]);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "neon") {
      setTheme("neon");
      document.documentElement.classList.add("theme-neon");
    }
  }, []);

  const setThemeMode = (next) => {
    const value = next === "neon" ? "neon" : "light";
    setTheme(value);
    if (value === "neon") {
      document.documentElement.classList.add("theme-neon");
    } else {
      document.documentElement.classList.remove("theme-neon");
    }
    localStorage.setItem("theme", value);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    navigate("/login");
  };

  const items = useMemo(() => {
    const base = [
      {
        label: "Shop",
        bgColor: "#0D0716",
        textColor: "#fff",
        links: [
          { label: "All Items", ariaLabel: "All Items", to: "/items" },
          { label: "Men", ariaLabel: "Shop Men", to: "/items?category=Men" },
          { label: "Women", ariaLabel: "Shop Women", to: "/items?category=Women" },
        ],
      },
      {
        label: "Sell",
        bgColor: "#170D27",
        textColor: "#fff",
        links: [
          { label: "Upload", ariaLabel: "Upload Item", to: "/upload" },
          { label: "Dashboard", ariaLabel: "My Dashboard", to: "/dashboard" },
        ],
      },
      {
        label: "Account",
        bgColor: "#271E37",
        textColor: "#fff",
        links: currentUser
          ? [
              { label: "Profile", ariaLabel: "Profile", to: "/dashboard" },
              { label: "Logout", ariaLabel: "Logout", onClick: handleLogout },
            ]
          : [
              { label: "Login", ariaLabel: "Login", to: "/login" },
              { label: "Register", ariaLabel: "Register", to: "/register" },
            ],
      },
    ];

    if (currentUser?.role === "admin") {
      base.push({
        label: "Admin",
        bgColor: "#3B0D0D",
        textColor: "#fff",
        links: [{ label: "Dashboard", ariaLabel: "Admin Dashboard", to: "/admin" }],
      });
    }

    return base;
  }, [currentUser]);

  return (
    <nav className="relative w-full z-50">
      <CardNav
        logo="/logo.png"
        logoAlt="ReWear"
        items={items}
        baseColor={theme === "neon" ? "#0b0f1a" : "#ffffff"}
        menuColor={theme === "neon" ? "#e6f4ff" : "#000000"}
        buttonBgColor={theme === "neon" ? "#00f5ff" : "#111111"}
        buttonTextColor={theme === "neon" ? "#001018" : "#ffffff"}
        ctaLabel={currentUser ? "Dashboard" : "Login"}
        ctaTo={currentUser ? "/dashboard" : "/login"}
        onCtaClick={currentUser ? undefined : undefined}
        theme={theme === "neon" ? "neon" : "light"}
        onThemeChange={setThemeMode}
      />
    </nav>
  );
};

export default Navbar;
