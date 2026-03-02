
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  BookOpen, 
  MessageSquare, 
  Calendar, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Send, 
  Bell, 
  Settings, 
  Trophy, 
  Users,
  Info,
  ArrowLeft,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { OTReadingDay, OTComment } from '../types';
import { OT_READING_PLAN } from '../data/otReadingPlan';
import { useAuth } from '../context/AuthContext';

const OTChallenge: React.FC = () => {
  const { user } = useAuth();
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [completedDays, setCompletedDays] = useState<number[]>(() => {
    const saved = localStorage.getItem('ot_completed_days');
    return saved ? JSON.parse(saved) : [];
  });
  const [comments, setComments] = useState<OTComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showAnnouncements, setShowAnnouncements] = useState(false);

  const activeDayPlan = OT_READING_PLAN.find(d => d.day === currentDay) || OT_READING_PLAN[0];
  const progressPercent = Math.round((completedDays.length / 90) * 100);

  useEffect(() => {
    localStorage.setItem('ot_completed_days', JSON.stringify(completedDays));
  }, [completedDays]);

  const toggleComplete = (day: number) => {
    setCompletedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handlePostComment = () => {
    if (!newComment.trim() || !user) return;
    const comment: OTComment = {
      id: Date.now().toString(),
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      text: newComment,
      timestamp: new Date(),
      day: currentDay
    };
    setComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Banner */}
      <div className="bg-church-900 text-white pt-12 pb-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-600 rounded-full blur-[150px] opacity-10"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <div>
            <Link to="/events" className="inline-flex items-center text-church-300 hover:text-white mb-4 transition">
              <ArrowLeft size={16} className="mr-2" /> Back to Events
            </Link>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">OT In 3 Months</h1>
            <p className="text-church-200">The 90-Day Spiritual Journey of Christ Believers Assembly</p>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setShowAnnouncements(true)}
                className="relative p-3 bg-white/10 hover:bg-white/20 rounded-full transition group"
             >
                <Bell size={24} />
                <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 border-2 border-church-900 rounded-full"></span>
             </button>
             <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20 flex items-center gap-4">
                <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gold-400">Total Progress</p>
                    <p className="text-2xl font-bold">{progressPercent}%</p>
                </div>
                <div className="w-16 h-16 rounded-full bg-church-800 flex items-center justify-center relative">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/10" />
                        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={175.9} strokeDashoffset={175.9 - (175.9 * progressPercent / 100)} className="text-gold-500 transition-all duration-1000" />
                    </svg>
                    <Trophy size={20} className="absolute text-gold-500" />
                </div>
             </div>
          </div>
        </div>

        {/* Visual Progress Bar - ADDED FEATURE */}
        <div className="max-w-7xl mx-auto mt-8">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-church-300 mb-2">
                <span>Day 1</span>
                <span>{completedDays.length} / 90 Days Completed</span>
                <span>Day 90</span>
            </div>
            <div className="h-3 bg-church-800 rounded-full overflow-hidden relative">
                <div 
                    className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercent}%` }}
                ></div>
                {/* Checkpoints */}
                <div className="absolute top-0 left-1/3 w-0.5 h-full bg-church-900/50"></div>
                <div className="absolute top-0 left-2/3 w-0.5 h-full bg-church-900/50"></div>
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-church-400 font-medium">
                <span>Genesis</span>
                <span>Month 2</span>
                <span>Malachi</span>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Day Navigation Sidebar */}
          <div className="lg:col-span-1 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col h-[600px]">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 flex items-center gap-2"><Calendar size={18} /> Schedule</h3>
              <span className="text-[10px] font-black bg-church-50 text-church-600 px-2 py-1 rounded">DAY 1 - 90</span>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar p-2">
              {OT_READING_PLAN.map(day => (
                <button 
                  key={day.day}
                  onClick={() => setCurrentDay(day.day)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all mb-1 ${currentDay === day.day ? 'bg-church-600 text-white shadow-lg' : 'hover:bg-gray-50 text-gray-600'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${currentDay === day.day ? 'bg-white/20 border-white/30' : 'bg-gray-100 border-gray-200'}`}>
                      {day.day}
                    </span>
                    <div className="text-left">
                       <p className="text-xs font-bold truncate max-w-[120px]">{day.passages}</p>
                       <p className={`text-[10px] ${currentDay === day.day ? 'text-church-200' : 'text-gray-400'}`}>Week {day.week}</p>
                    </div>
                  </div>
                  {completedDays.includes(day.day) && <CheckCircle size={14} className={currentDay === day.day ? 'text-gold-300' : 'text-green-500'} />}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Insight & Reading */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 animate-scale-in">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                   <p className="text-xs font-black uppercase tracking-widest text-church-500 mb-1">Month {activeDayPlan.month} • Week {activeDayPlan.week} • Day {activeDayPlan.day}</p>
                   <h2 className="text-4xl font-serif font-bold text-gray-900 leading-tight">{activeDayPlan.passages}</h2>
                </div>
                <button 
                  onClick={() => toggleComplete(currentDay)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition shadow-md ${completedDays.includes(currentDay) ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-church-600 text-white hover:bg-church-700'}`}
                >
                   {completedDays.includes(currentDay) ? <><CheckCircle size={20} /> Completed</> : 'Mark as Read'}
                </button>
              </div>

              <div className="p-8 bg-church-50 rounded-3xl border border-church-100 relative group overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                    <BookOpen size={100} />
                 </div>
                 <h4 className="text-sm font-black uppercase tracking-widest text-church-600 mb-4 flex items-center gap-2"><Sparkles size={16} /> Daily Wisdom</h4>
                 <p className="text-xl font-serif text-church-900 leading-relaxed italic mb-8">"{activeDayPlan.description}"</p>
                 <div className="flex flex-wrap gap-4">
                    <Link to="/study" className="bg-white text-church-900 px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition flex items-center gap-2 border border-gray-100">
                       <BookOpen size={16} /> Open Study Bible
                    </Link>
                    <button className="bg-white text-church-900 px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition flex items-center gap-2 border border-gray-100">
                       <Info size={16} /> Reading Guide
                    </button>
                 </div>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
                 <button 
                  disabled={currentDay === 1}
                  onClick={() => setCurrentDay(prev => prev - 1)}
                  className="flex items-center gap-2 text-church-600 font-bold disabled:opacity-30"
                 >
                    <ChevronLeft /> Previous Day
                 </button>
                 <button 
                  disabled={currentDay === 90}
                  onClick={() => setCurrentDay(prev => prev + 1)}
                  className="flex items-center gap-2 text-church-600 font-bold disabled:opacity-30"
                 >
                    Next Day <ChevronRight />
                 </button>
              </div>
            </div>

            {/* Community Section */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
               <div className="p-6 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2"><MessageSquare size={18} className="text-church-600" /> Conversations</h3>
                  <div className="flex items-center gap-2">
                     <Users size={16} className="text-gray-400" />
                     <span className="text-xs text-gray-500 font-bold">120+ Members Reading</span>
                  </div>
               </div>
               
               <div className="p-8">
                  <div className="flex gap-4 mb-8">
                     <div className="w-10 h-10 rounded-full bg-church-100 flex-shrink-0 flex items-center justify-center font-bold text-church-600 uppercase">
                        {user?.firstName.charAt(0)}
                     </div>
                     <div className="flex-1 relative">
                        <textarea 
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="What did the Lord speak to you through this passage?"
                          className="w-full p-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-church-500 bg-gray-50/30 min-h-[100px]"
                        ></textarea>
                        <button 
                          onClick={handlePostComment}
                          className="absolute bottom-4 right-4 bg-church-600 text-white p-2 rounded-xl hover:bg-church-700 transition shadow-lg"
                        >
                           <Send size={18} />
                        </button>
                     </div>
                  </div>

                  <div className="space-y-6">
                     {comments.filter(c => c.day === currentDay).length === 0 ? (
                        <div className="text-center py-10">
                           <p className="text-gray-400 text-sm font-medium">No thoughts shared yet for Day {currentDay}. Be the first!</p>
                        </div>
                     ) : (
                        comments.filter(c => c.day === currentDay).map(c => (
                           <div key={c.id} className="flex gap-4 animate-fade-in">
                              <div className="w-10 h-10 rounded-full bg-gold-50 text-gold-600 flex-shrink-0 flex items-center justify-center font-bold uppercase shadow-sm border border-gold-100">
                                 {c.userName.charAt(0)}
                              </div>
                              <div className="flex-1 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                                 <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-bold text-gray-900 text-sm">{c.userName}</h4>
                                    <span className="text-[10px] text-gray-400">{c.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                 </div>
                                 <p className="text-sm text-gray-600 leading-relaxed">{c.text}</p>
                              </div>
                           </div>
                        ))
                     )}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Announcements Modal */}
      {showAnnouncements && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
           <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-in">
              <div className="p-6 bg-church-900 text-white flex justify-between items-center">
                 <h3 className="text-xl font-bold flex items-center gap-2"><Bell size={20} className="text-gold-500" /> Challenge Updates</h3>
                 <button onClick={() => setShowAnnouncements(false)} className="hover:bg-white/10 p-1 rounded-full"><X size={24} /></button>
              </div>
              <div className="p-6 space-y-4">
                 <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">General Announcement</span>
                        <span className="text-[10px] text-blue-400 font-bold">MARCH 8</span>
                    </div>
                    <h4 className="font-bold text-blue-900 mb-1">Pre-Challenge Launch Stream</h4>
                    <p className="text-xs text-blue-700 leading-relaxed">Join Pastor Michael tomorrow at 7 PM for a live session to prepare our hearts for the 90-day journey.</p>
                 </div>
                 <div className="bg-gold-50 border border-gold-100 p-4 rounded-2xl">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black uppercase text-gold-600 tracking-widest">Email Notification</span>
                        <span className="text-[10px] text-gold-400 font-bold">MARCH 9</span>
                    </div>
                    <h4 className="font-bold text-gold-900 mb-1">Daily Reminders Active</h4>
                    <p className="text-xs text-gold-700 leading-relaxed">Daily emails with insights and reading links will be sent to all members registered in the portal.</p>
                 </div>
              </div>
              <div className="p-6 border-t border-gray-50 flex justify-end">
                 <button onClick={() => setShowAnnouncements(false)} className="bg-church-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg">Understood</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default OTChallenge;
