// // src/Components/AnalyticsBandSection.tsx
// import React from "react";

// const AnalyticsBandSection = () => {
//   return (
//     <section id="analytics" style={styles.section}>
//       <style>{css}</style>
//       <div style={styles.band}>
//         <div style={styles.left}>
//           <div style={styles.eyebrow}>Safety analytics</div>
//           <div style={styles.title}>Spot trends before incidents happen.</div>
//           <div style={styles.desc}>
//             Track exposure time, incident frequency, response time, and device reliability. Export insights for audits
//             and reviews.
//           </div>

//           <div style={styles.stats}>
//             {STATS.map((s) => (
//               <div key={s.label} className="statCard" style={styles.stat}>
//                 <div style={styles.statLabel}>{s.label}</div>
//                 <div style={styles.statValue}>{s.value}</div>
//                 <div style={styles.statHint}>{s.hint}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div style={styles.right}>
//           <div className="chartCard" style={styles.chartCard}>
//             <div style={styles.chartHeader}>
//               <div style={styles.chartTitle}>Incident trend</div>
//               <div style={styles.chartBadge}>↓ 12% vs last month</div>
//             </div>
//             <div style={styles.fakeChart}>
//               <div style={styles.chartLine} />
//               <div style={styles.chartGlow} />
//             </div>
//           </div>

//           <div className="chartCard" style={styles.chartCard}>
//             <div style={styles.chartHeader}>
//               <div style={styles.chartTitle}>Exposure time</div>
//               <div style={styles.chartBadge}>Avg 4.2h/day</div>
//             </div>
//             <div style={styles.fakeChartSmall}>
//               <div style={styles.chartBarContainer}>
//                 {[65, 45, 80, 55, 70, 60, 85].map((h, i) => (
//                   <div key={i} style={{...styles.chartBar, height: `${h}%`}} />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default AnalyticsBandSection;

// const STATS = [
//   { label: "Avg response time", value: "1m 12s", hint: "Track & improve" },
//   { label: "Disconnection rate", value: "0.9%", hint: "Device reliability" },
//   { label: "Exposure alerts", value: "23", hint: "Last 7 days" },
// ];

// const styles: Record<string, React.CSSProperties> = {
//   section: { padding: "95px 0 0" },
//   band: {
//     borderRadius: 22,
//     padding: 18,
//     border: "1px solid rgba(255,255,255,0.10)",
//     background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(0,0,0,0.20))",
//     display: "grid",
//     gridTemplateColumns: "1.1fr 0.9fr",
//     gap: 16,
//     alignItems: "stretch",
//   },
//   left: {
//     borderRadius: 18,
//     padding: 18,
//     background: "rgba(0,0,0,0.18)",
//     border: "1px solid rgba(255,255,255,0.10)",
//   },
//   eyebrow: {
//     fontSize: 12,
//     letterSpacing: "0.16em",
//     textTransform: "uppercase",
//     color: "rgba(255,255,255,0.60)",
//     marginBottom: 10,
//   },
//   title: { fontSize: 26, fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 10 },
//   desc: { fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.70)" },

//   stats: { marginTop: 14, display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 },
//   stat: {
//     borderRadius: 14,
//     padding: 12,
//     background: "rgba(255,255,255,0.04)",
//     border: "1px solid rgba(255,255,255,0.10)",
//   },
//   statLabel: { fontSize: 12, color: "rgba(255,255,255,0.62)", marginBottom: 6 },
//   statValue: { fontSize: 18, fontWeight: 900 },
//   statHint: { fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 6 },

//   right: { display: "grid", gap: 12 },
//   chartCard: {
//     borderRadius: 18,
//     padding: 14,
//     background: "rgba(0,0,0,0.18)",
//     border: "1px solid rgba(255,255,255,0.10)",
//   },
//   chartHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   chartTitle: { 
//     fontSize: 13, 
//     fontWeight: 900, 
//     color: "rgba(255,255,255,0.82)",
//   },
//   chartBadge: {
//     fontSize: 11,
//     fontWeight: 600,
//     color: "rgba(255,255,255,0.70)",
//     background: "rgba(255,255,255,0.06)",
//     border: "1px solid rgba(255,255,255,0.10)",
//     padding: "4px 8px",
//     borderRadius: 999,
//   },
//   fakeChart: {
//     height: 120,
//     borderRadius: 12,
//     border: "1px solid rgba(255,255,255,0.10)",
//     background: "rgba(0,0,0,0.20)",
//     position: "relative" as const,
//     overflow: "hidden" as const,
//   },
//   chartLine: {
//     position: "absolute" as const,
//     bottom: "20%",
//     left: 0,
//     right: 0,
//     height: 3,
//     background: "linear-gradient(90deg, transparent, rgba(255, 234, 0, 0.5) 20%, rgba(255, 234, 0, 0.9) 50%, rgba(255, 234, 0, 0.4) 80%, transparent)",
//     filter: "blur(1px)",
//   },
//   chartGlow: {
//     position: "absolute" as const,
//     bottom: "10%",
//     left: "10%",
//     right: "10%",
//     height: "40%",
//     background: "radial-gradient(ellipse at center, rgba(255, 234, 0, 0.2), transparent 70%)",
//   },
//   fakeChartSmall: {
//     height: 90,
//     borderRadius: 12,
//     border: "1px solid rgba(255,255,255,0.10)",
//     background: "rgba(0,0,0,0.20)",
//     padding: "10px",
//     display: "flex",
//     alignItems: "flex-end",
//   },
//   chartBarContainer: {
//     display: "flex",
//     gap: "6px",
//     width: "100%",
//     height: "100%",
//     alignItems: "flex-end",
//   },
//   chartBar: {
//     flex: 1,
//     background: "linear-gradient(180deg, rgba(255, 234, 0, 0.85), rgba(255, 234, 0, 0.6))",
//     borderRadius: "4px 4px 0 0",
//     border: "1px solid rgba(255, 234, 0, 0.4)",
//     borderBottom: "none",
//     minHeight: "20%",
//   },
// };

