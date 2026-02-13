// src/Components/FAQSection.tsx
import React from "react";

/**
 * Replaces the old FAQ UI with a clean Testimonials grid
 * (simple dark cards, no glow / bento effects)
 *
 * NOTE:
 * - Keeping id="faq" so your navbar anchor (if any) doesn’t break.
 * - If you want the URL anchor to be #testimonials, change id below.
 */

type T = {
  company: string;
  handle: string;
  quote: string;
  // optional: if later you want to use a real logo
  // logo?: string;
};

const FAQSection = () => {
  return (
    <section id="faq" style={styles.section}>
      <style>{css}</style>

      <div style={styles.wrap}>
        <div style={styles.head}>
          <div style={styles.eyebrow}>Testimonials</div>
          <h2 style={styles.h2}>Built with Commedia. Backed by trust.</h2>
          <p style={styles.p}>
            From hot reloads to happy teams — here’s what our customers have to say.
          </p>
        </div>

        <div style={styles.grid}>
          {TESTIMONIALS.map((t) => (
            <article key={t.company} className="tCard" style={styles.card}>
              <div style={styles.cardTop}>
                <div style={styles.logoWrap}>
                  <div style={styles.logoInner}>{getInitials(t.company)}</div>
                </div>

                <div style={{ minWidth: 0 }}>
                  <div style={styles.companyRow}>
                    <div style={styles.company}>{t.company}</div>
                  </div>
                  <div style={styles.handle}>{t.handle}</div>
                </div>
              </div>

              <p style={styles.quote}>{t.quote}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

/* ---------------- data ---------------- */
const TESTIMONIALS: T[] = [
  {
    company: "Airtel",
    handle: "@airtel.in",
    quote:
      "Commedia’s team integrated seamlessly with our infrastructure. Their delivery speed and technical depth exceeded expectations.",
  },
  {
    company: "Central Bank",
    handle: "@centralbank.bank.in",
    quote:
      "Security and scalability were non-negotiable for us. Commedia delivered both — with zero compromise on speed.",
  },
  {
    company: "NTT Data",
    handle: "@nttdata.com",
    quote:
      "From planning to deployment, their engineers were proactive, precise, and deeply collaborative. A true extension of our team.",
  },
  {
    company: "Tata Communications",
    handle: "@tatacommunications.com",
    quote:
      "Commedia helped us unify multiple platforms into one cohesive system. Their domain expertise made all the difference.",
  },
  {
    company: "HP",
    handle: "@hp.com",
    quote:
      "We’ve worked with many vendors — Commedia stands out for reliability and ability to handle complex integrations.",
  },
  {
    company: "LG",
    handle: "@www.lg.com",
    quote:
      "Their delivery model is agile, transparent, and outcome-driven. We saw results within weeks, not months.",
  },
];

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("");
}

/* ---------------- styles ---------------- */
const styles: Record<string, React.CSSProperties> = {
  section: { padding: "95px 0 0" },

  // ✅ This is what prevents “big big cards” on wide screens
  wrap: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 22px",
  },

  head: {
    textAlign: "center",
    maxWidth: 920,
    margin: "0 auto 22px",
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.60)",
    marginBottom: 10,
  },
  h2: {
    margin: "0 0 10px",
    fontSize: 54,
    fontWeight: 900,
    letterSpacing: "-0.03em",
    lineHeight: 1.03,
  },
  p: {
    margin: 0,
    fontSize: 16,
    lineHeight: 1.7,
    color: "rgba(255,255,255,0.60)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 16,
    marginTop: 22,
  },

  card: {
    borderRadius: 18,
    padding: 20,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.02)",
    overflow: "hidden",
    minHeight: 160,
  },

  cardTop: {
    display: "flex",
    gap: 14,
    alignItems: "center",
    marginBottom: 14,
  },

  logoWrap: {
    width: 48,
    height: 48,
    borderRadius: 999,
    background: "rgba(0,0,0,0.25)",
    border: "1px solid rgba(255,255,255,0.10)",
    display: "grid",
    placeItems: "center",
    flex: "0 0 auto",
  },
  logoInner: {
    width: 36,
    height: 36,
    borderRadius: 999,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.10)",
    display: "grid",
    placeItems: "center",
    fontSize: 12,
    fontWeight: 900,
    color: "rgba(255,255,255,0.80)",
  },

  companyRow: { display: "flex", alignItems: "baseline", gap: 10, minWidth: 0 },
  company: {
    fontSize: 18,
    fontWeight: 800,
    color: "rgba(255,255,255,0.92)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  handle: {
    marginTop: 2,
    fontSize: 13,
    color: "rgba(255,255,255,0.45)",
  },

  quote: {
    margin: 0,
    fontSize: 16,
    lineHeight: 1.7,
    color: "rgba(255,255,255,0.70)",
  },
};

const css = `
  /* responsive grid */
  @media (max-width: 980px) {
    #faq .tGrid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (max-width: 680px) {
    #faq .tGrid { grid-template-columns: repeat(1, minmax(0, 1fr)); }
    #faq h2 { font-size: 40px; }
  }

  /* minimal hover (no glow) */
  .tCard {
    transition: transform .16s ease, border-color .16s ease;
  }
  .tCard:hover {
    transform: translateY(-2px);
    border-color: rgba(255,255,255,0.16);
  }
`;

// tiny helper to make the media queries work with inline styles
// (we add a class via JS-less way: just style object + class on grid)
styles.grid = { ...styles.grid, } as React.CSSProperties;

// Add class via React prop in JSX
// (done in JSX below)
