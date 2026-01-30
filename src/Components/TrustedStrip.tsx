// // src/Components/TrustedStrip.tsx
// import React from "react";

// const TrustedStrip = () => {
//   return (
//     <section id="trusted" style={styles.section}>
//       <div style={styles.inner}>
//         <div style={styles.left}>
//           <div style={styles.kicker}>Built for industrial safety teams</div>
//           <div style={styles.title}>A safety stack that stays out of the way.</div>
//         </div>

//         <div style={styles.right}>
//           {BADGES.map((b) => (
//             <span key={b} style={styles.badge}>
//               {b}
//             </span>
//           ))}
//         </div>
//       </div>

//       <div style={styles.divider} />
//     </section>
//   );
// };

// export default TrustedStrip;

// const BADGES = [
//   "Real-time vitals",
//   "Gas detection",
//   "Helmet status",
//   "Instant alerts",
//   "Live dashboard",
//   "History & reports",
//   "Multi-device fleet",
// ];

// const styles: Record<string, React.CSSProperties> = {
//   section: { padding: "28px 0 0" },
//   inner: {
//     display: "flex",
//     alignItems: "flex-start",
//     justifyContent: "space-between",
//     gap: 20,
//     flexWrap: "wrap",
//   },
//   left: { minWidth: 260 },
//   kicker: {
//     fontSize: 12,
//     letterSpacing: "0.16em",
//     textTransform: "uppercase",
//     color: "rgba(255,255,255,0.60)",
//     marginBottom: 8,
//   },
//   title: { fontSize: 18, fontWeight: 700, color: "rgba(255,255,255,0.92)" },
//   right: {
//     display: "flex",
//     gap: 10,
//     flexWrap: "wrap",
//     justifyContent: "flex-end",
//     flex: 1,
//   },
//   badge: {
//     padding: "8px 12px",
//     borderRadius: 999,
//     fontSize: 12,
//     fontWeight: 600,
//     color: "rgba(255,255,255,0.78)",
//     background: "rgba(255,255,255,0.04)",
//     border: "1px solid rgba(255,255,255,0.08)",
//   },
//   divider: {
//     marginTop: 18,
//     height: 1,
//     background: "rgba(255,255,255,0.08)",
//   },
// };

// src/Components/TrustedStrip.tsx
import React from "react";

const TrustedStrip = () => {
  return (
    <section id="trusted" style={styles.section}>
      <div style={styles.inner}>
        <div style={styles.left}>
          <div style={styles.kicker}>Built for industrial safety teams</div>
          <div style={styles.title}>A safety stack that stays out of the way.</div>
        </div>

        <div style={styles.right}>
          {BADGES.map((label, idx) => (
            <span key={label} style={{...styles.badge, ...getBadgeColor(idx)}}>
              {label}
            </span>
          ))}
        </div>
      </div>

      <div style={styles.divider} />
    </section>
  );
};

export default TrustedStrip;

const BADGES = [
  "Real-time vitals",
  "Gas detection",
  "Helmet status",
  "Instant alerts",
  "Live dashboard",
  "History & reports",
  "Multi-device fleet",
];

const getBadgeColor = (index: number): React.CSSProperties => {
  const colors = [
    { color: "#FFB8C6", border: "rgba(255, 140, 170, 0.5)" }, // Pink
    { color: "#B8E6FF", border: "rgba(140, 200, 255, 0.5)" }, // Blue
    { color: "#D4B8FF", border: "rgba(180, 140, 255, 0.5)" }, // Purple
    { color: "#FFD4B8", border: "rgba(255, 180, 140, 0.5)" }, // Orange
    { color: "#B8FFD4", border: "rgba(140, 255, 180, 0.5)" }, // Cyan
    { color: "#E6B8FF", border: "rgba(200, 140, 255, 0.5)" }, // Lavender
    { color: "#FFE6B8", border: "rgba(255, 200, 140, 0.5)" }, // Yellow
  ];
  
  const colorScheme = colors[index % colors.length];
  return {
    color: colorScheme.color,
    borderColor: colorScheme.border,
  };
};

const styles: Record<string, React.CSSProperties> = {
  section: { padding: "28px 0 0" },
  inner: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 20,
    flexWrap: "wrap",
  },
  left: { minWidth: 260 },
  kicker: {
    fontSize: 12,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.60)",
    marginBottom: 8,
  },
  title: { fontSize: 18, fontWeight: 700, color: "rgba(255,255,255,0.92)" },
  right: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "flex-end",
    flex: 1,
  },
  badge: {
    padding: "8px 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    background: "rgba(20, 20, 30, 0.4)",
    border: "1.5px solid",
    letterSpacing: "0.01em",
  },
  divider: {
    marginTop: 18,
    height: 1,
    background: "rgba(255,255,255,0.08)",
  },
};