
import React, { useState, useEffect } from 'react';
import { BookOpen, ShoppingBag, Lock, CheckCircle, Search, ArrowLeft, CreditCard, Sparkles, Filter, X, Loader2, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Book } from '../types';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useCurrency } from '../context/CurrencyContext';

const Library: React.FC = () => {
  const { user } = useAuth();
  const { books } = useData();
  const { formatAmount } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isBuying, setIsBuying] = useState(false);
  
  // Persist purchased books for the client
  const [purchasedBookIds, setPurchasedBookIds] = useState<string[]>(() => {
      const saved = localStorage.getItem('cba_my_library');
      return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
      localStorage.setItem('cba_my_library', JSON.stringify(purchasedBookIds));
  }, [purchasedBookIds]);

  const filteredBooks = books.filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isBookOwned = (bookId: string) => {
      return purchasedBookIds.includes(bookId);
  }

  const handlePurchase = () => {
    if(!selectedBook) return;
    setIsBuying(true);
    
    // Simulate payment gateway delay
    setTimeout(() => {
        setIsBuying(false);
        setPurchasedBookIds(prev => [...prev, selectedBook.id]);
        alert(`Payment successful! ${selectedBook.title} has been added to your Digital Shelf.`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-church-900 text-white pt-24 pb-16 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(var(--church-500),0.1),transparent)]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
            <Link to="/portal" className="inline-flex items-center text-church-300 hover:text-white mb-6 transition">
                <ArrowLeft size={16} className="mr-2" /> Back to Portal
            </Link>
            <h1 className="text-5xl font-serif font-bold mb-4">Spiritual Library</h1>
            <p className="text-church-200 text-lg max-w-2xl">Resources to equip and empower your walk with Christ. Invest in your growth.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
          <div className="flex flex-col md:flex-row gap-4 mb-12">
              <div className="flex-1 relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-church-600" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search by title, author, or keyword..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-none shadow-xl focus:ring-4 focus:ring-church-500/20 outline-none bg-white"
                  />
              </div>
              <button className="bg-white p-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 font-bold text-gray-600 hover:bg-gray-50 transition border border-gray-100">
                  <Filter size={20} /> Filter
              </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {filteredBooks.map(book => {
                  const owned = isBookOwned(book.id);
                  return (
                    <div key={book.id} className="group flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                        <div className="aspect-[2/3] relative overflow-hidden bg-gray-100 cursor-pointer" onClick={() => setSelectedBook(book)}>
                            <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-4">
                                <button 
                                    className="bg-white text-church-900 py-2.5 rounded-xl font-bold text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition duration-500"
                                >
                                    {owned ? 'Read Now' : 'View Details'}
                                </button>
                            </div>
                            {owned && (
                                <div className="absolute top-2 right-2 bg-green-500 text-white p-1.5 rounded-full shadow-lg">
                                    <CheckCircle size={14} />
                                </div>
                            )}
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="font-bold text-gray-900 leading-tight mb-1 group-hover:text-church-600 transition line-clamp-1">{book.title}</h3>
                            <p className="text-xs text-gray-400 font-medium mb-3">By {book.author}</p>
                            <div className="mt-auto flex justify-between items-center">
                                {owned ? (
                                    <span className="text-green-600 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                                        <BookOpen size={12} /> Purchased
                                    </span>
                                ) : (
                                    <span className="text-church-900 font-bold">{formatAmount(book.price)}</span>
                                )}
                            </div>
                        </div>
                    </div>
              )})}
          </div>
          
          {filteredBooks.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                  <p>No books found matching your search.</p>
              </div>
          )}
      </div>

      {/* Purchase/Details Modal */}
      {selectedBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
              <div className="bg-white rounded-3xl w-full max-w-2xl p-0 shadow-2xl animate-scale-in border border-gray-100 overflow-hidden">
                  <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto md:overflow-visible">
                      <div className="md:w-1/2 bg-gray-100 p-8 flex items-center justify-center relative">
                          <img src={selectedBook.imageUrl} alt={selectedBook.title} className="w-full max-w-[200px] shadow-2xl rounded-lg transform hover:scale-105 transition duration-500" />
                          <div className="absolute top-4 left-4">
                              <span className="bg-white/80 backdrop-blur text-church-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{selectedBook.category}</span>
                          </div>
                      </div>
                      <div className="md:w-1/2 p-8 flex flex-col">
                          <div className="flex justify-between items-start mb-4">
                              <div>
                                  <h3 className="text-2xl font-bold text-gray-900 leading-tight">{selectedBook.title}</h3>
                                  <p className="text-church-600 font-medium text-sm mt-1">By {selectedBook.author}</p>
                              </div>
                              <button onClick={() => setSelectedBook(null)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                          </div>
                          <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                              {selectedBook.description}
                          </p>
                          
                          {isBookOwned(selectedBook.id) ? (
                              <div className="space-y-4">
                                  <div className="bg-green-50 border border-green-200 p-4 rounded-2xl flex items-center gap-3">
                                      <CheckCircle className="text-green-600" size={24} />
                                      <div>
                                          <p className="text-green-800 font-bold text-sm">Purchase Complete</p>
                                          <p className="text-green-600 text-xs">This item is in your library.</p>
                                      </div>
                                  </div>
                                  <a 
                                    href={selectedBook.downloadUrl || '#'} 
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full bg-church-600 text-white py-4 rounded-xl font-bold hover:bg-church-700 transition shadow-lg flex items-center justify-center gap-2"
                                  >
                                      <Download size={18} /> Download Resource
                                  </a>
                              </div>
                          ) : (
                              <>
                                <div className="bg-gray-50 p-4 rounded-2xl mb-6 border border-gray-100">
                                    <div className="flex justify-between items-center text-sm font-bold">
                                        <span className="text-gray-500">Price</span>
                                        <span className="text-2xl text-church-900">{formatAmount(selectedBook.price)}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <button 
                                        onClick={handlePurchase}
                                        disabled={isBuying}
                                        className="w-full bg-church-900 text-white py-4 rounded-xl font-bold hover:bg-black transition shadow-lg flex items-center justify-center gap-2"
                                    >
                                        {isBuying ? <Loader2 className="animate-spin" /> : <><CreditCard size={18} /> Buy Now</>}
                                    </button>
                                    <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest font-bold">Secure checkout via Kingdom Pay</p>
                                </div>
                              </>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Library;
