import GradientBackground from "@/components/GradientBackground";
import InputScreen, { type UserInputs } from "@/components/screens/InputScreen";
import LoadingScreen from "@/components/screens/LoadingScreen";
import ResultsScreen from "@/components/screens/ResultsScreen";
import Logo from "@/components/Logo";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const Index = () => {
  const [step, setStep] = useState<'input'|'loading'|'results'>("input");
  const [inputs, setInputs] = useState<UserInputs | null>(null);

  const handleAnalyze = (vals: UserInputs) => {
    setInputs(vals);
    setStep('loading');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <GradientBackground />
      <div className="container py-4">
        {step === 'input' && <InputScreen onAnalyze={handleAnalyze} />}
        {step === 'loading' && <LoadingScreen onDone={() => setStep('results')} />}
        {step === 'results' && inputs && (
          <div className="py-6 space-y-6 animate-fade-in">
            <header className="flex items-center justify-between">
              <Logo />
              <Button variant="glass" size="sm" onClick={() => setStep('input')} aria-label="Go Home">
                <Home />
              </Button>
            </header>
            <main>
              <h1 className="sr-only">Hedging with AI</h1>
              <ResultsScreen inputs={inputs} onEditAndRecompute={(u) => { setInputs((prev)=> ({...prev!, ...u})); setStep('loading'); }} />
            </main>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
