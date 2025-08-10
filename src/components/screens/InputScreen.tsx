import React, { useRef, useState } from "react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Upload, FileText, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export type UserInputs = {
  ticker: string;
  timeframe: string;
  startDate?: Date;
  fileName?: string;
};

type Props = {
  onAnalyze: (inputs: UserInputs) => void;
};

const InputScreen: React.FC<Props> = ({ onAnalyze }) => {
  const [ticker, setTicker] = useState("");
  const [timeframe, setTimeframe] = useState("Daily");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const fileRef = useRef<HTMLInputElement>(null);

  const canAnalyze = ticker.trim().length > 0;

  return (
    <div className="relative min-h-[92vh] flex flex-col">
      <header className="flex items-center justify-between py-6">
        <div className="flex items-center gap-3">
          <Logo />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-6xl font-semibold tracking-[0.3em] uppercase underline-animated">Hedging with AI</h1>
        <p className="mt-4 text-foreground/70 max-w-xl">
          Upload a financial document, choose your parameters, and let AI surface hedging insights.
        </p>

        <div className="mt-10 w-full max-w-5xl">
          <div className="glass-panel rounded-full px-4 md:px-6 py-4 flex flex-col md:flex-row items-center gap-3 md:gap-4">
            <div className="flex-1 w-full">
              <Input placeholder="Ticker (e.g., AAPL)" value={ticker} onChange={(e) => setTicker(e.target.value.toUpperCase())} className="h-12 rounded-full px-5 focus-visible:ring-[hsl(var(--neon-yellow))]" />
            </div>

            <div>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="h-12 rounded-full w-[160px]">
                  <SelectValue placeholder="Time Frame" />
                </SelectTrigger>
                <SelectContent className="z-50">
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="glass" size="pill" className={cn("justify-start w-[220px] font-normal", !date && "text-foreground/60")}> 
                    <CalendarIcon className="mr-2" />
                    {date ? format(date, "PPP") : <span>Start Date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <input ref={fileRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setFileName(f.name);
              }} />
              <Button variant="glass" size="pill" onClick={() => fileRef.current?.click()} className="group">
                <Upload className="mr-2 transition-transform group-hover:-rotate-6" />
                {fileName ? fileName : "Upload PDF"}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Button
            variant="cta"
            size="pill"
            onClick={() => canAnalyze && onAnalyze({ ticker, timeframe, startDate: date, fileName })}
            className="pulse-glow"
            disabled={!canAnalyze}
          >
            Analyze
            <ChevronRight />
          </Button>
          {!canAnalyze && <div className="mt-2 text-sm text-foreground/60">Enter a ticker to continue.</div>}
        </div>
      </main>

      <footer className="py-8 text-sm text-foreground/60">
        <nav className="flex items-center justify-center gap-6">
          {['Privacy', 'Terms', 'Support'].map((l) => (
            <a key={l} href="#" className="transition-colors hover:text-neon-cyan">{l}</a>
          ))}
        </nav>
      </footer>
    </div>
  );
};

export default InputScreen;
