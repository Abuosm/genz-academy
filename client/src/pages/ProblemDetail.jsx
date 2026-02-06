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
  ChevronDown,
  Settings,
  Terminal,
  CheckCircle2,
  XCircle,
  Keyboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProblemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [code, setCode] = useState(localStorage.getItem(`code_${id}_${language}`) || '');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('code'); // code, testcase, result
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [customTestcase, setCustomTestcase] = useState('');
  const [explanation, setExplanation] = useState(null);
  const [showReview, setShowReview] = useState(false);

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
          setCode(currentProblem.initialCode?.[language] || '');
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

      const { success, results, accuracy, solvedCount } = res.data;
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
    <div className="h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-white text-slate-900 overflow-hidden">
      {/* Immersive Header */}
      <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 z-20 shadow-sm">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/assignments')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 text-slate-500 group-hover:text-slate-900" />
          </button>
          <div className="h-6 w-[1px] bg-slate-200"></div>
          <h1 className="font-bold text-slate-900 tracking-tight">{problem.title}</h1>
          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${problem.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400' :
            problem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
              'bg-red-500/10 text-red-400'
            }`}>
            {problem.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6 text-[10px] font-black tracking-widest uppercase grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
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
          <div className="h-6 w-[1px] bg-slate-200"></div>
          <button
            onClick={async () => {
              const res = await api.post(`/upgrade/assignments/${id}/explain`, { code });
              setExplanation(res.data.explanation);
              setActiveTab('result');
              setConsoleOutput([{ type: 'info', text: 'AI Explanation Generated. Check results.' }]);
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all"
          >
            Explain
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Split Layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left: Problem Description (Dark Glass) */}
        <section className="w-[45%] border-r border-slate-200 bg-slate-50 overflow-y-auto custom-scrollbar p-8">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Description</h2>
              <div className="text-slate-600 leading-relaxed text-sm">
                {problem.problemStatement}
              </div>
            </div>

            {problem.examples?.map((ex, i) => (
              <div key={i} className="space-y-3">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Example {i + 1}</h3>
                <div className="bg-white border border-slate-200 rounded-2xl p-6 font-mono text-[11px] space-y-4 shadow-sm">
                  <div className="flex gap-4">
                    <span className="text-indigo-600 font-bold w-12 shrink-0">Input:</span>
                    <span className="text-slate-700 break-all">{ex.input}</span>
                  </div>
                  <div className="flex gap-4 border-t border-slate-100 pt-4">
                    <span className="text-emerald-600 font-bold w-12 shrink-0">Output:</span>
                    <span className="text-slate-700">{ex.output}</span>
                  </div>
                  {ex.explanation && (
                    <div className="flex gap-4 border-t border-slate-100 pt-4">
                      <span className="text-indigo-400 font-bold w-12 shrink-0">Reason:</span>
                      <p className="text-slate-500 italic leading-relaxed">{ex.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="space-y-3 pb-20">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Constraints</h3>
              <ul className="space-y-3">
                {problem.constraints?.map((c, i) => (
                  <li key={i} className="flex gap-3 items-start group">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500/30 group-hover:bg-indigo-500 transition-colors"></div>
                    <code className="text-[11px] font-bold text-slate-500 group-hover:text-slate-900 transition-colors">{c}</code>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Right: Immersive Workbench */}
        <section className="flex-1 flex flex-col bg-white">
          {/* Editor Tabs Toolbar */}
          <div className="h-12 border-b border-slate-200 flex items-center justify-between px-4 bg-slate-50/50">
            <div className="flex gap-1 h-full pt-2">
              {[
                { id: 'code', label: 'Code', icon: Keyboard },
                { id: 'testcase', label: 'Testcase', icon: Terminal },
                { id: 'result', label: 'Result', icon: CheckCircle2 }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest rounded-t-lg transition-all ${activeTab === tab.id
                    ? 'bg-white text-indigo-600 border-x border-t border-slate-200 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]'
                    : 'text-slate-500 hover:text-slate-900'
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
                className="bg-white border border-slate-200 text-[10px] font-black uppercase rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition-all cursor-pointer text-slate-700 shadow-sm"
              >
                <option value="javascript">JS</option>
                <option value="python">PY</option>
                <option value="java">JAVA</option>
                <option value="cpp">C++</option>
              </select>
              <button
                onClick={handleReset}
                className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg transition-all"
                title="Reset Code"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Workbench Body */}
          <div className="flex-1 relative overflow-hidden bg-white">
            <AnimatePresence mode="wait">
              {activeTab === 'code' && (
                <motion.div
                  key="code"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-full bg-white text-slate-800 font-mono text-sm p-8 focus:outline-none resize-none custom-scrollbar selection:bg-indigo-500/10"
                    placeholder="// Unleash your genius here..."
                    spellCheck="false"
                  />
                  {/* Line numbers emulation */}
                  <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col items-center py-8 gap-[1.5rem] text-[10px] text-slate-200 font-black pointer-events-none select-none border-r border-slate-50">
                    {[...Array(50)].map((_, i) => <span key={i}>{i + 1}</span>)}
                  </div>
                </motion.div>
              )}

              {activeTab === 'testcase' && (
                <motion.div
                  key="testcase"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full p-8 space-y-8"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Custom Bench Input</label>
                      <span className="text-[10px] font-bold text-blue-500/40">JSON format required</span>
                    </div>
                    <textarea
                      value={customTestcase}
                      onChange={(e) => setCustomTestcase(e.target.value)}
                      className="w-full h-[300px] bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-xs text-indigo-600 focus:outline-none focus:border-indigo-500/20 transition-all custom-scrollbar shadow-inner"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {problem.testCases?.slice(0, 4).map((tc, i) => (
                      <button
                        key={i}
                        onClick={() => setCustomTestcase(JSON.stringify(tc.input, null, 2))}
                        className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-indigo-500/30 hover:bg-white hover:text-indigo-600 transition-all text-left flex items-center gap-3 shadow-sm"
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
                  className="h-full flex flex-col"
                >
                  <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-4">
                    {consoleOutput.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center opacity-10 select-none">
                        <Terminal className="w-16 h-16 mb-6" />
                        <p className="text-xs font-black uppercase tracking-[0.2em]">Workbench Idle</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {explanation && activeTab === 'result' && (
                          <div className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-3">
                            <h4 className="flex items-center gap-2 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
                              <Play className="w-3 h-3" />
                              AI Code Walkthrough
                            </h4>
                            <ul className="space-y-3">
                              {explanation.map((line, i) => (
                                <li key={i} className="flex gap-3 text-[11px] text-indigo-900 font-medium bg-white/50 p-3 rounded-xl border border-indigo-100/50">
                                  <span className="text-indigo-400 font-bold">{i + 1}.</span>
                                  {line}
                                </li>
                              ))}
                            </ul>
                            <button onClick={() => setExplanation(null)} className="text-[9px] font-black text-indigo-400 underline uppercase tracking-widest">Dismiss</button>
                          </div>
                        )}
                        {consoleOutput.map((log, i) => (
                          <div key={i} className={`p-5 rounded-2xl border ${log.type === 'success' ? 'bg-green-500/[0.03] border-green-500/10 text-green-400' :
                            log.type === 'error' ? 'bg-red-500/[0.03] border-red-500/10 text-red-400' :
                              'bg-blue-500/[0.03] border-blue-500/10 text-blue-400'
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
          <footer className="h-20 border-t border-slate-200 bg-white flex items-center justify-between px-8">
            <div className="flex items-center gap-6 text-[10px] font-black uppercase text-slate-400 tracking-wider">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                Judge Ready
              </div>
              <div className="h-4 w-[1px] bg-slate-100"></div>
              <div>Latency: 42ms</div>
            </div>
            <div className="flex items-center gap-4">
              <button
                disabled={isSubmitting}
                onClick={() => handleSubmit(true)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 text-green-500" />
                Run Code
              </button>
              <button
                disabled={isSubmitting}
                onClick={() => handleSubmit(false)}
                className="flex items-center gap-2 px-10 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-50"
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
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.1); }
        .prose italic { color: #64748b !important; }
      `}</style>
    </div>
  );
};

export default ProblemDetail;
