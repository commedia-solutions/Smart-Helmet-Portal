// // src/Components/UseCasesSection.tsx
// import React, { useMemo, useState } from "react";

// // ✅ assets (as per your folder screenshot)
// import constructionImg from "../assets/Constructions.png";
// import miningImg from "../assets/Mine.png";
// import factoryImg from "../assets/Factory.png";
// import loneImg from "../assets/Loneworker.png";

// const UseCasesSection = () => {
//   const [active, setActive] = useState(USE_CASES[0].id);
//   const current = useMemo(() => USE_CASES.find((u) => u.id === active)!, [active]);

//   return (
//     <section id="use-cases" style={styles.section}>
//       <div style={styles.head}>
//         <div style={styles.eyebrow}>Use cases</div>
//         <h2 style={styles.h2}>Real-world safety. Real-time insights.</h2>
//         <p style={styles.p}>Explore how teams monitor, respond, and stay compliant—across industries and environments.</p>
//       </div>

//       <div style={styles.tabsRow}>
//         {USE_CASES.map((u) => {
//           const isActive = u.id === active;
//           return (
//             <button
//               key={u.id}
//               onClick={() => setActive(u.id)}
//               style={{ ...styles.tab, ...(isActive ? styles.tabActive : null) }}
//             >
//               {u.title}
//             </button>
//           );
//         })}
//       </div>

//       <div style={styles.panel}>
//         {/* LEFT */}
//         <div style={styles.panelLeft}>
//           <div style={styles.panelTitle}>{current.subtitle}</div>
//           <ul style={styles.ul}>
//             {current.points.map((p) => (
//               <li key={p} style={styles.li}>
//                 <span style={styles.bullet} />
//                 <span>{p}</span>
//               </li>
//             ))}
//           </ul>
//           {/* ✅ Buttons removed */}
//         </div>

//         {/* RIGHT */}
//         <div style={styles.panelRight}>
//           <div style={styles.mockFrame}>
//             <div style={styles.mockTop}>
//               <span style={{ ...styles.dot, background: "#ff5f56" }} />
//               <span style={{ ...styles.dot, background: "#ffbd2e" }} />
//               <span style={{ ...styles.dot, background: "#27c93f" }} />
//               {/* ✅ title only (no "Preview") */}
//               <span style={styles.mockTitle}>{current.title}</span>
//             </div>

//             {/* ✅ SAME mockBody size — just image inside */}
//             <div style={styles.mockBody}>
//               <div style={styles.imageCenter}>
//                 <img src={current.image} alt={current.title} style={styles.usecaseImage} />
//               </div>
//             </div>
//           </div>

//           <div style={styles.note}>
//             Tip: you can map policies per site (thresholds + escalations) without changing devices.
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default UseCasesSection;

// const USE_CASES = [
//   {
//     id: "construction",
//     title: "Construction",
//     subtitle: "Reduce incidents with live risk visibility.",
//     points: [
//       "Heat + exertion monitoring (HR/temp)",
//       "Gas exposure alerts (CO/NO₂)",
//       "Disconnected device detection",
//     ],
//     image: constructionImg,
//   },
//   {
//     id: "mining",
//     title: "Mining",
//     subtitle: "Confined spaces need faster escalation.",
//     points: [
//       "Gas spike detection with strict thresholds",
//       "Multi-step alert escalation",
//       "Historical exposure reporting",
//     ],
//     image: miningImg,
//   },
//   {
//     id: "factory",
//     title: "Factories",
//     subtitle: "Track safety across shifts and zones.",
//     points: [
//       "Zone-based monitoring by site",
//       "Shift-wise incident review",
//       "Reports for compliance & audits",
//     ],
//     image: factoryImg,
//   },
//   {
//     id: "lone",
//     title: "Lone workers",
//     subtitle: "Situational awareness when nobody’s nearby.",
//     points: ["Instant threshold alerts", "Quick status checks", "Incident timeline for review"],
//     image: loneImg,
//   },
// ];

// const styles: Record<string, React.CSSProperties> = {
//   section: { padding: "90px 0 0" },
//   head: { maxWidth: 720, marginBottom: 18 },
//   eyebrow: {
//     fontSize: 12,
//     letterSpacing: "0.16em",
//     textTransform: "uppercase",
//     color: "rgba(255,255,255,0.60)",
//     marginBottom: 10,
//   },
//   h2: { margin: "0 0 10px", fontSize: 34, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1 },
//   p: { margin: 0, fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.70)" },

//   tabsRow: { display: "flex", gap: 10, flexWrap: "wrap", margin: "18px 0 18px" },
//   tab: {
//     background: "rgba(255,255,255,0.04)",
//     border: "1px solid rgba(255,255,255,0.10)",
//     color: "rgba(255,255,255,0.80)",
//     padding: "10px 14px",
//     borderRadius: 999,
//     fontSize: 13,
//     fontWeight: 800,
//     cursor: "pointer",
//   },

