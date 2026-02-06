import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { ArrowLeft, Briefcase, HelpCircle, CheckCircle } from 'lucide-react';

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await api.get(`/companies/${id}`);
        setCompany(res.data);
      } catch (err) {
        console.error("Error fetching company:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Company not found</h2>
        <button onClick={() => navigate('/company-questions')} className="text-blue-600 mt-4 hover:underline">
          Back to Companies
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/company-questions')}
          className="flex items-center text-gray-500 hover:text-gray-700 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Companies
        </button>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="w-20 h-20 rounded-lg border border-gray-100 flex items-center justify-center bg-white p-2 overflow-hidden shadow-sm">
            <img
              src={company.logo}
              alt={company.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${company.name.replace(' ', '+')}&background=f3f4f6&color=4b5563&font-size=0.4`;
              }}
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
            <div className="flex gap-2 mt-2">
              {company.tags.map((tag, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interview Rounds */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Interview Experiences & Questions</h2>
        </div>

        {company.interviewRounds && company.interviewRounds.length > 0 ? (
          company.interviewRounds.map((round, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </div>
                <h3 className="font-bold text-lg text-gray-800">{round.roundName}</h3>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  {round.questions.map((question, qIdx) => (
                    <li key={qIdx} className="flex items-start gap-3 group">
                      <HelpCircle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0 group-hover:text-blue-500 transition-colors" />
                      <span className="text-gray-700 font-medium leading-relaxed">{question}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-blue-50 rounded-xl p-8 text-center border border-blue-100">
            <p className="text-blue-800 font-medium">No interview questions added yet for this company.</p>
            <p className="text-blue-600 text-sm mt-2">Check back later or contribute your own experience!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetails;
