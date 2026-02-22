
import React, { useState, useRef } from 'react';
import { Play, Pause, Download, BookOpen, Sparkles, Mic2 } from 'lucide-react';
import { Sermon } from '../types';
import { summarizeSermon } from '../services/geminiService';
import { useData } from '../context/DataContext';

const Sermons: React.FC = () => {
  const { sermons } = useData();
  const [activeCategory, setActiveCategory] = useState<'all' | 'Nugget' | 'Full Service'>('all');
  const [loadingSummaryId, setLoadingSummaryId] = useState<string | null>(null);
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  
  // Audio Player State
  const [playingSermonId, setPlayingSermonId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const filteredSermons = activeCategory === 'all' 
    ? sermons 
    : sermons.filter(s => s.category === activeCategory);

  const handleGetSummary = async (sermon: Sermon) => {
    if (summaries[sermon.id]) return;
    setLoadingSummaryId(sermon.id);
    const summary = await summarizeSermon(sermon.title, sermon.passage);
    setSummaries(prev => ({ ...prev, [sermon.id]: summary }));
    setLoadingSummaryId(null);
  };

  const togglePlay = (sermon: Sermon) => {
    if (playingSermonId === sermon.id) {
      audioRef.current?.pause();
      setPlayingSermonId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingSermonId(sermon.id);
      // In a real app, we would use the actual sermon.audioUrl
      // For demo purposes, we'll use a sample audio if audioUrl is missing
      const audioSrc = sermon.audioUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
      
      // We need to wait for state update or use a direct ref approach for the audio element
      // But since we are rendering a single hidden audio element or one per card?
      // Let's use a single global audio element for simplicity or manage it via effect
      
      // Actually, let's just set the src and play
      setTimeout(() => {
          if (audioRef.current) {
              audioRef.current.src = audioSrc;
              audioRef.current.play();
          }
      }, 0);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <audio ref={audioRef} onEnded={() => setPlayingSermonId(null)} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Live Stream Section */}
        <div className="mb-16 animate-fade-in-up">
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
            <div className="bg-church-900 text-white p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <h2 className="text-xl font-bold font-serif">Live Service</h2>
              </div>
              <span className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full uppercase tracking-widest">On Air</span>
            </div>
            <div className="aspect-video w-full bg-black relative group">
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/live_stream?channel=UC4R8DWoMoI7CAwX8_LjQHig" 
                title="Christ Believers Assembly Live Stream"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none">
                 <p className="font-bold text-lg mb-2">Join us live!</p>
                 <p className="text-sm">Sundays 8:00 AM & 10:00 AM | Wednesdays 6:00 PM</p>
              </div>
            </div>
            <div className="p-6 bg-church-50 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-church-900">Sunday Worship Service</h3>
                    <p className="text-sm text-church-600">Join us as we worship and study the word of God.</p>
                </div>
                <button className="bg-red-600 text-white px-6 py-2 rounded-full font-bold hover:bg-red-700 transition shadow-lg shadow-red-200 flex items-center gap-2">
                    <Play size={16} className="fill-current" /> Watch on YouTube
                </button>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Message Archive</h1>
          <p className="text-gray-600">Full services and short nuggets for your spiritual journey.</p>
        </div>

        <div className="flex justify-center gap-3 mb-12">
          {['all', 'Full Service', 'Nugget'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={`px-6 py-2 rounded-full text-sm font-bold border transition-all ${
                activeCategory === cat
                  ? 'bg-church-600 text-white border-church-600 shadow-lg'
                  : 'bg-white text-gray-500 hover:bg-gray-50 border-gray-200'
              }`}
            >
              {cat === 'all' ? 'Everything' : cat === 'Nugget' ? 'Short Messages (Nuggets)' : 'Full Services'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredSermons.map((sermon) => (
            <div key={sermon.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="h-56 bg-church-800 relative">
                  <img src="https://images.unsplash.com/photo-1445633629932-0029acc44e88?auto=format&fit=crop&w=800&q=80" alt={sermon.title} className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button 
                      onClick={() => togglePlay(sermon)}
                      className="bg-white/20 backdrop-blur-md rounded-full p-4 hover:bg-white/30 transition text-white group"
                    >
                      {playingSermonId === sermon.id ? (
                        <Pause className="fill-current group-hover:scale-110 transition" size={32} />
                      ) : (
                        <Play className="fill-current group-hover:scale-110 transition" size={32} />
                      )}
                    </button>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur rounded px-3 py-1 text-white text-xs font-bold">
                    {sermon.duration}
                  </div>
                  {sermon.category === 'Nugget' && (
                    <div className="absolute top-4 left-4 bg-gold-500 text-church-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                      <Mic2 size={12} /> Nugget
                    </div>
                  )}
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold text-church-500 uppercase tracking-widest">{sermon.date}</span>
                  <div className="flex gap-2">
                    {sermon.tags.map(tag => <span key={tag} className="text-[10px] bg-church-50 text-church-600 px-2 py-1 rounded font-bold uppercase">{tag}</span>)}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{sermon.title}</h3>
                <p className="text-sm text-church-600 font-bold mb-4">{sermon.preacher} • {sermon.passage}</p>
                <p className="text-gray-500 text-sm mb-6 flex-grow leading-relaxed">{sermon.description}</p>

                <div className="pt-6 border-t border-gray-100">
                  {summaries[sermon.id] ? (
                    <div className="bg-gold-50/50 p-4 rounded-xl text-xs text-church-800 italic border border-gold-100 mb-4 animate-fade-in relative">
                       <Sparkles size={14} className="absolute top-2 right-2 text-gold-400" />
                       {summaries[sermon.id]}
                    </div>
                  ) : (
                    <button onClick={() => handleGetSummary(sermon)} className="text-xs flex items-center gap-2 text-church-500 hover:text-gold-600 font-bold mb-4">
                       <Sparkles size={14} /> Get AI Summary
                    </button>
                  )}
                  <div className="flex gap-4">
                    <button className="flex-1 bg-church-50 text-church-600 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-church-100 transition">
                      <Download size={14} /> Download
                    </button>
                    <button className="flex-1 bg-church-50 text-church-600 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-church-100 transition">
                      <BookOpen size={14} /> Notes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sermons;