//   // ✅ no border highlight change
//   tabActive: {
//     borderColor: "rgba(255,255,255,0.10)",
//     background: "rgba(255,234,0,0.08)",
//     color: "rgba(255,255,255,0.92)",
//   },

//   panel: {
//     display: "grid",
//     gridTemplateColumns: "1fr 1fr",
//     gap: 18,
//     alignItems: "stretch",
//   },

//   panelLeft: {
//     borderRadius: 18,
//     padding: 22,
//     background: "rgba(255,255,255,0.03)",
//     border: "1px solid rgba(255,255,255,0.10)",
//   },

//   panelTitle: { fontSize: 22, fontWeight: 900, marginBottom: 14, letterSpacing: "-0.01em" },

//   ul: { margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 10 },
//   li: { display: "flex", gap: 10, color: "rgba(255,255,255,0.78)", lineHeight: 1.6, fontSize: 14 },
//   bullet: {
//     width: 10,
//     height: 10,
//     borderRadius: 999,
//     background: "#ffea00",
//     marginTop: 6,
//     flex: "0 0 auto",
//     boxShadow: "0 0 0 4px rgba(255,234,0,0.12)",
//   },

//   panelRight: { display: "grid", gap: 10 },

//   mockFrame: {
//     borderRadius: 18,
//     overflow: "hidden",
//     border: "1px solid rgba(255,255,255,0.10)",
//     background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
//   },
//   mockTop: {
//     height: 44,
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     padding: "0 14px",
//     borderBottom: "1px solid rgba(255,255,255,0.08)",
//     background: "rgba(0,0,0,0.18)",
//   },
//   dot: { width: 10, height: 10, borderRadius: 999, opacity: 0.8 },
//   mockTitle: { marginLeft: 10, fontSize: 13, color: "rgba(255,255,255,0.80)", fontWeight: 700 },

//   // ✅ UNCHANGED SIZE SETTINGS
//   mockBody: {
//     position: "relative",
//     padding: 18,
//     minHeight: 270,
//     background:
//       "radial-gradient(circle at 30% 35%, rgba(255,255,255,0.06), transparent 45%)," +
//       "radial-gradient(circle at 70% 60%, rgba(255,255,255,0.04), transparent 50%)," +
//       "linear-gradient(180deg, rgba(0,0,0,0.10), rgba(0,0,0,0.32))",
//     filter: "grayscale(1)",
//   },

//   // ✅ ONLY new: center image without affecting container size
//   imageCenter: {
//     position: "absolute",
//     inset: 0,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   usecaseImage: {
//     maxWidth: "86%",
//     maxHeight: "86%",
//     objectFit: "contain",
//     display: "block",
//   },

//   note: { fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, paddingLeft: 6 },
// };


// src/Components/UseCasesSection.tsx
import React, { useMemo, useState } from "react";

// ✅ assets (as per your folder screenshot)
import constructionImg from "../assets/Constructions.png";
import miningImg from "../assets/Mine.png";
import factoryImg from "../assets/Factory.png";
import loneImg from "../assets/Loneworker.png";

