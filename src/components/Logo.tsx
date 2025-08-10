import { LineChart as LineChartIcon } from "lucide-react";

const Logo = () => {
  return (
    <div className="group inline-flex items-center gap-2 select-none">
      <div className="p-2 rounded-lg glass-panel transition-transform group-hover:scale-105">
        <LineChartIcon className="text-neon-cyan" />
      </div>
      <span className="text-lg font-semibold tracking-wide">FinDocGPT</span>
    </div>
  );
};

export default Logo;
