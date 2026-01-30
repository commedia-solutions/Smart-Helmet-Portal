// import React from "react";
// import smartHelmetImg from "../assets/Smarthelmet.png"; // ✅ make sure filename matches exactly

// const HeroSection = () => {
//   return (
//     <section id="dashboard" className="hero">
//       <style>{css}</style>

//       <div className="hero-inner">
//         {/* LEFT */}
//         <div>
//           <h1 className="hero-title">
//             Keep workers safe with{" "}
//             <span className="hero-highlight">real-time</span> vitals &amp;
//             environment intelligence.
//           </h1>

//           <p className="hero-subtitle">
//             C-Smart Smart Helmet streams sensor data to the cloud and transforms
//             it into a clean dashboard — so teams can detect risk early, respond
//             faster, and track safety across multiple helmets.
//           </p>

//           <div className="hero-actions">
//             <button className="btn btn-primary hero-cta">Sign in</button>
//             <button className="btn btn-outline hero-cta">Talk to Sales</button>
//           </div>
//         </div>

//         {/* RIGHT: FREE IMAGE + GRID FLOOR */}
//         <div className="hero-visual">
//           <img className="hero-helmet" src={smartHelmetImg} alt="Smart Helmet" />
//           <div className="hero-floor" />
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;

// const css = `
//   /* HERO wrapper */
//   .hero{
//     position: relative;
//     padding: 24px 0 20px;
//   }

//   /* ✅ removed yellow glow */
//   .hero::before{ display:none; }

//   .hero-inner{
//     position: relative;
//     display:grid;
//     grid-template-columns: 1.12fr 0.88fr;
//     gap: 44px;
//     align-items:center;
//   }

//   .hero-title{
//     font-size: 56px;
//     line-height: 1.04;
//     letter-spacing: -0.02em;
//     font-weight: 600;
//     margin: 0 0 16px;
//   }

//   .hero-highlight{ color: #ffea00; }

//   .hero-subtitle{
//     max-width: 580px;
//     font-size: 16px;
//     line-height: 1.7;
//     color: rgba(255,255,255,0.72);
//     margin: 0 0 26px;
//   }

//   .hero-actions{
//     display:flex;
//     gap: 14px;
//     align-items:center;
//   }

//   .hero-cta{
//     border-radius: 12px;
//     padding: 12px 18px;
//     font-size: 14px;
//     cursor: pointer;
//   }

//   /* Keep buttons consistent + remove focus ring */
//   .btn:focus, .btn:focus-visible, .btn:active{
//     outline:none !important;
//     box-shadow:none !important;
//   }

//   .btn-outline{
//     background: transparent;
//     color: #fff;
//     border: 1px solid rgba(255,255,255,0.16);
//   }
//   .btn-outline:hover{
//     background: rgba(255,255,255,0.06);
//     transform: translateY(-1px);
//     transition: 0.15s ease;
//   }

//   .btn-primary{
//     background: #ffea00;
//     color: #0b0b0d;
//     border: 1px solid rgba(255,234,0,0.35);
//     font-weight: 700;
//   }

//   /* ✅ match navbar Sign in hover (no grey overlay) */
//   .btn-primary:hover{
//     transform: translateY(-1px);
//     transition: 0.15s ease;
   
//     filter: brightness(0.98);
//   }

//   /* ✅ RIGHT side: free image */
//   .hero-visual{
//     position: relative;
//     min-height: 420px;
//     display:flex;
//     align-items:center;
//     justify-content:center;
//   }

//   .hero-helmet{
//     width: min(560px, 100%);
//     height: auto;
//     display:block;
//     position: relative;
//     z-index: 2;
//     filter: drop-shadow(0 18px 40px rgba(0,0,0,0.55));
//     transform: translateY(-10px);
//     user-select:none;
//     pointer-events:none;
//   }

//   /* ✅ 3D grid floor under the helmet */
//   .hero-floor{
//     position: absolute;
//     left: 50%;
//     bottom: -30px;
//     width: 120%;
//     height: 240px;
//     transform: translateX(-50%) perspective(900px) rotateX(68deg);
//     transform-origin: top;
//     z-index: 1;

//     background:
//       repeating-linear-gradient(
//         to right,
//         rgba(255,255,255,0.12) 0px,
//         rgba(255,255,255,0.12) 1px,
//         transparent 1px,
//         transparent 28px
//       ),
//       repeating-linear-gradient(
//         to bottom,
//         rgba(255,255,255,0.10) 0px,
//         rgba(255,255,255,0.10) 1px,
//         transparent 1px,
//         transparent 28px
//       );

//     opacity: 0.22;

//     /* fade-out */
//     mask-image: linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0));
//     -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0));
//   }

//   @media (max-width: 1024px){
//     .hero-inner{ grid-template-columns: 1fr; }
//     .hero-title{ font-size: 46px; }
//     .hero-visual{ min-height: 360px; }
//     .hero-floor{ bottom: -40px; height: 220px; width: 140%; }
//   }
// `;

// src/Components/HeroSection.tsx

import { useNavigate } from "react-router-dom";
import smartHelmetImg from "../assets/Smarthelmet.png"; // ✅ make sure filename matches exactly