const UseCasesSection = () => {
  const [active, setActive] = useState(USE_CASES[0].id);
  const current = useMemo(() => USE_CASES.find((u) => u.id === active)!, [active]);

  return (
    <section id="use-cases" style={styles.section}>
      <div style={styles.head}>
        <div style={styles.eyebrow}>Use cases</div>
        <h2 style={styles.h2}>Real-world safety. Real-time insights.</h2>
        <p style={styles.p}>
          Explore how teams monitor, respond, and stay compliant—across industries and environments.
        </p>
      </div>

      <div style={styles.tabsRow}>
        {USE_CASES.map((u) => {
          const isActive = u.id === active;
          return (
            <button
              key={u.id}
              onClick={() => setActive(u.id)}
              style={{ ...styles.tab, ...(isActive ? styles.tabActive : null) }}
            >
              {u.title}
            </button>
          );
        })}
      </div>

      <div style={styles.panel}>
        {/* LEFT */}
        <div style={styles.panelLeft}>
          <div style={styles.panelTitle}>{current.subtitle}</div>
          <ul style={styles.ul}>
            {current.points.map((p) => (
              <li key={p} style={styles.li}>
                <span style={styles.bullet} />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT */}
        <div style={styles.panelRight}>
          <div style={styles.mockFrame}>
            <div style={styles.mockTop}>
              <span style={{ ...styles.dot, background: "#ff5f56" }} />
              <span style={{ ...styles.dot, background: "#ffbd2e" }} />
              <span style={{ ...styles.dot, background: "#27c93f" }} />
              <span style={styles.mockTitle}>{current.title}</span>
            </div>

            <div style={styles.mockBody}>
              <div style={styles.imageCenter}>
                <img src={current.image} alt={current.title} style={styles.usecaseImage} />
              </div>
            </div>
          </div>

          {/* ✅ removed Tip line */}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;

const USE_CASES = [
  {
    id: "construction",
    title: "Construction",
    subtitle: "Reduce incidents with live risk visibility.",
    points: [
      "Heat + exertion monitoring (HR/temp)",
      "Gas exposure alerts (CO/NO₂)",
      "Disconnected device detection",
      "Immediate supervisor notifications for high-risk readings",
      "Daily safety summaries per site and shift",
    ],
    image: constructionImg,
  },
  {
    id: "mining",
    title: "Mining",
    subtitle: "Confined spaces need faster escalation.",
    points: [
      "Gas spike detection with strict thresholds",
      "Multi-step alert escalation for underground zones",
      "Historical exposure reporting for compliance",
      "Offline buffering + sync when connectivity returns",
      "Worker status tracking for entry/exit and check-ins",
    ],
    image: miningImg,
  },
  {
    id: "factory",
    title: "Factories",
    subtitle: "Track safety across shifts and zones.",
    points: [
      "Zone-based monitoring by plant sections",
      "Shift-wise incident review and trend spotting",
      "Reports for compliance & audits",
      "Threshold profiles by process/area (welding, chemical, etc.)",
      "Early warnings when readings approach limits",
    ],
    image: factoryImg,
  },
  {
    id: "lone",
    title: "Lone workers",
    subtitle: "Situational awareness when nobody’s nearby.",
    points: [
      "Instant threshold alerts to control room",
      "Quick status checks with last-seen timestamp",
      "Incident timeline for review",
      "Auto-escalation if no movement/check-in detected",
      "Location-based alerts for restricted zones (if enabled)",
    ],
    image: loneImg,
  },
];

const styles: Record<string, React.CSSProperties> = {
  section: { padding: "90px 0 0" },
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

  tabsRow: { display: "flex", gap: 10, flexWrap: "wrap", margin: "18px 0 18px" },

  tab: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.10)",
    color: "rgba(255,255,255,0.80)",
    padding: "10px 14px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 800,
    cursor: "pointer",

    // ✅ removes the blue outline ring on click/focus
    outline: "none",
    boxShadow: "none",
  },

  // ✅ no border highlight change (and no extra glow)
  tabActive: {
    borderColor: "rgba(255,255,255,0.10)",
    background: "rgba(255,234,0,0.08)",
    color: "rgba(255,255,255,0.92)",
    outline: "none",
    boxShadow: "none",
  },

  // ✅ IMPORTANT: stop stretching left card to match right image height
  panel: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 18,
    alignItems: "start", // was "stretch"
  },

  // ✅ card height becomes natural (no huge empty space)
  panelLeft: {
    borderRadius: 18,
    padding: 22,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.10)",
    height: "fit-content",
  },

  panelTitle: { fontSize: 22, fontWeight: 900, marginBottom: 14, letterSpacing: "-0.01em" },

  ul: { margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 10 },
  li: { display: "flex", gap: 10, color: "rgba(255,255,255,0.78)", lineHeight: 1.6, fontSize: 14 },
  bullet: {
    width: 10,
    height: 10,
    borderRadius: 999,
    background: "#ffea00",
    marginTop: 6,
    flex: "0 0 auto",
    boxShadow: "0 0 0 4px rgba(255,234,0,0.12)",
  },

  panelRight: { display: "grid", gap: 10 },

  mockFrame: {
    borderRadius: 18,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
  },
  mockTop: {
    height: 44,
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "0 14px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(0,0,0,0.18)",
  },
  dot: { width: 10, height: 10, borderRadius: 999, opacity: 0.8 },
  mockTitle: { marginLeft: 10, fontSize: 13, color: "rgba(255,255,255,0.80)", fontWeight: 700 },

  mockBody: {
    position: "relative",
    padding: 18,
    minHeight: 270,
    background:
      "radial-gradient(circle at 30% 35%, rgba(255,255,255,0.06), transparent 45%)," +
      "radial-gradient(circle at 70% 60%, rgba(255,255,255,0.04), transparent 50%)," +
      "linear-gradient(180deg, rgba(0,0,0,0.10), rgba(0,0,0,0.32))",
    filter: "grayscale(1)",
  },

  imageCenter: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  usecaseImage: {
    maxWidth: "86%",
    maxHeight: "86%",
    objectFit: "contain",
    display: "block",
  },
};
