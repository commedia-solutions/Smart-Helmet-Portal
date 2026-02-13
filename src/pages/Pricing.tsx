// src/pages/Pricing.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import helmetLogo from "../assets/Helemt2.png";
import FooterSection from "../Components/FooterSection";

type PlanId = "pilot" | "standard" | "enterprise";
type Billing = "monthly" | "annual";

const PLANS: Array<{
  id: PlanId;
  name: string;
  tagline: string;
  priceMonthly?: number; // per helmet / month
  setupFee: number; // one-time
  popular?: boolean;
  bullets: string[];
}> = [
  {
    id: "pilot",
    name: "Pilot",
    tagline: "Start small. Validate fast.",
    priceMonthly: 999,
    setupFee: 15000,
    bullets: ["Vitals (HR/SpO₂)", "Basic alerts", "Weekly summary", "Single site"],
  },
  {
    id: "standard",
    name: "Standard",
    tagline: "For teams deploying across sites.",
    priceMonthly: 1499,
    setupFee: 25000,
    popular: true,
    bullets: ["Vitals (HR/SpO₂)", "Zone-wise alerts", "Audit logs & exports", "Multi-helmet dashboard"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Custom policies, integrations, scale.",
    setupFee: 0,
    bullets: ["Custom sensor suite", "Custom escalation flows", "Integrations & SSO", "Dedicated support"],
  },
];

const ADDONS = [
  { key: "gas", label: "Gas Sensor Pack", desc: "CO / H₂S / multi-gas (as applicable)", price: 349 },
  { key: "gps", label: "GPS / Location", desc: "Outdoor / site perimeter tracking", price: 199 },
  { key: "ble", label: "BLE Proximity", desc: "Beacon-based zones & proximity alerts", price: 149 },
  { key: "noise", label: "Noise Exposure", desc: "Noise threshold + exposure logs", price: 99 },
];

function formatINR(n: number) {
  return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

// volume discount on subscription subtotal (not setup fee)
function volumeDiscountPct(helmets: number) {
  if (helmets >= 250) return 0.12;
  if (helmets >= 100) return 0.08;
  if (helmets >= 50) return 0.05;
  return 0;
}

// annual discount applied after volume (subscription only)
const ANNUAL_DISCOUNT = 0.15;

export default function Pricing() {
  const navigate = useNavigate();
  const token = localStorage.getItem("idToken");
  const dashboardTo = token ? "/dashboard" : "/login";

  const [selectedPlan, setSelectedPlan] = useState<PlanId>("standard");
  // const [helmets, setHelmets] = useState<number>(25);
  const [helmetsText, setHelmetsText] = useState<string>("");

// parsed value used in calculations (blank -> 0)
const helmets = useMemo(() => {
  const n = parseInt(helmetsText, 10);
  return Number.isFinite(n) ? n : 0;
}, [helmetsText]);

  const [billing, setBilling] = useState<Billing>("monthly");
  const [addons, setAddons] = useState<Record<string, boolean>>({
    gas: false,
    gps: false,
    ble: false,
    noise: false,
  });

  // ✅ custom dropdown (dark themed)
  const [ddOpen, setDdOpen] = useState(false);
  const ddRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ddRef.current) return;
      if (!ddRef.current.contains(e.target as Node)) setDdOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDdOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const plan = useMemo(() => PLANS.find((p) => p.id === selectedPlan)!, [selectedPlan]);

  const addonsPerHelmet = useMemo(() => {
    return ADDONS.reduce((sum, a) => (addons[a.key] ? sum + a.price : sum), 0);
  }, [addons]);

  const basePerHelmet = plan.priceMonthly ?? 0;
  const totalPerHelmet = basePerHelmet + addonsPerHelmet;

  const monthlySubtotal = totalPerHelmet * helmets;

  const volPct = volumeDiscountPct(helmets);
  const volDiscount = Math.round(monthlySubtotal * volPct);
  const afterVolumeMonthly = monthlySubtotal - volDiscount;

  const annualDiscount = billing === "annual" ? Math.round(afterVolumeMonthly * 12 * ANNUAL_DISCOUNT) : 0;

  const payableNow =
    billing === "monthly"
      ? afterVolumeMonthly + plan.setupFee
      : afterVolumeMonthly * 12 - annualDiscount + plan.setupFee;

  const enterpriseMode = plan.id === "enterprise";

  return (
    <div style={styles.page}>
      <style>{css}</style>

      {/* Navbar (same styling as Landing) */}
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
            <NavLink to="/pricing" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} style={styles.navLink}>
              Pricing
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
        <div className="pricingHead">
          <div className="eyebrow">PRICING</div>
          <h1 className="title">Plans that scale from pilots to fleets.</h1>
          <p className="sub">
            Pick a package based on your safety policy and sensor needs. Use the calculator to estimate cost for your helmet count.
          </p>

          <div className="pills">
            {["Audit-ready logs", "Zone-wise alerts", "Multi-helmet dashboard"].map((t) => (
              <span key={t} className="pill">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Plans */}
        <section className="plansGrid">
          {PLANS.map((p) => {
            const selected = p.id === selectedPlan;
            const isEnterprise = p.id === "enterprise";

            return (
              <button
                key={p.id}
                type="button"
                className={`planCard ${selected ? "selected" : ""}`}
                onClick={() => setSelectedPlan(p.id)}
              >
                <div className="planTop">
                  <div>
                    <div className="planNameRow">
                      <div className="planName">{p.name}</div>
                      {p.popular && <span className="badge">Most popular</span>}
                    </div>
                    <div className="planTag">{p.tagline}</div>
                  </div>

                  <div className={`radio ${selected ? "radioOn" : ""}`} aria-hidden="true">
                    <div className="radioDot" />
                  </div>
                </div>

                <div className="priceRow">
                  {isEnterprise ? (
                    <div className="priceBig">Custom</div>
                  ) : (
                    <>
                      <div className="priceBig">₹{formatINR(p.priceMonthly!)}</div>
                      <div className="priceUnit">/ helmet / month</div>
                    </>
                  )}
                </div>

                <div className="setup">Setup: {p.setupFee ? `₹${formatINR(p.setupFee)} (one-time)` : "Included (one-time)"}</div>

                <div className="sectionLabel">Included sensors</div>
                <ul className="bullets">
                  {p.bullets.map((b) => (
                    <li key={b}>
                      <span className="dot" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="planHint">Click to select</div>
              </button>
            );
          })}
        </section>

        {/* Calculator */}
        <section className="calcWrap">
          <div className="calcIntro">
            Select a package, helmet count, and add-ons. Volume and annual billing discounts apply automatically.
          </div>

          <div className="calcGrid">
            {/* Left card */}
            <div className="glassCard">
              <div className="field">
                <div className="label">Package</div>

                {/* ✅ dark themed custom dropdown */}
                <div className="dd" ref={ddRef}>
                  <button
                    type="button"
                    className={`ddBtn ${ddOpen ? "open" : ""}`}
                    onClick={() => setDdOpen((v) => !v)}
                    aria-haspopup="listbox"
                    aria-expanded={ddOpen}
                  >
                    <span className="ddValue">{plan.name}</span>
                    <span className="ddArrow" aria-hidden="true">▾</span>
                  </button>

                  {ddOpen && (
                    <div className="ddMenu" role="listbox">
                      {PLANS.map((p) => {
                        const active = p.id === selectedPlan;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            className={`ddItem ${active ? "active" : ""}`}
                            role="option"
                            aria-selected={active}
                            onClick={() => {
                              setSelectedPlan(p.id);
                              setDdOpen(false);
                            }}
                          >
                            <span className="ddItemTitle">{p.name}</span>
                            <span className="ddItemSub">
                              {p.id === "enterprise" ? "Custom" : `₹${formatINR(p.priceMonthly!)}/helmet/mo`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="row2">
                <div className="field">
                  <div className="label">Helmets</div>
                  <input
  className="input"
  type="text"
  inputMode="numeric"
  placeholder="Enter helmet count"
  value={helmetsText}
  onChange={(e) => {
    // allow empty, digits only
    const next = e.target.value.replace(/[^\d]/g, "");
    setHelmetsText(next);
  }}
/>

                </div>

                <div className="field">
                  <div className="label">Billing</div>
                  <div className="seg">
                    <button
                      type="button"
                      className={`segBtn ${billing === "monthly" ? "on" : ""}`}
                      onClick={() => setBilling("monthly")}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      className={`segBtn ${billing === "annual" ? "on" : ""}`}
                      onClick={() => setBilling("annual")}
                    >
                      Annual
                    </button>
                  </div>
                </div>
              </div>

              <div className="addonsTitle">Add-ons (per helmet / month)</div>

              <div className="addonsList">
                {ADDONS.map((a) => (
                  <button
                    key={a.key}
                    type="button"
                    className={`addonRow ${addons[a.key] ? "checked" : ""}`}
                    onClick={() => setAddons((s) => ({ ...s, [a.key]: !s[a.key] }))}
                    disabled={enterpriseMode}
                  >
                    <div>
                      <div className="addonName">{a.label}</div>
                      <div className="addonDesc">{a.desc}</div>
                    </div>

                    <div className="addonRight">
                      <div className="addonPrice">₹{formatINR(a.price)}</div>
                      <span className={`checkBox ${addons[a.key] ? "on" : ""}`} aria-hidden="true" />
                    </div>
                  </button>
                ))}
              </div>

              {enterpriseMode && (
                <div className="note">
                  Enterprise pricing is tailored. Use “Request exact quote” to share your requirements.
                </div>
              )}
            </div>

            {/* Right card */}
            <div className="glassCard">
              <div className="cardTitle">Your estimate</div>

              <div className="kv">
                <div className="k">Base (per helmet / month)</div>
                <div className="v">{enterpriseMode ? "—" : `₹${formatINR(basePerHelmet)}`}</div>

                <div className="k">Add-ons (per helmet / month)</div>
                <div className="v">{enterpriseMode ? "—" : `₹${formatINR(addonsPerHelmet)}`}</div>

                <div className="k strong">Total (per helmet / month)</div>
                <div className="v strong hi">{enterpriseMode ? "Custom" : `₹${formatINR(totalPerHelmet)}`}</div>
              </div>

              <div className="divider" />

              <div className="kv">
                <div className="k">Monthly subtotal</div>
                <div className="v">{enterpriseMode ? "—" : `₹${formatINR(monthlySubtotal)}`}</div>

                <div className="k">Volume discount</div>
                <div className="v">{enterpriseMode ? "—" : `- ₹${formatINR(volDiscount)}`}</div>

                <div className="k strong">Monthly after volume</div>
                <div className="v strong hi">{enterpriseMode ? "—" : `₹${formatINR(afterVolumeMonthly)}`}</div>

                {billing === "annual" && !enterpriseMode && (
                  <>
                    <div className="k">Annual discount</div>
                    <div className="v">- ₹{formatINR(annualDiscount)}</div>
                  </>
                )}
              </div>

              <div className="payNow">
                <div className="payLabel">Estimated payable now</div>
                <div className="payValue">{enterpriseMode ? "Custom" : `₹${formatINR(payableNow)}`}</div>
              </div>

              <div className="fine">
                Includes setup fee of {plan.setupFee ? `₹${formatINR(plan.setupFee)}` : "₹0"} (one-time).
                {billing === "annual" && !enterpriseMode ? " Annual discount shown above." : ""}
              </div>

              <div className="actions">
                <button className="btn btn-primary wide" onClick={() => navigate("/contact-sales")}>
                  Request exact quote
                </button>
                <button className="btn btn-outline wide" onClick={() => navigate("/use-cases")}>
                  See use cases
                </button>
              </div>
            </div>
          </div>
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
  :root{
    --bg:#1a1a1a;
    --card: rgba(0,0,0,0.28);
    --border: rgba(255,255,255,0.10);
    --text: rgba(255,255,255,0.92);
    --muted: rgba(255,255,255,0.62);
    --yellow:#ffea00;
  }

  /* ✅ kill default blue focus rings (mouse), keep nice focus for keyboard */
  button:focus, button:active,
  .planCard:focus, .planCard:active,
  .addonRow:focus, .addonRow:active,
  .segBtn:focus, .segBtn:active,
  .ddBtn:focus, .ddBtn:active,
  input:focus, input:active{
    outline: none !important;
    box-shadow: none !important;
  }
  button:focus-visible,
  .planCard:focus-visible,
  .addonRow:focus-visible,
  .segBtn:focus-visible,
  .ddBtn:focus-visible,
  input:focus-visible{
    outline: none !important;
    box-shadow: 0 0 0 4px rgba(255,234,0,0.12) !important;
    border-color: rgba(255,234,0,0.30) !important;
  }

  /* ✅ Remove number input spinners (so it doesn't look like a counter) */
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button{
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"]{
    -moz-appearance: textfield;
    appearance: textfield;
  }

/* Navbar link hover + active (with underline like Use Cases) */
.nav-link:hover{ color: var(--yellow) !important; transition: 0.15s ease; }
.nav-link.active{ color: var(--yellow) !important; }
.nav-link{ position: relative; }
.nav-link.active::after{
  content:"";
  position:absolute;
  left:0; right:0;
  bottom:-10px;  /* ✅ same as Use Cases */
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
  .pricingHead{ padding: 22px 0 14px; }
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
    max-width: 900px;
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

  /* Plans */
  .plansGrid{
    margin-top: 18px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }
  .planCard{
    text-align: left;
    width: 100%;
    border-radius: 18px;
    border: 1px solid var(--border);
    background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(0,0,0,0.20));
    padding: 18px;
    cursor: pointer;
    color: white;
    box-shadow: 0 18px 44px rgba(0,0,0,0.25);
    transition: 0.18s ease;
  }
  .planCard:hover{ border-color: rgba(255,255,255,0.18); transform: translateY(-1px); }
  .planCard.selected{
    border-color: rgba(255,234,0,0.45);
    box-shadow: 0 18px 54px rgba(0,0,0,0.35), 0 0 0 4px rgba(255,234,0,0.08);
    background: linear-gradient(180deg, rgba(255,234,0,0.06), rgba(0,0,0,0.22));
  }

  .planTop{ display:flex; justify-content: space-between; gap: 10px; align-items:flex-start; }
  .planNameRow{ display:flex; gap: 10px; align-items:center; }
  .planName{ font-size: 22px; font-weight: 700; letter-spacing: -0.01em; }
  .badge{
    font-size: 12px;
    font-weight: 700;
    color: rgba(255,234,0,0.95);
    border: 1px solid rgba(255,234,0,0.22);
    background: rgba(255,234,0,0.08);
    padding: 6px 10px;
    border-radius: 999px;
  }
  .planTag{ margin-top: 6px; font-size: 13px; color: var(--muted); font-weight: 500; }

  .radio{
    width: 18px; height: 18px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.22);
    background: rgba(255,255,255,0.03);
    display:flex; align-items:center; justify-content:center;
    margin-top: 4px;
  }
  .radioDot{ width: 8px; height: 8px; border-radius: 999px; background: transparent; }
  .radio.radioOn{ border-color: rgba(255,234,0,0.55); }
  .radio.radioOn .radioDot{ background: rgba(255,234,0,0.92); box-shadow: 0 0 0 3px rgba(255,234,0,0.10); }

  .priceRow{ margin-top: 16px; display:flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
  .priceBig{ font-size: 44px; font-weight: 700; letter-spacing: -0.02em; }
  .priceUnit{ font-size: 13px; color: rgba(255,255,255,0.60); font-weight: 600; }
  .setup{ margin-top: 10px; font-size: 13px; color: rgba(255,255,255,0.60); font-weight: 600; }

  .sectionLabel{ margin-top: 16px; font-size: 13px; color: rgba(255,255,255,0.70); font-weight: 700; }
  .bullets{ list-style:none; padding:0; margin: 12px 0 0; display:grid; gap: 10px; }
  .bullets li{ display:flex; gap: 10px; align-items:flex-start; font-size: 13px; color: rgba(255,255,255,0.72); font-weight: 600; }
  .dot{ width: 8px; height: 8px; border-radius: 999px; background: rgba(255,234,0,0.85); margin-top: 5px; box-shadow: 0 0 0 4px rgba(255,234,0,0.08); }

  .planHint{ margin-top: 14px; font-size: 12px; color: rgba(255,255,255,0.45); font-weight: 600; }

  /* Calculator */
  .calcWrap{ margin-top: 22px; }
  .calcIntro{ color: rgba(255,255,255,0.60); font-size: 13px; font-weight: 600; margin-bottom: 12px; }

  .calcGrid{
    display:grid;
    grid-template-columns: 1.08fr 0.92fr;
    gap: 16px;
  }
  .glassCard{
    border-radius: 18px;
    border: 1px solid var(--border);
    background: rgba(0,0,0,0.22);
    padding: 16px;
    box-shadow: 0 18px 44px rgba(0,0,0,0.25);
  }

  .cardTitle{ font-size: 18px; font-weight: 700; margin-bottom: 10px; color: rgba(255,255,255,0.92); }

  .field{ display:grid; gap: 8px; }
  .label{ font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.65); letter-spacing: 0.04em; }

  .input{
    height: 44px;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.10);
    background: rgba(255,255,255,0.03);
    color: rgba(255,255,255,0.90);
    padding: 0 14px;
    font-size: 14px;
    font-weight: 600;
    outline: none;
  }
  .input:focus{ border-color: rgba(255,234,0,0.30); box-shadow: 0 0 0 4px rgba(255,234,0,0.08); }

  .row2{ margin-top: 14px; display:grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  .seg{
    height: 44px;
    display:flex;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.10);
    background: rgba(255,255,255,0.02);
    padding: 4px;
    gap: 6px;
  }
  .segBtn{
    flex:1;
    border: 0;
    border-radius: 12px;
    background: transparent;
    color: rgba(255,255,255,0.72);
    font-weight: 700;
    font-size: 13px;
    cursor: pointer;
  }
  .segBtn.on{
    background: rgba(255,234,0,0.10);
    color: rgba(255,234,0,0.95);
    border: 1px solid rgba(255,234,0,0.22);
  }

  /* ✅ Custom dropdown styles */
  .dd{ position: relative; }
  .ddBtn{
    height: 44px;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.10);
    background: rgba(255,255,255,0.03);
    color: rgba(255,255,255,0.90);
    padding: 0 14px;
    display:flex;
    align-items:center;
    justify-content: space-between;
    cursor: pointer;
    width: 100%;
    font-size: 14px;
    font-weight: 650;
  }
  .ddBtn.open{
    border-color: rgba(255,234,0,0.30);
    box-shadow: 0 0 0 4px rgba(255,234,0,0.08);
  }
  .ddArrow{ color: rgba(255,255,255,0.60); }
  .ddMenu{
    position: absolute;
    top: calc(100% + 10px);
    left: 0; right: 0;
    background: rgba(12,12,12,0.98);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 18px 60px rgba(0,0,0,0.55);
    z-index: 50;
  }
  .ddItem{
    width: 100%;
    text-align: left;
    padding: 12px 14px;
    display:flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    background: transparent;
    border: 0;
    cursor: pointer;
    color: rgba(255,255,255,0.90);
  }
  .ddItem:hover{ background: rgba(255,255,255,0.06); }
  .ddItem.active{ background: rgba(255,234,0,0.10); }
  .ddItemTitle{ font-weight: 750; }
  .ddItemSub{ font-size: 12px; font-weight: 650; color: rgba(255,255,255,0.60); white-space: nowrap; }

  .addonsTitle{ margin-top: 16px; font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.65); letter-spacing: 0.04em; }
  .addonsList{ margin-top: 10px; display:grid; gap: 10px; }

  .addonRow{
    width:100%;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.02);
    padding: 14px;
    color: white;
    display:flex;
    justify-content: space-between;
    gap: 12px;
    cursor: pointer;
    text-align: left;
    transition: 0.15s ease;
  }
  .addonRow:hover{ border-color: rgba(255,255,255,0.16); transform: translateY(-1px); }
  .addonRow.checked{ border-color: rgba(255,234,0,0.35); background: rgba(255,234,0,0.05); }

  .addonName{ font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.88); }
  .addonDesc{ margin-top: 4px; font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.55); }

  .addonRight{ display:flex; align-items:center; gap: 12px; }
  .addonPrice{ font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.80); }

  .checkBox{
    width: 18px; height: 18px;
    border-radius: 6px;
    border: 1px solid rgba(255,255,255,0.18);
    background: rgba(255,255,255,0.03);
    display:inline-block;
    position: relative;
  }
  .checkBox.on{
    border-color: rgba(255,234,0,0.55);
    background: rgba(255,234,0,0.12);
  }
  .checkBox.on::after{
    content:"";
    position:absolute;
    left: 5px; top: 2px;
    width: 6px; height: 10px;
    border-right: 2px solid rgba(255,234,0,0.95);
    border-bottom: 2px solid rgba(255,234,0,0.95);
    transform: rotate(45deg);
  }

  .divider{ height:1px; background: rgba(255,255,255,0.10); margin: 14px 0; }

  .kv{ display:grid; grid-template-columns: 1fr auto; gap: 10px 14px; align-items: baseline; }
  .k{ font-size: 13px; font-weight: 650; color: rgba(255,255,255,0.60); }
  .v{ font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.82); }
  .strong{ color: rgba(255,255,255,0.92); }
  .hi{ color: rgba(255,234,0,0.95); }

  .payNow{
    margin-top: 14px;
    border-radius: 16px;
    border: 1px solid rgba(255,234,0,0.22);
    background: rgba(255,234,0,0.08);
    padding: 12px 14px;
    display:flex;
    justify-content: space-between;
    align-items:center;
    gap: 10px;
  }
  .payLabel{ font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.82); }
  .payValue{ font-size: 14px; font-weight: 800; color: rgba(255,234,0,0.95); }

  .fine{ margin-top: 10px; font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.52); line-height: 1.6; }
  .actions{ margin-top: 14px; display:flex; gap: 10px; flex-wrap: wrap; }
  .wide{ padding: 12px 18px; border-radius: 12px; font-weight: 650; }


  .note{
    margin-top: 12px;
    font-size: 12px;
    color: rgba(255,255,255,0.55);
    font-weight: 600;
    line-height: 1.6;
  }

  @media (max-width: 980px){
    .plansGrid{ grid-template-columns: 1fr; }
    .calcGrid{ grid-template-columns: 1fr; }
    .title{ font-size: 36px; }
  }
`;