const HeroSection = () => {
  const navigate = useNavigate();
  

  

  return (
    <section id="dashboard" className="hero">
      <style>{css}</style>

      <div className="hero-inner">
        {/* LEFT */}
        <div>
          <h1 className="hero-title">
            Keep workers safe with{" "}
            <span className="hero-highlight">real-time</span> vitals &amp;
            environment intelligence.
          </h1>

          <p className="hero-subtitle">
            C-Smart Smart Helmet streams sensor data to the cloud and transforms
            it into a clean dashboard — so teams can detect risk early, respond
            faster, and track safety across multiple helmets.
          </p>

          <div className="hero-actions">
            <button
              className="btn btn-primary hero-cta"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>

            <button
              className="btn btn-outline hero-cta"
              onClick={() => navigate("/contact-sales")}
            >
              Talk to Sales
            </button>
          </div>
        </div>

        {/* RIGHT: FREE IMAGE + GRID FLOOR */}
        <div className="hero-visual">
          <img className="hero-helmet" src={smartHelmetImg} alt="Smart Helmet" />
          <div className="hero-floor" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

const css = `
  /* HERO wrapper */
  .hero{
    position: relative;
    padding: 24px 0 20px;
  }

  .hero::before{ display:none; }

  .hero-inner{
    position: relative;
    display:grid;
    grid-template-columns: 1.12fr 0.88fr;
    gap: 44px;
    align-items:center;
  }

  .hero-title{
    font-size: 56px;
    line-height: 1.04;
    letter-spacing: -0.02em;
    font-weight: 600;
    margin: 0 0 16px;
  }

  .hero-highlight{ color: #ffea00; }

  .hero-subtitle{
    max-width: 580px;
    font-size: 16px;
    line-height: 1.7;
    color: rgba(255,255,255,0.72);
    margin: 0 0 26px;
  }

  .hero-actions{
    display:flex;
    gap: 12px;            /* ✅ matches navbar spacing */
    align-items:center;
    flex-wrap: wrap;
  }

  /* ✅ Match NAVBAR button sizing + radius exactly */
  .hero-cta{
    border-radius: 10px;  /* ✅ navbar radius */
    font-size: 14px;
    cursor: pointer;
    line-height: 1;
    height: 44px;         /* ✅ consistent tap area */
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 18px;   /* ✅ navbar outline padding */
    font-weight: 600;
  }

  /* Primary button uses navbar padding + weight */
  .btn-primary.hero-cta{
    padding: 10px 22px;   /* ✅ navbar primary padding */
    font-weight: 700;     /* ✅ navbar primary weight */
  }

  /* Keep buttons consistent + remove focus ring */
  .btn:focus, .btn:focus-visible, .btn:active{
    outline:none !important;
    box-shadow:none !important;
  }

  /* ✅ NAVBAR outline style */
  .btn-outline{
    background: transparent;
    color: #fff;
    border: 1px solid rgba(255,255,255,0.16);
  }

  /* ✅ NAVBAR outline hover (yellow border + glow ring) */
  .btn-outline:hover{
    background: rgba(255,255,255,0.06);
    border-color: rgba(255,234,0,0.55) !important;
    box-shadow: 0 0 0 4px rgba(255,234,0,0.10);
    transform: translateY(-1px);
    transition: 0.15s ease;
  }

  /* ✅ NAVBAR primary style */
  .btn-primary{
    background: #ffea00;
    color: #0b0b0d;
    border: 1px solid rgba(255,234,0,0.35);
  }

  /* ✅ NAVBAR primary hover */
 .hero-actions .btn-primary:hover{
    background: #ffea00;
    color: #0b0b0d;
    border: 1px solid rgba(255,234,0,0.35);
    transform: none;
    transition: none;
    filter: none;
    box-shadow: none;
  }

  /* ✅ RIGHT side: free image */
  .hero-visual{
    position: relative;
    min-height: 420px;
    display:flex;
    align-items:center;
    justify-content:center;
  }

  .hero-helmet{
    width: min(560px, 100%);
    height: auto;
    display:block;
    position: relative;
    z-index: 2;
    filter: drop-shadow(0 18px 40px rgba(0,0,0,0.55));
    transform: translateY(-10px);
    user-select:none;
    pointer-events:none;
  }

  /* ✅ 3D grid floor under the helmet */
  .hero-floor{
    position: absolute;
    left: 50%;
    bottom: -30px;
    width: 120%;
    height: 240px;
    transform: translateX(-50%) perspective(900px) rotateX(68deg);
    transform-origin: top;
    z-index: 1;

    background:
      repeating-linear-gradient(
        to right,
        rgba(255,255,255,0.12) 0px,
        rgba(255,255,255,0.12) 1px,
        transparent 1px,
        transparent 28px
      ),
      repeating-linear-gradient(
        to bottom,
        rgba(255,255,255,0.10) 0px,
        rgba(255,255,255,0.10) 1px,
        transparent 1px,
        transparent 28px
      );

    opacity: 0.22;

    mask-image: linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0));
    -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0));
  }

  @media (max-width: 1024px){
    .hero-inner{ grid-template-columns: 1fr; }
    .hero-title{ font-size: 46px; }
    .hero-visual{ min-height: 360px; }
    .hero-floor{ bottom: -40px; height: 220px; width: 140%; }
  }
`;
