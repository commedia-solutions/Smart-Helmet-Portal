// // src/Components/FeaturesSection.tsx
// import React from "react";

// const FeaturesSection = () => {
//   return (
//     <section id="features" style={styles.section}>
//       <style>{css}</style>

//       <div style={styles.head}>
//         <div style={styles.eyebrow}>Core capabilities</div>
//         <h2 style={styles.h2}>Everything you need to monitor, alert, and respond.</h2>
//         <p style={styles.p}>
//           C-Smart combines on-helmet sensing with a cloud dashboard so your team can act fast and
//           prove compliance later.
//         </p>
//       </div>

//       <div style={styles.grid}>
//         {FEATURES.map((f) => (
//           <div key={f.title} className="featureCard" style={styles.card}>
//             <div style={styles.iconWrap}>{f.icon}</div>
//             <div style={styles.cardTitle}>{f.title}</div>
//             <div style={styles.cardDesc}>{f.desc}</div>
//             {f.tag ? <div style={styles.tag}>{f.tag}</div> : null}
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default FeaturesSection;

// const FEATURES = [
//   {
//     icon: "❤️",
//     title: "Vitals monitoring",
//     desc: "Track heart rate and temperature in real time for early warning and trends.",
//     tag: "Live + history",
//   },
//   {
//     icon: "🧪",
//     title: "Gas & air quality",
//     desc: "Detect CO, NO₂, volatile gas and more—set thresholds per site policy.",
//     tag: "Threshold rules",
//   },
//   {
//     icon: "🪖",
//     title: "Helmet status",
//     desc: "Know whether devices are active, worn, disconnected, or idle—at a glance.",
//     tag: "Fleet overview",
//   },
//   {
//     icon: "🚨",
//     title: "Instant alerts",
//     desc: "Get notified when vitals or gas levels cross limits—reduce response time.",
//     tag: "Escalation ready",
//   },
//   {
//     icon: "📟",
//     title: "Live dashboard",
//     desc: "Unified view of workers, sites, and devices with quick drill-down.",
//     tag: "Ops-friendly",
//   },
//   {
//     icon: "📄",
//     title: "Reports & logs",
//     desc: "Export history for audits, compliance, and incident review workflows.",
//     tag: "PDF/CSV",
//   },
// ];

// const styles: Record<string, React.CSSProperties> = {
//   section: { padding: "80px 0 0" },
//   head: { maxWidth: 720, marginBottom: 26 },
//   eyebrow: {
//     fontSize: 12,
//     letterSpacing: "0.16em",
//     textTransform: "uppercase",
//     color: "rgba(255,255,255,0.60)",
//     marginBottom: 10,
//   },
//   h2: {
//     margin: "0 0 10px",
//     fontSize: 34,
//     fontWeight: 800,
//     letterSpacing: "-0.02em",
//     lineHeight: 1.1,
//   },
//   p: { margin: 0, fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.70)" },
//   grid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
//     gap: 16,
//   },
//   card: {
//     borderRadius: 16,
//     padding: 18,
//     background: "rgba(255,255,255,0.04)",
//     border: "1px solid rgba(255,255,255,0.10)",
//     minHeight: 170,
//     position: "relative",
//     overflow: "hidden",
//   },
//   iconWrap: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     display: "grid",
//     placeItems: "center",
//     background: "rgba(255,255,255,0.06)",
//     border: "1px solid rgba(255,255,255,0.10)",
//     marginBottom: 12,
//     fontSize: 18,
//   },
//   cardTitle: { fontSize: 16, fontWeight: 800, marginBottom: 6 },
//   cardDesc: { fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.68)" },
//   tag: {
//     marginTop: 12,
//     display: "inline-flex",
//     alignItems: "center",
//     gap: 8,
//     fontSize: 12,
//     fontWeight: 700,
//     color: "rgba(255,255,255,0.78)",
//     border: "1px solid rgba(255,255,255,0.10)",
//     background: "rgba(0,0,0,0.18)",
//     borderRadius: 999,
//     padding: "6px 10px",
//   },
// };

