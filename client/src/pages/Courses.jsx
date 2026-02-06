import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, ChevronRight, PlayCircle, Video } from 'lucide-react';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      {/* Header Banner with Embedded Video */}
      <div className="bg-gradient-to-br from-indigo-50 via-white to-indigo-50 rounded-[2rem] overflow-hidden shadow-sm border border-indigo-100">
        <div className="flex flex-col md:flex-row">
          {/* Left Content */}
          <div className="p-8 md:p-14 flex-1 flex flex-col justify-center relative z-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">
              Welcome to the <span className="text-indigo-600">Course Section</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium mb-8 max-w-lg leading-relaxed">
              Explore our wide range of courses designed to help you master new skills.
              Watch the introduction video to get started on your learning journey.
            </p>

            <div className="mt-2">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-500/5 border border-indigo-500/10 rounded-full text-indigo-600 text-sm font-black uppercase tracking-widest">
                <Video className="w-4 h-4" />
                <span>Watch Intro Video</span>
              </div>
            </div>

            <div className="mt-10">
              <input
                type="text"
                placeholder="Search for course..."
                className="w-full md:w-96 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder-slate-400 font-bold"
              />
            </div>
          </div>

          {/* Right Video Content */}
          <div className="relative md:w-1/2 lg:w-5/12 min-h-[300px] md:min-h-auto bg-black">
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/WUWVumrvlS8?rel=0"
              title="Founder Intro"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map(course => (
          <div key={course._id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col">
            <div className="relative group">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Link
                  to={`/courses/${course._id}`}
                  className="bg-white/90 text-gray-900 rounded-full p-3 transform hover:scale-110 transition-transform"
                >
                  <PlayCircle className="w-8 h-8 text-blue-600" />
                </Link>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <div className="mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                  {course.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1" title={course.title}>{course.title}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{course.description}</p>

              <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.modulesCount} modules</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
              </div>

              <Link
                to={`/courses/${course._id}`}
                className="mt-6 w-full block text-center py-3 rounded-2xl bg-indigo-600 text-white font-black uppercase text-[10px] tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
              >
                Get Started →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No courses available at the moment.
        </div>
      )}


    </div>
  );
};

export default Courses;
