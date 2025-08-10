import React, { useEffect, useState } from "react";

const RotatingWireframe: React.FC = () => {
  return (
    <div className="relative w-full h-40 flex items-center justify-center">
      <svg className="absolute inset-0 m-auto spin-slow opacity-70" width="260" height="160" viewBox="0 0 260 160" fill="none">
        <g stroke="hsl(var(--foreground)/0.25)">
          {Array.from({ length: 8 }).map((_, i) => (
            <path key={i} d={`M0 ${20 * (i + 1)} C 60 ${10 * i}, 200 ${30 * i}, 260 ${20 * (i + 1)}`} />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={`v-${i}`} x1={20 * (i + 1)} y1="0" x2={20 * (i + 1)} y2="160" />
          ))}
        </g>
      </svg>
    </div>
  );
};

const steps = ["Parsing", "Chunking", "Retrieving Context", "Running Models", "Generating Results"] as const;

type LoadingScreenProps = {
  onDone: () => void;
  durationMs?: number;
};

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onDone, durationMs = 5200 }) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const per = Math.floor(durationMs / steps.length);
    const timers: number[] = [];
    steps.forEach((_, idx) => {
      timers.push(window.setTimeout(() => setActive(idx), per * idx));
    });
    timers.push(window.setTimeout(onDone, durationMs));
    return () => timers.forEach(clearTimeout);
  }, [onDone, durationMs]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className="glass-panel rounded-2xl p-8 w-full max-w-2xl animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          {steps.map((label, i) => (
            <div key={label} className="flex-1 flex flex-col items-center">
              <div className={`h-3 w-3 rounded-full ${i <= active ? 'bg-neon-orange' : 'bg-foreground/20'}`} />
              <div className={`mt-2 text-xs ${i === active ? 'text-neon-orange' : 'text-foreground/60'}`}>{label}</div>
            </div>
          ))}
        </div>
        <div className="h-2 w-full rounded-full bg-foreground/10 overflow-hidden">
          <div className="h-full bg-neon-orange" style={{ width: `${((active + 1) / steps.length) * 100}%`, boxShadow: '0 0 20px hsl(var(--neon-orange)/0.6)' }} />
        </div>
        <RotatingWireframe />
        <div className="mt-4 h-6 overflow-hidden text-center text-sm text-foreground/80">
          <div className="animate-fade-in">Tip: Highlight key terms in <span className="text-neon-yellow font-medium">filings</span> to spot risks faster.</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
