import { useState, useEffect, useRef } from "react"; 
import { Search, User, ShoppingCart } from "lucide-react";

// ── Scroll-reveal hook ──────────────────────────────────────────────────────
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ── Staggered children reveal ───────────────────────────────────────────────
function useStaggerReveal(count, threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ── Data ────────────────────────────────────────────────────────────────────
const products = [
  {
    name: "NovaPad X Pro",
    price: "$1,299",
    tag: "Ultra-thin neural display",
    bg: "#f0f0f0",
    emoji: "💻",
    accent: "#ff4d4d",
    img: null,
  },
  {
    name: "AuraBuds Max",
    price: "$349",
    tag: "Spatial audio, zero latency",
    bg: "#1a1a1a",
    emoji: "🎧",
    accent: "#ff4d4d",
    light: false,
    img: null,
  },
  {
    name: "OmniWatch Ultra",
    price: "$599",
    tag: "Health OS on your wrist",
    bg: "#f5f5f5",
    emoji: "⌚",
    accent: "#ff4d4d",
    img: null,
  },
];

const standards = [
  {
    icon: "🚀",
    title: "GLOBAL TRANSIT",
    desc: "Complimentary expedited shipping on all orders over $200. Monitored delivery.",
  },
  {
    icon: "🛡️",
    title: "LIFETIME WARRANTY",
    desc: "Our gear is built to outlast you. Covered against all manufacturing defects.",
  },
  {
    icon: "♻️",
    title: "CLOSED LOOP",
    desc: "Sustainable materials engineered for high-performance without compromise.",
  },
];

// ── Product Card ────────────────────────────────────────────────────────────
function ProductCard({ product, index, visible }) {
  const [hovered, setHovered] = useState(false);
  const isLight = product.bg !== "#1a1a1a";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(48px)",
        transition: `opacity 0.7s ease ${index * 0.15}s, transform 0.7s ease ${index * 0.15}s`,
        cursor: "default",
      }}
      className="group relative flex flex-col rounded-none overflow-hidden"
    >
      {/* Image area */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          background: product.bg,
          height: 260,
          transition: "box-shadow 0.4s ease",
          boxShadow: hovered ? "0 24px 60px rgba(0,0,0,0.18)" : "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        {/* Animated glow on hover */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at 50% 60%, ${product.accent}22 0%, transparent 70%)`,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.5s ease",
            pointerEvents: "none",
          }}
        />

        {/* Product emoji as placeholder */}
        <div
          style={{
            fontSize: 90,
            transform: hovered ? "scale(1.12) translateY(-6px)" : "scale(1) translateY(0)",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
            filter: hovered ? "drop-shadow(0 16px 32px rgba(0,0,0,0.25))" : "none",
            userSelect: "none",
          }}
        >
          {product.emoji}
        </div>

        {/* Red accent line bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: 3,
            background: product.accent,
            width: hovered ? "100%" : "0%",
            transition: "width 0.5s ease",
          }}
        />
      </div>

      {/* Info area */}
      <div
        className="flex items-start justify-between pt-3 pb-1"
        style={{ borderTop: "none" }}
      >
        <div>
          <p
            className="font-semibold text-sm tracking-tight"
            style={{ color: "#111", letterSpacing: "-0.01em" }}
          >
            {product.name}
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ color: "#888" }}
          >
            {product.tag}
          </p>
        </div>
        <span
          className="text-sm font-semibold"
          style={{ color: "#111", whiteSpace: "nowrap", paddingLeft: 16 }}
        >
          {product.price}
        </span>
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Scroll tracking for parallax
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Section reveal refs
  const [newArrivalsRef, newArrivalsVisible] = useStaggerReveal(3);
  const [standardRef, standardVisible] = useStaggerReveal(3);
  const [ctaRef, ctaVisible] = useScrollReveal(0.2);
  const [footerRef, footerVisible] = useScrollReveal(0.05);

  return (
    <div
      style={{
        fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
        background: "#fff",
        color: "#111",
        overflowX: "hidden",
        cursor: "default",
      }}
    >
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroShoe {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.7; transform: scaleX(1); }
          50%       { opacity: 1;   transform: scaleX(1.08); }
        }
        @keyframes lineSlide {
          from { transform: scaleY(0); opacity: 0; }
          to   { transform: scaleY(1); opacity: 1; }
        }
        @keyframes fadeInNav {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }

        .nav-link {
          position: relative;
          text-decoration: none;
          color: #111;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition: color 0.2s;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1.5px;
          background: #ff4d4d;
          transition: width 0.3s ease;
        }
        .nav-link:hover::after { width: 100%; }

        .explore-btn {
          display: inline-block;
          background: #ff4d4d;
          color: #fff;
          border: none;
          border-radius: 999px;
          padding: 13px 32px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: default;
          transition: background 0.25s, transform 0.25s, box-shadow 0.25s;
          box-shadow: 0 4px 24px rgba(255,77,77,0.35);
          font-family: inherit;
        }
        .explore-btn:hover {
          background: #e03030;
          transform: scale(1.04);
          box-shadow: 0 8px 32px rgba(255,77,77,0.5);
        }

        .subscribe-btn {
          background: #111;
          color: #fff;
          border: none;
          padding: 12px 24px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: default;
          transition: background 0.2s, transform 0.2s;
          font-family: inherit;
          flex-shrink: 0;
        }
        .subscribe-btn:hover {
          background: #ff4d4d;
          transform: scale(1.02);
        }

        .email-input {
          border: 1px solid #ddd;
          padding: 12px 16px;
          font-size: 13px;
          font-family: inherit;
          color: #111;
          background: #fff;
          outline: none;
          flex: 1;
          transition: border-color 0.2s;
        }
        .email-input:focus { border-color: #111; }
        .email-input::placeholder { color: #aaa; }

        .footer-link {
          color: #888;
          font-size: 13px;
          text-decoration: none;
          transition: color 0.2s;
          display: block;
          margin-bottom: 8px;
        }
        .footer-link:hover { color: #ff4d4d; }

        .view-all-link {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          color: #111;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: color 0.2s, gap 0.2s;
        }
        .view-all-link:hover { color: #ff4d4d; gap: 8px; }
      `}</style>

      {/* ── NAV ──────────────────────────────────────────────────────── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          height: 60,
          background: scrollY > 60 ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: scrollY > 60 ? "1px solid #eee" : "1px solid transparent",
          transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s",
          boxShadow: scrollY > 60 ? "0 2px 20px rgba(0,0,0,0.06)" : "none",
          animation: "fadeInNav 0.6s ease both",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em", fontFamily: "inherit" }}>
          VELOCORE
        </span>
        <div style={{ display: "flex", gap: 32 }}>
          {["SHOP", "EDITORIAL", "ABOUT"].map((l) => (
            <a key={l} href="#" className="nav-link">{l}</a>
          ))}
        </div>
<div style={{ display: "flex", gap: 20, alignItems: "center" }}>
  {[Search, User, ShoppingCart].map((Icon, i) => (
    <span
      key={i}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "default",
        opacity: 0.7,
        transition: "opacity 0.2s, transform 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = 1;
        e.currentTarget.style.transform = "scale(1.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = 0.7;
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <Icon size={20} />
    </span>
  ))}
</div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          height: "100vh",
          minHeight: 560,
          background: "linear-gradient(160deg, #1a1a1a 0%, #2d2d2d 50%, #111 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          paddingTop: 60,
        }}
      >
        {/* Parallax background glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 70% 50% at 50% ${60 - scrollY * 0.02}%, rgba(255,77,77,0.18) 0%, transparent 70%)`,
            transition: "background 0.1s",
            pointerEvents: "none",
          }}
        />

        {/* Decorative light rods */}
        {[{ left: "12%", rotate: "-15deg" }, { right: "12%", rotate: "15deg" }].map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "8%",
              width: 3,
              height: 120,
              background: "linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.1))",
              borderRadius: 2,
              transform: `rotate(${s.rotate})`,
              ...s,
              animation: "lineSlide 1s ease both",
              animationDelay: `${0.3 + i * 0.2}s`,
              boxShadow: "0 0 18px rgba(255,255,255,0.6)",
            }}
          />
        ))}

        {/* Hero product image placeholder */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, calc(-50% + ${scrollY * 0.18}px))`,
            width: "min(540px, 72vw)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "heroShoe 1.2s cubic-bezier(0.22,1,0.36,1) both",
            animationDelay: "0.1s",
            pointerEvents: "none",
          }}
        >
          {/* Tech product placeholder – laptop silhouette */}
          <div
            style={{
              fontSize: "clamp(120px, 18vw, 200px)",
              filter: "drop-shadow(0 40px 80px rgba(255,77,77,0.4)) drop-shadow(0 0 60px rgba(255,77,77,0.2))",
              userSelect: "none",
            }}
          >
            💻
          </div>
        </div>

        {/* Red glow line */}
        <div
          style={{
            position: "absolute",
            bottom: "28%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(480px, 68vw)",
            height: 4,
            background: "linear-gradient(90deg, transparent, #ff4d4d, #ff8080, #ff4d4d, transparent)",
            borderRadius: 2,
            filter: "blur(3px)",
            animation: "glowPulse 2.5s ease-in-out infinite",
          }}
        />

        {/* Text content */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            marginTop: "auto",
            paddingBottom: "16vh",
            padding: "0 20px 16vh",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(32px, 5.5vw, 68px)",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.03em",
              lineHeight: 1.0,
              marginBottom: 16,
              animation: "heroFadeUp 0.9s cubic-bezier(0.22,1,0.36,1) both",
              animationDelay: "0.35s",
            }}
          >
            VELOCORE KINETICS
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.62)",
              fontSize: "clamp(12px, 1.4vw, 15px)",
              maxWidth: 380,
              margin: "0 auto 28px",
              lineHeight: 1.7,
              animation: "heroFadeUp 0.9s cubic-bezier(0.22,1,0.36,1) both",
              animationDelay: "0.5s",
            }}
          >
            Engineered for the absolute edge. High-performance gear crafted through kinetic minimalism. Less resistance, more power.
          </p>
          <div
            style={{
              animation: "heroFadeUp 0.9s cubic-bezier(0.22,1,0.36,1) both",
              animationDelay: "0.65s",
            }}
          >
            <button className="explore-btn">EXPLORE COLLECTION</button>
          </div>
        </div>

        {/* Bottom fade */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 120,
            background: "linear-gradient(to top, #fff, transparent)",
            pointerEvents: "none",
          }}
        />
      </section>

      {/* ── NEW ARRIVALS ─────────────────────────────────────────────── */}
      <section style={{ padding: "80px 40px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <div
          ref={newArrivalsRef}
          style={{
            opacity: newArrivalsVisible ? 1 : 0,
            transform: newArrivalsVisible ? "none" : "translateY(30px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 32 }}>
            <h2 style={{ fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 700, letterSpacing: "-0.03em" }}>
              New Arrivals
            </h2>
            <a href="#" className="view-all-link">
              View All <span>→</span>
            </a>
          </div>

          {/* Product grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 24,
            }}
          >
            {products.map((p, i) => (
              <ProductCard
                key={p.name}
                product={p}
                index={i}
                visible={newArrivalsVisible}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── THE VELOCORE STANDARD ────────────────────────────────────── */}
      <section
        style={{
          background: "#f7f7f7",
          padding: "80px 40px",
        }}
      >
        <div
          ref={standardRef}
          style={{ maxWidth: 1100, margin: "0 auto" }}
        >
          <h2
            style={{
              textAlign: "center",
              fontSize: "clamp(18px, 2.2vw, 26px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              marginBottom: 56,
              opacity: standardVisible ? 1 : 0,
              transform: standardVisible ? "none" : "translateY(24px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            The Velocore Standard
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 40,
            }}
          >
            {standards.map((s, i) => (
              <div
                key={s.title}
                style={{
                  textAlign: "center",
                  opacity: standardVisible ? 1 : 0,
                  transform: standardVisible ? "none" : "translateY(40px)",
                  transition: `opacity 0.7s ease ${i * 0.15}s, transform 0.7s ease ${i * 0.15}s`,
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 16 }}>{s.icon}</div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "#111", marginBottom: 10 }}>
                  {s.title}
                </p>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7, maxWidth: 200, margin: "0 auto" }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── JOIN THE VANGUARD ─────────────────────────────────────────── */}
      <section
        ref={ctaRef}
        style={{
          padding: "80px 40px",
          textAlign: "center",
          opacity: ctaVisible ? 1 : 0,
          transform: ctaVisible ? "none" : "translateY(32px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        <h2 style={{ fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 10 }}>
          Join the Vanguard
        </h2>
        <p style={{ color: "#888", fontSize: 13, marginBottom: 28 }}>
          Subscribe for early access to product drops and kinetic insights.
        </p>

        {subscribed ? (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#111",
              color: "#fff",
              padding: "14px 28px",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.06em",
              animation: "heroFadeUp 0.5s ease both",
            }}
          >
            ✓ YOU'RE IN THE VANGUARD
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              maxWidth: 420,
              margin: "0 auto",
              boxShadow: "0 2px 20px rgba(0,0,0,0.08)",
            }}
          >
            <input
              className="email-input"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") setSubscribed(true); }}
            />
            <button className="subscribe-btn" onClick={() => setSubscribed(true)}>
              SUBSCRIBE
            </button>
          </div>
        )}
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer
        ref={footerRef}
        style={{
          borderTop: "1px solid #eee",
          padding: "48px 40px 28px",
          opacity: footerVisible ? 1 : 0,
          transform: footerVisible ? "none" : "translateY(20px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
            gap: 32,
            marginBottom: 40,
          }}
        >
          <div>
            <p style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.02em", marginBottom: 8 }}>VELOCORE</p>
            <p style={{ color: "#888", fontSize: 12, lineHeight: 1.7 }}>Kinetic Minimalism. Engineered for the absolute edge.</p>
          </div>
          {[
            { title: "COMPANY", links: ["Sustainability", "Privacy Policy", "Terms of Service", "Contact"] },
            { title: "SUPPORT", links: ["FAQ", "Shipping & Returns", "Size Guide"] },
            { title: "SOCIAL", links: ["Instagram", "Strava", "Journal"] },
          ].map((col) => (
            <div key={col.title}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#111", marginBottom: 14 }}>
                {col.title}
              </p>
              {col.links.map((l) => (
                <a key={l} href="#" className="footer-link">{l}</a>
              ))}
            </div>
          ))}
        </div>

        <div
          style={{
            borderTop: "1px solid #eee",
            paddingTop: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ color: "#aaa", fontSize: 11, letterSpacing: "0.04em" }}>
            © 2024 VELOCORE KINETICS. ALL RIGHTS RESERVED.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            {["💳", "🏦"].map((ic, i) => (
              <span key={i} style={{ fontSize: 18, opacity: 0.4 }}>{ic}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}