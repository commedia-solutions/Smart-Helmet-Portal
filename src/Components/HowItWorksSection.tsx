// src/Components/HowItWorksSection.tsx
import React from "react";

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" style={styles.section}>
      <div style={styles.head}>
        <div style={styles.eyebrow}>How it works</div>
        <h2 style={styles.h2}>From helmet to dashboard in seconds.</h2>
        <p style={styles.p}>
          A simple pipeline: sensing → cloud → visibility. Built to be reliable in real environments.
        </p>
      </div>

      <div style={styles.row}>
        {STEPS.map((s) => (
          <div key={s.n} style={styles.step}>
            <div style={styles.num}>{s.n}</div>
            <div>
              <div style={styles.stepTitle}>{s.title}</div>
              <div style={styles.stepDesc}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.connector} />
    </section>
  );
};

export default HowItWorksSection;

const STEPS = [
  { n: "01", title: "Sense", desc: "Vitals, temperature, and gas sensors continuously capture readings." },
  { n: "02", title: "Stream", desc: "Data syncs to the cloud—secured and organized by device/site." },
  { n: "03", title: "Act", desc: "Dashboards and alerts help teams respond fast and review history." },
];

const styles: Record<string, React.CSSProperties> = {
  section: { padding: "90px 0 0", position: "relative" },
  head: { maxWidth: 720, marginBottom: 26 },
  eyebrow: {
    fontSize: 12,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.60)",
    marginBottom: 10,
  },
  h2: { margin: "0 0 10px", fontSize: 34, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1 },
  p: { margin: 0, fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.70)" },
  row: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 },
  step: {
    display: "flex",
    gap: 14,
    padding: 18,
    borderRadius: 16,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.10)",
    alignItems: "flex-start",
  },
  num: {
    width: 44,
    height: 44,
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    fontWeight: 900,
    color: "#0b0b0d",
    background: "#ffea00",
    border: "1px solid rgba(255,234,0,0.35)",
    flex: "0 0 auto",
  },
  stepTitle: { fontSize: 16, fontWeight: 900, marginBottom: 6 },
  stepDesc: { fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.68)" },
  connector: {
    marginTop: 22,
    height: 1,
    background: "rgba(255,255,255,0.08)",
  },
};
