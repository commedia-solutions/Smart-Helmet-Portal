// src/Components/ComparisonSection.tsx
import React from "react";

const ComparisonSection = () => {
  return (
    <section id="comparison" style={styles.section}>
      <div style={styles.head}>
        <div style={styles.eyebrow}>Why C-Smart</div>
        <h2 style={styles.h2}>Compared to standard helmets.</h2>
        <p style={styles.p}>A simple view of what you gain when protection becomes connected.</p>
      </div>

      <div style={styles.tableWrap}>
        <div style={styles.rowHead}>
          <div />
          <div style={styles.colHead}>Standard helmet</div>
          <div style={styles.colHead}>C-Smart helmet</div>
        </div>

        {ROWS.map((r) => (
          <div key={r.label} style={styles.row}>
            <div style={styles.cellLabel}>{r.label}</div>
            <div style={styles.cell}>{r.standard}</div>
            <div style={styles.cell}>{r.smart}</div>
          </div>
        ))}

        <div style={styles.footnote}>
          *C-Smart is designed to work alongside existing PPE programs.
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;

const ROWS = [
  { label: "Real-time vitals & gas monitoring", standard: "—", smart: "✅" },
  { label: "Instant alerts with thresholds", standard: "—", smart: "✅" },
  { label: "Impact / fall event detection", standard: "—", smart: "✅" },
  { label: "Fleet view of all devices", standard: "—", smart: "✅" },
  { label: "Historical logs for audits", standard: "Manual / paper-based", smart: "✅" },
  { label: "Response time tracking", standard: "—", smart: "✅" },
  { label: "Disconnected helmet detection", standard: "—", smart: "✅" },
];

const styles: Record<string, React.CSSProperties> = {
  section: { padding: "95px 0 0" },
  head: { maxWidth: 720, marginBottom: 18 },
  eyebrow: {
    fontSize: 12,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.60)",
    marginBottom: 10,
  },
  h2: { margin: "0 0 10px", fontSize: 34, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1 },
  p: { margin: 0, fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.70)" },

  tableWrap: {
    marginTop: 14,
    borderRadius: 18,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
  },

  rowHead: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.9fr 0.9fr",
    gap: 0,
    padding: "14px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(0,0,0,0.18)",
  },
  colHead: { fontSize: 13, fontWeight: 900, color: "rgba(255,255,255,0.86)" },

  row: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.9fr 0.9fr",
    padding: "14px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  cellLabel: { fontSize: 14, fontWeight: 800, color: "rgba(255,255,255,0.84)" },
  cell: { fontSize: 14, color: "rgba(255,255,255,0.72)" },

  footnote: {
    padding: "12px 16px",
    fontSize: 12,
    color: "rgba(255,255,255,0.55)",
    background: "rgba(0,0,0,0.12)",
  },
};
