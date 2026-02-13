// // src/Components/DashboardShowcaseSection.tsx
// import React, { useMemo, useState } from "react";

// const DashboardShowcaseSection = () => {
//   const [tab, setTab] = useState<Tab>("Overview");
//   const content = useMemo(() => TAB_CONTENT[tab], [tab]);

//   return (
//     <section id="dashboard-showcase" style={styles.section}>
//       <div style={styles.head}>
//         <div style={styles.eyebrow}>Dashboard</div>
//         <h2 style={styles.h2}>One view for devices, alerts, and history.</h2>
//         <p style={styles.p}>
//           Switch between overview, active alerts, device fleet, and historical trends—without hunting for data.
//         </p>
//       </div>

//       <div style={styles.wrap}>
//         <div style={styles.tabs}>
//           {TABS.map((t) => {
//             const active = t === tab;
//             return (
//               <button
//                 key={t}
//                 onClick={() => setTab(t)}
//                 style={{ ...styles.tab, ...(active ? styles.tabActive : null) }}
//               >
//                 {t}
//               </button>
//             );
//           })}
//         </div>

//         <div style={styles.panel}>
//           <div style={styles.left}>
//             <div style={styles.cardTitle}>{content.title}</div>
//             <div style={styles.cardDesc}>{content.desc}</div>

//             <div style={styles.metrics}>
//               {content.metrics.map((m) => (
//                 <div key={m.label} style={styles.metric}>
//                   <div style={styles.metricLabel}>{m.label}</div>
//                   <div style={styles.metricValue}>{m.value}</div>
//                   <div style={styles.metricHint}>{m.hint}</div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div style={styles.right}>
//             <div style={styles.frame}>
//               <div style={styles.topbar}>
//                 <span style={{ ...styles.dot, background: "#ff5f56" }} />
//                 <span style={{ ...styles.dot, background: "#ffbd2e" }} />
//                 <span style={{ ...styles.dot, background: "#27c93f" }} />
//                 <span style={styles.topTitle}>C-Smart Dashboard</span>
//               </div>

//               <div style={styles.body}>
//                 <div style={styles.bigCard}>
//                   <div style={styles.kicker}>Selected view</div>
//                   <div style={styles.bigValue}>{tab}</div>
//                   <div style={styles.hint}>Preview layout (greyscale)</div>
//                 </div>

//                 <div style={{ ...styles.smallCard, left: 22, top: 136 }}>
//                   <div style={styles.kicker}>Devices</div>
//                   <div style={styles.bigValue2}>48</div>
//                   <div style={styles.hint}>2 disconnected</div>
//                 </div>

//                 <div style={{ ...styles.smallCard, right: 22, top: 136 }}>
//                   <div style={styles.kicker}>Alerts</div>
//                   <div style={styles.bigValue2}>3</div>
//                   <div style={styles.hint}>1 urgent</div>
//                 </div>

//                 <div style={styles.chart} />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default DashboardShowcaseSection;

// type Tab = "Overview" | "Alerts" | "History" | "Devices";
// const TABS: Tab[] = ["Overview", "Alerts", "History", "Devices"];

// const TAB_CONTENT: Record<Tab, { title: string; desc: string; metrics: { label: string; value: string; hint: string }[] }> =
//   {
//     Overview: {
//       title: "Overview at a glance",
//       desc: "See fleet health, active alerts, and top risk signals across all helmets.",
//       metrics: [
//         { label: "Active devices", value: "48", hint: "Across 3 sites" },
//         { label: "Open alerts", value: "3", hint: "1 urgent" },
//         { label: "Avg response", value: "1m 12s", hint: "Target < 2m" },
//       ],
//     },
//     Alerts: {
//       title: "Alerts with context",
//       desc: "Every alert shows device, threshold, recent readings, and escalation path.",
//       metrics: [
//         { label: "Urgent", value: "1", hint: "CO threshold" },
//         { label: "Warnings", value: "2", hint: "Vitals + temp" },
//         { label: "Resolved today", value: "7", hint: "Auto logged" },
//       ],
//     },
//     History: {
//       title: "History you can export",
//       desc: "Review vitals and exposure over time—built for audits and incident reviews.",
//       metrics: [
//         { label: "Retention", value: "90 days", hint: "Configurable" },
//         { label: "Exports", value: "PDF/CSV", hint: "One-click" },
//         { label: "Trends", value: "Shift-wise", hint: "Compare periods" },
//       ],
//     },
//     Devices: {
//       title: "Manage the helmet fleet",
//       desc: "Track connectivity, health, and assignment status across all devices.",
//       metrics: [
//         { label: "Online", value: "46", hint: "Stable" },
//         { label: "Disconnected", value: "2", hint: "Investigate" },
//         { label: "Battery health", value: "Good", hint: "Overall" },
//       ],
//     },
//   };

