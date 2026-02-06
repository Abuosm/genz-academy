import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { Search, Heart, Filter, Briefcase, ArrowRight } from 'lucide-react';

const CompanyQuestions = () => {
  const [companies, setCompanies] = useState([]);
  const [favoriteCompanies, setFavoriteCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'favorites'

  useEffect(() => {
    fetchCompanies();
    fetchFavorites();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await api.get('/companies');
      setCompanies(res.data);
    } catch (err) {
      console.error("Error fetching companies:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await api.get('/companies/favorites/list');
      setFavoriteCompanies(res.data.map(c => c._id));
    } catch (err) {
      console.error("Error fetching favorites:", err);
    }
  };

  const toggleFavorite = async (companyId) => {
    try {
      const res = await api.post(`/companies/${companyId}/favorite`, {});

      // Update local state
      if (res.data.isFavorite) {
        setFavoriteCompanies([...favoriteCompanies, companyId]);
      } else {
        setFavoriteCompanies(favoriteCompanies.filter(id => id !== companyId));
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  // Get all unique tags
  const allTags = [...new Set(companies.flatMap(c => c.tags))];

  // Filter companies
  const getFilteredCompanies = () => {
    let filtered = activeTab === 'favorites'
      ? companies.filter(c => favoriteCompanies.includes(c._id))
      : companies;

    if (searchTerm) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTag) {
      filtered = filtered.filter(company =>
        company.tags.includes(selectedTag)
      );
    }

    return filtered;
  };

  const filteredCompanies = getFilteredCompanies();

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Company Questions</h1>
          <div className="flex gap-4 mt-2 text-sm">
            <button
              onClick={() => setActiveTab('all')}
              className={`font-black pb-1 uppercase text-[10px] tracking-widest ${activeTab === 'all' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Company Questions
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`font-black pb-1 uppercase text-[10px] tracking-widest ${activeTab === 'favorites' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Favorite Company Questions
            </button>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search Companies"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="text-center py-20">
          <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {activeTab === 'favorites' ? 'No favorite companies yet' : 'No companies found'}
          </h3>
          <p className="text-gray-500">
            {activeTab === 'favorites'
              ? 'Start adding companies to your favorites by clicking the heart icon'
              : 'Try adjusting your search or filters'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCompanies.map(company => (
            <div key={company._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer relative group">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(company._id);
                }}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
              >
                <Heart
                  className={`w-5 h-5 ${favoriteCompanies.includes(company._id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 mb-4 flex items-center justify-center">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=random`;
                    }}
                  />
                </div>

                <h3 className="font-semibold text-gray-900 mb-2">{company.name}</h3>

                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {company.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  to={`/company/${company._id}`}
                  className="w-full mt-auto px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-indigo-600/20"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyQuestions;
