// src/pages/UseCases.tsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import helmetLogo from "../assets/Helemt2.png";
import FooterSection from "../Components/FooterSection";

// ✅ Use-case images from src/assets
import ConstructionImg from "../assets/Constructions.png";
import MineImg from "../assets/Mine.png";
import FactoryImg from "../assets/Factory.png";
import LoneWorkerImg from "../assets/Loneworker.png";

type UseCase = {
  id: "construction" | "mining" | "factories" | "lone-workers";
  title: string;
  subtitle: string;
  tags: string[];
  sensors: string[];
  outcomes: string[];
};

const USE_CASE_IMAGES: Record<UseCase["id"], string> = {
  construction: ConstructionImg,
  mining: MineImg,
  factories: FactoryImg,
  "lone-workers": LoneWorkerImg,
};

const USE_CASES: UseCase[] = [
  {
    id: "construction",
    title: "Construction sites",
    subtitle: "Detect heat stress, unsafe exposure, and response gaps across crews.",
    tags: ["Multi-site", "Safety supervisors", "Compliance"],
    sensors: ["Vitals (HR/SpO₂)", "Noise exposure", "Gas sensor pack (optional)", "BLE proximity (optional)"],
    outcomes: ["Early risk detection", "Faster incident response", "Audit-ready logs"],
  },
  {
    id: "mining",
    title: "Mining operations",
    subtitle: "Monitor hazardous gases and fatigue indicators in high-risk zones.",
    tags: ["Underground", "High risk", "Continuous monitoring"],
    sensors: ["Gas sensor pack", "Vitals (HR/SpO₂)", "GPS / Location (optional)", "BLE proximity (optional)"],
    outcomes: ["Reduce exposure time", "Improve evacuation decisions", "Zone-wise alerts"],
  },
  {
    id: "factories",
    title: "Factories & plants",
    subtitle: "Track incidents, environmental thresholds, and worker safety at scale.",
    tags: ["Plant ops", "Shift-based", "Repeatable workflows"],
    sensors: ["Vitals (HR/SpO₂)", "Noise exposure", "BLE proximity", "Gas sensor pack (optional)"],
    outcomes: ["Lower incident frequency", "Better shift oversight", "Centralized dashboard"],
  },
  {
    id: "lone-workers",
    title: "Lone workers",
    subtitle: "Add visibility for remote or isolated staff with proactive escalation.",
    tags: ["Remote", "Field staff", "Escalation"],
    sensors: ["Vitals (HR/SpO₂)", "GPS / Location", "BLE proximity (optional)"],
    outcomes: ["Safer solo work", "Quicker dispatch", "Better accountability"],
  },
];

