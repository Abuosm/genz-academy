import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { User, Camera, Mail, Phone, Instagram, Linkedin, MapPin, Calendar, BookOpen, Briefcase, Award, Save, Share, Loader, ExternalLink } from 'lucide-react';

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
      // Optional: Add a toast notification here
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
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
    <div className="space-y-8 animate-in pb-10">
      {/* Header Section */}
      <div className="glass-panel p-8 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-50"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          {/* Profile Image */}
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-surfaceHighlight shadow-2xl overflow-hidden bg-surface relative z-10">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt={profile.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-surfaceHighlight">
                  <User className="w-16 h-16 text-gray-500" />
                </div>
              )}
            </div>
            {/* Animated Ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary to-secondary animate-pulse-slow blur-md opacity-75 -z-0 transform scale-105"></div>

            <button className="absolute bottom-2 right-2 z-20 bg-surfaceHighlight text-white p-2.5 rounded-full shadow-lg border border-glass-border hover:bg-primary transition-colors">
              <Camera className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-display font-bold text-white mb-2">{profile.name || 'Your Name'}</h1>
            <p className="text-gray-400 mb-6 flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4" /> {profile.email}
            </p>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto md:mx-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-primary-glow uppercase tracking-wider">Profile Completion</span>
                <span className="text-xs font-bold text-white">{calculateProgress()}%</span>
              </div>
              <div className="w-full bg-surfaceHighlight rounded-full h-2 overflow-hidden border border-white/5">
                <div
                  className="bg-gradient-to-r from-primary to-secondary h-full rounded-full relative"
                  style={{ width: `${calculateProgress()}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 min-w-[160px]">
            <button className="glass-button py-2.5 text-sm flex items-center justify-center gap-2 w-full hover:bg-primary/80">
              <Share className="w-4 h-4" />
              Share Publicly
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-surfaceHighlight border border-glass-border text-white rounded-xl text-sm font-bold hover:bg-white/5 transition-colors flex items-center justify-center gap-2 w-full group"
            >
              <FileText className="w-4 h-4 group-hover:text-primary-glow" />
              Resume View
            </button>
          </div>
        </div>
      </div>

      {/* Hidden Print Wrapper (Optimized for printing) */}
      <div className="hidden print:block print:absolute print:inset-0 print:bg-white print:z-[9999] print:p-12">
        <div className="border-b-2 border-black pb-8 mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-black text-black uppercase tracking-tighter mb-2">{profile.name}</h1>
            <p className="text-gray-600 font-bold text-xl">{profile.currentCity}, {profile.currentState}</p>
          </div>
          <div className="text-right text-sm text-gray-600 font-medium">
            <p>{profile.email}</p>
            <p>{profile.whatsapp}</p>
            <p>{profile.linkedin}</p>
          </div>
        </div>

        {profile.bio && (
          <div className="mb-10">
            <h2 className="text-sm font-black text-black uppercase tracking-widest mb-3 border-b border-gray-200 pb-1">Professional Summary</h2>
            <p className="text-gray-800 leading-relaxed text-sm text-justify">{profile.bio}</p>
          </div>
        )}

        {profile.education.length > 0 && (
          <div className="mb-10">
            <h2 className="text-sm font-black text-black uppercase tracking-widest mb-4 border-b border-gray-200 pb-1">Education</h2>
            <div className="space-y-4">
              {profile.education.map((edu, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{edu.institution}</h3>
                    <p className="text-sm text-gray-700 italic">{edu.degree}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{edu.year}</p>
                    <p className="text-xs text-gray-600 font-medium">Grade: {edu.grade}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {profile.projects.length > 0 && (
          <div className="mb-10">
            <h2 className="text-sm font-black text-black uppercase tracking-widest mb-4 border-b border-gray-200 pb-1">Projects</h2>
            <div className="space-y-6">
              {profile.projects.map((proj, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-900">{proj.title}</h3>
                    <span className="text-xs text-gray-500 font-mono">{proj.link}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{proj.description}</p>
                  <div className="flex gap-2">
                    {Array.isArray(proj.technologies) && proj.technologies.map((t, ti) => (
                      <span key={ti} className="text-[10px] font-bold bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wide text-gray-600 border border-gray-200">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="glass-panel p-1 md:p-2 overflow-hidden">
        <div className="flex border-b border-glass-border">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all relative ${isActive
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                  }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary-glow' : ''}`} />
                <span className="hidden md:inline">{tab.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-secondary shadow-[0_0_10px_#7045ff]"></div>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-6 md:p-8">
          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name || ''}
                  onChange={handleInputChange}
                  className="glass-input w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
                <input
                  type="email"
                  value={profile.email || ''}
                  disabled
                  className="glass-input w-full opacity-50 cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Gender</label>
                <select
                  name="gender"
                  value={profile.gender || ''}
                  onChange={handleInputChange}
                  className="glass-input w-full appearance-none"
                  style={{ colorScheme: 'dark' }} // Hacks consistent dark styling for select
                >
                  <option value="" className="bg-surface text-gray-400">Select Gender</option>
                  <option value="Male" className="bg-surface text-white">Male</option>
                  <option value="Female" className="bg-surface text-white">Female</option>
                  <option value="Other" className="bg-surface text-white">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Phone / WhatsApp</label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={profile.whatsapp || ''}
                  onChange={handleInputChange}
                  placeholder="+91"
                  className="glass-input w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={profile.dob ? profile.dob.split('T')[0] : ''}
                  onChange={handleInputChange}
                  className="glass-input w-full"
                  style={{ colorScheme: 'dark' }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Parent's/Guardian Mobile</label>
                <input
                  type="tel"
                  name="parentMobile"
                  value={profile.parentMobile || ''}
                  onChange={handleInputChange}
                  placeholder="+91"
                  className="glass-input w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">LinkedIn Profile</label>
                <div className="relative">
                  <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                  <input
                    type="url"
                    name="linkedin"
                    value={profile.linkedin || ''}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/..."
                    className="glass-input w-full pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Instagram Profile</label>
                <div className="relative">
                  <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
                  <input
                    type="url"
                    name="instagram"
                    value={profile.instagram || ''}
                    onChange={handleInputChange}
                    placeholder="https://instagram.com/..."
                    className="glass-input w-full pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Current City</label>
                <input
                  type="text"
                  name="currentCity"
                  value={profile.currentCity || ''}
                  onChange={handleInputChange}
                  className="glass-input w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Current State</label>
                <input
                  type="text"
                  name="currentState"
                  value={profile.currentState || ''}
                  onChange={handleInputChange}
                  className="glass-input w-full"
                />
              </div>

              <div className="col-span-1 md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Professional Bio</label>
                <textarea
                  name="bio"
                  value={profile.bio || ''}
                  onChange={handleInputChange}
                  rows="4"
                  className="glass-input w-full"
                  placeholder="Tell us about your career goals and interests..."
                />
              </div>
            </div>
          )}

          {/* Education Tab */}
          {activeTab === 'education' && (
            <div className="space-y-6 animate-in">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-white">Education History</h3>
                  <p className="text-xs text-gray-400">Add your academic qualifications here</p>
                </div>
                <button
                  onClick={() => setProfile({ ...profile, education: [...profile.education, { degree: '', institution: '', year: '', grade: '' }] })}
                  className="px-4 py-2 bg-primary/20 text-primary-glow hover:bg-primary/30 rounded-lg text-xs font-bold uppercase tracking-wider border border-primary/30 transition-colors"
                >
                  + Add Education
                </button>
              </div>

              {profile.education.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-xl border border-dashed border-white/10">
                  <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-gray-400">No education details added yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {profile.education.map((edu, index) => (
                    <div key={index} className="p-6 bg-surfaceHighlight/30 border border-glass-border rounded-xl relative group">
                      <button
                        onClick={() => {
                          const newEdu = [...profile.education];
                          newEdu.splice(index, 1);
                          setProfile({ ...profile, education: newEdu });
                        }}
                        className="absolute top-4 right-4 text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold uppercase tracking-wider bg-black/20 px-2 py-1 rounded"
                      >
                        Remove
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Degree</label>
                          <input
                            placeholder="e.g. B.Tech Computer Science"
                            value={edu.degree}
                            onChange={(e) => {
                              const newEdu = [...profile.education];
                              newEdu[index].degree = e.target.value;
                              setProfile({ ...profile, education: newEdu });
                            }}
                            className="glass-input w-full"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Institution</label>
                          <input
                            placeholder="University / College Name"
                            value={edu.institution}
                            onChange={(e) => {
                              const newEdu = [...profile.education];
                              newEdu[index].institution = e.target.value;
                              setProfile({ ...profile, education: newEdu });
                            }}
                            className="glass-input w-full"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Passing Year</label>
                          <input
                            placeholder="e.g. 2024"
                            value={edu.year}
                            onChange={(e) => {
                              const newEdu = [...profile.education];
                              newEdu[index].year = e.target.value;
                              setProfile({ ...profile, education: newEdu });
                            }}
                            className="glass-input w-full"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Grade / CGPA</label>
                          <input
                            placeholder="e.g. 9.5 CGPA"
                            value={edu.grade}
                            onChange={(e) => {
                              const newEdu = [...profile.education];
                              newEdu[index].grade = e.target.value;
                              setProfile({ ...profile, education: newEdu });
                            }}
                            className="glass-input w-full"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-6 animate-in">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-white">Project Showcase</h3>
                  <p className="text-xs text-gray-400">Technical projects you've built</p>
                </div>
                <button
                  onClick={() => setProfile({ ...profile, projects: [...profile.projects, { title: '', description: '', technologies: '', link: '' }] })}
                  className="px-4 py-2 bg-primary/20 text-primary-glow hover:bg-primary/30 rounded-lg text-xs font-bold uppercase tracking-wider border border-primary/30 transition-colors"
                >
                  + Add Project
                </button>
              </div>

              {profile.projects.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-xl border border-dashed border-white/10">
                  <Briefcase className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-gray-400">No projects added yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {profile.projects.map((proj, index) => (
                    <div key={index} className="p-6 bg-surfaceHighlight/30 border border-glass-border rounded-xl relative group">
                      <button
                        onClick={() => {
                          const newProj = [...profile.projects];
                          newProj.splice(index, 1);
                          setProfile({ ...profile, projects: newProj });
                        }}
                        className="absolute top-4 right-4 text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold uppercase tracking-wider bg-black/20 px-2 py-1 rounded z-10"
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
                          className="glass-input w-full font-bold text-lg"
                        />
                        <textarea
                          placeholder="Project Description (Describe what you built, challenges faced, and outcome)"
                          value={proj.description}
                          onChange={(e) => {
                            const newProj = [...profile.projects];
                            newProj[index].description = e.target.value;
                            setProfile({ ...profile, projects: newProj });
                          }}
                          className="glass-input w-full"
                          rows="3"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            placeholder="Technologies (e.g. React, Node.js, MongoDB)"
                            value={Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                            onChange={(e) => {
                              const newProj = [...profile.projects];
                              newProj[index].technologies = e.target.value.split(',').map(t => t.trim());
                              setProfile({ ...profile, projects: newProj });
                            }}
                            className="glass-input w-full"
                          />
                          <div className="relative">
                            <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                              placeholder="Project URL / GitHub Link"
                              value={proj.link}
                              onChange={(e) => {
                                const newProj = [...profile.projects];
                                newProj[index].link = e.target.value;
                                setProfile({ ...profile, projects: newProj });
                              }}
                              className="glass-input w-full pl-10"
                            />
                          </div>
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
            <div className="space-y-6 animate-in">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-white">Certifications & Awards</h3>
                  <p className="text-xs text-gray-400">Honors and recognized certifications</p>
                </div>
                <button
                  onClick={() => setProfile({ ...profile, certificates: [...profile.certificates, { name: '', issuer: '', link: '' }] })}
                  className="px-4 py-2 bg-primary/20 text-primary-glow hover:bg-primary/30 rounded-lg text-xs font-bold uppercase tracking-wider border border-primary/30 transition-colors"
                >
                  + Add Certificate
                </button>
              </div>

              {profile.certificates.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-xl border border-dashed border-white/10">
                  <Award className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-gray-400">No certificates added yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {profile.certificates.map((cert, index) => (
                    <div key={index} className="p-4 bg-surfaceHighlight/30 border border-glass-border rounded-xl relative group flex items-center gap-4">
                      <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                        <Award className="w-6 h-6 text-yellow-500" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <input
                          placeholder="Certificate Name"
                          value={cert.name}
                          onChange={(e) => {
                            const newCert = [...profile.certificates];
                            newCert[index].name = e.target.value;
                            setProfile({ ...profile, certificates: newCert });
                          }}
                          className="bg-transparent border-none text-white font-bold w-full focus:ring-0 p-0 placeholder-gray-600"
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
                            className="bg-transparent border-none text-gray-400 text-xs w-full focus:ring-0 p-0 placeholder-gray-600"
                          />
                          <input
                            placeholder="Credential Link"
                            value={cert.link}
                            onChange={(e) => {
                              const newCert = [...profile.certificates];
                              newCert[index].link = e.target.value;
                              setProfile({ ...profile, certificates: newCert });
                            }}
                            className="bg-transparent border-none text-blue-400 text-xs w-full focus:ring-0 p-0 placeholder-gray-600"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const newCert = [...profile.certificates];
                          newCert.splice(index, 1);
                          setProfile({ ...profile, certificates: newCert });
                        }}
                        className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/5 rounded-lg"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Save Area */}
        <div className="border-t border-glass-border p-6 bg-surfaceHighlight/30 backdrop-blur-md flex justify-end rounded-b-xl">
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="glass-button w-full md:w-auto flex items-center justify-center gap-2"
          >
            {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving Changes...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
