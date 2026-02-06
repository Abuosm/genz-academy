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
  SearchX
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
      <div className="w-12 h-12 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-6 px-4 pb-20">
      {/* Premium Hero Header */}
      <section className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-indigo-50 via-white to-indigo-50 border border-indigo-100 shadow-xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[100px] -ml-40 -mb-40"></div>

        <div className="relative z-10 p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-6 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/5 border border-indigo-500/10 rounded-full">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">GenZ Mastery Track</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">
              Solve the World's<br />
              <span className="text-indigo-600">Elite Coding</span> Challenges
            </h1>
            <p className="text-slate-500 text-lg font-medium">
              125+ industrial-grade problems curated by experts to help you ace your interviews at MAANG and beyond.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20">
                Start Daily Challenge
              </button>
              <button className="px-8 py-3 bg-white hover:bg-slate-50 text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest transition-all border border-slate-200 shadow-sm">
                View Roadmap
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            {[
              { label: 'Rank', value: `#${userStats?.rank || 0}`, icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
              { label: 'Accuracy', value: `${userStats?.accuracy || 0}%`, icon: Target, color: 'text-purple-500', bg: 'bg-purple-500/10' },
              { label: 'Points', value: userStats?.leaderboardPoints || 0, icon: Zap, color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { label: 'Solved', value: `${userStats?.assignmentsCompleted || 0}/${assignments.length}`, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' }
            ].map((stat, i) => (
              <div key={i} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Controls Bar */}
      <section className="sticky top-4 z-40">
        <div className="bg-white/80 backdrop-blur-xl border border-gray-100 shadow-xl shadow-gray-200/20 rounded-3xl p-4 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-2">
            <div className="mr-4 flex bg-gray-100 p-1 rounded-xl">
              {['All', 'Easy', 'Medium', 'Hard'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setDifficultyFilter(lvl)}
                  className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${difficultyFilter === lvl ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-900'
                    }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
            <div className="h-6 w-[1px] bg-gray-200 hidden lg:block"></div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-black uppercase tracking-widest text-gray-600 outline-none focus:ring-2 focus:ring-blue-500/10 transition-all cursor-pointer"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="flex flex-1 max-w-md w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search problems by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold placeholder:text-gray-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
            />
          </div>

          <div className="hidden lg:flex items-center gap-2 p-1 bg-gray-100 rounded-xl">
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>
              <ListIcon className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>
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
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-50">
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Challenge</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Difficulty</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Experience</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredAssignments.map((problem) => (
                      <tr key={problem._id} className="group hover:bg-blue-50/40 transition-all duration-300">
                        <td className="px-8 py-6">
                          {problem.isSolved ? (
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform shadow-lg shadow-green-500/20">
                              <CheckCircle2 className="w-5 h-5" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-gray-50 border-2 border-dashed border-gray-200 rounded-full flex items-center justify-center text-gray-300 group-hover:border-blue-500 group-hover:text-blue-500 transition-all">
                              <Circle className="w-5 h-5" />
                            </div>
                          )}
                        </td>
                        <td className="px-8 py-6">
                          <div className="space-y-1">
                            <h3 className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight">{problem.title}</h3>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{problem.category}</span>
                              <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                              <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> 15 - 30 MINS</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${problem.difficulty === 'Easy' ? 'bg-green-500/10 text-green-600' :
                            problem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-600' :
                              'bg-red-500/10 text-red-600'
                            }`}>
                            {problem.difficulty}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl w-fit group-hover:bg-white transition-colors">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            <span className="text-xs font-black text-gray-700">+{problem.points || 10} XP</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button
                            onClick={() => navigate(`/assignments/${problem._id}`)}
                            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${problem.isSolved
                              ? 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20'
                              }`}
                          >
                            {problem.isSolved ? 'Review' : 'Begin'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAssignments.map((problem) => (
                <div key={problem._id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-4 rounded-[1.5rem] ${problem.isSolved ? 'bg-green-500 text-white shadow-xl shadow-green-500/20' : 'bg-gray-50 text-gray-300'}`}>
                      {problem.isSolved ? <CheckCircle2 className="w-6 h-6" /> : <Code2 className="w-6 h-6" />}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${problem.difficulty === 'Easy' ? 'bg-green-500/10 text-green-600' :
                      problem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-600' :
                        'bg-red-500/10 text-red-600'
                      }`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2 truncate tracking-tight">{problem.title}</h3>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8">{problem.category}</p>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-yellow-500">
                      <Zap className="w-4 h-4" />
                      <span className="text-xs font-black">{problem.points || 10} XP</span>
                    </div>
                    <button
                      onClick={() => navigate(`/assignments/${problem._id}`)}
                      className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-700 shadow-lg transition-all"
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
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                <SearchX className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">No Challenges Found</h3>
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">Adjust your filters to reveal new paths</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Assignments;