// const styles: Record<string, React.CSSProperties> = {
//   section: { padding: "95px 0 0" },
//   head: { maxWidth: 760, marginBottom: 18 },
//   eyebrow: {
//     fontSize: 12,
//     letterSpacing: "0.16em",
//     textTransform: "uppercase",
//     color: "rgba(255,255,255,0.60)",
//     marginBottom: 10,
//   },
//   h2: { margin: "0 0 10px", fontSize: 34, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1 },
//   p: { margin: 0, fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.70)" },

//   wrap: {
//     borderRadius: 18,
//     border: "1px solid rgba(255,255,255,0.10)",
//     background: "rgba(255,255,255,0.03)",
//     padding: 16,
//   },

//   tabs: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 },
//   tab: {
//     background: "rgba(255,255,255,0.04)",
//     border: "1px solid rgba(255,255,255,0.10)",
//     color: "rgba(255,255,255,0.78)",
//     padding: "10px 14px",
//     borderRadius: 12,
//     fontSize: 13,
//     fontWeight: 900,
//     cursor: "pointer",
//   },
//   tabActive: {
//     background: "rgba(255,234,0,0.10)",
//     borderColor: "rgba(255,234,0,0.35)",
//     color: "rgba(255,255,255,0.92)",
//   },

//   panel: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "stretch" },
//   left: {
//     borderRadius: 16,
//     border: "1px solid rgba(255,255,255,0.10)",
//     background: "rgba(0,0,0,0.18)",
//     padding: 18,
//   },
//   cardTitle: { fontSize: 18, fontWeight: 900, marginBottom: 6 },
//   cardDesc: { fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.70)", marginBottom: 14 },

//   metrics: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 },
//   metric: {
//     borderRadius: 14,
//     padding: 12,
//     background: "rgba(255,255,255,0.04)",
//     border: "1px solid rgba(255,255,255,0.10)",
//   },
//   metricLabel: { fontSize: 12, color: "rgba(255,255,255,0.62)", marginBottom: 6 },
//   metricValue: { fontSize: 18, fontWeight: 900 },
//   metricHint: { fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 6 },

//   right: { display: "grid" },

//   frame: {
//     borderRadius: 18,
//     overflow: "hidden",
//     border: "1px solid rgba(255,255,255,0.10)",
//     background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
//   },
//   topbar: {
//     height: 44,
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     padding: "0 14px",
//     borderBottom: "1px solid rgba(255,255,255,0.08)",
//     background: "rgba(0,0,0,0.18)",
//   },
//   dot: { width: 10, height: 10, borderRadius: 999, opacity: 0.8 },
//   topTitle: { marginLeft: 10, fontSize: 13, color: "rgba(255,255,255,0.80)", fontWeight: 700 },

//   body: {
//     position: "relative",
//     padding: 16,
//     minHeight: 320,
//     filter: "grayscale(1)",
//     background:
//       "radial-gradient(circle at 30% 35%, rgba(255,255,255,0.06), transparent 45%)," +
//       "radial-gradient(circle at 70% 60%, rgba(255,255,255,0.04), transparent 50%)," +
//       "linear-gradient(180deg, rgba(0,0,0,0.10), rgba(0,0,0,0.32))",
//   },

//   bigCard: {
//     borderRadius: 16,
//     padding: 14,
//     background: "rgba(15,15,15,0.62)",
//     border: "1px solid rgba(255,255,255,0.10)",
//     backdropFilter: "blur(8px)",
//     width: "100%",
//   },
//   kicker: { fontSize: 12, color: "rgba(255,255,255,0.65)", marginBottom: 6 },
//   bigValue: { fontSize: 22, fontWeight: 900, color: "rgba(255,255,255,0.92)", marginBottom: 6 },
//   hint: { fontSize: 12, color: "rgba(255,255,255,0.65)" },

//   smallCard: {
//     position: "absolute",
//     width: 170,
//     borderRadius: 14,
//     padding: 12,
//     background: "rgba(15,15,15,0.62)",
//     border: "1px solid rgba(255,255,255,0.10)",
//     backdropFilter: "blur(8px)",
//   },
//   bigValue2: { fontSize: 20, fontWeight: 900, color: "rgba(255,255,255,0.92)", marginBottom: 4 },

