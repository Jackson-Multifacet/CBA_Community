
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, User, Share2, MessageSquare, Send, Mail, Heart, Sparkles } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Member } from '../types';

interface ArticleComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  date: string;
}

const ArticleDetail: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { articles } = useData();
  const article = articles.find(a => a.id === id);
  
  const [comments, setComments] = useState<ArticleComment[]>([
    { id: 'c1', authorName: 'Sarah J.', authorAvatar: 'S', text: 'This was exactly what I needed to hear today. Thank you!', date: 'Oct 29, 2023' }
  ]);
  const [newComment, setNewComment] = useState('');
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h2>
        <Link to="/articles" className="text-church-600 hover:underline">Back to Library</Link>
      </div>
    );
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    const comment: ArticleComment = {
      id: Date.now().toString(),
      authorName: `${user.firstName} ${user.lastName}`,
      authorAvatar: user.firstName.charAt(0),
      text: newComment,
      date: new Date().toLocaleDateString()
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  const handleSubscribe = () => {
      if(email) {
          setIsSubscribed(true);
          // API Call would go here
      }
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Hero Image */}
      <div className="h-[400px] md:h-[500px] relative w-full">
        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-90"></div>
        
        <div className="absolute top-0 left-0 p-6">
            <Link to="/articles" className="inline-flex items-center text-white/80 hover:text-white bg-black/20 backdrop-blur-md px-4 py-2 rounded-full transition">
                <ArrowLeft size={16} className="mr-2" /> Back to Articles
            </Link>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-4xl mx-auto">
             <div className="mb-4 flex flex-wrap gap-4 text-sm font-bold text-white/80">
                 <span className="bg-gold-500 text-church-900 px-3 py-1 rounded-full uppercase tracking-widest text-xs">{article.category}</span>
                 <span className="flex items-center gap-2"><Calendar size={16} /> {article.date}</span>
                 <span className="flex items-center gap-2"><Clock size={16} /> {article.readTime} read</span>
             </div>
             <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight shadow-sm">
                 {article.title}
             </h1>
             <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-white text-church-900 flex items-center justify-center font-bold text-lg">
                     {article.author.charAt(0)}
                 </div>
                 <div>
                     <p className="text-white font-bold text-lg">{article.author}</p>
                     <p className="text-white/60 text-sm">Author</p>
                 </div>
             </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-8">
              {/* Article Body */}
              <div 
                className="prose prose-lg prose-church max-w-none font-serif text-gray-800 leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-church-600 first-letter:mr-1 first-letter:float-left"
                dangerouslySetInnerHTML={{ __html: article.content || '' }} 
              />

              {/* Interaction Bar */}
              <div className="border-y border-gray-100 py-6 my-12 flex justify-between items-center">
                  <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition font-bold group">
                      <Heart size={20} className="group-hover:fill-current" /> Like Article
                  </button>
                  <button className="flex items-center gap-2 text-gray-500 hover:text-church-600 transition font-bold">
                      <Share2 size={20} /> Share
                  </button>
              </div>

              {/* Comments Section */}
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                  <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
                      <MessageSquare size={20} className="text-church-600" /> Discussion ({comments.length})
                  </h3>

                  {user ? (
                      <form onSubmit={handleCommentSubmit} className="mb-8 relative">
                          <textarea 
                             value={newComment}
                             onChange={(e) => setNewComment(e.target.value)}
                             placeholder="Share your thoughts..."
                             className="w-full p-4 pr-14 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-church-500 outline-none min-h-[100px] resize-none bg-white"
                          />
                          <button 
                            type="submit"
                            disabled={!newComment.trim()}
                            className="absolute bottom-4 right-4 bg-church-600 text-white p-2 rounded-xl hover:bg-church-700 transition disabled:opacity-50"
                          >
                              <Send size={18} />
                          </button>
                      </form>
                  ) : (
                      <div className="bg-white p-6 rounded-2xl text-center border border-gray-100 mb-8">
                          <p className="text-gray-600 mb-3">Please sign in to join the conversation.</p>
                          <Link to="/login" className="inline-block bg-church-100 text-church-700 px-6 py-2 rounded-full font-bold text-sm hover:bg-church-200">
                              Login to Comment
                          </Link>
                      </div>
                  )}

                  <div className="space-y-6">
                      {comments.map(comment => (
                          <div key={comment.id} className="flex gap-4 animate-fade-in">
                              <div className="w-10 h-10 rounded-full bg-church-200 text-church-700 flex-shrink-0 flex items-center justify-center font-bold">
                                  {comment.authorAvatar}
                              </div>
                              <div className="flex-1">
                                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                                      <div className="flex justify-between items-center mb-1">
                                          <h4 className="font-bold text-gray-900 text-sm">{comment.authorName}</h4>
                                          <span className="text-xs text-gray-400">{comment.date}</span>
                                      </div>
                                      <p className="text-gray-700 text-sm">{comment.text}</p>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
               {/* Newsletter Widget */}
               <div className="bg-church-900 text-white rounded-3xl p-8 relative overflow-hidden shadow-xl sticky top-24">
                   <div className="absolute top-0 right-0 p-8 opacity-10">
                       <Mail size={120} />
                   </div>
                   <div className="relative z-10">
                       <h3 className="text-2xl font-serif font-bold mb-3">Weekly Wisdom</h3>
                       <p className="text-church-200 mb-6 text-sm leading-relaxed">
                           Get articles like this delivered to your inbox every Friday morning. No spam, just grace.
                       </p>
                       
                       {isSubscribed ? (
                           <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 flex items-center gap-3 text-green-100 font-bold animate-fade-in">
                               <div className="bg-green-500 rounded-full p-1"><Share2 size={12} /></div>
                               Subscribed!
                           </div>
                       ) : (
                           <div className="space-y-3">
                               <input 
                                 type="email" 
                                 value={email}
                                 onChange={(e) => setEmail(e.target.value)}
                                 placeholder="your@email.com" 
                                 className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-church-300 focus:outline-none focus:bg-white/20 transition"
                               />
                               <button 
                                 onClick={handleSubscribe}
                                 className="w-full bg-gold-500 text-church-900 py-3 rounded-xl font-bold hover:bg-gold-400 transition shadow-lg"
                               >
                                   Subscribe Free
                               </button>
                           </div>
                       )}
                   </div>
               </div>

               {/* Related Articles (Mock) */}
               <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                   <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Sparkles size={16} className="text-gold-500" /> Related Reading</h4>
                   <div className="space-y-4">
                       {articles.filter(a => a.id !== id).slice(0, 3).map(a => (
                           <Link to={`/articles/${a.id}`} key={a.id} className="flex gap-3 group">
                               <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                   <img src={a.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" referrerPolicy="no-referrer" />
                               </div>
                               <div>
                                   <h5 className="font-bold text-gray-800 text-sm leading-tight mb-1 group-hover:text-church-600 transition">{a.title}</h5>
                                   <span className="text-[10px] text-gray-400 uppercase font-bold">{a.category}</span>
                               </div>
                           </Link>
                       ))}
                   </div>
               </div>
          </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
