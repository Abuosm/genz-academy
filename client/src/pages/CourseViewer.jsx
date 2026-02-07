import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { ArrowLeft, Play, Lock, CheckCircle, Clock, BookOpen, AlertCircle, ChevronRight, Zap } from 'lucide-react';

const CourseViewer = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [activeModule, setActiveModule] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data);
      } catch (err) {
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <div className="w-20 h-20 bg-surfaceHighlight rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Course not found</h2>
        <p className="text-gray-400 mb-8 max-w-md">The course you are looking for might have been removed or is temporarily unavailable.</p>
        <Link to="/courses" className="glass-button flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </Link>
      </div>
    );
  }

  const currentModule = course.modules[activeModule];

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-6rem)] animate-in">
      {/* Video Player Section - Main Content */}
      <div className="flex-1 flex flex-col glass-panel overflow-hidden relative">
        {/* Header */}
        <div className="p-4 border-b border-glass-border flex items-center gap-4 bg-surfaceHighlight/30 backdrop-blur-md z-10">
          <Link to="/courses" className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white border border-transparent hover:border-glass-border">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-white flex items-center gap-3">
              {course.title}
              <span className="text-[10px] font-black uppercase tracking-widest bg-primary/20 text-primary-glow px-2 py-0.5 rounded border border-primary/30">
                Playing
              </span>
            </h1>
            <p className="text-xs text-gray-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              {currentModule.title}
            </p>
          </div>
        </div>

        {/* Video Container */}
        <div className="flex-1 bg-black relative flex items-center justify-center group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-20 pointer-events-none"></div>

          {/* Responsive aspect ratio container */}
          <div className="w-full h-full relative z-10">
            <iframe
              width="100%"
              height="100%"
              src={currentModule.videoUrl}
              title={currentModule.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            ></iframe>
          </div>
        </div>

        {/* Description / Metadata */}
        <div className="p-6 bg-surfaceHighlight/10 backdrop-blur-sm border-t border-glass-border">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400 fill-current" />
                {currentModule.title}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed max-w-4xl">{course.description}</p>
            </div>
            <div className="hidden md:flex gap-3">
              <button className="px-4 py-2 bg-surfaceHighlight border border-glass-border rounded-xl text-xs font-bold text-white hover:bg-primary/20 transition-colors uppercase tracking-wider">
                Resources
              </button>
              <button className="px-4 py-2 bg-surfaceHighlight border border-glass-border rounded-xl text-xs font-bold text-white hover:bg-primary/20 transition-colors uppercase tracking-wider">
                Notes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Module List */}
      <div className="w-full lg:w-96 glass-panel flex flex-col h-[500px] lg:h-full overflow-hidden">
        <div className="p-5 border-b border-glass-border bg-surfaceHighlight/30 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Course Content
            </h3>
            <span className="text-xs font-bold text-gray-500 bg-black/30 px-2 py-1 rounded-lg border border-white/5">
              {Math.round(((activeModule + 1) / course.modules.length) * 100)}% Completed
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-black/30 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-500 relative"
              style={{ width: `${((activeModule + 1) / course.modules.length) * 100}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
          </div>
          <p className="text-[10px] text-gray-500 mt-2 text-right uppercase tracking-wider font-bold">
            {activeModule + 1} of {course.modules.length} lessons
          </p>
        </div>

        <div className="overflow-y-auto flex-1 p-3 space-y-2 custom-scrollbar">
          {course.modules.map((module, index) => (
            <button
              key={index}
              onClick={() => setActiveModule(index)}
              className={`w-full text-left p-4 rounded-xl flex items-center gap-4 transition-all relative group overflow-hidden ${activeModule === index
                  ? 'bg-primary/10 border border-primary/30 shadow-[0_0_15px_rgba(112,69,255,0.1)]'
                  : 'bg-surfaceHighlight/20 border border-transparent hover:bg-surfaceHighlight/40 hover:border-glass-border'
                }`}
            >
              {/* Active Indicator Line */}
              {activeModule === index && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-primary rounded-r-full shadow-[0_0_10px_#7045ff]"></div>
              )}

              {/* Icon/Number */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all relative z-10 ${activeModule === index
                  ? 'bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg'
                  : 'bg-surfaceHighlight border border-glass-border text-gray-500 group-hover:text-white'
                }`}>
                {activeModule === index ? <Play className="w-3 h-3 fill-current ml-0.5" /> : index + 1}
              </div>

              {/* Text Info */}
              <div className="flex-1 relative z-10">
                <h4 className={`text-sm font-bold transition-colors ${activeModule === index ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                  }`}>
                  {module.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-3 h-3 text-gray-600" />
                  <span className="text-[10px] text-gray-600 font-medium uppercase tracking-wider">{module.duration}</span>
                </div>
              </div>

              {/* Status Icon */}
              <div className="relative z-10">
                {activeModule > index ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : activeModule === index ? (
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                ) : (
                  <Lock className="w-3 h-3 text-gray-700" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;
