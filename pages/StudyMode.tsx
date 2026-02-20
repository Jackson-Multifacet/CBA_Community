
import React, { useState, useEffect, useRef } from 'react';
import { 
  Book as BookIcon, 
  ChevronRight, 
  ChevronLeft, 
  Search, 
  Columns, 
  Layout, 
  MessageSquare, 
  Loader2, 
  Info,
  X,
  RefreshCw,
  Menu,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { fetchBibleChapter, fetchCommentary, BIBLE_BOOKS } from '../services/bibleService';
import { BibleApiResponse, BibleTranslation, BibleVerse, CommentaryEntry } from '../types';

type ViewTab = 'read' | 'study' | 'nav';

const StudyMode: React.FC = () => {
  const [book, setBook] = useState('John');
  const [chapter, setChapter] = useState(1);
  const [translation, setTranslation] = useState<BibleTranslation>('kjv');
  const [dualTranslation, setDualTranslation] = useState<BibleTranslation | null>(null);
  const [activeVerse, setActiveVerse] = useState<number>(1);
  const [bibleData, setBibleData] = useState<BibleApiResponse | null>(null);
  const [dualBibleData, setDualBibleData] = useState<BibleApiResponse | null>(null);
  const [commentary, setCommentary] = useState<CommentaryEntry | null>(null);
  const [commentaryAuthor, setCommentaryAuthor] = useState<'MHC' | 'JFB'>('MHC');
  const [loading, setLoading] = useState(true);
  const [loadingCommentary, setLoadingCommentary] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [activeTab, setActiveTab] = useState<ViewTab>('read');
  
  const textContainerRef = useRef<HTMLDivElement>(null);

  // Translations supported by bible-api.com
  const translations: {id: BibleTranslation, label: string}[] = [
    { id: 'kjv', label: 'KJV' },
    { id: 'web', label: 'WEB' },
    { id: 'webbe', label: 'WEB (UK)' },
    { id: 'oeb-us', label: 'OEB' },
    { id: 'almeida', label: 'ALMEIDA' },
    { id: 'rccv', label: 'RCCV' }
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadBible = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchBibleChapter(book, chapter, translation);
        setBibleData(data);
        
        if (dualTranslation) {
          try {
            const dualData = await fetchBibleChapter(book, chapter, dualTranslation);
            setDualBibleData(dualData);
          } catch (dualErr) {
            setDualBibleData(null);
          }
        } else {
          setDualBibleData(null);
        }
      } catch (err: any) {
        setError(err.message || 'Error loading Bible text.');
      } finally {
        setLoading(false);
      }
    };
    loadBible();
  }, [book, chapter, translation, dualTranslation]);

  useEffect(() => {
    const loadCommentary = async () => {
      setLoadingCommentary(true);
      try {
        const data = await fetchCommentary(commentaryAuthor, book, chapter, activeVerse);
        setCommentary(data);
      } catch (err) {
        console.error('Commentary error:', err);
      } finally {
        setLoadingCommentary(false);
      }
    };
    loadCommentary();
  }, [book, chapter, activeVerse, commentaryAuthor]);

  const handleBookSelect = (selectedBook: string) => {
    setBook(selectedBook);
    setChapter(1);
    setActiveVerse(1);
    if (window.innerWidth < 1024) setActiveTab('read');
  };

  const handleChapterSelect = (selectedChapter: number) => {
    setChapter(selectedChapter);
    setActiveVerse(1);
    if (window.innerWidth < 1024) setActiveTab('read');
  };

  const handleVerseClick = (verseNum: number) => {
    setActiveVerse(verseNum);
    if (window.innerWidth < 1024) setActiveTab('study');
  };

  const toggleDualMode = () => {
    if (dualTranslation) {
      setDualTranslation(null);
    } else {
      setDualTranslation(translation === 'kjv' ? 'web' : 'kjv');
    }
  };

  const retry = () => {
    setError(null);
    setLoading(true);
    const currentBook = book;
    setBook('');
    setTimeout(() => setBook(currentBook), 10);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-white overflow-hidden relative selection:bg-church-100 selection:text-church-900">
      
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-3 md:px-4 py-2 bg-gray-50 border-b border-gray-200 z-30 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden lg:block p-2 hover:bg-gray-200 rounded-lg text-gray-600 transition"
          >
            <Layout size={20} />
          </button>
          
          <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
             <div className="px-2 md:px-3 py-1 md:py-1.5 font-bold text-church-900 border-r border-gray-200 bg-gray-50/50 text-xs md:text-sm whitespace-nowrap">
               {book.substring(0, 3)}. {chapter}
             </div>
             <div className="flex divide-x divide-gray-200 overflow-x-auto no-scrollbar max-w-[150px] md:max-w-none">
                {translations.map(t => (
                  <button 
                    key={t.id}
                    onClick={() => setTranslation(t.id)}
                    className={`px-2 md:px-3 py-1 md:py-1.5 text-[9px] md:text-xs font-black uppercase tracking-widest transition whitespace-nowrap ${translation === t.id ? 'bg-church-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    {t.label}
                  </button>
                ))}
             </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
           <button 
              onClick={toggleDualMode}
              className={`hidden md:flex items-center gap-2 px-4 py-1.5 rounded-lg border text-xs font-bold transition ${dualTranslation ? 'bg-gold-500 border-gold-600 text-church-900' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              <Columns size={16} /> {dualTranslation ? 'Single View' : 'Dual View'}
            </button>
            <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 lg:hidden" onClick={() => setActiveTab('nav')}>
                <Menu size={20} />
            </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Navigation Sidebar */}
        <div className={`absolute lg:relative z-40 bg-white border-r border-gray-200 h-full transition-all duration-300 overflow-hidden ${isSidebarOpen || activeTab === 'nav' ? 'w-full md:w-80 translate-x-0' : 'w-0 -translate-x-full lg:translate-x-0'}`}>
            <div className="flex flex-col h-full">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2"><Search size={16} className="text-gray-400" /> Navigator</h3>
                    <button className="lg:hidden p-1 hover:bg-gray-200 rounded" onClick={() => setActiveTab('read')}><X size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Books of the Bible</p>
                        <div className="grid grid-cols-2 gap-2">
                            {BIBLE_BOOKS.map(b => (
                                <button 
                                  key={b}
                                  onClick={() => handleBookSelect(b)}
                                  className={`text-left px-3 py-2 rounded-lg text-xs font-bold transition ${book === b ? 'bg-church-600 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'}`}
                                >
                                    {b}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Bible Text View */}
            <div className={`flex-1 flex flex-col overflow-hidden bg-white ${activeTab !== 'read' && activeTab !== 'nav' ? 'hidden md:flex' : ''}`}>
                <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin" ref={textContainerRef}>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
                            <Loader2 size={40} className="animate-spin text-church-600" />
                            <p className="font-bold text-sm tracking-widest">GATHERING MANNA...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-4">
                            <div className="bg-red-50 text-red-600 p-6 rounded-3xl mb-4 border border-red-100">
                                <Info size={40} className="mx-auto mb-2" />
                                <h3 className="font-bold text-lg mb-1">Navigation Error</h3>
                                <p className="text-sm">{error}</p>
                            </div>
                            <button onClick={retry} className="flex items-center gap-2 bg-church-900 text-white px-6 py-2 rounded-full font-bold shadow-lg">
                                <RefreshCw size={16} /> Retry Fetch
                            </button>
                        </div>
                    ) : (
                        <div className="max-w-3xl mx-auto space-y-8 pb-20">
                            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 text-center mb-12 border-b border-gray-100 pb-8">
                                {bibleData?.reference}
                            </h1>
                            <div className={`grid gap-6 ${dualTranslation ? 'md:grid-cols-2' : ''}`}>
                                <div className="space-y-4">
                                    {dualTranslation && <p className="text-[10px] font-black uppercase tracking-widest text-church-500 mb-2">{translation}</p>}
                                    {bibleData?.verses.map(v => (
                                        <div 
                                          key={v.verse}
                                          onClick={() => handleVerseClick(v.verse)}
                                          className={`group cursor-pointer rounded-xl p-3 transition-all ${activeVerse === v.verse ? 'bg-church-50 border-l-4 border-l-church-600 ring-1 ring-church-100' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}
                                        >
                                            <span className="text-[10px] font-black text-church-400 mr-2 inline-block w-4">{v.verse}</span>
                                            <span className="text-lg text-gray-800 leading-relaxed font-serif">{v.text}</span>
                                        </div>
                                    ))}
                                </div>
                                {dualTranslation && dualBibleData && (
                                    <div className="space-y-4 border-l border-gray-100 md:pl-6">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gold-600 mb-2">{dualTranslation}</p>
                                        {dualBibleData.verses.map(v => (
                                            <div key={v.verse} className="p-3">
                                                <span className="text-[10px] font-black text-gold-400 mr-2 inline-block w-4">{v.verse}</span>
                                                <span className="text-lg text-gray-800 leading-relaxed font-serif">{v.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Commentary/Study Sidebar */}
            <div className={`w-full md:w-96 border-l border-gray-200 bg-gray-50 flex flex-col overflow-hidden ${activeTab !== 'study' ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between shadow-sm">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2"><BookOpen size={18} className="text-church-600" /> Study Center</h3>
                    <div className="flex gap-1">
                        <button 
                          onClick={() => setCommentaryAuthor('MHC')}
                          className={`px-3 py-1 rounded-full text-[10px] font-black transition ${commentaryAuthor === 'MHC' ? 'bg-church-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        >
                            MHC
                        </button>
                        <button 
                          onClick={() => setCommentaryAuthor('JFB')}
                          className={`px-3 py-1 rounded-full text-[10px] font-black transition ${commentaryAuthor === 'JFB' ? 'bg-church-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        >
                            JFB
                        </button>
                        <button className="md:hidden p-1 hover:bg-gray-100 rounded" onClick={() => setActiveTab('read')}><X size={20} /></button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
                    {loadingCommentary ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
                            <Sparkles size={32} className="animate-pulse text-gold-400" />
                            <p className="text-xs font-bold tracking-widest uppercase">Deepening context...</p>
                        </div>
                    ) : commentary ? (
                        <div className="animate-fade-in">
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 mb-6">
                                <h4 className="text-xs font-black uppercase tracking-widest text-church-600 mb-2">Focusing on Verse {activeVerse}</h4>
                                <p className="text-sm font-bold text-gray-900 italic font-serif leading-relaxed">
                                    "{bibleData?.verses.find(v => v.verse === activeVerse)?.text}"
                                </p>
                            </div>
                            
                            <div className="relative">
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                                    <MessageSquare size={14} /> Historical Commentary
                                </h3>
                                <div className="prose prose-sm prose-church bg-white rounded-2xl p-6 shadow-sm border border-gray-200 text-gray-700 leading-relaxed font-serif">
                                    {commentary.text}
                                </div>
                                <p className="mt-4 text-[10px] text-gray-400 text-center font-bold">SOURCE: {commentary.author.toUpperCase()}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center p-6">
                            <Info size={40} className="mb-4 opacity-20" />
                            <p className="text-sm font-bold">Select a verse to view in-depth historical commentary and cross-references.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* Mobile Footer Tab Bar */}
      <div className="md:hidden flex items-center justify-around bg-white border-t border-gray-200 py-3 z-50">
          <button 
            onClick={() => setActiveTab('nav')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'nav' ? 'text-church-600' : 'text-gray-400'}`}
          >
              <Layout size={20} />
              <span className="text-[10px] font-bold">NAV</span>
          </button>
          <button 
            onClick={() => setActiveTab('read')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'read' ? 'text-church-600' : 'text-gray-400'}`}
          >
              <BookIcon size={20} />
              <span className="text-[10px] font-bold">READ</span>
          </button>
          <button 
            onClick={() => setActiveTab('study')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'study' ? 'text-church-600' : 'text-gray-400'}`}
          >
              <Sparkles size={20} />
              <span className="text-[10px] font-bold">STUDY</span>
          </button>
      </div>
    </div>
  );
};

export default StudyMode;
