import { useState, useEffect } from "react";

// ─── Helpers ────────────────────────────────────────────────────────────────

const CITIES = [
  { name: "Dubai",    timezone: "Asia/Dubai" },
  { name: "New York", timezone: "America/New_York" },
  { name: "London",   timezone: "Europe/London" },
  { name: "Tokyo",    timezone: "Asia/Tokyo" },
];

const getZoneTime = (timezone, date) => {
  const fmt = new Intl.DateTimeFormat("en-US", {
    hour: "numeric", minute: "numeric", second: "numeric", hour12: false,
    timeZone: timezone,
  });
  const parts = fmt.formatToParts(date);
  const get = (type) => parseInt(parts.find((p) => p.type === type)?.value ?? 0);
  return { h: get("hour"), m: get("minute"), s: get("second") };
};

const pad = (n) => String(n).padStart(2, "0");
const toRad = (deg) => (deg * Math.PI) / 180;

// ─── Analog Clock (accepts time from parent) ─────────────────────────────────

const AnalogClock = ({ timezone, now }) => {
  const { h, m, s } = getZoneTime(timezone, now);
  const cx = 30, cy = 30;

  const hourDeg   = ((h % 12) / 12) * 360 + (m / 60) * 30;
  const minuteDeg = (m / 60) * 360 + (s / 60) * 6;
  const secondDeg = (s / 60) * 360;

  const hand = (deg, len) => ({
    x2: cx + len * Math.sin(toRad(deg)),
    y2: cy - len * Math.cos(toRad(deg)),
  });

  const hr  = hand(hourDeg, 14);
  const min = hand(minuteDeg, 20);
  const sec = hand(secondDeg, 22);

  return (
    <svg width="60" height="60" viewBox="0 0 60 60">
      <circle cx={cx} cy={cy} r={28} fill="#2c2c2e" stroke="#48484a" strokeWidth="1" />
      {[...Array(12)].map((_, i) => {
        const a = toRad((i / 12) * 360 - 90);
        return (
          <line key={i}
            x1={cx + 24 * Math.cos(a)} y1={cy + 24 * Math.sin(a)}
            x2={cx + 21 * Math.cos(a)} y2={cy + 21 * Math.sin(a)}
            stroke="#636366" strokeWidth="1.5" strokeLinecap="round"
          />
        );
      })}
      <line x1={cx} y1={cy} x2={hr.x2}  y2={hr.y2}  stroke="white"   strokeWidth="2.5" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={min.x2} y2={min.y2} stroke="white"   strokeWidth="1.5" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={sec.x2} y2={sec.y2} stroke="#ff453a" strokeWidth="1"   strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="2.5" fill="#ff453a" />
    </svg>
  );
};

// ─── World Clock Widget ──────────────────────────────────────────────────────

const WorldClockWidget = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="widget widget-dark">
      <div className="widget-header">
        <span className="text-base leading-none"><img src="/images/clock.png" alt="Clock" className="w-4 h-4" /></span>
        <span className="widget-title">World Clock</span>
      </div>
      <div className="widget-clock-row">
        {CITIES.map(({ name, timezone }) => {
          const { h, m } = getZoneTime(timezone, now);
          const displayTime = `${pad(h)}:${pad(m)}`;
          return (
            <div key={name} className="widget-clock-city">
              <AnalogClock timezone={timezone} now={now} />
              <p className="widget-city-time">{displayTime}</p>
              <p className="widget-city-name">{name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── GitHub Activity Widget ──────────────────────────────────────────────────

const COLORS = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];

const seededRand = (seed) => {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
};

const buildGrid = () => {
  const rand = seededRand(42);
  return Array.from({ length: 26 }, (_, w) => {
    const density = w < 8 ? 0.22 : w < 16 ? 0.52 : 0.78;
    return Array.from({ length: 7 }, () => {
      if (rand() > density) return 0;
      const r = rand();
      if (r < 0.35) return 1;
      if (r < 0.65) return 2;
      if (r < 0.85) return 3;
      return 4;
    });
  });
};

const GRID = buildGrid();

const GitHubWidget = () => (
  <div className="widget widget-github">
    <div className="widget-header">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.929.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
      <div>
        <span className="widget-title">Gpcode233</span>
        <span className="widget-sub">2,163 contributions this year</span>
      </div>
    </div>
    <div className="widget-contrib-grid">
      {GRID.map((week, wi) => (
        <div key={wi} className="widget-contrib-col">
          {week.map((level, di) => (
            <div key={di} className="widget-contrib-cell"
              style={{ backgroundColor: COLORS[level] }} />
          ))}
        </div>
      ))}
    </div>
    <div className="widget-contrib-legend">
      <span>Less</span>
      {COLORS.map((c, i) => (
        <div key={i} style={{ backgroundColor: c, width: 8, height: 8, borderRadius: 2 }} />
      ))}
      <span>More</span>
    </div>
  </div>
);

// ─── Export ──────────────────────────────────────────────────────────────────

const Widgets = () => (
  <div className="desktop-widgets">
    <WorldClockWidget />
    <GitHubWidget />
  </div>
);

export default Widgets;
