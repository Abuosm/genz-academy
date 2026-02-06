import React, { useContext, useEffect, useState } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { TrendingUp, Trophy, Star, BookOpen, Building2, GraduationCap, Target } from 'lucide-react';

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Unable to load dashboard statistics.</p>
          <button
            onClick={fetchDashboardStats}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Founder's Thought Section - Enhanced Layout */}
      <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-100 group">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-indigo-50/50"></div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>

        <div className="relative z-10 p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Left Side - Founder Image */}
            <div className="flex-shrink-0">
              <div className="relative">
                {/* Animated ring effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 animate-pulse opacity-75 blur-sm"></div>

                {/* Image container */}
                <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                  <img
                    src="/assets/founder.jpg"
                    alt="Abubakar Osman"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Founder name badge */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-6 py-2 rounded-full shadow-lg border border-slate-100">
                  <p className="text-slate-900 font-bold text-sm whitespace-nowrap">Abubakar Osman</p>
                  <p className="text-indigo-600 text-xs text-center font-medium">Founder, GenZ Academy</p>
                </div>
              </div>
            </div>

            {/* Right Side - Quote Carousel */}
            <div className="flex-1 text-center md:text-left">
              {/* Header */}
              <div className="inline-flex items-center gap-2 mb-6 bg-indigo-500/5 px-4 py-2 rounded-full border border-indigo-500/10">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold tracking-wider text-indigo-600 uppercase">Founder's Thought</span>
              </div>

              {/* Carousel Container */}
              <div className="relative overflow-hidden min-h-[180px] mb-6">
                {founderThoughts.map((thought, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-1000 ${index === currentSlide
                      ? 'opacity-100 translate-x-0'
                      : index < currentSlide
                        ? 'opacity-0 -translate-x-full'
                        : 'opacity-0 translate-x-full'
                      }`}
                  >
                    <div className="relative">
                      <svg className="absolute -top-6 -left-2 w-12 h-12 text-indigo-500/10" fill="currentColor" viewBox="0 0 32 32">
                        <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2h2V8h-2zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2h2V8h-2z" />
                      </svg>

                      <p className="text-xl md:text-3xl font-black text-slate-900 leading-tight tracking-tight pl-8">
                        {thought.quote.split(' ').map((word, i) => {
                          const isHighlight = thought.highlight.some(h =>
                            word.toLowerCase().includes(h.toLowerCase().replace(/,/g, ''))
                          );
                          const colors = ['text-indigo-600', 'text-purple-600', 'text-pink-600'];
                          const colorIndex = thought.highlight.findIndex(h =>
                            word.toLowerCase().includes(h.toLowerCase().replace(/,/g, ''))
                          );
                          return (
                            <span
                              key={i}
                              className={isHighlight ? `${colors[colorIndex % colors.length]} font-extrabold` : ''}
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
                      ? 'w-10 h-2 bg-gradient-to-r from-indigo-500 to-purple-500'
                      : 'w-2 h-2 bg-slate-200 hover:bg-slate-300'
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Total Questions</span>
            <BookOpen className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tighter">{stats.stats.totalQuestions.toLocaleString()}</div>
          <p className="text-xs text-gray-500 mt-1">Across all companies</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Companies</span>
            <Building2 className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tighter">{stats.stats.totalCompanies}</div>
          <p className="text-xs text-gray-500 mt-1">{stats.stats.favoriteCompanies} favorited</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Interview Rounds</span>
            <Target className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tighter">{stats.stats.totalRounds}</div>
          <p className="text-xs text-gray-500 mt-1">Ready to practice</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Courses</span>
            <GraduationCap className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tighter">{stats.stats.totalCourses}</div>
          <p className="text-xs text-gray-500 mt-1">Available for learning</p>
        </div>
      </div>

      {/* Score and Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employability Score */}
        <div className="lg:col-span-1 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg shadow-indigo-600/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Employability Score</h3>
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-5xl font-bold mb-2">{stats.user.employabilityScore}%</div>
          <div className="text-blue-100 text-sm mb-4">Rank #{stats.user.rank} | {stats.user.leaderboardPoints} points</div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2"
              style={{ width: `${stats.user.employabilityScore}%` }}
            ></div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Top Performers</h3>
            <Trophy className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="space-y-3">
            {stats.leaderboard.map((leader) => (
              <div
                key={leader.rank}
                className={`flex items-center justify-between p-3 rounded-lg ${leader.isCurrentUser ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${leader.rank === 1 ? 'bg-yellow-500 text-white' :
                    leader.rank === 2 ? 'bg-gray-400 text-white' :
                      leader.rank === 3 ? 'bg-orange-600 text-white' :
                        'bg-gray-200 text-gray-700'
                    }`}>
                    {leader.rank}
                  </div>
                  <div>
                    <div className={`font-medium ${leader.isCurrentUser ? 'text-blue-700' : 'text-gray-900'}`}>
                      {leader.name} {leader.isCurrentUser && '(You)'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-semibold text-gray-900">{leader.points}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Solved Questions Section (LeetCode Style) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Progress Circular Visualization */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* SVG Circle for Progress (using simplified CSS for now) */}
            <div className="absolute inset-0 rounded-full border-[12px] border-gray-100"></div>
            <div
              className="absolute inset-0 rounded-full border-[12px] border-blue-600 border-t-transparent border-r-transparent transform -rotate-45"
              style={{ clipPath: `conic-gradient(#2563eb ${stats.user.accuracy || 0}%, transparent 0)` }}
            ></div>
            <div className="z-10 text-center">
              <p className="text-4xl font-black text-gray-900">{stats.user.solvedStats?.total || 0}</p>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest text-center mt-1">Solved</p>
              <div className="mt-2 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-tighter">
                {stats.user.accuracy || 0}% Accuracy
              </div>
            </div>
          </div>

          {/* Difficulty Breakdown */}
          <div className="flex-1 w-full space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <Target className="w-6 h-6 text-blue-600" />
                Solved Breakdown
              </h3>
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-xl border border-purple-100">
                <Trophy className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-black text-purple-700 tracking-tight">Global Rank #{stats.user.rank}</span>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Easy', count: stats.user.solvedStats?.Easy || 0, color: 'bg-green-500', bgColor: 'bg-green-50', textColor: 'text-green-600' },
                { label: 'Medium', count: stats.user.solvedStats?.Medium || 0, color: 'bg-yellow-500', bgColor: 'bg-yellow-50', textColor: 'text-yellow-600' },
                { label: 'Hard', count: stats.user.solvedStats?.Hard || 0, color: 'bg-red-500', bgColor: 'bg-red-50', textColor: 'text-red-600' }
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className={item.textColor}>{item.label}</span>
                    <span className="text-gray-900">{item.count} Questions</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full ${item.color} transition-all duration-1000`}
                      style={{ width: `${Math.min((item.count / 10) * 100, 100)}%` }} // Assuming 10 is target for each for visual
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Points/Leaderboard Teaser */}
          <div className="hidden lg:block w-64 bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <div className="space-y-4">
              <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase">Current Points</p>
                <p className="text-2xl font-black text-blue-600">{stats.user.leaderboardPoints}</p>
              </div>
              <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase">Global Rank</p>
                <p className="text-2xl font-black text-purple-600">#{stats.user.rank}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
