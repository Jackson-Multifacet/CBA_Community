
import React, { useState } from 'react';
import { Play, Heart, X, Image as ImageIcon, Video, Plus, Sparkles } from 'lucide-react';
import { useData } from '../context/DataContext';
import { GalleryItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Gallery: React.FC = () => {
  const { galleryItems } = useData();
  const { user } = useAuth();
  const [activeStory, setActiveStory] = useState<GalleryItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [filter, setFilter] = useState<'All' | 'Service' | 'Event' | 'Reel'>('All');

  const isAdmin = user && (user.role === 'Pastor' || user.role === 'Leader' || user.role === 'Admin' as any);

  const stories = galleryItems.filter(i => i.category === 'Story');
  const reels = galleryItems.filter(i => i.category === 'Reel');
  const gridItems = galleryItems.filter(i => i.category !== 'Story' && i.category !== 'Reel');

  const filteredGrid = filter === 'All' 
    ? gridItems 
    : gridItems.filter(i => i.category === filter);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Stories Section */}
      <div className="bg-white pt-8 pb-6 shadow-sm border-b border-gray-100 sticky top-20 z-30 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 flex gap-6">
           {/* Add Story Placeholder - Admin Only */}
           {isAdmin && (
               <Link to="/admin" className="flex flex-col items-center gap-2 cursor-pointer group flex-shrink-0">
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 group-hover:border-church-500 transition relative">
                      <Plus className="text-gray-400 group-hover:text-church-600" />
                      <div className="absolute bottom-0 right-0 bg-church-600 text-white p-1 rounded-full text-[10px]">
                          <Sparkles size={10} />
                      </div>
                  </div>
                  <span className="text-xs font-bold text-gray-500">Add Story</span>
               </Link>
           )}

           {stories.map(story => (
             <div 
                key={story.id} 
                onClick={() => setActiveStory(story)}
                className="flex flex-col items-center gap-2 cursor-pointer group flex-shrink-0"
             >
                <div className="w-20 h-20 rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 group-hover:scale-105 transition-transform duration-300">
                    <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-gray-100">
                        <img src={story.url} alt={story.title} className="w-full h-full object-cover" />
                    </div>
                </div>
                <span className="text-xs font-bold text-gray-700 truncate w-20 text-center">{story.title}</span>
             </div>
           ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Reels Section */}
        <div className="mb-12">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Video size={24} className="text-church-600" /> CBA Reels
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {reels.map(reel => (
                    <div 
                        key={reel.id} 
                        onClick={() => setSelectedItem(reel)}
                        className="aspect-[9/16] rounded-xl overflow-hidden relative group cursor-pointer shadow-md bg-gray-900"
                    >
                        <img src={reel.url} alt={reel.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500 opacity-90" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition"></div>
                        <div className="absolute bottom-4 left-4 text-white">
                            <p className="font-bold text-sm text-shadow flex items-center gap-1"><Play size={12} fill="currentColor" /> {reel.likes || 0}</p>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                                <Play fill="white" className="text-white ml-1" />
                            </div>
                        </div>
                    </div>
                ))}
                {reels.length === 0 && (
                    <div className="col-span-full py-10 text-center text-gray-400 bg-gray-100 rounded-xl border border-dashed border-gray-200">
                        <Video size={32} className="mx-auto mb-2 opacity-50" />
                        <p>No reels posted yet.</p>
                    </div>
                )}
            </div>
        </div>

        {/* Moments Gallery */}
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h2 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-2">
                    <ImageIcon size={24} className="text-church-600" /> Moments
                </h2>
                <div className="flex gap-2 bg-white p-1 rounded-lg border border-gray-100 shadow-sm mt-4 md:mt-0">
                    {['All', 'Service', 'Event'].map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setFilter(cat as any)}
                            className={`px-4 py-1.5 rounded-md text-sm font-bold transition ${filter === cat ? 'bg-church-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {filteredGrid.map(item => (
                    <div 
                        key={item.id} 
                        onClick={() => setSelectedItem(item)}
                        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer"
                    >
                        <div className="aspect-[4/3] overflow-hidden relative bg-gray-200">
                             <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                             <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-church-600 shadow-sm">
                                {item.category}
                             </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-gray-900">{item.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>

      {/* Story Viewer Modal */}
      {activeStory && (
          <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center animate-fade-in">
              <div className="absolute top-4 right-4 z-50">
                  <button onClick={() => setActiveStory(null)} className="text-white p-2 hover:bg-white/10 rounded-full">
                      <X size={32} />
                  </button>
              </div>
              <div className="relative h-full max-h-[85vh] aspect-[9/16] bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
                  <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/60 to-transparent z-10 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                           <img src={activeStory.url} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-white font-bold text-sm shadow-black drop-shadow-md">{activeStory.title}</span>
                      <span className="text-white/60 text-xs ml-auto">{activeStory.date}</span>
                  </div>
                  
                  {/* Progress Bar Simulation */}
                  <div className="absolute top-1 left-1 right-1 h-1 bg-white/30 rounded-full overflow-hidden z-20">
                      <div className="h-full bg-white w-full animate-[width_5s_linear]"></div>
                  </div>

                  <img src={activeStory.url} alt={activeStory.title} className="w-full h-full object-cover" />
              </div>
          </div>
      )}

      {/* Item Details Modal */}
      {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 text-white p-2 hover:bg-white/10 rounded-full"
              >
                  <X size={32} />
              </button>
              <div className="max-w-5xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
                  <div className="md:w-2/3 bg-black flex items-center justify-center relative">
                      <img src={selectedItem.url} alt={selectedItem.title} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="md:w-1/3 p-6 flex flex-col bg-white">
                      <div className="flex items-center gap-3 mb-6">
                           <div className="w-10 h-10 rounded-full bg-church-100 flex items-center justify-center text-church-600 font-bold">
                               CBA
                           </div>
                           <div>
                               <h3 className="font-bold text-sm text-gray-900">Christ Believers Assembly</h3>
                               <p className="text-xs text-gray-500">{selectedItem.date}</p>
                           </div>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedItem.title}</h2>
                      <p className="text-gray-600 text-sm leading-relaxed mb-6">
                          Captured moments from our {selectedItem.category.toLowerCase()}. 
                          Join us as we celebrate the goodness of God.
                      </p>
                      
                      <div className="mt-auto border-t border-gray-100 pt-4 flex gap-4">
                          <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 font-bold transition">
                              <Heart size={20} /> Like
                          </button>
                          <button className="flex items-center gap-2 text-gray-600 hover:text-church-600 font-bold transition">
                              <Sparkles size={20} /> Share
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default Gallery;
