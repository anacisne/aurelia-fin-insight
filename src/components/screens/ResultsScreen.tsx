import React, { useMemo, useState } from "react";
import { Pencil, Save, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PriceForecastChart } from "@/components/charts/PriceForecastChart";
import { Slider } from "@/components/ui/slider";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import type { UserInputs } from "./InputScreen";

const RecommendationBadge: React.FC<{ rec: "BUY"|"HOLD"|"SELL" }> = ({ rec }) => {
  const color = rec === 'BUY' ? 'neon-green' : rec === 'SELL' ? 'neon-red' : 'neon-orange';
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-[hsl(var(--${color})/0.18)] text-[hsl(var(--${color}))] shadow-[0_0_16px_hsl(var(--${color})/0.35)]`}>{rec}</span>
  );
};

type Props = {
  inputs: UserInputs;
  onEditAndRecompute: (updated: Partial<UserInputs>) => void;
};

const ResultsScreen: React.FC<Props> = ({ inputs, onEditAndRecompute }) => {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState(inputs);
  const tfDays = useMemo(() => {
    const n = parseInt((local.timeframe as any) ?? '', 10);
    return isNaN(n) ? 60 : n;
  }, [local.timeframe]);
  const [sentiment, setSentiment] = useState(68);
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const eventIndices = useMemo(() => [0.2, 0.5, 0.75, 0.9].map(f => Math.min(Math.max(0, Math.floor(tfDays * f)), Math.max(0, tfDays - 1))), [tfDays]);
  const rec = useMemo(() => {
    const t = (local.ticker || "").length;
    return t % 3 === 0 ? "BUY" : t % 3 === 1 ? "HOLD" : "SELL";
  }, [local.ticker]);
  const recColor = rec === 'BUY' ? 'neon-green' : rec === 'SELL' ? 'neon-red' : 'neon-orange';

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Sidebar */}
      <aside className="col-span-12 lg:col-span-3 glass-panel rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm uppercase tracking-wider text-foreground/70">Inputs</h2>
          {!editing ? (
            <Button variant="glass" size="sm" onClick={() => setEditing(true)}><Pencil className="mr-2" />Edit</Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="cta" size="sm" onClick={() => { setEditing(false); onEditAndRecompute(local); }}><Save className="mr-2" />Save</Button>
              <Button variant="outline" size="sm" onClick={() => { setLocal(inputs); setEditing(false); }}><XCircle className="mr-2" />Cancel</Button>
            </div>
          )}
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between"><span className="text-foreground/70">Ticker</span>{editing ? (
            <input value={local.ticker} onChange={(e)=>setLocal(prev=>({...prev, ticker: e.target.value.toUpperCase()}))} className="bg-transparent border-b border-border focus:outline-none focus:border-neon-cyan px-1 py-0.5" />
          ) : (
            <span className="font-medium">{inputs.ticker}</span>
          )}</div>
          <div className="flex items-center justify-between"><span className="text-foreground/70">Timeframe</span>{editing ? (
            <select value={local.timeframe} onChange={(e)=>setLocal(prev=>({...prev, timeframe: e.target.value}))} className="bg-transparent border-b border-border focus:outline-none focus:border-neon-cyan px-1 py-0.5">
              <option>30 days</option><option>60 days</option><option>90 days</option>
            </select>
          ) : (
            <span className="font-medium">{inputs.timeframe}</span>
          )}</div>
          {inputs.fileName && <div className="flex items-center justify-between"><span className="text-foreground/70">PDF</span><span className="font-medium truncate max-w-[160px]" title={inputs.fileName}>{inputs.fileName}</span></div>}
        </div>
      </aside>

      {/* Main */}
      <section className="col-span-12 lg:col-span-9 space-y-6">
        <div className={`rounded-xl p-4 text-center font-extrabold text-2xl md:text-3xl tracking-wide bg-[hsl(var(--${recColor})/0.12)] text-[hsl(var(--${recColor}))] border border-[hsl(var(--${recColor})/0.35)] shadow-[0_0_24px_hsl(var(--${recColor})/0.25)] animate-fade-in`}>
          {rec}
        </div>
        <div className="glass-panel rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-2xl font-semibold tracking-wide">{inputs.ticker}</div>
              <div className="text-sm text-foreground/60">Last: $142.35 • Forecast: $146.20</div>
            </div>
            <RecommendationBadge rec={rec} />
          </div>
          <div className="text-sm text-foreground/60">Confidence: 95%</div>
        </div>
        <div className="flex items-center justify-end gap-2">
          {[30,60,90].map((d) => (
            <Button
              key={d}
              variant="glass"
              size="sm"
              className={d === tfDays ? "bg-[hsl(var(--neon-cyan))] text-[hsl(var(--background))]" : "border border-[hsl(var(--neon-cyan)/0.5)] text-[hsl(var(--neon-cyan))]"}
              onClick={() => setLocal(prev => ({...prev, timeframe: `${d} days`}))}
            >
              {d}d
            </Button>
          ))}
        </div>

        <PriceForecastChart timeframeDays={tfDays} selectedIndex={highlightIndex ?? undefined} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-panel rounded-xl p-4">
            <h3 className="text-sm uppercase tracking-wider text-foreground/70 mb-2">Key Events</h3>
            <ul className="space-y-2 text-sm">
              {['Earnings beat expectations', 'New product announced', 'Regulatory update', 'Analyst upgrade'].map((label, idx) => (
                <li key={label} className="flex items-center gap-2 cursor-pointer hover:text-foreground" onClick={() => setHighlightIndex(eventIndices[idx])}>
                  <span className={idx % 2 === 0 ? 'text-neon-yellow' : 'text-neon-cyan'}>{idx % 2 === 0 ? '⚡' : '📈'}</span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-panel rounded-xl p-4">
            <h3 className="text-sm uppercase tracking-wider text-foreground/70 mb-2">Sentiment</h3>
            <div className="h-2 rounded-full bg-gradient-to-r from-[hsl(var(--neon-red))] via-[hsl(var(--neon-yellow))] to-[hsl(var(--neon-green))] shimmer" />
            <div className="mt-3">
              <Slider value={[sentiment]} onValueChange={(v) => setSentiment(v[0] ?? sentiment)} />
              <div className="mt-2 text-xs text-foreground/70">Overall Sentiment: {sentiment > 60 ? 'Positive' : sentiment < 40 ? 'Negative' : 'Neutral'}, based on {sentiment}% positive news & reports</div>
            </div>
          </div>
          <div className="glass-panel rounded-xl p-4">
            <h3 className="text-sm uppercase tracking-wider text-foreground/70 mb-2">Risk Predictions</h3>
            <TooltipProvider>
              <div className="flex flex-wrap gap-2">
                {['Rate Shock', 'FX Exposure', 'Supply Risk', 'Vol Spike'].map((t) => (
                  <Tooltip key={t}>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="border-[hsl(var(--neon-cyan)/0.4)] text-neon-cyan hover:bg-[hsl(var(--neon-cyan)/0.08)] cursor-default">{t}</Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t} – potential impact and mitigation details.</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          </div>
        </div>

        {/* Chat bar */}
        <div className="glass-panel rounded-full p-2 pl-4 flex items-center gap-2">
          <input placeholder="Ask me something else from this document…" className="flex-1 bg-transparent outline-none text-sm" />
          <Button variant="cta" size="pill">Ask</Button>
        </div>
      </section>
    </div>
  );
};

export default ResultsScreen;