// const css = `
//   .statCard {
//     transition: transform 0.2s ease, border-color 0.2s ease;
//   }
//   .statCard:hover {
//     transform: translateY(-2px);
//     border-color: rgba(255,255,255,0.20);
//   }
//   .chartCard {
//     transition: transform 0.2s ease, border-color 0.2s ease;
//   }
//   .chartCard:hover {
//     transform: translateY(-2px);
//     border-color: rgba(255,255,255,0.18);
//   }
// `;


// src/Components/AnalyticsBandSection.tsx
import React from "react";

// ✅ assets (make sure filenames match exactly)
import incidentTrendImg from "../assets/Incident.png";
import exposureTimeImg from "../assets/Exposure.png";

const AnalyticsBandSection = () => {
  return (
    <section id="analytics" style={styles.section}>
      <style>{css}</style>

      <div style={styles.band}>
        <div style={styles.left}>
          <div style={styles.eyebrow}>Safety analytics</div>
          <div style={styles.title}>Spot trends before incidents happen.</div>
          <div style={styles.desc}>
            Track exposure time, incident frequency, response time, and device reliability. Export insights for audits
            and reviews.
          </div>

          <div style={styles.stats}>
            {STATS.map((s) => (
              <div key={s.label} className="statCard" style={styles.stat}>
                <div style={styles.statLabel}>{s.label}</div>
                <div style={styles.statValue}>{s.value}</div>
                <div style={styles.statHint}>{s.hint}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.right}>
          {/* Incident trend (single card, image directly inside) */}
          <div className="chartCard" style={{ ...styles.chartCard, ...styles.chartCardTall }}>
            <div style={styles.chartHeader}>
              <div style={styles.chartTitle}>Incident trend</div>
              <div style={styles.chartBadge}>↓ 12% vs last month</div>
            </div>

            <img
              src={incidentTrendImg}
              alt="Incident trend"
              draggable={false}
              style={{ ...styles.chartImg, ...styles.chartImgIncident }}
            />
          </div>

          {/* Exposure time (single card, image directly inside) */}
          <div className="chartCard" style={{ ...styles.chartCard, ...styles.chartCardSmall }}>
            <div style={styles.chartHeader}>
              <div style={styles.chartTitle}>Exposure time</div>
              <div style={styles.chartBadge}>Avg 4.2h/day</div>
            </div>

            <img
              src={exposureTimeImg}
              alt="Exposure time"
              draggable={false}
              style={{ ...styles.chartImg, ...styles.chartImgExposure }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsBandSection;

const STATS = [
  { label: "Avg response time", value: "1m 12s", hint: "Track & improve" },
  { label: "Disconnection rate", value: "0.9%", hint: "Device reliability" },
  { label: "Exposure alerts", value: "23", hint: "Last 7 days" },
];

const styles: Record<string, React.CSSProperties> = {
  section: { padding: "95px 0 0" },
  band: {
    borderRadius: 22,
    padding: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(0,0,0,0.20))",
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: 16,
    alignItems: "stretch",
  },

  left: {
    borderRadius: 18,
    padding: 18,
    background: "rgba(0,0,0,0.18)",
    border: "1px solid rgba(255,255,255,0.10)",
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.60)",
    marginBottom: 10,
  },
  title: { fontSize: 26, fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 10 },
  desc: { fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.70)" },

  stats: { marginTop: 14, display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 },
  stat: {
    borderRadius: 14,
    padding: 12,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.10)",
  },
  statLabel: { fontSize: 12, color: "rgba(255,255,255,0.62)", marginBottom: 6 },
  statValue: { fontSize: 18, fontWeight: 900 },
  statHint: { fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 6 },

  right: { display: "grid", gap: 12 },

  // ✅ Main chart card (no extra inner black container)
  chartCard: {
    borderRadius: 18,
    padding: 14,
    background: "rgba(0,0,0,0.18)",
    border: "1px solid rgba(255,255,255,0.10)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden", // keeps zoomed images inside rounded corners
  },
  chartCardTall: {
    height: 170, // tweak if you want more/less image area
  },
  chartCardSmall: {
    height: 150,
  },

  chartHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 13,
    fontWeight: 900,
    color: "rgba(255,255,255,0.82)",
  },
  chartBadge: {
    fontSize: 11,
    fontWeight: 600,
    color: "rgba(255,255,255,0.70)",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    padding: "4px 8px",
    borderRadius: 999,
    whiteSpace: "nowrap",
  },

  // ✅ Image fills remaining space under header
  chartImg: {
    width: "100%",
    flex: 1,
    objectFit: "contain",
    objectPosition: "center",
    display: "block",
    userSelect: "none",
    pointerEvents: "none",
  },

  // ✅ Compensate for transparent padding in PNGs (adjust if needed)
  chartImgIncident: {
    transform: "scale(1.55)",
  },
  chartImgExposure: {
    transform: "scale(1.70)",
  },
};

const css = `
  .statCard {
    transition: transform 0.2s ease, border-color 0.2s ease;
  }
  .statCard:hover {
    transform: translateY(-2px);
    border-color: rgba(255,255,255,0.20);
  }
  .chartCard {
    transition: transform 0.2s ease, border-color 0.2s ease;
  }
  .chartCard:hover {
    transform: translateY(-2px);
    border-color: rgba(255,255,255,0.18);
  }
`;
