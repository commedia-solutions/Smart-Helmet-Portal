// src/pages/Landing.tsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import helmetLogo from "../assets/Helemt2.png";
import HeroSection from "../Components/HeroSection";
import TrustedStrip from "../Components/TrustedStrip";
import FeaturesSection from "../Components/FeaturesSection";
import HowItWorksSection from "../Components/HowItWorksSection";
import UseCasesSection from "../Components/UseCasesSection";
import DashboardShowcaseSection from "../Components/DashboardShowcaseSection";
import AnalyticsBandSection from "../Components/AnalyticsBandSection";
import ComparisonSection from "../Components/ComparisonSection";
import Testimonialsection from "../Components/Testimonial";
import FooterSection from "../Components/FooterSection";


const Landing = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("idToken");

  const dashboardTo = token ? "/dashboard" : "/login";

  return (
    <div style={styles.page}>
      <style>{css}</style>

      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <div style={styles.navLeft}>
            <div style={styles.logoWrap} onClick={() => navigate("/")}>
              <img src={helmetLogo} alt="C-Smart" style={styles.logoImg} />
              <span style={styles.logoText}>C-Smart</span>
            </div>

            <span style={styles.divider} />
          </div>

          <div style={styles.navCenter}>
            <NavLink
              to={dashboardTo}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              style={styles.navLink}
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/use-cases"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              style={styles.navLink}
            >
              Use Cases
            </NavLink>

            <NavLink
              to="/docs"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              style={styles.navLink}
            >
              Docs
            </NavLink>

            {/* <NavLink
              to="/pricing"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              style={styles.navLink}
            >
              Pricing
            </NavLink> */}
          </div>

          <div style={styles.navRight}>
            <button
              className="btn btn-outline"
              style={styles.btnOutline}
              onClick={() => navigate("/contact-sales")}
            >
              Contact Sales
            </button>

            <button
              className="btn btn-primary"
              style={styles.btnPrimary}
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
          </div>
        </div>
      </nav>

      {/* ✅ Constrained content */}
      <main style={styles.main}>
        <HeroSection />
        <TrustedStrip />
        <FeaturesSection />
        <HowItWorksSection />
        <UseCasesSection />
        <DashboardShowcaseSection />
        <AnalyticsBandSection />
        <ComparisonSection />
        <Testimonialsection />


      </main>

      {/* ✅ Full-width footer (traditional) */}
     <FooterSection />
    </div>
  );
};

export default Landing;

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", backgroundColor: "#1a1a1a", color: "#fff" },

  navbar: {
    backgroundColor: "#1a1a1a",
    borderBottom: "1px solid #2d2d2d",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    height: 56,
  },

  navContent: {
    maxWidth: 1400,
    margin: "0 auto",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 32px",
  },

  navLeft: { display: "flex", alignItems: "center", gap: 18 },

  logoWrap: { display: "flex", alignItems: "center", gap: 12, cursor: "pointer" },

  logoImg: { width: 40, height: 40, objectFit: "contain", display: "block" },

  logoText: { fontSize: 20, fontWeight: 700, whiteSpace: "nowrap" },

  divider: { width: 1, height: 22, background: "rgba(255,255,255,0.12)" },

  navCenter: {
    display: "flex",
    alignItems: "center",
    gap: 44,
    flex: 1,
    marginLeft: 18,
  },

  navLink: {
    color: "#d4d4d4",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 600,
    padding: "8px 0",
    whiteSpace: "nowrap",
  },

  navRight: { display: "flex", alignItems: "center", gap: 12 },

  btnOutline: {
    background: "transparent",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.16)",
    padding: "10px 18px",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },

  btnPrimary: {
    background: "#ffea00",
    color: "#0b0b0d",
    border: "1px solid rgba(255,234,0,0.35)",
    padding: "10px 22px",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },

  main: { maxWidth: 1400, margin: "0 auto", padding: "28px 32px 60px" },
};


const css = `
  /* ✅ Navbar link hover + active = yellow (no purple) */
  .nav-link:hover{
    color: #ffea00 !important;
    transition: 0.15s ease;
  }
  .nav-link.active{
    color: #ffea00 !important;
  }

  /* subtle underline for active link */
  .nav-link{
    position: relative;
  }
  .nav-link.active::after{
    content:"";
    position:absolute;
    left:0;
    right:0;
    bottom:-18px;
    height:2px;
    background: rgba(255,234,0,0.9);
    border-radius: 999px;
  }

  .btn:focus, .btn:focus-visible, .btn:active{
    outline: none !important;
    box-shadow: none !important;
  }

  /* ✅ Outline button hover: yellow highlight */
  .btn-outline:hover{
    background: rgba(255,255,255,0.06);
    border-color: rgba(255,234,0,0.55) !important;
    box-shadow: 0 0 0 4px rgba(255,234,0,0.10);
    transform: translateY(-1px);
    transition: 0.15s ease;
  }

  .btn-primary:hover{
    transform: translateY(-1px);
    transition: 0.15s ease;
  }

  /* ✅ footer link hover */
  .footer-link:hover{
    color: #ffea00 !important;
    transition: 0.15s ease;
  }

  @media (max-width: 980px){
    footer .footer-grid { grid-template-columns: 1fr 1fr; }
  }

  @media (max-width: 768px){
    .nav-link{ display:none; }
  }
`;
