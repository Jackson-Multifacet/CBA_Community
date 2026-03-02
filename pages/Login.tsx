import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const getAuthErrorMessage = (code: string): string => {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Incorrect email or password. Please try again.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a moment and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    default:
      return 'Something went wrong. Please try again.';
  }
};

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    
    try {
      await login(email, password);
      navigate('/portal');
    } catch (err: any) {
      setError(getAuthErrorMessage(err.code));
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen pt-20 pb-12 flex items-center justify-center relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1920&q=80")' }} />
        <div className="absolute inset-0 bg-gradient-to-tr from-church-900/90 to-church-800/80 z-10" />

        <div className="relative z-20 w-full max-w-md px-4 animate-fade-in-up">
            <div className="glass-panel p-8 rounded-2xl shadow-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-serif font-bold text-gray-900">Welcome Back</h2>
                    <p className="text-gray-500 mt-2">Sign in to access your member portal</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-church-600 transition" size={20} />
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-church-500 focus:border-church-500 bg-white/50 backdrop-blur-sm transition outline-none"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-church-600 transition" size={20} />
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-church-500 focus:border-church-500 bg-white/50 backdrop-blur-sm transition outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                            <input type="checkbox" className="rounded text-church-600 focus:ring-church-500" />
                            Remember me
                        </label>
                        <button type="button" className="text-church-600 hover:text-church-800 font-medium">Forgot Password?</button>
                    </div>

                    <button 
                        type="submit" 
                        disabled={submitting}
                        className="w-full bg-church-600 text-white py-3.5 rounded-xl font-bold hover:bg-church-700 transition shadow-lg shadow-church-200/50 flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {submitting ? <Loader2 className="animate-spin" size={20} /> : <>Sign In <ArrowRight size={20} /></>}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-gold-600 font-bold hover:text-gold-700 hover:underline">
                        Become a Member
                    </Link>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
                    <p>Demo Account: joshua.d@example.com / any password</p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Login;