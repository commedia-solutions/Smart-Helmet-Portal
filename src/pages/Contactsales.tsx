// src/pages/ContactSales.tsx
import React, { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import helmetLogo from "../assets/Helemt2.png";
import FooterSection from "../Components/FooterSection";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  industry: string;
  helmets: string; // keep as string to allow empty
  message: string;
  preference: "Email" | "Phone";
};

const CONTACT_ENDPOINT = (import.meta as any).env?.VITE_CONTACT_ENDPOINT as string | undefined;

export default function ContactSalesPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("idToken");
  const dashboardTo = token ? "/dashboard" : "/login";

  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    industry: "Construction",
    helmets: "",
    message: "",
    preference: "Email",
  });

  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const canSubmit = useMemo(() => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    return (
      form.fullName.trim().length >= 2 &&
      emailOk &&
      form.company.trim().length >= 2 &&
      form.role.trim().length >= 2
    );
  }, [form]);

  const update = (k: keyof FormState, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const buildMailto = () => {
    const subject = `C-Smart — Contact Sales (${form.company || "Company"})`;
    const body = [
      `Name: ${form.fullName || "-"}`,
      `Work Email: ${form.email || "-"}`,
      `Phone: ${form.phone || "-"}`,
      `Company: ${form.company || "-"}`,
      `Role: ${form.role || "-"}`,
      `Industry: ${form.industry || "-"}`,
      `Helmet count: ${form.helmets || "-"}`,
      `Preferred contact: ${form.preference || "-"}`,
      "",
      "Message:",
      form.message || "-",
    ].join("\n");

    const to = "sales@commediaindia.com";
    return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);

    if (!canSubmit) {
      setToast({ type: "error", msg: "Please fill all required fields correctly." });
      return;
    }

    const payload = {
      ...form,
      helmets: form.helmets ? Number(form.helmets) : null,
      createdAt: new Date().toISOString(),
      source: "web",
    };

    try {
      setSubmitting(true);

      if (CONTACT_ENDPOINT) {
        const res = await fetch(CONTACT_ENDPOINT, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Request failed");
        setToast({ type: "success", msg: "Request sent! Our team will reach out soon." });
        setForm((p) => ({ ...p, message: "" }));
        return;
      }

      window.location.href = buildMailto();
      setToast({ type: "success", msg: "Opening your email client to send the request…" });
    } catch {
      setToast({ type: "error", msg: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
      setTimeout(() => setToast(null), 3500);
    }
  };

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
        <header className="csHead">
          <div className="eyebrow">CONTACT SALES</div>
          <h1 className="title">Let’s plan your pilot.</h1>
          <p className="sub">
            Tell us about your sites and helmet count. We’ll suggest the right sensor package, dashboards, and rollout plan.
          </p>
        </header>

        {/* Body */}
        <section className="csGrid">
          {/* Form */}
          <div className="card">
            <div className="cardTop">
              <div className="cardTitle">Request a quote</div>
              <div className="cardHint">Required fields are marked *</div>
            </div>

            <form className="form" onSubmit={onSubmit}>
              <div className="row2">
                <div>
                  <label className="lbl">Full name *</label>
                  <input
                    className="input"
                    value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label className="lbl">Work email *</label>
                  <input
                    className="input"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="name@company.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="row2">
                <div>
                  <label className="lbl">Company *</label>
                  <input
                    className="input"
                    value={form.company}
                    onChange={(e) => update("company", e.target.value)}
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <label className="lbl">Role *</label>
                  <input
                    className="input"
                    value={form.role}
                    onChange={(e) => update("role", e.target.value)}
                    placeholder="Safety Manager / Ops / HR…"
                  />
                </div>
              </div>

              <div className="row2">
                <div>
                  <label className="lbl">Industry</label>

                  {/* ✅ FIXED DROPDOWN */}
                  <div className="selectWrap">
                    <select
                      className="input select"
                      value={form.industry}
                      onChange={(e) => update("industry", e.target.value)}
                    >
                      <option value="Construction">Construction</option>
                      <option value="Mining">Mining</option>
                      <option value="Factories">Factories & plants</option>
                      <option value="Lone workers">Lone workers</option>
                      <option value="Other">Other</option>
                    </select>
                    <span className="chev">▾</span>
                  </div>
                </div>

                <div>
                  <label className="lbl">Helmet count</label>
                  <input
                    className="input"
                    value={form.helmets}
                    onChange={(e) => update("helmets", e.target.value.replace(/[^\d]/g, ""))}
                    placeholder="e.g. 50"
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div className="row2">
                <div>
                  <label className="lbl">Phone (optional)</label>
                  <input
                    className="input"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    autoComplete="tel"
                  />
                </div>

                <div>
                  <label className="lbl">Preferred contact</label>

                  {/* ✅ FIXED DROPDOWN */}
                  <div className="selectWrap">
                    <select
                      className="input select"
                      value={form.preference}
                      onChange={(e) => update("preference", e.target.value as any)}
                    >
                      <option value="Email">Email</option>
                      <option value="Phone">Phone</option>
                    </select>
                    <span className="chev">▾</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="lbl">What are you trying to improve?</label>
                <textarea
                  className="input textarea"
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="Example: heat stress monitoring, gas exposure alerts, incident response time…"
                />
              </div>

              <div className="actions">
                {/* ✅ REMOVED: Open pricing calculator button */}

                <button className="btnSend" type="submit" disabled={!canSubmit || submitting}>
                  {submitting ? "Sending…" : "Send request"}
                </button>
              </div>

              <div className="finePrint">
                By submitting, you agree that we may contact you about C-Smart. No spam. No nonsense.
              </div>
            </form>
          </div>

          {/* Right panel */}
          <div className="side">
            <div className="sideCard">
              <div className="sideTitle">What happens next</div>
              <div className="sideList">
                <div className="sideItem">
                  <span className="dot" />
                  <div>
                    <div className="sideK">Quick discovery</div>
                    <div className="sideV">We map sites, roles, and the risk signals you care about.</div>
                  </div>
                </div>
                <div className="sideItem">
                  <span className="dot" />
                  <div>
                    <div className="sideK">Pilot plan</div>
                    <div className="sideV">Recommended sensors + dashboards + alert thresholds.</div>
                  </div>
                </div>
                <div className="sideItem">
                  <span className="dot" />
                  <div>
                    <div className="sideK">Rollout support</div>
                    <div className="sideV">Training, SOPs, and escalation workflows.</div>
                  </div>
                </div>
              </div>

              <div className="divider" />

              <div className="sideMeta">
                <div className="metaRow">
                  <div className="metaK">Typical response</div>
                  <div className="metaV">Within 1 business day</div>
                </div>
                <div className="metaRow">
                  <div className="metaK">Best for</div>
                  <div className="metaV">Pilots → fleets, multi-site operations</div>
                </div>
              </div>

              <div className="sideBtns">
                <button className="btnGhost" onClick={() => navigate("/use-cases")}>
                  View use cases
                </button>
                <button className="btnOutline" onClick={() => navigate("/docs")}>
                  Open docs
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Toast */}
        {toast && (
          <div className={`toast ${toast.type}`}>
            <div className="toastText">{toast.msg}</div>
            <button className="toastX" onClick={() => setToast(null)} aria-label="Close">
              ✕
            </button>
          </div>
        )}
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
  logoText: { fontSize: 20, fontWeight: 650, whiteSpace: "nowrap" },
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
    fontWeight: 560,
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
    fontWeight: 560,
    cursor: "pointer",
  },

  btnPrimary: {
    background: "#ffea00",
    color: "#0b0b0d",
    border: "1px solid rgba(255,234,0,0.35)",
    padding: "10px 22px",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 650,
    cursor: "pointer",
  },

  main: { maxWidth: 1400, margin: "0 auto", padding: "26px 32px 60px" },
};

