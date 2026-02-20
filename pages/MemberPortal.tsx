
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  CreditCard, 
  LayoutDashboard, 
  MessageSquare, 
  Calendar, 
  Settings, 
  LogOut, 
  Heart,
  BookOpen,
  ArrowUpRight,
  ArrowDownLeft,
  Coffee,
  ShoppingBag,
  History,
  BookHeart,
  Plus,
  X,
  Sparkles,
  Loader2,
  ChevronRight,
  User,
  Edit2,
  Save,
  Church,
  GraduationCap,
  Library as LibraryIcon,
  Newspaper,
  Book,
  Brain
} from 'lucide-react';
import { WalletTransaction, InboxMessage, JournalEntry, Member } from '../types';
import { generateDevotionalThought } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';

const MemberPortal: React.FC = () => {
  const { user, logout, updateProfile, isLoading, campuses } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'wallet' | 'messages' | 'journal' | 'schedule' | 'profile'>('dashboard');
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Member>>({});

  useEffect(() => {
    if (!isLoading && !user) {
        navigate('/login');
    }
  }, [user, isLoading, navigate]);

  const [transactions, setTransactions] = useState<WalletTransaction[]>([
    { id: 't1', date: '2023-11-01', description: 'Monthly Tithe', amount: 450.00, type: 'credit', category: 'Tithe' },
    { id: 't2', date: '2023-10-29', description: 'Sunday Coffee (Cafe)', amount: 4.50, type: 'debit', category: 'Cafe' },
    { id: 't4', date: '2023-10-20', description: 'Book: Purpose Driven Life', amount: 15.00, type: 'debit', category: 'Bookstore' },
  ]);
  const [showGiveModal, setShowGiveModal] = useState(false);
  const [giveAmount, setGiveAmount] = useState('');
  const [givingType, setGivingType] = useState<'Tithe' | 'Offering'>('Tithe');

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [newJournalContent, setNewJournalContent] = useState('');
  const [isGeneratingDevotional, setIsGeneratingDevotional] = useState(false);

  const messages: InboxMessage[] = [
    { id: 'm1', sender: 'Pastor Michael', subject: 'Volunteer Appreciation Dinner', preview: 'We would love to host you this Friday...', date: '2 hrs ago', read: false, priority: 'normal' },
    { id: 'm2', sender: 'Admin Team', subject: 'Tax Statement Available', preview: 'Your 2023 giving statement is ready for download.', date: '1 day ago', read: true, priority: 'high' },
  ];

  if (!user) return null;

  useEffect(() => {
    if (user) {
        setEditForm(user);
    }
  }, [user]);

  const calculateTotalGiving = () => {
    return transactions
      .filter(t => t.type === 'credit' && (t.category === 'Tithe' || t.category === 'Offering'))
      .reduce((acc, curr) => acc + curr.amount, 0);
  };

  const handleGive = () => {
    if (!giveAmount) return;
    const amount = parseFloat(giveAmount);
    if (isNaN(amount) || amount <= 0) return;
    const newTransaction: WalletTransaction = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      description: `Online ${givingType}`,
      amount: amount,
      type: 'credit',
      category: givingType
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setShowGiveModal(false);
    setGiveAmount('');
  };

  const handleSaveJournal = async () => {
    if (!newJournalContent.trim()) return;
    setIsGeneratingDevotional(true);
    const reflection = await generateDevotionalThought(newJournalContent);
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      content: newJournalContent,
      aiReflection: reflection
    };
    setJournalEntries(prev => [newEntry, ...prev]);
    setNewJournalContent('');
    setIsGeneratingDevotional(false);
  };
  
  const handleSaveProfile = async () => {
    await updateProfile(editForm);
    setIsEditingProfile(false);
  };

  const handleEditChange = (field: keyof Member | string, value: any) => {
      if (field.includes('.')) {
          const [parent, child] = field.split('.');
          setEditForm(prev => ({
              ...prev,
              [parent]: { ...(prev as any)[parent], [child]: value }
          }));
      } else {
          setEditForm(prev => ({ ...prev, [field]: value }));
      }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-church-800 to-church-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden animate-fade-in-up">
        <div className="relative z-10">
          <h2 className="text-3xl font-serif font-bold mb-2">Shalom, {user.firstName}</h2>
          <p className="text-church-100 max-w-xl font-light">Your spiritual dashboard for Christ Believers Assembly.</p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-white opacity-5 transform skew-x-12 translate-x-12 blur-2xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 animate-fade-in-up delay-100">
         <Link to="/study" className="bg-white p-5 rounded-2xl shadow-sm border border-church-100 hover:shadow-md transition group">
             <div className="bg-gold-50 w-10 h-10 rounded-full flex items-center justify-center text-gold-600 mb-3 group-hover:scale-110 transition">
                 <Book size={20} />
             </div>
             <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Bible</p>
             <h4 className="font-bold text-gray-900">Study Bible</h4>
         </Link>
         <Link to="/bible-trivia" className="bg-white p-5 rounded-2xl shadow-sm border border-church-100 hover:shadow-md transition group">
             <div className="bg-indigo-50 w-10 h-10 rounded-full flex items-center justify-center text-indigo-600 mb-3 group-hover:scale-110 transition">
                 <Brain size={20} />
             </div>
             <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Fun</p>
             <h4 className="font-bold text-gray-900">Bible Trivia</h4>
         </Link>
         <Link to="/school-of-word" className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
             <div className="bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition">
                 <GraduationCap size={20} />
             </div>
             <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Study</p>
             <h4 className="font-bold text-gray-900">Bible School</h4>
         </Link>
         <Link to="/library" className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
             <div className="bg-orange-50 w-10 h-10 rounded-full flex items-center justify-center text-orange-600 mb-3 group-hover:scale-110 transition">
                 <LibraryIcon size={20} />
             </div>
             <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Resources</p>
             <h4 className="font-bold text-gray-900">Digital Library</h4>
         </Link>
         <Link to="/articles" className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
             <div className="bg-green-50 w-10 h-10 rounded-full flex items-center justify-center text-green-600 mb-3 group-hover:scale-110 transition">
                 <Newspaper size={20} />
             </div>
             <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Growth</p>
             <h4 className="font-bold text-gray-900">Articles</h4>
         </Link>
         <Link to="/events" className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
             <div className="bg-purple-50 w-10 h-10 rounded-full flex items-center justify-center text-purple-600 mb-3 group-hover:scale-110 transition">
                 <Calendar size={20} />
             </div>
             <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Gather</p>
             <h4 className="font-bold text-gray-900">Event RSVP</h4>
         </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100/50 flex justify-between items-center bg-gray-50/30">
            <h3 className="font-bold text-gray-900 flex items-center gap-2"><Calendar size={18} className="text-church-600" /> My Registered Events</h3>
            <Link to="/events" className="text-church-600 text-xs font-bold hover:underline">Register More</Link>
          </div>
          <div className="p-6">
              <div className="bg-church-50 border border-church-100 rounded-xl p-4 flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex flex-col items-center justify-center shadow-sm">
                      <span className="text-[10px] text-church-600 font-bold uppercase">Nov</span>
                      <span className="text-lg font-bold text-gray-900 leading-tight">28</span>
                  </div>
                  <div>
                      <h4 className="font-bold text-gray-900 text-sm">Miracle Night 2023</h4>
                      <p className="text-xs text-gray-500">6:00 PM • Main Sanctuary</p>
                  </div>
              </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl shadow-sm overflow-hidden">
           <div className="p-6 border-b border-gray-100/50 flex justify-between items-center bg-gray-50/30">
            <h3 className="font-bold text-gray-900 flex items-center gap-2"><ShoppingBag size={18} className="text-gold-600" /> My Library</h3>
            <Link to="/library" className="text-church-600 text-xs font-bold hover:underline">Browse Library</Link>
          </div>
          <div className="p-6 flex gap-4">
              <div className="w-16 h-20 bg-gray-100 rounded shadow-md overflow-hidden flex-shrink-0">
                  <img src="https://picsum.photos/100/150?random=b2" alt="Book" className="w-full h-full object-cover" />
              </div>
              <div>
                  <h4 className="font-bold text-gray-900 text-sm">Foundation of Faith</h4>
                  <p className="text-xs text-gray-400 mb-3">Pastor Sarah Jenkins</p>
                  <button className="text-xs bg-church-600 text-white px-3 py-1 rounded-full font-bold">Resume Reading</button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
      <div className="space-y-6 animate-fade-in-up">
           <div className="flex justify-between items-center">
               <h2 className="text-2xl font-serif font-bold text-gray-900">My Profile</h2>
               <button 
                onClick={() => isEditingProfile ? handleSaveProfile() : setIsEditingProfile(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition shadow-sm ${
                    isEditingProfile 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-church-600 text-white hover:bg-church-700'
                }`}
               >
                   {isEditingProfile ? <><Save size={16} /> Save Changes</> : <><Edit2 size={16} /> Edit Profile</>}
               </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-bold text-church-800 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2"><User size={18} /> Personal Information</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">First Name</span>
                                {isEditingProfile ? (
                                    <input className="w-full border rounded p-1" value={editForm.firstName || ''} onChange={e => handleEditChange('firstName', e.target.value)} />
                                ) : (
                                    <p className="text-gray-900 font-medium">{user.firstName}</p>
                                )}
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Last Name</span>
                                {isEditingProfile ? (
                                    <input className="w-full border rounded p-1" value={editForm.lastName || ''} onChange={e => handleEditChange('lastName', e.target.value)} />
                                ) : (
                                    <p className="text-gray-900 font-medium">{user.lastName}</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Email</span>
                             <p className="text-gray-900 font-medium">{user.email}</p>
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-bold text-church-800 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2"><Church size={18} /> Church Details</h3>
                    <div className="space-y-4">
                        <div>
                            <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Parish / Branch</span>
                            {isEditingProfile ? (
                                <input className="w-full border rounded p-1" value={editForm.parish || ''} onChange={e => handleEditChange('parish', e.target.value)} />
                            ) : (
                                <p className="text-gray-900 font-medium">{user.parish || 'Not listed'}</p>
                            )}
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Role</span>
                            <p className="text-church-600 font-bold bg-church-50 inline-block px-3 py-1 rounded-full mt-1 text-xs">{user.role}</p>
                        </div>
                    </div>
                </div>
           </div>
      </div>
  );

  const renderWallet = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-bold text-gray-900">Kingdom Wallet</h2>
        <button onClick={() => setShowGiveModal(true)} className="bg-church-600 text-white px-6 py-2 rounded-full font-bold hover:bg-church-700 transition shadow-lg shadow-church-200/50 flex items-center gap-2">
          <Heart size={18} /> Give Now
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-church-900 to-church-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-church-200 text-sm font-medium mb-1">Total Giving (YTD)</p>
            <h3 className="text-3xl font-bold">${calculateTotalGiving().toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
          </div>
        </div>
      </div>
      <div className="glass-panel rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
            <History size={18} className="text-gray-400" />
            <h3 className="font-bold text-gray-900">Transaction History</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {transactions.map((t) => (
            <div key={t.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${t.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {t.type === 'credit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{t.description}</h4>
                  <p className="text-xs text-gray-500">{t.date} • {t.category}</p>
                </div>
              </div>
              <span className={`font-bold ${t.type === 'credit' ? 'text-green-600' : 'text-gray-900'}`}>
                {t.type === 'credit' ? '+' : '-'}${t.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="space-y-6 animate-fade-in-up">
        <h2 className="text-2xl font-serif font-bold text-gray-900">Inbox</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {messages.map((msg) => (
                <div key={msg.id} className="p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            {!msg.read && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                            <h4 className="font-bold text-gray-900">{msg.sender}</h4>
                        </div>
                        <span className="text-xs text-gray-400">{msg.date}</span>
                    </div>
                    <h5 className="font-bold text-sm text-gray-800 mb-1">{msg.subject}</h5>
                    <p className="text-sm text-gray-500 line-clamp-2">{msg.preview}</p>
                </div>
            ))}
        </div>
    </div>
  );

  const renderJournal = () => (
    <div className="space-y-6 animate-fade-in-up">
       <div className="bg-gradient-to-r from-purple-800 to-church-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <h2 className="text-2xl font-serif font-bold mb-2">Spiritual Journal</h2>
            <p className="text-purple-100 max-w-xl text-sm">Record your walk with God.</p>
       </div>
       <div className="glass-panel p-6 rounded-2xl shadow-sm">
            <textarea
                value={newJournalContent}
                onChange={(e) => setNewJournalContent(e.target.value)}
                placeholder="What is God speaking to you today?"
                className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-church-500 outline-none min-h-[120px] mb-4 bg-gray-50/50"
            ></textarea>
            <button 
                onClick={handleSaveJournal}
                disabled={!newJournalContent.trim() || isGeneratingDevotional}
                className="bg-church-600 text-white px-6 py-2 rounded-full font-bold hover:bg-church-700 transition flex items-center gap-2"
            >
                {isGeneratingDevotional ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                {isGeneratingDevotional ? 'Reflecting...' : 'Save Entry'}
            </button>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-72 flex-shrink-0 animate-fade-in-up">
            <div className="glass-panel rounded-2xl shadow-sm p-6 mb-6 sticky top-24">
              <div className="flex flex-col items-center text-center mb-8">
                <img src={user.avatarUrl} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white shadow-md mb-4 object-cover" />
                <h2 className="font-bold text-gray-900 text-xl font-serif">{user.firstName} {user.lastName}</h2>
                <p className="text-xs text-church-500 uppercase tracking-widest font-bold mt-1 bg-church-50 px-3 py-1 rounded-full">{user.role}</p>
              </div>
              <nav className="space-y-1.5">
                {[
                    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                    { id: 'profile', label: 'Profile', icon: User },
                    { id: 'wallet', label: 'Wallet', icon: CreditCard },
                    { id: 'messages', label: 'Inbox', icon: MessageSquare },
                    { id: 'journal', label: 'Journal', icon: BookHeart },
                    { id: 'schedule', label: 'Schedule', icon: Calendar },
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === tab.id ? 'bg-church-600 text-white shadow-lg' : 'text-gray-600 hover:bg-white hover:text-church-600'}`}
                    >
                        <tab.icon size={18} /> {tab.label}
                    </button>
                ))}
              </nav>
              <div className="border-t border-gray-100 mt-6 pt-6">
                <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                  <LogOut size={18} /> Sign Out
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'profile' && renderProfile()}
            {activeTab === 'wallet' && renderWallet()}
            {activeTab === 'messages' && renderMessages()}
            {activeTab === 'journal' && renderJournal()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberPortal;
