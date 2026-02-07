import React, { useContext, useEffect, useState } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { TrendingUp, Trophy, Star, BookOpen, Building2, GraduationCap, Target, Zap, Activity } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Founder's thought carousel data
  const founderThoughts = [
    {
      quote: "Your future is not written by your marks alone, but by your curiosity, consistency, and courage to keep learning.",
      highlight: ["curiosity", "consistency", "courage"]
    },
    {
      quote: "Success is not about being the best from day one. It's about being better than you were yesterday.",
      highlight: ["better than you were yesterday"]
    },
    {
      quote: "Every expert was once a beginner. Every master was once a disaster. Keep pushing forward.",
      highlight: ["Keep pushing forward"]
    },
    {
      quote: "The only limit to your growth is the extent of your willingness to learn and adapt.",
      highlight: ["willingness to learn and adapt"]
    }
  ];

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Auto-rotate carousel every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % founderThoughts.length);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [founderThoughts.length]);

  const fetchDashboardStats = async () => {
    try {
      const res = await api.get('/dashboard/comprehensive-stats');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="w-6 h-6 text-primary animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center glass-panel p-8 rounded-2xl">
          <p className="text-gray-400 mb-4">Unable to load dashboard statistics.</p>
          <button
            onClick={fetchDashboardStats}
            className="glass-button"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in pb-10">
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-1">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-glow to-secondary-glow">{user?.name}</span>
          </h1>
          <p className="text-gray-400 text-sm">Targeting top companies? Let's get to work.</p>
        </div>
        <div className="flex items-center gap-3 bg-surfaceHighlight/50 border border-glass-border px-4 py-2 rounded-xl backdrop-blur-md">
          <Zap className="w-5 h-5 text-yellow-400 fill-current" />
          <div>
            <span className="text-xs text-gray-400 uppercase font-bold block">Current Streak</span>
            <span className="text-lg font-mono font-bold text-white">3 Days</span>
          </div>
        </div>
      </div>

      {/* Founder's Thought Section - Enhanced Layout */}
      <div className="relative rounded-3xl overflow-hidden glass-panel group">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"></div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 p-8 md:p-10">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            {/* Left Side - Founder Image */}
            <div className="flex-shrink-0">
              <div className="relative group-hover:scale-105 transition-transform duration-500">
                {/* Animated ring effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary to-secondary animate-pulse-slow opacity-75 blur-md"></div>

                {/* Image container */}
                <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-surfaceHighlight shadow-2xl">
                  <img
                    src="/assets/founder.jpg"
                    alt="Abubakar Osman"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Founder name badge */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-surfaceHighlight/90 backdrop-blur-md px-6 py-2 rounded-full shadow-xl border border-glass-border whitespace-nowrap">
                  <p className="text-white font-bold text-sm">Abubakar Osman</p>
                  <p className="text-primary-glow text-[10px] text-center font-bold uppercase tracking-wider">Founder</p>
                </div>
              </div>
            </div>

            {/* Right Side - Quote Carousel */}
            <div className="flex-1 text-center md:text-left">
              {/* Header */}
              <div className="inline-flex items-center gap-2 mb-6 bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
                <div className="w-1.5 h-1.5 bg-primary-glow rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black tracking-widest text-primary-glow uppercase">Daily Inspiration</span>
              </div>

              {/* Carousel Container */}
              <div className="relative overflow-hidden min-h-[160px] mb-4">
                {founderThoughts.map((thought, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-700 ease-out ${index === currentSlide
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                      }`}
                  >
                    <div className="relative">
                      <svg className="absolute -top-6 -left-4 w-12 h-12 text-white/5" fill="currentColor" viewBox="0 0 32 32">
                        <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2h2V8h-2zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2h2V8h-2z" />
                      </svg>

                      <p className="text-xl md:text-2xl font-display font-medium text-gray-200 leading-relaxed tracking-tight pl-6">
                        {thought.quote.split(' ').map((word, i) => {
                          const isHighlight = thought.highlight.some(h =>
                            word.toLowerCase().includes(h.toLowerCase().replace(/,/g, ''))
                          );
                          const colors = ['text-primary-glow', 'text-secondary-glow', 'text-accent-glow'];
                          const colorIndex = thought.highlight.findIndex(h =>
                            word.toLowerCase().includes(h.toLowerCase().replace(/,/g, ''))
                          );
                          return (
                            <span
                              key={i}
                              className={isHighlight ? `${colors[colorIndex % colors.length]} font-bold drop-shadow-[0_0_10px_rgba(112,69,255,0.4)]` : ''}
                            >
                              {word}{' '}
                            </span>
                          );
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Dots */}
              <div className="flex gap-2 justify-center md:justify-start">
                {founderThoughts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`transition-all duration-300 rounded-full ${index === currentSlide
                      ? 'w-8 h-1.5 bg-gradient-to-r from-primary to-secondary'
                      : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { icon: BookOpen, label: 'Questions', value: stats.stats.totalQuestions.toLocaleString(), sub: 'Across all companies', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
          { icon: Building2, label: 'Companies', value: stats.stats.totalCompanies, sub: 'Top tech giants', color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
          { icon: Target, label: 'Rounds', value: stats.stats.totalRounds, sub: 'Interview scenarios', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
          { icon: GraduationCap, label: 'Courses', value: stats.stats.totalCourses, sub: 'Learning paths', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' }
        ].map((item, i) => (
          <div key={i} className="glass-card p-6 flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">{item.label}</span>
              <div className={`p-2 rounded-lg ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
                <item.icon className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-mono font-bold text-white tracking-tighter mb-1 group-hover:text-glow transition-all">{item.value}</div>
              <p className="text-[10px] text-gray-500 font-bold uppercase">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Score and Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employability Score */}
        <div className="lg:col-span-1 glass-card p-0 overflow-hidden relative border-none">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-surface"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <div className="relative z-10 p-8 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-bold text-white text-lg">Employability</h3>
                <p className="text-white/60 text-xs uppercase tracking-widest font-bold">Score Analysis</p>
              </div>
              <div className="bg-white/10 p-2 rounded-lg backdrop-blur-md">
                <TrendingUp className="w-5 h-5 text-green-300" />
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-white tracking-tighter">{stats.user.employabilityScore}</span>
                <span className="text-xl text-white/60 font-medium">%</span>
              </div>
              <div className="mt-4 flex gap-2">
                <div className="px-3 py-1 bg-black/20 rounded-lg text-xs font-bold text-white/90 border border-white/10">
                  Rank #{stats.user.rank}
                </div>
                <div className="px-3 py-1 bg-black/20 rounded-lg text-xs font-bold text-yellow-300 border border-yellow-500/20 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  {stats.user.leaderboardPoints} pts
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-white/80">
                <span>Progress</span>
                <span>Top 5%</span>
              </div>
              <div className="w-full bg-black/20 rounded-full h-2 overflow-hidden border border-white/10">
                <div
                  className="bg-secondary h-full rounded-full relative"
                  style={{ width: `${stats.user.employabilityScore}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                </div>
              </div>
              <p className="text-[10px] text-white/40 text-center mt-2">Update your profile & solve more to improve</p>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="lg:col-span-2 glass-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-white text-lg">Top Performers</h3>
              <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">Global Leaderboard</p>
            </div>
            <div className="px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-bold text-yellow-500 uppercase">Season 1</span>
            </div>
          </div>

          <div className="space-y-3">
            {stats.leaderboard.map((leader) => (
              <div
                key={leader.rank}
                className={`flex items-center justify-between p-4 rounded-xl transition-all ${leader.isCurrentUser
                  ? 'bg-primary/10 border border-primary/30 shadow-[0_0_15px_rgba(112,69,255,0.15)] transform scale-[1.02]'
                  : 'bg-surfaceHighlight/30 border border-transparent hover:border-glass-border hover:bg-surfaceHighlight/50'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm relative ${leader.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg' :
                      leader.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                        leader.rank === 3 ? 'bg-gradient-to-br from-orange-600 to-orange-700 text-white' :
                          'bg-surface border border-glass-border text-gray-500'
                    }`}>
                    {leader.rank <= 3 ? <Trophy className="w-5 h-5" /> : leader.rank}
                    {leader.rank === 1 && <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping"></div>}
                  </div>
                  <div>
                    <div className={`font-bold transition-colors ${leader.isCurrentUser ? 'text-primary-glow' : 'text-gray-200'}`}>
                      {leader.name} {leader.isCurrentUser && '(You)'}
                    </div>
                    {leader.rank === 1 && <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider">Current Champion</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/20 border border-white/5">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                  <span className="font-mono font-bold text-white">{leader.points}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Solved Questions Section */}
      <div className="glass-panel p-8">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Progress Circular Visualization */}
          <div className="relative w-48 h-48 flex items-center justify-center group shrink-0">
            {/* Background Circle */}
            <div className="absolute inset-0 rounded-full border-[10px] border-surfaceHighlight"></div>

            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

            {/* SVG Circle for Progress */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="86"
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                className="text-primary"
                strokeDasharray={2 * Math.PI * 86}
                strokeDashoffset={2 * Math.PI * 86 * (1 - (stats.user.accuracy || 0) / 100)}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <p className="text-5xl font-mono font-bold text-white tracking-tighter">{stats.user.solvedStats?.total || 0}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Solved</p>
              <div className="mt-3 px-3 py-1 bg-surfaceHighlight border border-glass-border rounded-full text-[10px] font-bold text-primary-glow uppercase tracking-tighter shadow-sm">
                Top {stats.user.accuracy > 80 ? '1%' : '10%'}
              </div>
            </div>
          </div>

          {/* Difficulty Breakdown */}
          <div className="flex-1 w-full space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Performance Analysis
                </h3>
                <p className="text-gray-400 text-xs mt-1">Accuracy Breakdown by Difficulty</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-mono font-bold text-white">{stats.user.accuracy}%</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Global Accuracy</p>
              </div>
            </div>

            <div className="space-y-6">
              {[
                { label: 'Easy', count: stats.user.solvedStats?.Easy || 0, color: 'bg-emerald-500', glow: 'shadow-[0_0_10px_rgba(16,185,129,0.4)]', textColor: 'text-emerald-400' },
                { label: 'Medium', count: stats.user.solvedStats?.Medium || 0, color: 'bg-amber-500', glow: 'shadow-[0_0_10px_rgba(245,158,11,0.4)]', textColor: 'text-amber-400' },
                { label: 'Hard', count: stats.user.solvedStats?.Hard || 0, color: 'bg-rose-500', glow: 'shadow-[0_0_10px_rgba(244,63,94,0.4)]', textColor: 'text-rose-400' }
              ].map((item) => (
                <div key={item.label} className="space-y-2 group">
                  <div className="flex justify-between items-end text-sm font-bold">
                    <span className={`${item.textColor} uppercase tracking-wider text-xs`}>{item.label}</span>
                    <span className="text-white font-mono">{item.count} <span className="text-gray-600 text-[10px] uppercase">Solved</span></span>
                  </div>
                  <div className="w-full bg-surfaceHighlight rounded-full h-2.5 overflow-hidden border border-white/5">
                    <div
                      className={`h-full ${item.color} ${item.glow} rounded-full transition-all duration-1000 group-hover:brightness-125`}
                      style={{ width: `${Math.min((item.count / 10) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
