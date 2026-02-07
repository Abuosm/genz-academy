import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { CheckSquare, Clock, MapPin, Play, Award, Zap } from 'lucide-react';

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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Tests & Assessments</h1>
        <p className="text-gray-500">Measure your skills and prepare for interviews with our curated sets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <CheckSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No assessments available right now.</p>
          </div>
        ) : (
          tests.map(test => (
            <div key={test._id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white relative">
                <div className="absolute top-4 right-4 bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <Zap className="w-5 h-5 text-yellow-300" />
                </div>
                <h3 className="text-xl font-bold mb-1">{test.title}</h3>
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded">{test.category}</span>
              </div>
              <div className="p-6 flex-1 flex flex-col space-y-4">
                <p className="text-gray-600 text-sm">{test.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {test.duration} mins</div>
                  <div className="flex items-center gap-2"><Award className="w-4 h-4" /> {test.difficulty}</div>
                </div>
                <div className="pt-4 mt-auto">
                  <button
                    onClick={() => alert(`Starting assessment: ${test.title} (Feature coming soon!)`)}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" /> Start Assessment
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
