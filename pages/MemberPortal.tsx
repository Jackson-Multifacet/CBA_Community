import React, { useState, useEffect } from 'react';
declare const PaystackPop: any;
import { useNavigate, Link, useLocation } from 'react-router-dom';
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
  Brain,
  Users
} from 'lucide-react';
import { WalletTransaction, InboxMessage, JournalEntry, Member } from '../types';
import { generateDevotionalThought } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import CurrencySwitcher from '../components/CurrencySwitcher';
import Community from '../components/community/Community';
import { useData } from '../context/DataContext';

const MemberPortal: React.FC = () => {
  const { user, logout, updateProfile, isLoading, campuses } = useAuth();
  const { transactions, addTransaction } = useData();
  const { formatAmount, currency } = useCurrency();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'wallet' | 'messages' | 'journal' | 'schedule' | 'profile' | 'community'>('dashboard');
  
  useEffect(() => {
    if (location.state?.tab) {
        setActiveTab(location.state.tab);
    }
  }, [location]);
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Member>>({});

  useEffect(() => {
    if (!isLoading && !user) {
        navigate('/login');
    }
  }, [user, isLoading, navigate]);

  // Root state removed as we use DataContext transactions
  const [showGiveModal, setShowGiveModal] = useState(false);
  const [giveAmount, setGiveAmount] = useState('');
  const [givingType, setGivingType] = useState<'Tithe' | 'Offering'>('Tithe');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('bank');

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [newJournalContent, setNewJournalContent] = useState('');
  const [isGeneratingDevotional, setIsGeneratingDevotional] = useState(false);

  const messages: InboxMessage[] = [];

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
    if (!giveAmount || !user) return;
    const amount = parseFloat(giveAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    const handler = PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder',
      email: user.email,
      amount: amount * 100, // Paystack uses Kobo/Cents
      currency: currency.code === 'NGN' ? 'NGN' : 'USD',
      ref: '' + Math.floor((Math.random() * 1000000000) + 1),
      onClose: () => {
        alert('Transaction cancelled.');
      },
      callback: (response: any) => {
        // In production, you would verify this on the server
        const newTransaction: Omit<WalletTransaction, 'id'> = {
          date: new Date().toISOString(),
          description: `Online ${givingType} (Ref: ${response.reference})`,
          amount: amount,
          type: 'credit',
          category: givingType
        };
        addTransaction(newTransaction);
        setShowGiveModal(false);
        setGiveAmount('');
        alert('Thank you for your seed! Your Kingdom Wallet has been updated.');
      }
    });
    handler.openIframe();
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
        {/* Placeholder for future dynamic Events/Library integration - removed hardcoded 2023 demo data */}
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

                <div className="glass-panel p-6 rounded-2xl shadow-sm md:col-span-2">
                    <h3 className="text-lg font-bold text-church-800 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2"><Sparkles size={18} /> Privacy Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                            <div>
                                <p className="text-sm font-bold text-gray-900">Show in Directory</p>
                                <p className="text-xs text-gray-500">Allow other members to find you</p>
                            </div>
                            <input 
                                type="checkbox" 
                                disabled={!isEditingProfile}
                                checked={editForm.privacySettings?.showInDirectory ?? true}
                                onChange={e => handleEditChange('privacySettings.showInDirectory', e.target.checked)}
                                className="w-5 h-5 accent-church-600"
                            />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                            <div>
                                <p className="text-sm font-bold text-gray-900">Show Phone</p>
                                <p className="text-xs text-gray-500">Visible to other members</p>
                            </div>
                            <input 
                                type="checkbox" 
                                disabled={!isEditingProfile}
                                checked={editForm.privacySettings?.showPhone ?? true}
                                onChange={e => handleEditChange('privacySettings.showPhone', e.target.checked)}
                                className="w-5 h-5 accent-church-600"
                            />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                            <div>
                                <p className="text-sm font-bold text-gray-900">Show Email</p>
                                <p className="text-xs text-gray-500">Visible to other members</p>
                            </div>
                            <input 
                                type="checkbox" 
                                disabled={!isEditingProfile}
                                checked={editForm.privacySettings?.showEmail ?? true}
                                onChange={e => handleEditChange('privacySettings.showEmail', e.target.checked)}
                                className="w-5 h-5 accent-church-600"
                            />
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
        <div className="flex items-center gap-3">
            <CurrencySwitcher />
            <button onClick={() => setShowGiveModal(true)} className="bg-church-600 text-white px-6 py-2 rounded-full font-bold hover:bg-church-700 transition shadow-lg shadow-church-200/50 flex items-center gap-2">
            <Heart size={18} /> Give Now
            </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-church-900 to-church-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-church-200 text-sm font-medium mb-1">Total Giving (YTD)</p>
            <h3 className="text-3xl font-bold">{formatAmount(calculateTotalGiving())}</h3>
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
                {t.type === 'credit' ? '+' : '-'}{formatAmount(t.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Give Modal */}
      {showGiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl animate-scale-in border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Give Online</h3>
              <button onClick={() => setShowGiveModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">{currency.symbol}</span>
                  <input 
                    type="number" 
                    value={giveAmount}
                    onChange={(e) => setGiveAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-church-500 outline-none font-bold text-lg"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Type</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setGivingType('Tithe')}
                    className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${givingType === 'Tithe' ? 'bg-church-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    Tithe
                  </button>
                  <button 
                    onClick={() => setGivingType('Offering')}
                    className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${givingType === 'Offering' ? 'bg-church-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    Offering
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Giving Channel</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 ${paymentMethod === 'card' ? 'bg-church-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    <CreditCard size={18} /> Pay Online
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('bank')}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 ${paymentMethod === 'bank' ? 'bg-church-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    <Church size={18} /> Bank Details
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 text-center flex items-center justify-center gap-1">
                  <Sparkles size={10} /> Securely processed by <strong>Paystack</strong>
                </p>
              </div>

              {paymentMethod === 'bank' && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm">
                  <p className="font-bold text-gray-900 mb-2">Bank Account Details</p>
                  <div className="space-y-1 text-gray-600">
                    <div className="flex justify-between">
                      <span>Bank Name:</span>
                      <span className="font-medium text-gray-900">Unity Bank</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Account Name:</span>
                      <span className="font-medium text-gray-900">Christ Believers Healing Ministry</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Account Number:</span>
                      <span className="font-medium text-gray-900">0057469027</span>
                    </div>
                  </div>
                  <p className="text-xs text-church-600 mt-3 italic">
                    Please use your name as the transaction reference.
                  </p>
                </div>
              )}

              <button 
                onClick={handleGive}
                className="w-full bg-church-600 text-white py-4 rounded-xl font-bold hover:bg-church-700 transition shadow-lg mt-4 flex items-center justify-center gap-2"
              >
                {paymentMethod === 'card' ? <><CreditCard size={18} /> Proceed to Pay</> : <><History size={18} /> I have made the transfer</>}
              </button>
            </div>
          </div>
        </div>
      )}
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
                <img src={user.avatarUrl} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white shadow-md mb-4 object-cover" referrerPolicy="no-referrer" />
                <h2 className="font-bold text-gray-900 text-xl font-serif">{user.firstName} {user.lastName}</h2>
                <p className="text-xs text-church-500 uppercase tracking-widest font-bold mt-1 bg-church-50 px-3 py-1 rounded-full">{user.role}</p>
              </div>
              <nav className="space-y-1.5">
                {[
                    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                    { id: 'community', label: 'Community', icon: Users },
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
            {activeTab === 'community' && <Community />}
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
