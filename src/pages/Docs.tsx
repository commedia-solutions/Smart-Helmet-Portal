// src/pages/Docs.tsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import helmetLogo from "../assets/Helemt2.png";
import FooterSection from "../Components/FooterSection";

function SectionCard({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="docCard">
      <div className="docCardHead">
        <div className="docCardTitle">{title}</div>
        {hint ? <div className="docCardHint">{hint}</div> : null}
      </div>
      <div className="docCardBody">{children}</div>
    </section>
  );
}

export default function Docs() {
  const navigate = useNavigate();
  const token = localStorage.getItem("idToken");
  const dashboardTo = token ? "/dashboard" : "/login";

  return (
    <div style={styles.page} className="docsPage">
      <style>{css}</style>

      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <div style={styles.navLeft}>
            <div style={styles.logoWrap} onClick={() => navigate("/")}>
              <img src={helmetLogo} alt="C-Smart" style={styles.logoImg} />
              <span style={styles.logoText} className="brandText">
                C-Smart
              </span>
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

      <main style={styles.main}>
        {/* Header */}
        <header className="docsHead">
          <div className="eyebrow">DOCS</div>
          <h1 className="title">Documentation, deployment & support.</h1>
          <p className="sub">
            This page will cover product usage, deployment steps, user manual guidance, and troubleshooting if a helmet
            is not working.
          </p>

          <div className="pills">
            {["Getting started", "Deployment", "User manual", "Troubleshooting", "Support"].map((t) => (
              <span key={t} className="pill">
                {t}
              </span>
            ))}
          </div>
        </header>

        {/* Layout */}
        <div className="docsLayout">
          {/* Left: mini nav */}
          <aside className="docsNav">
            <div className="docsNavTitle">On this page</div>

            <a className="docsNavItem" href="#usage">
              Usage understanding
            </a>
            <a className="docsNavItem" href="#deployment">
              Deployment steps
            </a>
            <a className="docsNavItem" href="#manual">
              User manual
            </a>
            <a className="docsNavItem" href="#troubleshooting">
              Helmet not working
            </a>
            <a className="docsNavItem" href="#support">
              Support
            </a>

            <div className="docsNavDivider" />

            <div className="docsNavTip">
              <div className="docsNavTipTitle">Quick support</div>
              <div className="docsNavTipText">
                If you’re stuck, use “Contact Sales” for now — later we’ll add support channels here.
              </div>
            </div>
          </aside>

          {/* Right: content cards */}
          <section className="docsContent">
            <SectionCard title="Usage understanding" hint="How to read vitals, exposure signals, alerts and dashboards.">
              <div id="usage" className="anchor" />
              <div className="emptyBlock">
                <div className="emptyTitle">Content coming soon</div>
                <div className="emptyText">We’ll add step-by-step usage guidance here.</div>
              </div>
            </SectionCard>

            <SectionCard title="Deployment steps" hint="Setup, onboarding, connectivity and dashboard access.">
              <div id="deployment" className="anchor" />
              <div className="emptyBlock">
                <div className="emptyTitle">Content coming soon</div>
                <div className="emptyText">We’ll add deployment steps and environment setup here.</div>
              </div>
            </SectionCard>

            <SectionCard title="User manual" hint="How operators and supervisors use the helmet daily.">
              <div id="manual" className="anchor" />
              <div className="emptyBlock">
                <div className="emptyTitle">Content coming soon</div>
                <div className="emptyText">We’ll add a full user manual flow here.</div>
              </div>
            </SectionCard>

            <SectionCard title="Helmet not working" hint="Basic troubleshooting checklist and common fixes.">
              <div id="troubleshooting" className="anchor" />
              <div className="emptyBlock">
                <div className="emptyTitle">Content coming soon</div>
                <div className="emptyText">We’ll add troubleshooting steps and diagnostics here.</div>
              </div>
            </SectionCard>

            <SectionCard title="Support" hint="Support channels, SLA, warranty / replacement process.">
              <div id="support" className="anchor" />
              <div className="emptyBlock">
                <div className="emptyTitle">Content coming soon</div>
                <div className="emptyText">We’ll add support details and escalation paths here.</div>
              </div>
            </SectionCard>

            {/* CTA band */}
            <section className="ctaBand">
              <div>
                <div className="ctaTitle">Need help right now?</div>
                <div className="ctaSub">
                  Until docs are finalized, reach out and we’ll guide you through setup and troubleshooting.
                </div>
              </div>

              <div className="ctaBtns">
                <button className="btn btn-primary ctaBig" onClick={() => navigate("/contact-sales")}>
                  Contact team
                </button>
                <button className="btn btn-outline ctaBig" onClick={() => navigate("/use-cases")}>
                  View use cases
                </button>
              </div>
            </section>
          </section>
        </div>
      </main>

      <FooterSection />
    </div>
  );
}

