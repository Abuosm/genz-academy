import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Bookmark, Building2, Book, Briefcase, HelpCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const res = await api.get('/upgrade/bookmarks');
      setBookmarks(res.data);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'course': return <Book className="w-5 h-5 text-blue-500" />;
      case 'company': return <Building2 className="w-5 h-5 text-purple-500" />;
      case 'job': return <Briefcase className="w-5 h-5 text-green-500" />;
      case 'question': return <HelpCircle className="w-5 h-5 text-orange-500" />;
      default: return <Bookmark className="w-5 h-5 text-gray-500" />;
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
        <h1 className="text-3xl font-bold text-gray-800">My Bookmarks</h1>
        <p className="text-gray-500">Quickly access the items you've saved across the platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookmarks.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nothing bookmarked yet. Start saving items you love!</p>
          </div>
        ) : (
          bookmarks.map((b, index) => (
            <Link
              key={index}
              to={b.type === 'company' ? `/company/${b.item._id}` : b.type === 'course' ? `/courses/${b.item._id}` : '#'}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                  {getIcon(b.type)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{b.item.name || b.item.title}</h3>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{b.type}</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600 transition-colors" />
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
