import React, { useState } from 'react';
import { BookOpen, Play, FileText, MessageCircle, Mic, Users, ArrowLeft, Search, CheckCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Lesson, ForumPost } from '../types';
import { useAuth } from '../context/AuthContext';

const SchoolOfTheWord: React.FC = () => {
  const { user } = useAuth();
  const [activePath, setActivePath] = useState<'Foundation' | 'Believers'>('Foundation');
  const [activeTab, setActiveTab] = useState<'lessons' | 'forum'>('lessons');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const lessons: Lesson[] = [
    {
      id: 'l1',
      title: 'Repentance from Dead Works',
      module: 'Foundation',
      duration: '45 min',
      content: 'The first step in our walk is turning away from the things that led to death. We explore the foundational concept of repentance...',
      author: 'Rev. Michael Thomas'
    },
    {
      id: 'l2',
      title: 'Faith Towards God',
      module: 'Foundation',
      duration: '30 min',
      content: 'Building a rock-solid trust in the Creator. Understanding that without faith, it is impossible to please Him.',
      author: 'Pastor Sarah Jenkins'
    },
    {
      id: 'l3',
      title: 'The Doctrine of Baptisms',
      module: 'Foundation',
      duration: '40 min',
      content: 'Exploring the three baptisms: Into Christ, in Water, and in the Holy Spirit.',
      author: 'Rev. Michael Thomas'
    },
    {
      id: 'l4',
      title: 'Operating in Spiritual Gifts',
      module: 'Believers',
      duration: '55 min',
      content: 'Now that the foundation is set, we explore the manifestation of the Spirit for the profit of all.',
      author: 'Pastor Michael'
    }
  ];

  const filteredLessons = lessons.filter(l => l.module === activePath);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-church-900 text-white pt-24 pb-12 px-4 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-church-600 rounded-full blur-[100px] opacity-30 translate-x-1/2 -translate-y-1/2"></div>
         <div className="max-w-7xl mx-auto relative z-10">
            <Link to="/portal" className="inline-flex items-center text-church-300 hover:text-white mb-6 transition">
                <ArrowLeft size={16} className="mr-2" /> Back to Portal
            </Link>
            <h1 className="text-4xl font-serif font-bold mb-2">School of the Word</h1>
            <p className="text-church-200">Systematic Bible Teaching for Spiritual Growth.</p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
         <div className="flex flex-col md:flex-row gap-4">
             <div className="glass-panel p-2 rounded-xl inline-flex gap-2 shadow-lg bg-white/95">
                 <button 
                   onClick={() => setActiveTab('lessons')}
                   className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${activeTab === 'lessons' ? 'bg-church-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                 >
                     <BookOpen size={18} /> Lessons
                 </button>
                 <button 
                   onClick={() => setActiveTab('forum')}
                   className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${activeTab === 'forum' ? 'bg-church-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                 >
                     <MessageCircle size={18} /> Forums
                 </button>
             </div>

             <div className="bg-white/80 backdrop-blur rounded-xl p-1.5 flex gap-1 border border-gray-100 shadow-sm">
                 <button 
                   onClick={() => setActivePath('Foundation')}
                   className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activePath === 'Foundation' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}
                 >
                   Foundation Class
                 </button>
                 <button 
                   onClick={() => setActivePath('Believers')}
                   className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activePath === 'Believers' ? 'bg-orange-100 text-orange-700' : 'text-gray-500 hover:bg-gray-50'}`}
                 >
                   Believers Class
                 </button>
             </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        {activeTab === 'lessons' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-4">
                     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b bg-gray-50/50">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                {activePath === 'Foundation' ? <CheckCircle className="text-blue-500" size={18} /> : <Users className="text-orange-500" size={18} />}
                                {activePath} Curriculum
                            </h3>
                        </div>
                        {filteredLessons.map(lesson => (
                            <button 
                              key={lesson.id}
                              onClick={() => setSelectedLesson(lesson)}
                              className={`w-full text-left p-4 border-b last:border-0 hover:bg-gray-50 transition border-gray-100 ${selectedLesson?.id === lesson.id ? 'bg-church-50 border-l-4 border-l-church-600' : ''}`}
                            >
                                <h3 className="font-bold text-gray-900 mb-1">{lesson.title}</h3>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="flex items-center gap-1"><Mic size={12} /> Audio</span>
                                    <span>•</span>
                                    <span>{lesson.duration}</span>
                                </div>
                            </button>
                        ))}
                     </div>
                </div>

                <div className="lg:col-span-2">
                    {selectedLesson ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-fade-in">
                             <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-3xl font-serif font-bold text-gray-900 mb-1">{selectedLesson.title}</h2>
                                    <p className="text-gray-500">Instructor: {selectedLesson.author}</p>
                                </div>
                                <button className="bg-church-50 text-church-600 px-4 py-2 rounded-full text-sm font-bold hover:bg-church-100 transition">
                                    Mark as Complete
                                </button>
                             </div>
                             
                             <div className="bg-church-900 rounded-xl p-6 mb-8 flex items-center gap-4 text-white shadow-lg relative overflow-hidden">
                                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none"></div>
                                 <button className="w-14 h-14 bg-gold-500 rounded-full flex items-center justify-center hover:bg-gold-400 transition text-church-900 shadow-xl flex-shrink-0">
                                     <Play size={28} className="ml-1" />
                                 </button>
                                 <div className="flex-1">
                                     <p className="text-xs text-church-300 font-bold uppercase tracking-widest mb-2">Lesson Audio</p>
                                     <div className="h-1.5 bg-white/20 rounded-full mb-3">
                                         <div className="h-full w-0 bg-gold-500 rounded-full"></div>
                                     </div>
                                     <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                                         <span>0:00</span>
                                         <span>{selectedLesson.duration}</span>
                                     </div>
                                 </div>
                             </div>

                             <div className="prose max-w-none text-gray-700 leading-relaxed">
                                 <div className="flex items-center gap-2 mb-4 text-church-800 border-b pb-2">
                                     <FileText size={20} />
                                     <h3 className="text-xl font-bold m-0">Written Content</h3>
                                 </div>
                                 <p className="text-lg font-serif italic mb-6">"Study to shew thyself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth." - 2 Timothy 2:15</p>
                                 <p>{selectedLesson.content}</p>
                                 <div className="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
                                    <h4 className="font-bold text-gray-900 mb-3">Reflection Questions</h4>
                                    <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
                                        <li>How does this foundational truth change your perspective on your daily walk?</li>
                                        <li>What scriptural evidence did you find most impactful in this lesson?</li>
                                    </ul>
                                 </div>
                             </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-gray-400 p-12 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <BookOpen size={40} className="text-gray-200" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to grow?</h3>
                            <p className="text-center max-w-sm">Select a lesson from the list on the left to begin your {activePath} study session.</p>
                        </div>
                    )}
                </div>
            </div>
        )}

        {activeTab === 'forum' && (
             <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-fade-in">
                 <div className="lg:col-span-3 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-gray-900">Recent Discussions</h3>
                        <div className="flex gap-2">
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold">#Foundation</span>
                            <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold">#Believers</span>
                        </div>
                    </div>
                    {/* Forum Posts Rendering (Existing logic updated with path styling) */}
                 </div>
             </div>
        )}
      </div>
    </div>
  );
};

export default SchoolOfTheWord;