/* ---------------- styles ---------------- */

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
  logoText: { fontSize: 20, fontWeight: 600, whiteSpace: "nowrap" }, // slightly lighter
  divider: { width: 1, height: 22, background: "rgba(255,255,255,0.12)" },

  navCenter: {
    display: "flex",
    alignItems: "center",
    gap: 44,
    flex: 1,
    marginLeft: 18,
  },

  navLink: {
    color: "rgba(255,255,255,0.72)",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
    padding: "8px 0",
    whiteSpace: "nowrap",
    letterSpacing: "0.02em",
  },

  navRight: { display: "flex", alignItems: "center", gap: 12 },

  btnOutline: {
    background: "transparent",
    color: "rgba(255,255,255,0.92)",
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

  main: { maxWidth: 1400, margin: "0 auto", padding: "26px 32px 60px" },
};

const css = `
  /* ✅ Google Font import */
  @import url('https://fonts.googleapis.com/css2?family=Sansation:wght@300;400;700&display=swap');

  *{ box-sizing: border-box; }
  html{ scroll-behavior:smooth; }

  :root{
    --border: rgba(255,255,255,0.10);
    --text: rgba(255,255,255,0.92);
    --muted: rgba(255,255,255,0.62);
    --muted2: rgba(255,255,255,0.48);
    --yellow:#ffea00;
  }

  /* ✅ Make Sansation default for this page */
  .docsPage{
    font-family: "Sansation", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    font-weight: 400;
    letter-spacing: 0.01em;
  }

  /* Navbar underline */
  .nav-link:hover{ color: var(--yellow) !important; transition: 0.15s ease; }
  .nav-link.active{ color: var(--yellow) !important; }
  .nav-link{ position: relative; }
  .nav-link.active::after{
    content:"";
    position:absolute;
    left:0; right:0;
    bottom:-10px;
    height:2px;
    background: rgba(255,234,0,0.9);
    border-radius: 999px;
  }

  .btn:focus, .btn:focus-visible, .btn:active{ outline:none !important; box-shadow:none !important; }
  .btn-outline:hover{
    background: rgba(255,255,255,0.06);
    border-color: rgba(255,234,0,0.55) !important;
    box-shadow: 0 0 0 4px rgba(255,234,0,0.10);
    transform: translateY(-1px);
    transition: 0.15s ease;
  }
  .btn-primary:hover{ transform: translateY(-1px); transition: 0.15s ease; }

  /* Head */
  .docsHead{ padding: 22px 0 12px; }
  .eyebrow{
    font-size: 12px;
    letter-spacing: 0.22em;
    color: rgba(255,255,255,0.55);
    font-weight: 600;
  }
  .title{
    margin: 10px 0 8px;
    font-size: 44px;
    line-height: 1.08;
    letter-spacing: -0.02em;
    font-weight: 700;
    color: var(--text);
  }
  .sub{
    margin: 0;
    max-width: 920px;
    font-size: 15px;
    line-height: 1.75;
    color: var(--muted);
    font-weight: 400;
  }

  .pills{ margin-top: 14px; display:flex; gap: 10px; flex-wrap: wrap; }
  .pill{
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.02);
    border-radius: 999px;
    padding: 8px 12px;
    font-size: 13px;
    color: rgba(255,255,255,0.74);
    font-weight: 400;
  }

  /* Layout */
  .docsLayout{
    margin-top: 18px;
    display:grid;
    grid-template-columns: 280px 1fr;
    gap: 16px;
    align-items:start;
  }

  .docsNav{
    position: sticky;
    top: 86px;
    border-radius: 18px;
    border: 1px solid var(--border);
    background: rgba(0,0,0,0.22);
    box-shadow: 0 18px 44px rgba(0,0,0,0.25);
    padding: 14px;
  }

  .docsNavTitle{
    font-size: 12px;
    letter-spacing: 0.18em;
    font-weight: 700;
    color: rgba(255,255,255,0.60);
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  .docsNavItem{
    display:block;
    padding: 10px 10px;
    border-radius: 12px;
    text-decoration:none;
    color: rgba(255,255,255,0.78);
    font-weight: 400;
    font-size: 13px;
    border: 1px solid transparent;
  }
  .docsNavItem:hover{
    background: rgba(255,255,255,0.04);
    border-color: rgba(255,255,255,0.10);
  }

  .docsNavDivider{
    height: 1px;
    background: rgba(255,255,255,0.10);
    margin: 12px 0;
  }

  .docsNavTip{
    border-radius: 14px;
    border: 1px solid rgba(255,234,0,0.18);
    background: rgba(255,234,0,0.06);
    padding: 12px;
  }
  .docsNavTipTitle{
    font-size: 13px;
    font-weight: 700;
    color: rgba(255,255,255,0.90);
  }
  .docsNavTipText{
    margin-top: 6px;
    font-size: 12px;
    line-height: 1.65;
    color: rgba(255,255,255,0.62);
    font-weight: 400;
  }

  .docsContent{ display:grid; gap: 16px; }

  .docCard{
    border-radius: 18px;
    border: 1px solid var(--border);
    background: rgba(0,0,0,0.22);
    box-shadow: 0 18px 44px rgba(0,0,0,0.25);
    padding: 16px;
    position: relative;
    scroll-margin-top: 86px;
  }
  .docCardHead{
    display:flex;
    justify-content: space-between;
    gap: 10px;
    align-items: baseline;
    flex-wrap: wrap;
  }
  .docCardTitle{
    font-size: 18px;
    font-weight: 700;
    color: rgba(255,255,255,0.92);
    letter-spacing: -0.01em;
  }
  .docCardHint{
    font-size: 12px;
    font-weight: 400;
    color: rgba(255,255,255,0.58);
  }
  .docCardBody{ margin-top: 12px; }

  .anchor{ position:absolute; top:-86px; height:1px; width:1px; }

  .emptyBlock{
    border-radius: 16px;
    border: 1px dashed rgba(255,255,255,0.16);
    background: rgba(255,255,255,0.02);
    padding: 14px;
  }
  .emptyTitle{
    font-size: 13px;
    font-weight: 700;
    color: rgba(255,255,255,0.86);
  }
  .emptyText{
    margin-top: 6px;
    font-size: 12px;
    line-height: 1.65;
    font-weight: 400;
    color: rgba(255,255,255,0.56);
  }

  /* CTA band */
  .ctaBand{
    border-radius: 18px;
    border: 1px solid rgba(255,234,0,0.20);
    background: rgba(255,234,0,0.06);
    padding: 16px 18px;
    display:flex;
    justify-content: space-between;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
  }
  .ctaTitle{ font-size: 18px; font-weight: 700; color: rgba(255,255,255,0.92); }
  .ctaSub{ margin-top: 6px; font-size: 13px; font-weight: 400; color: rgba(255,255,255,0.62); max-width: 720px; }
  .ctaBtns{ display:flex; gap: 10px; flex-wrap: wrap; }
  .ctaBig{
    border-radius: 12px;
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 600;
  }

  @media (max-width: 980px){
    .docsLayout{ grid-template-columns: 1fr; }
    .docsNav{ position: relative; top: auto; }
    .title{ font-size: 36px; }
  }

  @media (max-width: 768px){
    .nav-link{ display:none; }
  }
`;
