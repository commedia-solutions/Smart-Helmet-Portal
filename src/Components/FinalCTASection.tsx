// src/Components/FinalCTASection.tsx
import React from "react";

const FinalCTASection = () => {
  return (
    <section id="final-cta" style={styles.section}>
      <div style={styles.box}>
        <div style={styles.glow} />

        <div style={styles.left}>
          <div style={styles.eyebrow}>Ready to deploy</div>
          <div style={styles.title}>Make safety observable.</div>
          <div style={styles.desc}>
            Start with a small helmet fleet and scale across sites. Configure thresholds, alerts, and reports to match
            your policy.
          </div>

          <div style={styles.actions}>
            <button style={styles.primary}>Sign in</button>
            <button style={styles.outline}>Contact sales</button>
          </div>
        </div>

        <div style={styles.right}>
          <div style={styles.pill}>✔ Fast setup</div>
          <div style={styles.pill}>✔ Alerts + escalation</div>
          <div style={styles.pill}>✔ Reports & exports</div>
          <div style={styles.pill}>✔ Multi-helmet monitoring</div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;

const styles: Record<string, React.CSSProperties> = {
  section: { padding: "95px 0 40px" },
  box: {
    position: "relative",
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(0,0,0,0.25))",
    padding: 22,
    overflow: "hidden",
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: 16,
    alignItems: "center",
  },

  glow: {
    position: "absolute",
    left: -220,
    top: -240,
    width: 520,
    height: 520,
    background:
      "radial-gradient(circle, rgba(255,234,0,0.22) 0%, rgba(255,234,0,0.10) 28%, rgba(255,234,0,0.04) 45%, transparent 70%)",
    filter: "blur(10px)",
    pointerEvents: "none",
  },

  left: { position: "relative" },
  eyebrow: {
    fontSize: 12,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.60)",
    marginBottom: 10,
  },
  title: { fontSize: 32, fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 10 },
  desc: { fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.72)", maxWidth: 640 },

  actions: { display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" },

  primary: {
    background: "#ffea00",
    color: "#0b0b0d",
    border: "1px solid rgba(255,234,0,0.35)",
    padding: "11px 18px",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 900,
    cursor: "pointer",
  },
  outline: {
    background: "transparent",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.18)",
    padding: "11px 18px",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
  },

  right: {
    position: "relative",
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 10,
  },
  pill: {
    borderRadius: 999,
    padding: "10px 12px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.10)",
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
    fontWeight: 800,
  },
};
