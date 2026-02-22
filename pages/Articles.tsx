
import React, { useState } from 'react';
import { Clock, ArrowRight, ArrowLeft, Sparkles, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const Articles: React.FC = () => {
  const { articles } = useData();
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', ...Array.from(new Set(articles.map(a => a.category)))];

  const filteredArticles = articles.filter(article => {
    const matchesFilter = filter === 'All' || article.category === filter;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          article.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-church-900 text-white pt-24 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(var(--church-400),0.1),transparent)]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
            <Link to="/portal" className="inline-flex items-center text-church-300 hover:text-white mb-6 transition">
                <ArrowLeft size={16} className="mr-2" /> Back to Portal
            </Link>
            <h1 className="text-5xl font-serif font-bold mb-4">Spiritual Insights</h1>
            <p className="text-church-200 text-lg max-w-2xl">Articles, devotionals, and theological reflections to strengthen your spirit.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
          {/* Controls */}
          <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 mb-12 flex flex-col md:flex-row gap-4 justify-between items-center">
             <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search articles..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-church-500 outline-none"
                />
             </div>
             <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition ${
                      filter === cat 
                      ? 'bg-church-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, idx) => (
                  <Link 
                    to={`/articles/${article.id}`} 
                    key={article.id} 
                    className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
                  >
                      <div className="aspect-[16/9] overflow-hidden relative">
                          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" referrerPolicy="no-referrer" />
                          <div className="absolute top-4 left-4">
                             <span className="bg-white/90 backdrop-blur text-church-800 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                               {article.category}
                             </span>
                          </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                          <div className="flex items-center gap-2 mb-3 text-xs text-gray-400 font-medium">
                              <span>{article.date}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1"><Clock size={12} /> {article.readTime} read</span>
                          </div>
                          <h2 className="text-xl font-serif font-bold text-gray-900 mb-3 group-hover:text-church-600 transition leading-tight">
                              {article.title}
                          </h2>
                          <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-50">
                              <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-church-100 flex items-center justify-center font-bold text-church-600 text-xs">
                                      {article.author.charAt(0)}
                                  </div>
                                  <p className="text-xs font-bold text-gray-700">{article.author}</p>
                              </div>
                              <span className="text-church-500 group-hover:translate-x-1 transition">
                                  <ArrowRight size={18} />
                              </span>
                          </div>
                      </div>
                  </Link>
              ))}
          </div>

          {filteredArticles.length === 0 && (
             <div className="text-center py-20 text-gray-400">
                <p>No articles found matching your criteria.</p>
             </div>
          )}

          <div className="mt-20 bg-church-50 rounded-3xl p-10 text-center border border-church-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Sparkles size={100} className="text-church-600" />
               </div>
               <h3 className="text-2xl font-serif font-bold text-church-900 mb-4">Want more insights?</h3>
               <p className="text-gray-600 mb-8 max-w-md mx-auto">Join our monthly newsletter to get deep dives and pastoral reflections delivered straight to your inbox.</p>
               <div className="flex max-w-sm mx-auto gap-2">
                   <input type="email" placeholder="Email address" className="flex-1 p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-church-500" />
                   <button className="bg-church-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-church-700 transition">Subscribe</button>
               </div>
          </div>
      </div>
    </div>
  );
};

export default Articles;
