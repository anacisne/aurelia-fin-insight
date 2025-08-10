import React from "react";

const GradientBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 gradient-aurora">
      {/* Subtle abstract shapes */}
      <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full blur-3xl opacity-30" style={{ background: 'radial-gradient(circle at center, hsl(var(--neon-cyan)/0.35), transparent 60%)' }} />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full blur-3xl opacity-25" style={{ background: 'radial-gradient(circle at center, hsl(var(--neon-orange)/0.35), transparent 60%)' }} />
      <div className="absolute inset-0 spotlight-bg" />
    </div>
  );
};

export default GradientBackground;
