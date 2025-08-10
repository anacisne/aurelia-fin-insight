import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Area } from "recharts";
import { useMemo } from "react";

const dataGen = () => {
  const base = 100;
  const arr = Array.from({ length: 60 }).map((_, i) => {
    const price = base + Math.sin(i / 6) * 5 + i * 0.3 + (Math.random() - 0.5) * 2;
    const forecast = price + Math.sin(i / 8) * 2 + 1.5;
    const low = forecast - 3 - Math.random();
    const high = forecast + 3 + Math.random();
    return {
      i,
      date: `D${i + 1}`,
      price: Number(price.toFixed(2)),
      forecast: Number(forecast.toFixed(2)),
      low,
      high,
    };
  });
  return arr;
};

export function PriceForecastChart() {
  const data = useMemo(() => dataGen(), []);
  return (
    <div className="w-full h-[360px] glass-panel rounded-xl p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--foreground)/0.12)" />
          <XAxis dataKey="date" stroke="hsl(var(--foreground)/0.6)" dy={6} />
          <YAxis stroke="hsl(var(--foreground)/0.6)" />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              color: "hsl(var(--foreground))",
              borderRadius: 12,
            }}
          />
          <Area type="monotone" dataKey="high" stroke="none" fill="hsl(var(--foreground)/0.06)" />
          <Area type="monotone" dataKey="low" stroke="none" fill="hsl(var(--background))" />
          <Line type="monotone" dataKey="price" stroke="hsl(var(--neon-cyan))" dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="forecast" stroke="hsl(var(--neon-orange))" dot={false} strokeDasharray="5 5" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