const css = `
  *{ box-sizing: border-box; }

  :root{
    --border: rgba(255,255,255,0.10);
    --text: rgba(255,255,255,0.92);
    --muted: rgba(255,255,255,0.62);
    --yellow: #ffea00;
  }

  /* Navbar link hover + active */
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

  .btn:focus, .btn:focus-visible, .btn:active{ outline: none !important; box-shadow: none !important; }
  .btn-outline:hover{
    background: rgba(255,255,255,0.06);
    border-color: rgba(255,234,0,0.55) !important;
    box-shadow: 0 0 0 4px rgba(255,234,0,0.10);
    transform: translateY(-1px);
    transition: 0.15s ease;
  }
  .btn-primary:hover{ transform: translateY(-1px); transition: 0.15s ease; }

  /* Head */
  .csHead{ padding: 18px 0 16px; }
  .eyebrow{
    font-size: 12px;
    letter-spacing: 0.18em;
    color: rgba(255,255,255,0.55);
    font-weight: 600;
  }
  .title{
    margin: 10px 0 8px;
    font-size: 44px;
    line-height: 1.08;
    letter-spacing: -0.02em;
    font-weight: 640;
    color: var(--text);
  }
  .sub{
    margin: 0;
    max-width: 920px;
    font-size: 15px;
    line-height: 1.7;
    color: var(--muted);
    font-weight: 520;
  }

  /* Layout */
  .csGrid{
    margin-top: 18px;
    display:grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 16px;
    align-items: start;
  }

  .card{
    border-radius: 18px;
    border: 1px solid var(--border);
    background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(0,0,0,0.20));
    box-shadow: 0 18px 44px rgba(0,0,0,0.25);
    padding: 18px;
  }

  .cardTop{
    display:flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    margin-bottom: 14px;
  }

  .cardTitle{
    font-size: 16px;
    font-weight: 600;
    color: rgba(255,255,255,0.92);
    letter-spacing: -0.01em;
  }
  .cardHint{
    font-size: 12px;
    font-weight: 520;
    color: rgba(255,255,255,0.50);
  }

  .form{ display:grid; gap: 12px; }
  .row2{
    display:grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .lbl{
    display:block;
    font-size: 12px;
    font-weight: 580;
    color: rgba(255,255,255,0.62);
    margin-bottom: 8px;
    letter-spacing: 0.03em;
  }

  .input{
    width: 100%;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.10);
    background: rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.92);
    padding: 12px 12px;
    font-size: 14px;
    font-weight: 520;
    outline: none;
  }
  .input:focus{
    border-color: rgba(255,234,0,0.55);
    box-shadow: 0 0 0 3px rgba(255,234,0,0.10);
  }

  .textarea{
    min-height: 110px;
    resize: vertical;
    line-height: 1.55;
  }

  /* ✅ Dropdown fixes */
  .selectWrap{
    position: relative;
    width: 100%;
  }
  .select{
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    padding-right: 40px; /* space for chevron */
    cursor: pointer;
  }
  .chev{
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: rgba(255,255,255,0.65);
    font-size: 14px;
  }
  /* tries to avoid white/blue dropdown look */
  select option{
    background: #0b0b0d;
    color: rgba(255,255,255,0.92);
  }
  select:focus-visible{ outline: none !important; }

  .actions{
    margin-top: 6px;
    display:flex;
    justify-content: flex-end; /* since only 1 button now */
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
  }

  .btnSend{
    border-radius: 12px;
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 620;
    border: 1px solid rgba(255,234,0,0.35);
    background: var(--yellow);
    color: #0b0b0d;
    cursor:pointer;
    transition: 0.15s ease;
  }
  .btnSend:hover{ transform: translateY(-1px); }
  .btnSend:disabled{
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
  }

  .finePrint{
    margin-top: 10px;
    font-size: 12px;
    font-weight: 520;
    color: rgba(255,255,255,0.50);
    line-height: 1.6;
  }

  /* Right side */
  .side{ display:flex; }
  .sideCard{
    width: 100%;
    border-radius: 18px;
    border: 1px solid rgba(255,255,255,0.10);
    background: rgba(0,0,0,0.22);
    box-shadow: 0 18px 44px rgba(0,0,0,0.25);
    padding: 18px;
  }

  .sideTitle{
    font-size: 16px;
    font-weight: 600;
    color: rgba(255,255,255,0.92);
  }

  .sideList{ margin-top: 14px; display:grid; gap: 12px; }
  .sideItem{ display:flex; gap: 10px; align-items:flex-start; }
  .dot{
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: rgba(255,234,0,0.85);
    margin-top: 6px;
    box-shadow: 0 0 0 4px rgba(255,234,0,0.08);
    flex: 0 0 auto;
  }
  .sideK{ font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.88); }
  .sideV{ margin-top: 4px; font-size: 12px; font-weight: 520; color: rgba(255,255,255,0.58); line-height: 1.6; }

  .divider{ height: 1px; background: rgba(255,255,255,0.10); margin: 14px 0; }

  .sideMeta{ display:grid; gap: 10px; }
  .metaRow{ display:flex; justify-content: space-between; gap: 10px; }
  .metaK{ font-size: 12px; font-weight: 580; color: rgba(255,255,255,0.60); }
  .metaV{ font-size: 12px; font-weight: 560; color: rgba(255,255,255,0.80); text-align:right; }

  .sideBtns{ margin-top: 14px; display:flex; gap: 10px; flex-wrap: wrap; }

  .btnGhost{
    border-radius: 12px;
    padding: 12px 14px;
    font-size: 14px;
    font-weight: 580;
    border: 1px solid rgba(255,255,255,0.14);
    background: rgba(255,255,255,0.03);
    color: rgba(255,255,255,0.90);
    cursor:pointer;
    transition: 0.15s ease;
  }
  .btnGhost:hover{
    background: rgba(255,255,255,0.05);
    border-color: rgba(255,255,255,0.20);
    transform: translateY(-1px);
  }

  .btnOutline{
    border-radius: 12px;
    padding: 12px 14px;
    font-size: 14px;
    font-weight: 580;
    border: 1px solid rgba(255,255,255,0.16);
    background: transparent;
    color: rgba(255,255,255,0.90);
    cursor:pointer;
    transition: 0.15s ease;
  }
  .btnOutline:hover{
    background: rgba(255,255,255,0.04);
    border-color: rgba(255,234,0,0.45);
    transform: translateY(-1px);
  }

  /* Toast */
  .toast{
    position: fixed;
    top: 78px;
    right: 18px;
    z-index: 2000;
    min-width: 280px;
    max-width: 360px;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.14);
    background: rgba(10,10,10,0.85);
    backdrop-filter: blur(10px);
    box-shadow: 0 18px 44px rgba(0,0,0,0.35);
    padding: 12px 12px;
    display:flex;
    justify-content: space-between;
    gap: 10px;
    align-items: center;
  }
  .toast.success{ border-color: rgba(255,234,0,0.25); }
  .toast.error{ border-color: rgba(255,80,80,0.35); }

  .toastText{
    font-size: 13px;
    font-weight: 560;
    color: rgba(255,255,255,0.88);
    line-height: 1.5;
  }
  .toastX{
    width: 32px;
    height: 32px;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.14);
    background: rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.80);
    cursor:pointer;
  }
  .toastX:hover{ background: rgba(255,255,255,0.06); }

  @media (max-width: 980px){
    .csGrid{ grid-template-columns: 1fr; }
    .row2{ grid-template-columns: 1fr; }
    .title{ font-size: 36px; }
  }

  @media (max-width: 768px){
    .nav-link{ display:none; }
  }
`;
