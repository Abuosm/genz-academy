import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { User, Camera, Mail, Phone, Instagram, Linkedin, MapPin, Calendar, BookOpen, Briefcase, Award, Save, Share } from 'lucide-react';

const Profile = () => {
  const { user: authUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    whatsapp: '',
    parentMobile: '',
    instagram: '',
    linkedin: '',
    dob: '',
    gender: '',
    currentCity: '',
    currentState: '',
    nativeState: '',
    bio: '',
    profileImage: '',
    education: [],
    projects: [],
    certificates: []
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile');
      setProfile(res.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await api.put('/profile', profile);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'education', label: 'Education', icon: BookOpen },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'certificates', label: 'Certificates', icon: Award }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const calculateProgress = () => {
    let filled = 0;
    const fields = ['name', 'email', 'whatsapp', 'dob', 'gender', 'currentCity', 'linkedin'];
    fields.forEach(field => {
      if (profile[field]) filled++;
    });
    if (profile.education?.length > 0) filled++;
    if (profile.projects?.length > 0) filled++;
    if (profile.certificates?.length > 0) filled++;
    return Math.round((filled / 10) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-6">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
            <button className="absolute bottom-0 right-0 bg-white text-blue-600 p-2 rounded-full shadow-lg hover:bg-gray-100">
              <Camera className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1">{profile.name || 'Your Name'}</h1>
            <p className="text-blue-100 mb-4">{profile.email}</p>

            {/* Progress Bar */}
            <div className="max-w-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-blue-100">Profile Completion</span>
                <span className="text-sm font-semibold">{calculateProgress()}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-white rounded-full h-2 transition-all duration-500"
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <button className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 flex items-center gap-2">
              <Share className="w-4 h-4" />
              Share Profile
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800"
            >
              Generate Resume
            </button>
          </div>
        </div>
      </div>

      {/* Hidden Print Wrapper */}
      <div className="hidden print:block print:absolute print:inset-0 print:bg-white print:z-[9999] print:p-8">
        <div className="border-b-2 border-blue-600 pb-6 mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">{profile.name}</h1>
            <p className="text-blue-600 font-bold text-lg">{profile.currentCity}, {profile.currentState}</p>
          </div>
          <div className="text-right text-sm text-gray-600 font-medium">
            <p>{profile.email}</p>
            <p>{profile.whatsapp}</p>
            <p>{profile.linkedin}</p>
          </div>
        </div>

        {profile.bio && (
          <div className="mb-8">
            <h2 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-2">Professional Summary</h2>
            <p className="text-gray-700 leading-relaxed text-sm">{profile.bio}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8">
          {profile.education.length > 0 && (
            <div>
              <h2 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-4">Education</h2>
              <div className="space-y-4">
                {profile.education.map((edu, i) => (
                  <div key={i} className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                      <p className="text-sm text-gray-600">{edu.institution}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{edu.year}</p>
                      <p className="text-xs text-gray-500">{edu.grade}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {profile.projects.length > 0 && (
            <div>
              <h2 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-4 border-t pt-8">Projects</h2>
              <div className="space-y-6">
                {profile.projects.map((proj, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-gray-900">{proj.title}</h3>
                      <span className="text-xs text-blue-500 font-mono">{proj.link}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{proj.description}</p>
                    <div className="flex gap-2">
                      {Array.isArray(proj.technologies) && proj.technologies.map((t, ti) => (
                        <span key={ti} className="text-[10px] font-bold bg-gray-100 px-2 py-0.5 rounded uppercase tracking-tighter text-gray-600">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {profile.certificates.length > 0 && (
            <div>
              <h2 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-4 border-t pt-8">Certifications</h2>
              <div className="grid grid-cols-2 gap-4">
                {profile.certificates.map((cert, i) => (
                  <div key={i} className="flex flex-col">
                    <h3 className="font-bold text-sm text-gray-900">{cert.name}</h3>
                    <p className="text-xs text-gray-500">{cert.issuer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Generated via GenZ Academy Career Platform</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="border-b border-gray-200">
          <div className="flex gap-1 p-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={profile.gender || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email || ''}
                    onChange={handleInputChange}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mobile *</label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={profile.whatsapp || ''}
                    onChange={handleInputChange}
                    placeholder="+91"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp *</label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={profile.whatsapp || ''}
                    onChange={handleInputChange}
                    placeholder="+91"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">DOB</label>
                  <input
                    type="date"
                    name="dob"
                    value={profile.dob ? profile.dob.split('T')[0] : ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Parent/Guardian Mobile *</label>
                  <input
                    type="tel"
                    name="parentMobile"
                    value={profile.parentMobile || ''}
                    onChange={handleInputChange}
                    placeholder="+91"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Link *</label>
                  <input
                    type="url"
                    name="linkedin"
                    value={profile.linkedin || ''}
                    onChange={handleInputChange}
                    placeholder="https://www.linkedin.com/in/..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
                  <input
                    type="url"
                    name="instagram"
                    value={profile.instagram || ''}
                    onChange={handleInputChange}
                    placeholder="https://www.instagram.com/..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current City</label>
                  <input
                    type="text"
                    name="currentCity"
                    value={profile.currentCity || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current State</label>
                  <input
                    type="text"
                    name="currentState"
                    value={profile.currentState || ''}
                    onChange={handleInputChange}
                    placeholder="Karnataka"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Native State</label>
                  <input
                    type="text"
                    name="nativeState"
                    value={profile.nativeState || ''}
                    onChange={handleInputChange}
                    placeholder="Karnataka"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Education Tab */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">Educational Background</h3>
                <button
                  onClick={() => setProfile({ ...profile, education: [...profile.education, { degree: '', institution: '', year: '', grade: '' }] })}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  + Add Education
                </button>
              </div>

              {profile.education.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-500">No education details added yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {profile.education.map((edu, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-xl relative group">
                      <button
                        onClick={() => {
                          const newEdu = [...profile.education];
                          newEdu.splice(index, 1);
                          setProfile({ ...profile, education: newEdu });
                        }}
                        className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Remove
                      </button>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          placeholder="Degree (e.g. B.Tech)"
                          value={edu.degree}
                          onChange={(e) => {
                            const newEdu = [...profile.education];
                            newEdu[index].degree = e.target.value;
                            setProfile({ ...profile, education: newEdu });
                          }}
                          className="px-4 py-2 border border-gray-200 rounded-lg"
                        />
                        <input
                          placeholder="Institution"
                          value={edu.institution}
                          onChange={(e) => {
                            const newEdu = [...profile.education];
                            newEdu[index].institution = e.target.value;
                            setProfile({ ...profile, education: newEdu });
                          }}
                          className="px-4 py-2 border border-gray-200 rounded-lg"
                        />
                        <input
                          placeholder="Passing Year"
                          value={edu.year}
                          onChange={(e) => {
                            const newEdu = [...profile.education];
                            newEdu[index].year = e.target.value;
                            setProfile({ ...profile, education: newEdu });
                          }}
                          className="px-4 py-2 border border-gray-200 rounded-lg"
                        />
                        <input
                          placeholder="Grade/CGPA"
                          value={edu.grade}
                          onChange={(e) => {
                            const newEdu = [...profile.education];
                            newEdu[index].grade = e.target.value;
                            setProfile({ ...profile, education: newEdu });
                          }}
                          className="px-4 py-2 border border-gray-200 rounded-lg"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">My Projects</h3>
                <button
                  onClick={() => setProfile({ ...profile, projects: [...profile.projects, { title: '', description: '', technologies: '', link: '' }] })}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  + Add Project
                </button>
              </div>

              {profile.projects.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-500">No projects added yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {profile.projects.map((proj, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-xl relative group">
                      <button
                        onClick={() => {
                          const newProj = [...profile.projects];
                          newProj.splice(index, 1);
                          setProfile({ ...profile, projects: newProj });
                        }}
                        className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Remove
                      </button>
                      <div className="space-y-4">
                        <input
                          placeholder="Project Title"
                          value={proj.title}
                          onChange={(e) => {
                            const newProj = [...profile.projects];
                            newProj[index].title = e.target.value;
                            setProfile({ ...profile, projects: newProj });
                          }}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                        />
                        <textarea
                          placeholder="Project Description"
                          value={proj.description}
                          onChange={(e) => {
                            const newProj = [...profile.projects];
                            newProj[index].description = e.target.value;
                            setProfile({ ...profile, projects: newProj });
                          }}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                          rows="2"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            placeholder="Technologies (comma separated)"
                            value={Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                            onChange={(e) => {
                              const newProj = [...profile.projects];
                              newProj[index].technologies = e.target.value.split(',').map(t => t.trim());
                              setProfile({ ...profile, projects: newProj });
                            }}
                            className="px-4 py-2 border border-gray-200 rounded-lg"
                          />
                          <input
                            placeholder="Project Link"
                            value={proj.link}
                            onChange={(e) => {
                              const newProj = [...profile.projects];
                              newProj[index].link = e.target.value;
                              setProfile({ ...profile, projects: newProj });
                            }}
                            className="px-4 py-2 border border-gray-200 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Certificates Tab */}
          {activeTab === 'certificates' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">Certifications</h3>
                <button
                  onClick={() => setProfile({ ...profile, certificates: [...profile.certificates, { name: '', issuer: '', link: '' }] })}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  + Add Certificate
                </button>
              </div>

              {profile.certificates.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-500">No certificates added yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {profile.certificates.map((cert, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-xl relative group">
                      <button
                        onClick={() => {
                          const newCert = [...profile.certificates];
                          newCert.splice(index, 1);
                          setProfile({ ...profile, certificates: newCert });
                        }}
                        className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Remove
                      </button>
                      <div className="grid grid-cols-1 gap-4">
                        <input
                          placeholder="Certificate Name"
                          value={cert.name}
                          onChange={(e) => {
                            const newCert = [...profile.certificates];
                            newCert[index].name = e.target.value;
                            setProfile({ ...profile, certificates: newCert });
                          }}
                          className="px-4 py-2 border border-gray-200 rounded-lg"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            placeholder="Issuing Organization"
                            value={cert.issuer}
                            onChange={(e) => {
                              const newCert = [...profile.certificates];
                              newCert[index].issuer = e.target.value;
                              setProfile({ ...profile, certificates: newCert });
                            }}
                            className="px-4 py-2 border border-gray-200 rounded-lg"
                          />
                          <input
                            placeholder="Certificate Link"
                            value={cert.link}
                            onChange={(e) => {
                              const newCert = [...profile.certificates];
                              newCert[index].link = e.target.value;
                              setProfile({ ...profile, certificates: newCert });
                            }}
                            className="px-4 py-2 border border-gray-200 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-xl">
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2 mx-auto"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
