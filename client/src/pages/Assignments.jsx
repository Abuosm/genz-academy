import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Circle,
  Clock,
  Search,
  Filter,
  ChevronRight,
  Code2,
  Trophy,
  Activity,
  Zap,
  Target,
  LayoutGrid,
  List as ListIcon,
  SearchX,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Assignments = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); // list or grid

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assRes, statsRes] = await Promise.all([
          api.get('/upgrade/assignments'),
          api.get('/dashboard/comprehensive-stats')
        ]);
        setAssignments(assRes.data);
        setUserStats(statsRes.data.user);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = ['All', ...new Set(assignments.map(a => a.category).filter(Boolean))];

  const filteredAssignments = assignments.filter(item => {
    const matchesDiff = difficultyFilter === 'All' || item.difficulty === difficultyFilter;
    const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDiff && matchesCat && matchesSearch;
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Zap className="w-6 h-6 text-primary animate-pulse" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in pb-10">
      {/* Premium Hero Header */}
      <section className="glass-panel relative overflow-hidden rounded-[2.5rem] group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-60"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] -ml-40 -mb-40 pointer-events-none"></div>

        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-6 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary-glow">GenZ Mastery Track</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-display font-black text-white tracking-tighter leading-none">
              Solve the World's<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-glow to-secondary-glow">Elite Coding</span> Challenges
            </h1>

            <p className="text-gray-400 text-lg font-medium">
              125+ industrial-grade problems curated by experts to help you ace your interviews at MAANG and beyond.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <button className="glass-button flex items-center gap-2 group">
                <Zap className="w-4 h-4 group-hover:text-yellow-400 transition-colors" />
                Start Daily Challenge
              </button>
              <button className="px-8 py-3 bg-surfaceHighlight border border-glass-border hover:bg-white/5 text-white rounded-xl font-bold text-sm uppercase tracking-widest transition-all">
                View Roadmap
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            {[
              { label: 'Rank', value: `#${userStats?.rank || 0}`, icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
              { label: 'Accuracy', value: `${userStats?.accuracy || 0}%`, icon: Target, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
              { label: 'Points', value: userStats?.leaderboardPoints || 0, icon: Zap, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
              { label: 'Solved', value: `${userStats?.assignmentsCompleted || 0}/${assignments.length}`, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' }
            ].map((stat, i) => (
              <div key={i} className="glass-card p-6 flex flex-col justify-center items-center md:items-start">
                <div className={`w-10 h-10 ${stat.bg} ${stat.color} ${stat.border} border rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-mono font-bold text-white tracking-tighter">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Controls Bar */}
      <section className="sticky top-4 z-40">
        <div className="glass-panel p-4 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
          <div className="flex flex-wrap items-center gap-2">
            <div className="mr-4 flex bg-surfaceHighlight/50 p-1 rounded-xl border border-glass-border backdrop-blur-md">
              {['All', 'Easy', 'Medium', 'Hard'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setDifficultyFilter(lvl)}
                  className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${difficultyFilter === lvl
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
            <div className="h-6 w-[1px] bg-glass-border hidden lg:block"></div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="glass-input py-2.5 px-4 text-xs font-bold uppercase tracking-widest cursor-pointer bg-surfaceHighlight"
            >
              {categories.map(cat => <option key={cat} value={cat} className="bg-surface text-gray-300">{cat}</option>)}
            </select>
          </div>

          <div className="flex flex-1 max-w-md w-full relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input w-full pl-12 pr-4 bg-surfaceHighlight/30 focus:bg-surfaceHighlight/50 transition-all font-medium"
            />
          </div>

          <div className="hidden lg:flex items-center gap-2 p-1 bg-surfaceHighlight/30 border border-glass-border rounded-xl">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={difficultyFilter + categoryFilter + searchQuery + viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === 'list' ? (
            <div className="glass-panel overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-glass-border bg-surfaceHighlight/20">
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Status</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Challenge</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Difficulty</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Reward</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-glass-border">
                    {filteredAssignments.map((problem) => (
                      <tr key={problem._id} className="group hover:bg-surfaceHighlight/30 transition-all duration-300">
                        <td className="px-8 py-6">
                          {problem.isSolved ? (
                            <div className="w-10 h-10 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                              <CheckCircle2 className="w-5 h-5" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-gray-500 group-hover:border-primary/50 group-hover:text-primary transition-all">
                              <Circle className="w-5 h-5" />
                            </div>
                          )}
                        </td>
                        <td className="px-8 py-6">
                          <div className="space-y-1">
                            <h3 className="text-lg font-bold text-white group-hover:text-primary-glow transition-colors tracking-tight">{problem.title}</h3>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-surfaceHighlight px-2 py-0.5 rounded border border-glass-border">{problem.category}</span>
                              <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                              <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> 15 - 30 MINS</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest ${problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            problem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                              'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}>
                            {problem.difficulty}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl w-fit">
                            <Zap className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-xs font-black text-yellow-400">+{problem.points || 10} XP</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button
                            onClick={() => navigate(`/assignments/${problem._id}`)}
                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${problem.isSolved
                              ? 'bg-surfaceHighlight border border-glass-border text-gray-400 hover:text-white hover:bg-white/10'
                              : 'bg-primary text-white hover:bg-primary-glow shadow-lg shadow-primary/20'
                              }`}
                          >
                            {problem.isSolved ? 'Review' : 'Solve Challenge'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssignments.map((problem) => (
                <div key={problem._id} className="glass-card p-8 flex flex-col group hover:-translate-y-2 transition-transform duration-300">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-2xl ${problem.isSolved ? 'bg-green-500/20 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'bg-surfaceHighlight text-gray-400 border border-glass-border'}`}>
                      {problem.isSolved ? <CheckCircle2 className="w-6 h-6" /> : <Code2 className="w-6 h-6" />}
                    </div>
                    <span className={`px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      problem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                      {problem.difficulty}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-white mb-2 truncate tracking-tight group-hover:text-primary-glow transition-colors">{problem.title}</h3>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-8">{problem.category}</p>

                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-glass-border">
                    <div className="flex items-center gap-2 text-yellow-400">
                      <Zap className="w-4 h-4 fill-current" />
                      <span className="text-xs font-black">{problem.points || 10} XP</span>
                    </div>
                    <button
                      onClick={() => navigate(`/assignments/${problem._id}`)}
                      className="w-10 h-10 bg-surfaceHighlight border border-glass-border rounded-full flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all shadow-lg hover:shadow-primary/30"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredAssignments.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-24 h-24 bg-surfaceHighlight rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse border border-glass-border">
                <SearchX className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight mb-2">No Challenges Found</h3>
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">Adjust your filters to reveal new paths</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Assignments;
