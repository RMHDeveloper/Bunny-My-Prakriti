
import React from 'react';
import { useState } from 'react';
import { AppState, Dosha, PrakritiState, VikritiState } from './types';
import { QUESTIONS, SYMPTOMS, DOSHA_COLORS } from './constants';
import { calculateVikriti } from './services/geminiService';
import Mascot from './components/Mascot';
import RadarChart from './components/RadarChart';
import DoshaClock from './components/DoshaClock';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    step: 'intro',
    prakritiScores: null,
    vikritiData: null,
    currentFeeling: '',
    selectedSymptoms: [],
  });

  const [wizardStep, setWizardStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Dosha>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleAnswer = (questionId: string, dosha: Dosha) => {
    setAnswers(prev => ({ ...prev, [questionId]: dosha }));
    if (wizardStep < QUESTIONS.length - 1) {
      setWizardStep(prev => prev + 1);
    } else {
      completePrakriti({ ...answers, [questionId]: dosha });
    }
  };

  const completePrakriti = (finalAnswers: Record<string, Dosha>) => {
    const counts = { [Dosha.VATA]: 0, [Dosha.PITTA]: 0, [Dosha.KAPHA]: 0 };
    Object.values(finalAnswers).forEach(d => counts[d]++);
    const total = Object.keys(finalAnswers).length;
    const scores: PrakritiState = {
      vata: Math.round((counts[Dosha.VATA] / total) * 100),
      pitta: Math.round((counts[Dosha.PITTA] / total) * 100),
      kapha: Math.round((counts[Dosha.KAPHA] / total) * 100),
    };
    setState(prev => ({ ...prev, step: 'vikriti', prakritiScores: scores }));
  };

  const toggleSymptom = (symptom: string) => {
    setState(prev => ({
      ...prev,
      selectedSymptoms: prev.selectedSymptoms.includes(symptom)
        ? prev.selectedSymptoms.filter(s => s !== symptom)
        : [...prev.selectedSymptoms, symptom]
    }));
  };

  const processAnalysis = async () => {
    if (!state.prakritiScores) return;
    setIsLoading(true);
    try {
      const result = await calculateVikriti(state.prakritiScores, state.selectedSymptoms, state.currentFeeling);
      setState(prev => ({ ...prev, step: 'dashboard', vikritiData: result }));
    } catch (error) {
      console.error("AI Analysis failed", error);
      alert("AI was unable to process your analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyResults = () => {
    const text = `Bunny My Prakriti Results:\nPrakriti: VATA ${state.prakritiScores?.vata}%, PITTA ${state.prakritiScores?.pitta}%, KAPHA ${state.prakritiScores?.kapha}%\nImbalance Score: ${state.vikritiData?.imbalanceScore}%`;
    navigator.clipboard.writeText(text);
    alert("Results copied to clipboard!");
  };

  const saveAsPdf = () => window.print();

  const currentQuestion = QUESTIONS[wizardStep];

  return (
    <div className="min-h-screen selection:bg-indigo-100 flex flex-col">
      {/* Professional Sticky Disclaimer */}
      <div className="no-print fixed bottom-0 left-0 right-0 z-50 py-2 bg-white/95 backdrop-blur-sm border-t border-slate-100 text-center text-[8px] sm:text-[10px] text-slate-500 uppercase tracking-[0.2em] font-medium">
        Educational profile. Not medical advice.
      </div>

      <header className="no-print py-4 sm:pt-8 px-4 sm:px-8 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center animate-float">
            <img 
              src="https://i.ibb.co/XfRVZqR5/RMH-Mascot-Ayurveda.png" 
              alt="Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-lg sm:text-2xl tracking-tight font-bold text-slate-900 leading-none">Bunny My</span>
            <span className="text-indigo-600 font-heading text-lg sm:text-2xl font-bold leading-none">Prakriti</span>
          </div>
        </div>
        <button 
          onClick={() => { setState({ step: 'intro', prakritiScores: null, vikritiData: null, currentFeeling: '', selectedSymptoms: [] }); setWizardStep(0); setAnswers({}); }}
          className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
        >
          Reset
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-4 sm:pt-12 flex-grow w-full pb-20">
        {state.step === 'intro' && (
          <div className="max-w-3xl mx-auto text-center py-10 sm:py-20">
            <h1 className="text-4xl sm:text-6xl font-heading font-bold mb-6 text-slate-900 leading-tight">
              Biological Balance <br/><span className="italic text-indigo-600 underline decoration-indigo-200 underline-offset-4 sm:underline-offset-8">Find Your Prakriti</span>
            </h1>
            <p className="text-slate-500 mb-8 sm:mb-12 text-base sm:text-xl max-w-xl mx-auto leading-relaxed font-light px-4">
              Sophisticated Ayurvedic profiling for the modern era. Discover your inherent nature and real-time state.
            </p>
            <button 
              onClick={() => setState(prev => ({ ...prev, step: 'prakriti' }))}
              className="px-8 py-4 sm:px-10 sm:py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-semibold text-base sm:text-lg transition-all shadow-xl active:scale-95"
            >
              Start Bio-Profiling
            </button>
          </div>
        )}

        {state.step === 'prakriti' && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6 sm:mb-12 flex justify-between items-end">
              <div>
                <span className="text-indigo-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-1 block">Part 01: The Blueprint</span>
                <h2 className="text-2xl sm:text-4xl font-heading font-bold text-slate-900">{currentQuestion.label}</h2>
              </div>
              <span className="text-slate-300 text-xs font-mono">{wizardStep + 1}/{QUESTIONS.length}</span>
            </div>

            <div className="grid gap-3 sm:gap-6">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(currentQuestion.id, option.dosha)}
                  className="bento-card p-5 sm:p-8 text-left group flex items-center justify-between"
                >
                  <div className="pr-4">
                    <span className="font-semibold text-lg sm:text-xl text-slate-800 block mb-1">{option.label}</span>
                    <p className="text-slate-500 text-xs sm:text-sm font-light leading-snug">{option.description}</p>
                  </div>
                  <i className="fa-solid fa-chevron-right text-slate-200 group-hover:text-indigo-500 transition-all"></i>
                </button>
              ))}
            </div>

            <div className="mt-8 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-slate-900 transition-all duration-700"
                style={{ width: `${((wizardStep + 1) / QUESTIONS.length) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {state.step === 'vikriti' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-indigo-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-1 block">Part 02: Real-time State</span>
              <h2 className="text-2xl sm:text-4xl font-heading font-bold text-slate-900">Imbalance Detection</h2>
              <p className="text-slate-500 mt-2 text-sm font-light">Select any current deviations.</p>
            </div>

            <div className="space-y-4 sm:space-y-8">
              <div className="bento-card p-5 sm:p-8">
                <label className="block text-[10px] font-bold mb-4 uppercase tracking-[0.2em] text-slate-400">Markers</label>
                <div className="flex flex-wrap gap-2">
                  {SYMPTOMS.map(s => (
                    <button
                      key={s}
                      onClick={() => toggleSymptom(s)}
                      className={`px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-semibold border transition-all ${
                        state.selectedSymptoms.includes(s)
                        ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                        : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bento-card p-5 sm:p-8">
                <label className="block text-[10px] font-bold mb-3 uppercase tracking-[0.2em] text-slate-400">Context</label>
                <textarea
                  value={state.currentFeeling}
                  onChange={(e) => setState(prev => ({ ...prev, currentFeeling: e.target.value }))}
                  placeholder="e.g., Slightly higher anxiety after coffee..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 sm:p-5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-200 transition-all font-light"
                  rows={3}
                />
              </div>

              <button 
                onClick={processAnalysis}
                disabled={isLoading}
                className="w-full py-4 sm:py-5 bg-slate-900 text-white rounded-2xl font-bold text-base sm:text-lg transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <><i className="fa-solid fa-circle-notch animate-spin"></i> Analyzing...</>
                ) : (
                  <>Generate Analysis</>
                )}
              </button>
            </div>
          </div>
        )}

        {state.step === 'dashboard' && state.prakritiScores && state.vikritiData && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
            
            {/* Summary Header */}
            <div className="md:col-span-12 bento-card p-6 sm:p-10 flex flex-col items-center text-center bg-indigo-50/30 border-indigo-100/50">
              <h2 className="text-3xl sm:text-5xl font-heading font-bold mb-3 text-slate-900">Your Profile</h2>
              <p className="text-slate-600 text-sm sm:text-lg font-light leading-relaxed max-w-2xl">
                {state.vikritiData.imbalanceScore > 45 
                  ? "Moderate deviation detected. Prioritize restoration protocols."
                  : "Excellent coherence. Follow subtle adjustments for peak performance."}
              </p>
              <div className="mt-6 flex flex-wrap gap-3 no-print justify-center">
                <button onClick={copyResults} className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                  Copy
                </button>
                <button onClick={saveAsPdf} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest">
                  Export
                </button>
              </div>
            </div>

            {/* Radar Chart */}
            <div className="md:col-span-12 lg:col-span-6 bento-card p-6 sm:p-10 flex flex-col items-center justify-center">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-6 sm:mb-10">Equilibrium Map</h3>
              <div className="scale-75 sm:scale-100 -my-10 sm:my-0">
                <RadarChart prakriti={state.prakritiScores} vikriti={state.vikritiData} />
              </div>
              <div className="mt-4 sm:mt-10 flex gap-6 text-[9px] font-bold uppercase tracking-[0.1em]">
                <div className="flex items-center gap-2 text-indigo-600">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full"></span> Nature
                </div>
                <div className="flex items-center gap-2 text-slate-900">
                  <span className="w-2 h-2 border border-slate-900 rounded-full border-dashed"></span> State
                </div>
              </div>
            </div>

            {/* Nature Breakdown */}
            <div className="md:col-span-12 lg:col-span-6 bento-card p-6 sm:p-10">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-4 sm:mb-8">Prakriti Analysis</h3>
              <div className="space-y-4 sm:space-y-8">
                {([Dosha.VATA, Dosha.PITTA, Dosha.KAPHA] as Dosha[]).map(d => {
                  const score = state.prakritiScores?.[d.toLowerCase() as keyof PrakritiState] || 0;
                  return (
                    <div key={d}>
                      <div className="flex justify-between items-end mb-2">
                        <span className="font-bold text-[10px] sm:text-xs tracking-widest uppercase" style={{ color: DOSHA_COLORS[d] }}>{d}</span>
                        <span className="text-slate-400 font-mono text-xs">{score}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: DOSHA_COLORS[d] }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-8 text-[10px] text-slate-400 leading-relaxed italic border-t border-slate-50 pt-4 font-light">
                Blueprint foundations for your optimal strategy.
              </p>
            </div>

            {/* Equilibrium Score & Clock (Flex row on larger, stacked on mobile) */}
            <div className="md:col-span-12 flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="flex-1 bento-card p-6 sm:p-10 flex flex-col items-center justify-center text-center">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-6">Coherence Index</h3>
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="absolute inset-0">
                    <circle cx="50" cy="50" r="46" className="fill-none stroke-slate-50" strokeWidth="3" />
                    <circle 
                      cx="50" cy="50" r="46" 
                      className="fill-none stroke-slate-900" 
                      strokeWidth="3" 
                      strokeDasharray={`${100 - state.vikritiData.imbalanceScore} 100`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <span className="text-3xl sm:text-5xl font-light text-slate-900 tracking-tighter">{100 - state.vikritiData.imbalanceScore}%</span>
                </div>
              </div>

              <div className="flex-1 bento-card p-6 sm:p-10 flex flex-col items-center justify-center">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-6">Circadian Cycle</h3>
                <div className="scale-90 sm:scale-100">
                  <DoshaClock />
                </div>
              </div>
            </div>

            {/* Lifestyle Optimization */}
            <div className="md:col-span-12 bento-card p-6 sm:p-10">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-6 sm:mb-10 text-center">Adjustment Protocol</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10">
                {state.vikritiData.lifestyleShifts.map((shift, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 text-[10px] sm:text-xs font-bold text-slate-400">
                      {i + 1}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">{shift}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </main>

      <footer className="no-print w-full py-6 mt-auto border-t border-slate-100 bg-white flex flex-col items-center justify-center gap-1 px-4">
        <p className="text-slate-400 text-[10px] font-medium tracking-wide">
          &copy; {new Date().getFullYear()} Bunny My Prakriti.
        </p>
        <p className="text-slate-500 text-[9px] font-semibold tracking-wider text-center">
          By <a href="https://rabbitmarketinghouse.in" target="_blank" rel="noopener noreferrer" className="text-indigo-600">Rabbit Marketing House</a>
        </p>
      </footer>
    </div>
  );
};

export default App;
