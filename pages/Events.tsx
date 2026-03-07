
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, CheckCircle, X, Loader2, Users, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Event } from '../types';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const Events: React.FC = () => {
  const { user } = useAuth();
  const { events } = useData();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<'all' | 'Worship' | 'Community' | 'Outreach' | 'Program'>('all');
  const [isRegistering, setIsRegistering] = useState<string | null>(null);

  const filteredEvents = activeCategory === 'all' 
    ? events 
    : events.filter(e => e.category === activeCategory);

  const handleRegister = (id: string) => {
    if (id === 'ot-2026') {
      navigate('/ot-challenge');
      return;
    }
    setIsRegistering(id);
    setTimeout(() => {
        setIsRegistering(null);
        alert("Registration successful! We've sent a confirmation email.");
    }, 1500);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Upcoming Gatherings</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Fellowship is vital to our growth. Join us as we gather to seek God and serve one another.</p>
        </div>

        {/* Featured Challenge Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-16 bg-church-900 text-white shadow-2xl animate-fade-in-up">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80')] opacity-30 bg-cover bg-center"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-church-900 via-church-900/80 to-transparent"></div>
            <div className="relative z-10 p-8 md:p-16 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 bg-gold-500 text-church-900 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                        <Sparkles size={14} /> Major Church Event
                    </div>
                    <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">The Old Testament <br/><span className="text-gold-400">In 3 Months</span></h2>
                    <p className="text-lg text-church-100 mb-8 max-w-xl">From Monday, March 16th to June 16th, 2026. A collective spiritual pursuit of the entire CBA family. Are you ready?</p>
                    <button 
                      onClick={() => handleRegister('ot-2026')}
                      className="bg-white text-church-900 px-10 py-4 rounded-full font-bold hover:bg-gold-500 transition shadow-xl flex items-center gap-2 mx-auto md:mx-0 group"
                    >
                      Enter Platform <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
                    </button>
                </div>
                <div className="hidden lg:flex w-72 h-72 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 items-center justify-center animate-float">
                    <BookOpen size={120} className="text-gold-500" />
                </div>
            </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {['all', 'Worship', 'Community', 'Outreach', 'Program'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold border transition-all ${
                activeCategory === cat
                  ? 'bg-church-600 text-white border-church-600 shadow-md'
                  : 'bg-white text-gray-500 hover:bg-gray-50 border-gray-200'
              }`}
            >
              {cat === 'all' ? 'All Events' : cat}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all flex flex-col group">
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80" alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" referrerPolicy="no-referrer" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-church-600 shadow-sm">
                  {event.category}
                </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                <div className="space-y-2 mb-6 text-sm text-gray-500 font-medium">
                  <div className="flex items-center gap-2"><CalendarIcon size={16} className="text-church-400" /> {event.date}</div>
                  <div className="flex items-center gap-2"><Clock size={16} className="text-church-400" /> {event.time}</div>
                  <div className="flex items-center gap-2"><MapPin size={16} className="text-church-400" /> {event.location}</div>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1">{event.description}</p>
                
                <button 
                  onClick={() => handleRegister(event.id)}
                  disabled={isRegistering === event.id}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    event.id === 'ot-2026' 
                    ? 'bg-gold-500 text-church-900 hover:bg-gold-600'
                    : 'bg-church-50 text-church-600 hover:bg-church-100'
                  }`}
                >
                  {isRegistering === event.id ? <Loader2 size={18} className="animate-spin" /> : (
                      event.id === 'ot-2026' ? <><Sparkles size={18} /> Visit Challenge</> : 'Register Event'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
