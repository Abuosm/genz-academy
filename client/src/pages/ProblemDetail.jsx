import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import {
  ChevronLeft,
  Play,
  Send,
  RotateCcw,
  Trophy,
  Target,
  Award,
  Settings,
  Terminal,
  CheckCircle2,
  XCircle,
  Keyboard,
  Maximize2,
  Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProblemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('code'); // code, testcase, result
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [customTestcase, setCustomTestcase] = useState('');
  const [explanation, setExplanation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [probRes, statsRes] = await Promise.all([
          api.get('/upgrade/assignments'),
          api.get('/dashboard/comprehensive-stats')
        ]);

        const currentProblem = probRes.data.find(p => p._id === id);
        if (currentProblem) {
          setProblem(currentProblem);
          const savedCode = localStorage.getItem(`code_${id}_${language}`);
          setCode(savedCode || currentProblem.initialCode?.[language] || '');
          setCustomTestcase(JSON.stringify(currentProblem.testCases?.[0]?.input || '', null, 2));
        }
        setUserStats(statsRes.data.user);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, [id, language]);

  // --- AUTO-SAVE ---
  useEffect(() => {
    if (code) {
      localStorage.setItem(`code_${id}_${language}`, code);
    }
  }, [code, id, language]);

  // --- KEYBOARD SHORTCUTS ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        handleSubmit(true); // Run on Ctrl+Enter
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, customTestcase]);

  const handleSubmit = async (isRunOnly = false) => {
    setIsSubmitting(true);
    setActiveTab('result');
    setConsoleOutput([{ type: 'info', text: isRunOnly ? 'Running test cases...' : 'Submitting solution...' }]);

    try {
      const res = await api.post(`/upgrade/assignments/${id}/solve`,
        { code, language, testcase: isRunOnly ? customTestcase : null }
      );

      const { success, results, accuracy } = res.data;
      const newLogs = results.map(r => ({
        type: r.passed ? 'success' : 'error',
        text: r.passed
          ? `Test Case ${r.testCase}: Passed`
          : `Test Case ${r.testCase}: Failed (Expected ${JSON.stringify(r.expected)}, Got ${JSON.stringify(r.actual)})`
      }));

      if (success) {
        newLogs.unshift({ type: 'success', text: `Success! 🎉 ${isRunOnly ? 'Sample passed.' : `Problem solved! Accuracy: ${accuracy}%`}` });
        if (!isRunOnly) setProblem({ ...problem, isSolved: true });
      } else {
        newLogs.unshift({ type: 'error', text: 'Wrong Answer. Check the details below.' });
      }

      setConsoleOutput(newLogs);
    } catch (err) {
      setConsoleOutput([{ type: 'error', text: 'Error: Compilation failed or timeout occurred.' }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset code to default?')) {
      setCode(problem.initialCode?.[language] || '');
    }
  };

  if (loading || !problem) return (
    <div className="h-screen bg-background flex items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-background text-gray-100 overflow-hidden font-sans">
      {/* Immersive Glass Header */}
      <header className="h-16 border-b border-glass-border bg-glass-surface backdrop-blur-md flex items-center justify-between px-6 z-20 relative">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/assignments')}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors group text-gray-400 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="h-6 w-[1px] bg-glass-border"></div>
          <h1 className="font-bold text-white tracking-tight text-lg">{problem.title}</h1>
          <span className={`px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
              problem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}>
            {problem.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6 text-[10px] font-black tracking-widest uppercase text-gray-500">
            <div className="flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5 text-yellow-500" />
              <span>Rank #{userStats?.rank || '0'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-blue-500" />
              <span>{userStats?.leaderboardPoints || 0} Pts</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-purple-500" />
              <span>{userStats?.accuracy || 0}% Acc</span>
            </div>
          </div>
          <div className="h-6 w-[1px] bg-glass-border"></div>

          <button
            onClick={async () => {
              const res = await api.post(`/upgrade/assignments/${id}/explain`, { code });
              setExplanation(res.data.explanation);
              setActiveTab('result');
              setConsoleOutput([{ type: 'info', text: 'AI Explanation Generated. Check results.' }]);
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-primary-glow text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all shadow-[0_0_10px_rgba(112,69,255,0.2)]"
          >
            <div className="w-1.5 h-1.5 bg-primary-glow rounded-full animate-pulse"></div>
            AI Explain
          </button>

          <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Split Layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left: Problem Description (Dark Glass) */}
        <section className="w-[40%] border-r border-glass-border bg-black/20 backdrop-blur-sm overflow-y-auto custom-scrollbar p-8">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-2">
                <Code className="w-6 h-6 text-primary" />
                Problem Statement
              </h2>
              <div className="text-gray-300 leading-relaxed text-sm font-medium">
                {problem.problemStatement}
              </div>
            </div>

            {problem.examples?.map((ex, i) => (
              <div key={i} className="space-y-3">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Example {i + 1}</h3>
                <div className="bg-surfaceHighlight/50 border border-glass-border rounded-xl p-5 font-mono text-[11px] space-y-4">
                  <div className="flex gap-4">
                    <span className="text-secondary-glow font-bold w-12 shrink-0">Input:</span>
                    <span className="text-gray-300 break-all">{ex.input}</span>
                  </div>
                  <div className="flex gap-4 border-t border-glass-border pt-4">
                    <span className="text-green-400 font-bold w-12 shrink-0">Output:</span>
                    <span className="text-gray-300">{ex.output}</span>
                  </div>
                  {ex.explanation && (
                    <div className="flex gap-4 border-t border-glass-border pt-4">
                      <span className="text-primary-glow font-bold w-12 shrink-0">Reason:</span>
                      <p className="text-gray-400 italic leading-relaxed">{ex.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="space-y-3 pb-20">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Constraints</h3>
              <ul className="space-y-3">
                {problem.constraints?.map((c, i) => (
                  <li key={i} className="flex gap-3 items-start group">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary-glow transition-colors box-shadow-[0_0_5px_#7045ff]"></div>
                    <code className="text-[11px] font-bold text-gray-500 group-hover:text-gray-200 transition-colors bg-white/5 px-1 py-0.5 rounded">{c}</code>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Right: Immersive Workbench */}
        <section className="flex-1 flex flex-col bg-[#0e0c16] relative">
          {/* Editor Tabs Toolbar */}
          <div className="h-10 border-b border-glass-border flex items-center justify-between px-4 bg-black/40">
            <div className="flex gap-1 h-full pt-1">
              {[
                { id: 'code', label: 'Code', icon: Keyboard },
                { id: 'testcase', label: 'Testcase', icon: Terminal },
                { id: 'result', label: 'Console', icon: CheckCircle2 }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest rounded-t-lg transition-all ${activeTab === tab.id
                    ? 'bg-[#1e1c29] text-primary-glow border-x border-t border-glass-border border-b-[#1e1c29] relative top-[1px]'
                    : 'text-gray-600 hover:text-gray-300 hover:bg-white/5'
                    }`}
                >
                  <tab.icon className="w-3 h-3" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-surfaceHighlight border border-glass-border text-[10px] font-bold uppercase rounded-lg px-3 py-1 focus:outline-none focus:border-primary text-gray-300"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
              <button
                onClick={handleReset}
                className="p-1.5 hover:bg-rose-500/10 text-gray-500 hover:text-rose-500 rounded-lg transition-all"
                title="Reset Code"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 hover:bg-white/10 text-gray-500 hover:text-white rounded-lg transition-all">
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Workbench Body */}
          <div className="flex-1 relative overflow-hidden bg-[#1e1c29]">
            <AnimatePresence mode="wait">
              {activeTab === 'code' && (
                <motion.div
                  key="code"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-full relative"
                >
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-full bg-[#1e1c29] text-gray-300 font-mono text-sm p-8 pl-12 focus:outline-none resize-none custom-scrollbar selection:bg-primary/30 leading-relaxed"
                    placeholder="// Unleash your genius here..."
                    spellCheck="false"
                  />
                  {/* Line numbers emulation */}
                  <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col items-center py-8 gap-[1.625rem] text-[10px] text-gray-700 font-mono select-none border-r border-glass-border bg-black/20">
                    {[...Array(99)].map((_, i) => <span key={i}>{i + 1}</span>)}
                  </div>
                </motion.div>
              )}

              {activeTab === 'testcase' && (
                <motion.div
                  key="testcase"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full p-8 space-y-8 bg-[#1e1c29]"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Custom Bench Input</label>
                      <span className="text-[10px] font-bold text-primary-glow/50">JSON format required</span>
                    </div>
                    <textarea
                      value={customTestcase}
                      onChange={(e) => setCustomTestcase(e.target.value)}
                      className="w-full h-[300px] bg-black/40 border border-glass-border rounded-xl p-6 font-mono text-xs text-secondary-glow focus:outline-none focus:border-primary/50 transition-all custom-scrollbar shadow-inner"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {problem.testCases?.slice(0, 4).map((tc, i) => (
                      <button
                        key={i}
                        onClick={() => setCustomTestcase(JSON.stringify(tc.input, null, 2))}
                        className="p-4 bg-black/20 border border-glass-border rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:border-primary/50 hover:bg-primary/5 hover:text-white transition-all text-left flex items-center gap-3"
                      >
                        <Terminal className="w-3.5 h-3.5" />
                        Sample {i + 1}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'result' && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full flex flex-col bg-[#1e1c29]"
                >
                  <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-4">
                    {consoleOutput.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center opacity-10 select-none">
                        <Terminal className="w-16 h-16 mb-6 text-white" />
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-white">Workbench Idle</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {explanation && activeTab === 'result' && (
                          <div className="p-6 bg-primary/10 border border-primary/20 rounded-2xl space-y-3">
                            <h4 className="flex items-center gap-2 text-primary-glow text-[10px] font-black uppercase tracking-widest">
                              <Play className="w-3 h-3" />
                              AI Code Walkthrough
                            </h4>
                            <ul className="space-y-3">
                              {explanation.map((line, i) => (
                                <li key={i} className="flex gap-3 text-[11px] text-gray-300 font-medium bg-black/20 p-3 rounded-xl border border-white/5">
                                  <span className="text-primary font-bold">{i + 1}.</span>
                                  {line}
                                </li>
                              ))}
                            </ul>
                            <button onClick={() => setExplanation(null)} className="text-[9px] font-black text-gray-500 hover:text-white underline uppercase tracking-widest transition-colors">Dismiss</button>
                          </div>
                        )}
                        {consoleOutput.map((log, i) => (
                          <div key={i} className={`p-5 rounded-2xl border ${log.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                              log.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                'bg-blue-500/10 border-blue-500/20 text-blue-400'
                            } flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                            {log.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> :
                              log.type === 'error' ? <XCircle className="w-5 h-5 shrink-0" /> :
                                <Play className="w-5 h-5 shrink-0" />}
                            <p className="text-[11px] font-mono leading-relaxed font-bold tracking-tight">{log.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Workbench Actions Footer */}
          <footer className="h-16 border-t border-glass-border bg-glass-surface backdrop-blur-md flex items-center justify-between px-8 z-10">
            <div className="flex items-center gap-6 text-[10px] font-black uppercase text-gray-500 tracking-wider">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                Judge Ready
              </div>
              <div className="h-4 w-[1px] bg-white/10"></div>
              <div className="font-mono">Latency: 24ms</div>
            </div>
            <div className="flex items-center gap-4">
              <button
                disabled={isSubmitting}
                onClick={() => handleSubmit(true)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-black uppercase tracking-widest text-white transition-all disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 text-green-400" />
                Run Code
              </button>
              <button
                disabled={isSubmitting}
                onClick={() => handleSubmit(false)}
                className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/30 active:scale-95 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? 'Evaluating...' : 'Submit'}
              </button>
            </div>
          </footer>
        </section>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
};

export default ProblemDetail;
