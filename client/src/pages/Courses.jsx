import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, PlayCircle, Video, Search, Zap, Star } from 'lucide-react';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses');
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="space-y-8 animate-in pb-10">
      {/* Header Banner with Embedded Video - Premium Glass Design */}
      <div className="glass-panel overflow-hidden relative group rounded-3xl">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-60"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>

        <div className="relative z-10 flex flex-col lg:flex-row">
          {/* Left Content */}
          <div className="p-8 md:p-12 lg:w-7/12 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="px-3 py-1 bg-surfaceHighlight border border-glass-border rounded-full flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white">Start Learning Today</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-white tracking-tighter mb-6 leading-tight">
              Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-glow to-secondary-glow">Future</span>
            </h1>

            <p className="text-gray-400 text-lg mb-8 max-w-xl leading-relaxed">
              Explore our premium courses designed to help you crack top tech interviews.
              Watch the introduction video to get a sneak peek into your learning journey.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button className="glass-button w-full sm:w-auto flex items-center justify-center gap-2 group">
                <Video className="w-4 h-4 group-hover:text-white transition-colors" />
                <span>Watch Intro</span>
              </button>

              <div className="relative w-full sm:w-auto flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="glass-input w-full pl-10 bg-surfaceHighlight/50 focus:bg-surfaceHighlight transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Right Video Content */}
          <div className="lg:w-5/12 min-h-[300px] lg:min-h-auto bg-black relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background/50 z-10 pointer-events-none lg:block hidden"></div>
            <iframe
              className="absolute inset-0 w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-500"
              src="https://www.youtube.com/embed/m2Ux2PnJe6E?rel=0&controls=0&showinfo=0"
              title="Founder Intro"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl">
                <PlayCircle className="w-10 h-10 text-white fill-current opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCourses.map((course, index) => (
          <div
            key={course._id}
            className="glass-card flex flex-col overflow-hidden group hover:-translate-y-2 transition-transform duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Thumbnail Section */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80"></div>

              {/* Floating Badge */}
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-wider text-white flex items-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-400 fill-current" />
                  Premium
                </span>
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <Link
                  to={`/courses/${course._id}`}
                  className="w-14 h-14 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-lg shadow-primary/40 hover:scale-110 transition-transform backdrop-blur-sm border border-white/20"
                >
                  <PlayCircle className="w-7 h-7 fill-current" />
                </Link>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex-1 flex flex-col relative">
              <div className="mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-secondary-glow bg-secondary/10 px-2.5 py-1 rounded-md border border-secondary/20">
                  {course.category}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-primary-glow transition-colors" title={course.title}>
                {course.title}
              </h3>

              <p className="text-sm text-gray-400 mb-6 line-clamp-2 leading-relaxed">
                {course.description}
              </p>

              <div className="mt-auto space-y-4">
                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs font-medium text-gray-500 border-t border-glass-border pt-4">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{course.modulesCount} modules</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                {/* Rating (Mock) */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} className="w-3 h-3 text-yellow-500 fill-current" />
                  ))}
                  <span className="text-[10px] text-gray-500 ml-1">(4.9)</span>
                </div>

                <Link
                  to={`/courses/${course._id}`}
                  className="w-full flex items-center justify-center py-3 rounded-xl bg-surfaceHighlight border border-glass-border text-white text-xs font-bold uppercase tracking-widest hover:bg-primary hover:border-primary transition-all shadow-lg hover:shadow-primary/25"
                >
                  Start Course
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-surfaceHighlight rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Search className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No courses found</h3>
          <p className="text-gray-400">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
};

export default Courses;
