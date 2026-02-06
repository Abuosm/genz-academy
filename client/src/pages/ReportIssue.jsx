import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { AlertCircle, Send, CheckCircle, Clock } from 'lucide-react';

const ReportIssue = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Bug',
    priority: 'Medium'
  });
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const res = await api.get('/support/issues');
      setIssues(res.data);
    } catch (err) {
      console.error('Error fetching issues:', err);
    }
  };

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/support/report', formData);
      setSuccess(true);
      setFormData({ title: '', description: '', category: 'Bug', priority: 'Medium' });
      fetchIssues();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error reporting issue:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <AlertCircle className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">Report an Issue</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Report Form */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-6">Submit a New Issue</h2>
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="e.g., Course video not loading"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={onChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="Bug">Bug</option>
                  <option value="Suggestion">Suggestion</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={onChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={onChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Please describe the issue in detail..."
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : <><Send className="w-4 h-4" /> Submit Report</>}
            </button>
            {success && (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-lg animate-fade-in">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Issue reported successfully!</span>
              </div>
            )}
          </form>
        </div>

        {/* History */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Your Previous Reports</h2>
          <div className="space-y-4">
            {issues.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500">No issues reported yet.</p>
              </div>
            ) : (
              issues.map(issue => (
                <div key={issue._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${issue.priority === 'High' ? 'bg-red-100 text-red-600' :
                      issue.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                      {issue.priority}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">{issue.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{issue.description}</p>
                  <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-400 capitalize">{issue.category}</span>
                    <span className={`text-xs font-bold ${issue.status === 'Open' ? 'text-blue-500' :
                      issue.status === 'Resolved' ? 'text-green-500' : 'text-orange-500'
                      }`}>
                      {issue.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;