export default function UseCasesPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("idToken");
  const dashboardTo = token ? "/dashboard" : "/login";

  return (
    <div style={styles.page}>
      <style>{css}</style>

      {/* Navbar */}
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
            <NavLink to={dashboardTo} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} style={styles.navLink}>
              Dashboard
            </NavLink>
            <NavLink to="/use-cases" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} style={styles.navLink}>
              Use Cases
            </NavLink>
            <NavLink to="/docs" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} style={styles.navLink}>
              Docs
            </NavLink>
            {/* <NavLink to="/pricing" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} style={styles.navLink}>
              Pricing
            </NavLink> */}
          </div>

          <div style={styles.navRight}>
            <button className="btn btn-outline" style={styles.btnOutline} onClick={() => navigate("/contact-sales")}>
              Contact Sales
            </button>
            <button className="btn btn-primary" style={styles.btnPrimary} onClick={() => navigate("/login")}>
              Sign in
            </button>
          </div>
        </div>
      </nav>

      <main style={styles.main}>
        {/* Header */}
        <header className="ucHead">
          <div className="eyebrow">USE CASES</div>
          <h1 className="title">Where C-Smart makes safety measurable.</h1>
          <p className="sub">
            Pick a scenario below to see what teams typically monitor, what alerts they rely on, and what outcomes they improve. Everything rolls
            into one clean dashboard across multiple helmets.
          </p>

          <div className="pills">
            {["Real-time vitals", "Environment intelligence", "Zone-wise alerts", "Audit-ready logs"].map((t) => (
              <span key={t} className="pill">
                {t}
              </span>
            ))}
          </div>
        </header>

        {/* Use case grid */}
        <section className="ucGrid">
          {USE_CASES.map((u) => (
            <a key={u.id} href={`#${u.id}`} className="ucCard">
              <div className="ucTop">
                <div>
                  <div className="ucTitle">{u.title}</div>
                  <div className="ucSub">{u.subtitle}</div>
                </div>
                <div className="chev" aria-hidden="true">
                  →
                </div>
              </div>

              <div className="tagRow">
                {u.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>

              <div className="miniCols">
                <div className="miniCol">
                  <div className="miniLabel">Typical sensors</div>
                  <ul className="miniList">
                    {u.sensors.slice(0, 3).map((s) => (
                      <li key={s}>
                        <span className="dot" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="miniCol">
                  <div className="miniLabel">Outcomes</div>
                  <ul className="miniList">
                    {u.outcomes.slice(0, 3).map((o) => (
                      <li key={o}>
                        <span className="dot" />
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </a>
          ))}
        </section>

        {/* Deep dive sections */}
        <section className="ucDetails">
          {USE_CASES.map((u, idx) => (
            <div key={u.id} id={u.id} className={`detailRow ${idx % 2 === 1 ? "rev" : ""}`}>
              <div className="detailText">
                <div className="detailEyebrow">Use case</div>
                <h2 className="detailTitle">{u.title}</h2>
                <p className="detailSub">{u.subtitle}</p>

                <div className="detailBlock">
                  <div className="detailLabel">Recommended monitoring</div>
                  <ul className="detailList">
                    {u.sensors.map((s) => (
                      <li key={s}>
                        <span className="dot" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="detailBlock">
                  <div className="detailLabel">What teams usually improve</div>
                  <ul className="detailList">
                    {u.outcomes.map((o) => (
                      <li key={o}>
                        <span className="dot" />
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="detailActions">
                  <button className="btn btn-primary cta" onClick={() => navigate("/pricing")}>
                    View pricing
                  </button>
                  <button className="btn btn-outline cta" onClick={() => navigate("/contact-sales")}>
                    Talk to Sales
                  </button>
                </div>
              </div>

              {/* ✅ Image directly (no card / no yellow glow) */}
              <div className="detailVisual" aria-hidden="true">
                <img src={USE_CASE_IMAGES[u.id]} className="visualImg" alt="" loading="lazy" draggable={false} />
              </div>
            </div>
          ))}
        </section>

       
       
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

  main: { maxWidth: 1400, margin: "0 auto", padding: "26px 32px 60px" },
};

const css = `
  *{ box-sizing: border-box; }
  html{ scroll-behavior: smooth; }

  :root{
    --bg:#1a1a1a;
    --border: rgba(255,255,255,0.10);
    --text: rgba(255,255,255,0.92);
    --muted: rgba(255,255,255,0.62);
    --yellow:#ffea00;
  }

  /* Navbar link hover + active (underline) */
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

  .btn:focus, .btn:focus-visible, .btn:active{
    outline:none !important;
    box-shadow:none !important;
  }

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

  /* Head */
  .ucHead{ padding: 22px 0 12px; }
  .eyebrow{
    font-size: 12px;
    letter-spacing: 0.18em;
    color: rgba(255,255,255,0.55);
    font-weight: 700;
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
    line-height: 1.7;
    color: var(--muted);
    font-weight: 500;
  }
  .pills{ margin-top: 14px; display:flex; gap: 10px; flex-wrap: wrap; }
  .pill{
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.02);
    border-radius: 999px;
    padding: 8px 12px;
    font-size: 13px;
    color: rgba(255,255,255,0.72);
    font-weight: 600;
  }

  /* Grid cards */
  .ucGrid{
    margin-top: 18px;
    display:grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .ucCard{
    text-decoration: none;
    color: white;
    border-radius: 18px;
    border: 1px solid var(--border);
    background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(0,0,0,0.20));
    padding: 18px;
    box-shadow: 0 18px 44px rgba(0,0,0,0.25);
    transition: 0.18s ease;
    display:block;
  }
  .ucCard:hover{
    border-color: rgba(255,255,255,0.18);
    transform: translateY(-1px);
  }
  .ucTop{ display:flex; justify-content: space-between; gap: 12px; align-items:flex-start; }
  .ucTitle{ font-size: 18px; font-weight: 700; letter-spacing: -0.01em; }
  .ucSub{ margin-top: 6px; font-size: 13px; color: var(--muted); font-weight: 500; max-width: 520px; }
  .chev{
    width: 34px; height: 34px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.10);
    background: rgba(255,255,255,0.02);
    display:flex; align-items:center; justify-content:center;
    color: rgba(255,255,255,0.70);
    font-size: 16px;
    flex: 0 0 auto;
  }

  .tagRow{ margin-top: 12px; display:flex; gap: 8px; flex-wrap: wrap; }
  .tag{
    font-size: 12px;
    font-weight: 600;
    color: rgba(255,255,255,0.72);
    border: 1px solid rgba(255,255,255,0.10);
    background: rgba(255,255,255,0.02);
    padding: 6px 10px;
    border-radius: 999px;
  }

  .miniCols{
    margin-top: 14px;
    display:grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  .miniLabel{
    font-size: 12px;
    font-weight: 700;
    color: rgba(255,255,255,0.62);
    letter-spacing: 0.04em;
    margin-bottom: 8px;
  }
  .miniList{ list-style:none; margin:0; padding:0; display:grid; gap: 8px; }
  .miniList li{ display:flex; gap: 10px; align-items:flex-start; font-size: 13px; color: rgba(255,255,255,0.78); font-weight: 600; }
  .dot{ width: 8px; height: 8px; border-radius: 999px; background: rgba(255,234,0,0.85); margin-top: 5px; box-shadow: 0 0 0 4px rgba(255,234,0,0.08); }

  /* Details */
  .ucDetails{ margin-top: 22px; display:grid; gap: 16px; }
  .detailRow{
    border-radius: 18px;
    border: 1px solid var(--border);
    background: rgba(0,0,0,0.22);
    box-shadow: 0 18px 44px rgba(0,0,0,0.25);
    padding: 18px;
    display:grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 16px;
    scroll-margin-top: 86px;
  }
  .detailRow.rev{ grid-template-columns: 0.9fr 1.1fr; }
  .detailRow.rev .detailText{ order: 2; }
  .detailRow.rev .detailVisual{ order: 1; }

  .detailEyebrow{
    font-size: 12px;
    letter-spacing: 0.18em;
    color: rgba(255,255,255,0.55);
    font-weight: 700;
    text-transform: uppercase;
  }
  .detailTitle{ margin: 10px 0 8px; font-size: 28px; font-weight: 750; letter-spacing: -0.01em; color: var(--text); }
  .detailSub{ margin: 0 0 14px; color: var(--muted); font-size: 14px; line-height: 1.7; font-weight: 500; max-width: 820px; }

  .detailBlock{ margin-top: 12px; }
  .detailLabel{
    font-size: 12px;
    font-weight: 700;
    color: rgba(255,255,255,0.62);
    letter-spacing: 0.04em;
    margin-bottom: 8px;
  }
  .detailList{ list-style:none; padding:0; margin:0; display:grid; gap: 9px; }
  .detailList li{ display:flex; gap: 10px; align-items:flex-start; font-size: 13px; color: rgba(255,255,255,0.78); font-weight: 600; }

  .detailActions{ margin-top: 14px; display:flex; gap: 10px; flex-wrap: wrap; }
  .cta{
    border-radius: 12px;
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 650;
  }

  /* ✅ Image directly (no glow / no card) */
  .detailVisual{
    display:flex;
    align-items: stretch;
    justify-content: stretch;
    min-height: 360px;
  }
  .visualImg{
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 16px;
    display: block;
  }

  /* CTA band */
  .ctaBand{
    margin-top: 18px;
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
  .ctaTitle{ font-size: 18px; font-weight: 750; color: rgba(255,255,255,0.92); }
  .ctaSub{ margin-top: 6px; font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.62); max-width: 720px; }
  .ctaBtns{ display:flex; gap: 10px; flex-wrap: wrap; }
  .ctaBig{
    border-radius: 12px;
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 650;
  }

  @media (max-width: 980px){
    .ucGrid{ grid-template-columns: 1fr; }
    .detailRow{ grid-template-columns: 1fr; }
    .detailRow.rev .detailText{ order: 1; }
    .detailRow.rev .detailVisual{ order: 2; }
    .detailVisual{ min-height: 260px; }
    .title{ font-size: 36px; }
  }

  @media (max-width: 768px){
    .nav-link{ display:none; }
  }
`;
