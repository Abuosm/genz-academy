import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { ArrowLeft, Play, Lock, CheckCircle } from 'lucide-react';

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
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Course not found/</h2>
        <Link to="/courses" className="text-blue-600 hover:underline mt-4 inline-block">Back to Courses</Link>
      </div>
    );
  }

  const currentModule = course.modules[activeModule];

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] md:flex-row gap-6">
      {/* Video Player Section - Main Content */}
      <div className="flex-1 flex flex-col bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex items-center gap-4">
          <Link to="/courses" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-800">{course.title}</h1>
            <p className="text-xs text-gray-500">{currentModule.title}</p>
          </div>
        </div>

        <div className="flex-1 bg-black relative flex items-center justify-center">
          {/* Responsive aspect ratio container */}
          <div className="w-full h-full">
            <iframe
              width="100%"
              height="100%"
              src={currentModule.videoUrl}
              title={currentModule.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-bold mb-2">{currentModule.title}</h2>
          <p className="text-gray-600">{course.description}</p>
        </div>
      </div>

      {/* Sidebar - Module List */}
      <div className="w-full md:w-80 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-800">Course Content</h3>
          <p className="text-xs text-gray-500">{activeModule + 1} of {course.modules.length} lessons</p>
        </div>

        <div className="overflow-y-auto flex-1 p-2 space-y-2">
          {course.modules.map((module, index) => (
            <button
              key={index}
              onClick={() => setActiveModule(index)}
              className={`w-full text-left p-3 rounded-lg flex items-start gap-3 transition-colors ${activeModule === index
                ? 'bg-blue-50 border border-blue-100'
                : 'hover:bg-gray-50 border border-transparent'
                }`}
            >
              <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${activeModule === index ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                {activeModule === index ? <Play className="w-3 h-3 ml-0.5" /> : index + 1}
              </div>
              <div>
                <h4 className={`text-sm font-medium ${activeModule === index ? 'text-blue-700' : 'text-gray-700'}`}>
                  {module.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{module.duration}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;
