import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { CheckSquare, Clock, MapPin, Play, Award, Zap, AlertTriangle } from 'lucide-react';

const Tests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const res = await api.get('/upgrade/tests');
      setTests(res.data);
    } catch (err) {
      console.error('Error fetching tests:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in pb-10">
      <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-display font-bold text-white mb-2">Tests & Assessments</h1>
          <p className="text-gray-400 max-w-xl">
            Measure your skills and prepare for interviews with our curated sets.
            Earn badges and boost your employability score.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.length === 0 ? (
          <div className="col-span-full py-16 text-center glass-panel rounded-2xl border-dashed border-glass-border">
            <CheckSquare className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No active assessments</h3>
            <p className="text-gray-500">Check back later for new challenges.</p>
          </div>
        ) : (
          tests.map(test => (
            <div key={test._id} className="glass-card flex flex-col group hover:-translate-y-2 transition-transform duration-300">
              {/* Header Gradient */}
              <div className="h-32 bg-gradient-to-br from-primary/80 to-secondary/80 p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-20"></div>
                <div className="absolute top-4 right-4 bg-white/20 p-2 rounded-lg backdrop-blur-md shadow-lg">
                  <Zap className="w-5 h-5 text-yellow-300 fill-current" />
                </div>
                <div className="relative z-10 flex flex-col justify-end h-full">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-black/30 w-fit px-2 py-1 rounded text-white mb-2 backdrop-blur-sm">
                    {test.category}
                  </span>
                  <h3 className="text-xl font-bold text-white leading-tight shadow-black drop-shadow-md">{test.title}</h3>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col space-y-4">
                <p className="text-gray-400 text-sm leading-relaxed">{test.description}</p>

                <div className="grid grid-cols-2 gap-4 text-xs font-bold text-gray-500 border-t border-glass-border pt-4 mt-auto">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-secondary-glow" />
                    <span>{test.duration} mins</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-primary-glow" />
                    <span>{test.difficulty}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => alert(`Starting assessment: ${test.title} (Feature coming soon!)`)}
                    className="w-full glass-button flex items-center justify-center gap-2 group-hover:bg-primary group-hover:shadow-primary/30 transition-all"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Start Assessment
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tests;