// const css = `
//   .featureCard{
//     transition: transform .15s ease, border-color .15s ease, background .15s ease;
//   }
//   .featureCard:hover{
//     transform: translateY(-2px);
//     border-color: rgba(124,58,237,0.55);
//     background: rgba(255,255,255,0.05);
//   }
//   @media (max-width: 1024px){
//     #features .${""}{
//     }
//   }
//   @media (max-width: 1024px){
//     #features > div + div{
//     }
//   }
// `;


// src/Components/FeaturesSection.tsx
import React from "react";

const FeaturesSection = () => {
  return (
    <section id="features" style={styles.section}>
      <style>{css}</style>

      <div style={styles.head}>
        <div style={styles.eyebrow}>Core capabilities</div>
        <h2 style={styles.h2}>Everything you need to monitor, alert, and respond.</h2>
        <p style={styles.p}>
          C-Smart combines on-helmet sensing with a cloud dashboard so your team can act fast and
          prove compliance later.
        </p>
      </div>

      <div style={styles.grid}>
        {FEATURES.map((f) => (
          <div key={f.title} className="featureCard" style={styles.card}>
            <div style={styles.iconWrap}>
              <img src={f.icon} alt={f.title} style={styles.icon} />
            </div>
            <div style={styles.cardTitle}>{f.title}</div>
            <div style={styles.cardDesc}>{f.desc}</div>
            {f.tag ? <div style={styles.tag}>{f.tag}</div> : null}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;

const FEATURES = [
  {
    icon: "/src/assets/icons/heart.png",
    title: "Vitals monitoring",
    desc: "Track heart rate and temperature in real time for early warning and trends.",
    tag: "Live + history",
  },
  {
    icon: "/src/assets/icons/Gas.png",
    title: "Gas & air quality",
    desc: "Detect CO, NO₂, volatile gas and more—set thresholds per site policy.",
    tag: "Threshold rules",
  },
  {
    icon: "/src/assets/icons/status.png",
    title: "Helmet status",
    desc: "Know whether devices are active, worn, disconnected, or idle—at a glance.",
    tag: "Fleet overview",
  },
  {
    icon: "/src/assets/icons/Alerts.png",
    title: "Instant alerts",
    desc: "Get notified when vitals or gas levels cross limits—reduce response time.",
    tag: "Escalation ready",
  },
  {
    icon: "/src/assets/icons/dashboard.png",
    title: "Live dashboard",
    desc: "Unified view of workers, sites, and devices with quick drill-down.",
    tag: "Ops-friendly",
  },
  {
    icon: "/src/assets/icons/Reports.png",
    title: "Reports & logs",
    desc: "Export history for audits, compliance, and incident review workflows.",
    tag: "PDF/CSV",
  },
];

const styles: Record<string, React.CSSProperties> = {
  section: { padding: "80px 0 0" },
  head: { maxWidth: 720, marginBottom: 26 },
  eyebrow: {
    fontSize: 12,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.60)",
    marginBottom: 10,
  },
  h2: {
    margin: "0 0 10px",
    fontSize: 34,
    fontWeight: 800,
    letterSpacing: "-0.02em",
    lineHeight: 1.1,
  },
  p: { margin: 0, fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.70)" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 16,
  },
  card: {
    borderRadius: 16,
    padding: 18,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.10)",
    minHeight: 170,
    position: "relative",
    overflow: "hidden",
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    marginBottom: 12,
  },
  icon: {
    width: 24,
    height: 24,
    objectFit: "contain",
  },
  cardTitle: { fontSize: 16, fontWeight: 800, marginBottom: 6 },
  cardDesc: { fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.68)" },
  tag: {
    marginTop: 12,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12,
    fontWeight: 700,
    color: "rgba(255,255,255,0.78)",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.18)",
    borderRadius: 999,
    padding: "6px 10px",
  },
};

const css = `
  .featureCard{
    transition: transform .15s ease, border-color .15s ease, background .15s ease;
  }
  .featureCard:hover{
    transform: translateY(-2px);
    border-color: rgba(124,58,237,0.55);
    background: rgba(255,255,255,0.05);
  }
  @media (max-width: 1024px){
    #features .${""}{
    }
  }
  @media (max-width: 1024px){
    #features > div + div{
    }
  }
`;