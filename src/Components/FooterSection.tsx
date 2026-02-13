// src/Components/FooterSection.tsx
import React from "react";
import commediaLogo from "../assets/commedialogo.jpg"; // update name if needed

const brand = {
  name: "C-Smart",
  blurb: "Empowering teams with reliable, scalable, and elegant product experiences.",
};

const columns = {
  solutions: [
    { label: "Helmet Monitoring", href: "#features" },
    { label: "Safety Analytics", href: "#analytics" },
    { label: "Alerts & Escalation", href: "#alerts" },
    { label: "Reports & Exports", href: "#reports" },
    { label: "Multi-helmet Fleet View", href: "#dashboard" },
  ],
  resources: [
    { label: "Documentation", href: "/docs" },
    { label: "Use cases", href: "/use-cases" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact-sales" },
  ],
};

const socials = [
  { kind: "instagram" as const, href: "#", label: "Instagram" },
  { kind: "twitter" as const, href: "#", label: "Twitter/X" },
  { kind: "linkedin" as const, href: "#", label: "LinkedIn" },
  { kind: "youtube" as const, href: "#", label: "YouTube" },
];

export default function FooterSection() {
  return (
    <footer style={styles.footer}>
      <style>{css}</style>

      <div style={styles.container} className="footer-container">
        {/* Top band (no subscribe form) */}
        <div style={styles.topBand} className="top-band">
          <div>
            <h4 style={styles.topTitle}>Stay ahead with {brand.name}.</h4>
            <p style={styles.topDesc}>
              Join teams who trust {brand.name} for smarter monitoring, faster response, and safer sites.
            </p>
          </div>

          {/* ✅ Logo is FREE (not in a card) */}
          <div style={styles.logoBlock} className="logo-block">
            <img src={commediaLogo} alt="Commedia" style={styles.logoImg} />
            <div style={styles.logoCaption}>Built by Commedia Solutions</div>
          </div>
        </div>

        {/* Link Columns */}
        <div style={styles.linksGrid} className="footer-links-grid">
          {/* Brand column */}
          <div>
            <div style={styles.brandName}>{brand.name}.</div>
            <p style={styles.brandBlurb}>{brand.blurb}</p>

            <div style={styles.socialRow}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="social-btn"
                  style={styles.socialBtn}
                  target="_blank"
                  rel="noreferrer"
                >
                  <SocialIcon kind={s.kind} />
                </a>
              ))}
            </div>
          </div>

         

          {/* Resources */}
          <div>
            <h3 style={styles.colTitle}>Resources</h3>
            <ul style={styles.ul}>
              {columns.resources.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="footer-link" style={styles.a}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 style={styles.colTitle}>Company</h3>
            <ul style={styles.ul}>
              {columns.company.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="footer-link" style={styles.a}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={styles.bottomBar}>
        <div style={styles.container} className="footer-container">
          <div style={styles.bottomRow} className="footer-bottom-row">
            <p style={styles.copy}>
              © {new Date().getFullYear()} {brand.name}. All rights reserved.
            </p>

            <div style={styles.bottomLinks}>
              <a href="#" className="footer-link" style={styles.bottomLink}>
                Terms of Service
              </a>
              <a href="#" className="footer-link" style={styles.bottomLink}>
                Privacy Policy
              </a>
              <a href="#" className="footer-link" style={styles.bottomLink}>
                Cookie Settings
              </a>
              <a href="#" className="footer-link" style={styles.bottomLink}>
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- icons (no dependency) ---------------- */
function SocialIcon({ kind }: { kind: "instagram" | "twitter" | "linkedin" | "youtube" }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    style: { display: "block" as const },
  };

  switch (kind) {
    case "instagram":
      return (
        <svg {...common}>
          <path
            d="M7.5 2.75h9A4.75 4.75 0 0 1 21.25 7.5v9A4.75 4.75 0 0 1 16.5 21.25h-9A4.75 4.75 0 0 1 2.75 16.5v-9A4.75 4.75 0 0 1 7.5 2.75Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M12 16.25a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path d="M17.25 6.75h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );
    case "twitter":
      return (
        <svg {...common}>
          <path
            d="M21 7.2c-.7.3-1.4.5-2.1.6.8-.5 1.3-1.2 1.6-2.1-.7.4-1.5.8-2.4.9A3.6 3.6 0 0 0 12 9.1c0 .3 0 .6.1.9-3-.1-5.7-1.6-7.5-3.9-.3.6-.5 1.2-.5 2 0 1.2.6 2.3 1.6 3-.6 0-1.1-.2-1.6-.4v.1c0 1.7 1.2 3.1 2.8 3.4-.3.1-.7.1-1 .1-.2 0-.5 0-.7-.1.5 1.5 1.9 2.6 3.6 2.6A7.2 7.2 0 0 1 3 18.4 10.2 10.2 0 0 0 8.5 20c6.6 0 10.2-5.5 10.2-10.2v-.5c.7-.5 1.3-1.1 1.8-1.8Z"
            fill="currentColor"
          />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <path
            d="M6.5 9.5H4.2V20h2.3V9.5ZM5.35 8.4a1.35 1.35 0 1 0 0-2.7 1.35 1.35 0 0 0 0 2.7Z"
            fill="currentColor"
          />
          <path
            d="M20 20h-2.3v-5.3c0-1.3-.5-2.2-1.8-2.2-1 0-1.6.7-1.9 1.3-.1.2-.1.5-.1.8V20H11.6V9.5h2.2v1.4h.03c.3-.6 1.1-1.6 2.6-1.6 1.9 0 3.4 1.2 3.4 3.9V20Z"
            fill="currentColor"
          />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common}>
          <path
            d="M21 12s0-3.3-.4-4.8a2.8 2.8 0 0 0-2-2C16.9 4.8 12 4.8 12 4.8s-4.9 0-6.6.4a2.8 2.8 0 0 0-2 2C3 8.7 3 12 3 12s0 3.3.4 4.8a2.8 2.8 0 0 0 2 2c1.7.4 6.6.4 6.6.4s4.9 0 6.6-.4a2.8 2.8 0 0 0 2-2c.4-1.5.4-4.8.4-4.8Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5Z" fill="currentColor" />
        </svg>
      );
  }
}