//   chart: {
//     position: "absolute",
//     left: 16,
//     right: 16,
//     bottom: 16,
//     height: 90,
//     borderRadius: 14,
//     border: "1px solid rgba(255,255,255,0.10)",
//     background:
//       "linear-gradient(90deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.10) 12%, transparent 12%, transparent 18%," +
//       "rgba(255,255,255,0.10) 18%, rgba(255,255,255,0.10) 38%, transparent 38%, transparent 44%," +
//       "rgba(255,255,255,0.10) 44%, rgba(255,255,255,0.10) 70%, transparent 70%, transparent 100%)",
//     opacity: 0.65,
//   },
// };


// src/Components/DashboardShowcaseSection.tsx
import React, { useMemo, useState } from "react";

const DashboardShowcaseSection = () => {
  const [tab, setTab] = useState<Tab>("Overview");
  const content = useMemo(() => TAB_CONTENT[tab], [tab]);

  return (
    <section id="dashboard-showcase" style={styles.section}>
      <div style={styles.head}>
        <div style={styles.eyebrow}>Dashboard</div>
        <h2 style={styles.h2}>One view for devices, alerts, and history.</h2>
        <p style={styles.p}>
          Switch between overview, active alerts, device fleet, and historical trends—without hunting for data.
        </p>
      </div>

      <div style={styles.wrap}>
        <div style={styles.tabs}>
          {TABS.map((t) => {
            const active = t === tab;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{ ...styles.tab, ...(active ? styles.tabActive : null) }}
              >
                {t}
              </button>
            );
          })}
        </div>

        <div style={styles.panel}>
          <div style={styles.left}>
            <div style={styles.cardTitle}>{content.title}</div>
            <div style={styles.cardDesc}>{content.desc}</div>

            <div style={styles.metrics}>
              {content.metrics.map((m) => (
                <div key={m.label} style={styles.metric}>
                  <div style={styles.metricLabel}>{m.label}</div>
                  <div style={styles.metricValue}>{m.value}</div>
                  <div style={styles.metricHint}>{m.hint}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.right}>
            <div style={styles.frame}>
              <div style={styles.topbar}>
                <span style={{ ...styles.dot, background: "#ff5f56" }} />
                <span style={{ ...styles.dot, background: "#ffbd2e" }} />
                <span style={{ ...styles.dot, background: "#27c93f" }} />
                <span style={styles.topTitle}>C-Smart Dashboard</span>
              </div>

              <div style={styles.body}>
                <div style={styles.bigCard}>
                  <div style={styles.kicker}>Selected view</div>
                  <div style={styles.bigValue}>{tab}</div>
                  <div style={styles.hint}>Preview layout (greyscale)</div>
                </div>

                <div style={{ ...styles.smallCard, left: 22, top: 136 }}>
                  <div style={styles.kicker}>Devices</div>
                  <div style={styles.bigValue2}>48</div>
                  <div style={styles.hint}>2 disconnected</div>
                </div>

                <div style={{ ...styles.smallCard, right: 22, top: 136 }}>
                  <div style={styles.kicker}>Alerts</div>
                  <div style={styles.bigValue2}>3</div>
                  <div style={styles.hint}>1 urgent</div>
                </div>

                <div style={styles.chart} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardShowcaseSection;

type Tab = "Overview" | "Alerts" | "History" | "Devices";
const TABS: Tab[] = ["Overview", "Alerts", "History", "Devices"];

const TAB_CONTENT: Record<
  Tab,
  { title: string; desc: string; metrics: { label: string; value: string; hint: string }[] }
> = {
  Overview: {
    title: "Overview at a glance",
    desc: "See fleet health, active alerts, and top risk signals across all helmets.",
    metrics: [
      { label: "Active devices", value: "48", hint: "Across 3 sites" },
      { label: "Open alerts", value: "3", hint: "1 urgent" },
      { label: "Avg response", value: "1m 12s", hint: "Target < 2m" },
    ],
  },
  Alerts: {
    title: "Alerts with context",
    desc: "Every alert shows device, threshold, recent readings, and escalation path.",
    metrics: [
      { label: "Urgent", value: "1", hint: "CO threshold" },
      { label: "Warnings", value: "2", hint: "Vitals + temp" },
      { label: "Resolved today", value: "7", hint: "Auto logged" },
    ],
  },
  History: {
    title: "History you can export",
    desc: "Review vitals and exposure over time—built for audits and incident reviews.",
    metrics: [
      { label: "Retention", value: "90 days", hint: "Configurable" },
      { label: "Exports", value: "PDF/CSV", hint: "One-click" },
      { label: "Trends", value: "Shift-wise", hint: "Compare periods" },
    ],
  },
  Devices: {
    title: "Manage the helmet fleet",
    desc: "Track connectivity, health, and assignment status across all devices.",
    metrics: [
      { label: "Online", value: "46", hint: "Stable" },
      { label: "Disconnected", value: "2", hint: "Investigate" },
      { label: "Battery health", value: "Good", hint: "Overall" },
    ],
  },
};

const styles: Record<string, React.CSSProperties> = {
  section: { padding: "95px 0 0" },
  head: { maxWidth: 760, marginBottom: 18 },
  eyebrow: {
    fontSize: 12,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.60)",
    marginBottom: 10,
  },
  h2: { margin: "0 0 10px", fontSize: 34, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1 },
  p: { margin: 0, fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.70)" },

  wrap: {
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: 16,
  },

  tabs: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 },

  tab: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.10)",
    color: "rgba(255,255,255,0.78)",
    padding: "10px 14px",
    borderRadius: 12,
    fontSize: 13,
    fontWeight: 900,
    cursor: "pointer",

    // ✅ remove blue focus border/ring on click
    outline: "none",
    boxShadow: "none",
  },

  tabActive: {
    background: "rgba(255,234,0,0.10)",
    borderColor: "rgba(255,234,0,0.35)",
    color: "rgba(255,255,255,0.92)",

    // ✅ also ensure active doesn't show any ring
    outline: "none",
    boxShadow: "none",
  },

  panel: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "stretch" },
  left: {
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.18)",
    padding: 18,
  },
  cardTitle: { fontSize: 18, fontWeight: 900, marginBottom: 6 },
  cardDesc: { fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.70)", marginBottom: 14 },

  metrics: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 },
  metric: {
    borderRadius: 14,
    padding: 12,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.10)",
  },
  metricLabel: { fontSize: 12, color: "rgba(255,255,255,0.62)", marginBottom: 6 },
  metricValue: { fontSize: 18, fontWeight: 900 },
  metricHint: { fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 6 },

  right: { display: "grid" },

  frame: {
    borderRadius: 18,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
  },
  topbar: {
    height: 44,
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "0 14px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(0,0,0,0.18)",
  },
  dot: { width: 10, height: 10, borderRadius: 999, opacity: 0.8 },
  topTitle: { marginLeft: 10, fontSize: 13, color: "rgba(255,255,255,0.80)", fontWeight: 700 },

  body: {
    position: "relative",
    padding: 16,
    minHeight: 320,
    filter: "grayscale(1)",
    background:
      "radial-gradient(circle at 30% 35%, rgba(255,255,255,0.06), transparent 45%)," +
      "radial-gradient(circle at 70% 60%, rgba(255,255,255,0.04), transparent 50%)," +
      "linear-gradient(180deg, rgba(0,0,0,0.10), rgba(0,0,0,0.32))",
  },

  bigCard: {
    borderRadius: 16,
    padding: 14,
    background: "rgba(15,15,15,0.62)",
    border: "1px solid rgba(255,255,255,0.10)",
    backdropFilter: "blur(8px)",
    width: "100%",
  },
  kicker: { fontSize: 12, color: "rgba(255,255,255,0.65)", marginBottom: 6 },
  bigValue: { fontSize: 22, fontWeight: 900, color: "rgba(255,255,255,0.92)", marginBottom: 6 },
  hint: { fontSize: 12, color: "rgba(255,255,255,0.65)" },

  smallCard: {
    position: "absolute",
    width: 170,
    borderRadius: 14,
    padding: 12,
    background: "rgba(15,15,15,0.62)",
    border: "1px solid rgba(255,255,255,0.10)",
    backdropFilter: "blur(8px)",
  },
  bigValue2: { fontSize: 20, fontWeight: 900, color: "rgba(255,255,255,0.92)", marginBottom: 4 },

  chart: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    height: 90,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background:
      "linear-gradient(90deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.10) 12%, transparent 12%, transparent 18%," +
      "rgba(255,255,255,0.10) 18%, rgba(255,255,255,0.10) 38%, transparent 38%, transparent 44%," +
      "rgba(255,255,255,0.10) 44%, rgba(255,255,255,0.10) 70%, transparent 70%, transparent 100%)",
    opacity: 0.65,
  },
};