/* ---------------- styles ---------------- */
const font =
  'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"';

const styles: Record<string, React.CSSProperties> = {
  footer: {
    position: "relative",
    width: "100%",
    overflow: "hidden",
    borderTop: "1px solid rgba(255,255,255,0.10)",
    background: "#1a1a1a",
    marginTop: 90,
    fontFamily: font,
  },

  container: {
    position: "relative",
    maxWidth: 1400,
    margin: "0 auto",
    padding: "0 32px",
  },

  topBand: {
    paddingTop: 42,
    paddingBottom: 26,
    display: "grid",
    gridTemplateColumns: "1.4fr 0.6fr",
    gap: 18,
    alignItems: "center",
  },

  topTitle: {
    margin: 0,
    fontSize: 44,
    fontWeight: 800,
    letterSpacing: "-0.02em",
    color: "white",
  },

  topDesc: {
    margin: "10px 0 0",
    maxWidth: 820,
    fontSize: 18,
    lineHeight: 1.7,
    color: "rgba(255,255,255,0.70)",
  },

  // ✅ Not a card. Just a free block.
  logoBlock: {
    justifySelf: "end",
    display: "grid",
    gap: 10,
    alignItems: "center",
    textAlign: "right",
  },

  logoImg: {
    width: 230,
    height: 56,
    objectFit: "contain",
    display: "block",
    opacity: 0.95,
  },

  logoCaption: {
    fontSize: 12,
    color: "rgba(255,255,255,0.55)",
    fontWeight: 700,
  },

  linksGrid: {
    paddingTop: 18,
    paddingBottom: 26,
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 44,
    borderTop: "1px solid rgba(255,255,255,0.10)",
  },

  brandName: {
    fontSize: 22,
    fontWeight: 800,
    color: "white",
    letterSpacing: "-0.01em",
  },

  brandBlurb: {
    margin: "14px 0 0",
    maxWidth: 360,
    fontSize: 13,
    lineHeight: 1.7,
    color: "rgba(255,255,255,0.45)",
  },

  socialRow: {
    marginTop: 18,
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  socialBtn: {
    display: "inline-flex",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.10)",
    color: "rgba(255,255,255,0.70)",
    background: "transparent",
    textDecoration: "none",
  },

  colTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 800,
    color: "white",
  },

  ul: {
    listStyle: "none",
    padding: 0,
    margin: "16px 0 0",
    display: "grid",
    gap: 10,
    fontSize: 14,
  },

  a: {
    color: "rgba(255,255,255,0.55)",
    textDecoration: "none",
    fontWeight: 600,
  },

  bottomBar: {
    borderTop: "1px solid rgba(255,255,255,0.10)",
  },

  bottomRow: {
    padding: "18px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    flexWrap: "wrap",
    color: "rgba(255,255,255,0.50)",
    fontSize: 13,
  },

  copy: { margin: 0 },

  bottomLinks: {
    display: "flex",
    alignItems: "center",
    gap: 22,
    flexWrap: "wrap",
  },

  bottomLink: {
    color: "rgba(255,255,255,0.55)",
    textDecoration: "none",
    fontSize: 13,
    fontWeight: 600,
  },
};

const css = `
  .footer-link:hover { color: rgba(255,255,255,0.92) !important; }
  .social-btn:hover { border-color: rgba(255,255,255,0.22) !important; color: rgba(255,255,255,0.92) !important; }

  @media (max-width: 980px) {
    .footer-container { padding-left: 22px !important; padding-right: 22px !important; }
    .footer-links-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 28px !important; }
    .top-band { grid-template-columns: 1fr !important; }
    .logo-block { justify-self: start !important; text-align: left !important; }
  }

  @media (max-width: 640px) {
    .footer-links-grid { grid-template-columns: 1fr !important; }
    .footer-bottom-row { flex-direction: column !important; align-items: flex-start !important; }
  }
`;
