
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Church, UserCircle, LogIn, Book, LayoutDashboard, Image as ImageIcon, Brain } from 'lucide-react';
import ThemeSwitcher from './ThemeSwitcher';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Sermons', path: '/sermons' },
    { name: 'Events', path: '/events' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Trivia', path: '/bible-trivia' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isAdmin = user && (user.role === 'Pastor' || user.role === 'Leader' || user.role === 'Admin' as any);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50' 
        : 'bg-white shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
              <div className="bg-church-50 p-2 rounded-full group-hover:bg-church-100 transition duration-300">
                <Church className="h-6 w-6 text-church-600" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xl text-church-900 leading-none">Christ Believers</span>
                <span className="text-xs text-church-500 font-medium tracking-widest uppercase">Assembly</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex space-x-1 bg-gray-100/50 p-1.5 rounded-full border border-gray-200/50 backdrop-blur-sm">
               {navLinks.map((link) => (
                 <Link
                   key={link.name}
                   to={link.path}
                   className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                     isActive(link.path)
                       ? 'text-church-700 bg-white shadow-sm scale-105'
                       : 'text-gray-600 hover:text-church-600 hover:bg-white/50'
                   }`}
                 >
                   {link.name}
                 </Link>
               ))}
            </div>

            <div className="h-6 w-px bg-gray-200"></div>

            <div className="flex items-center gap-3">
              <ThemeSwitcher />
              
              {user ? (
                 <div className="flex items-center gap-2">
                     <Link 
                        to="/portal"
                        className="flex items-center gap-2 bg-gradient-to-r from-church-50 to-white text-church-700 px-4 py-2 rounded-full font-medium hover:shadow-md transition-all duration-300 border border-church-100 text-sm"
                      >
                        <UserCircle size={18} />
                        <span>Portal</span>
                      </Link>
                      {isAdmin && (
                         <Link 
                           to="/admin"
                           className="bg-church-800 text-white p-2 rounded-full hover:bg-black transition tooltip"
                           title="Admin Dashboard"
                         >
                             <LayoutDashboard size={18} />
                         </Link>
                      )}
                 </div>
              ) : (
                  <Link 
                    to="/login"
                    className="flex items-center gap-2 text-gray-600 hover:text-church-600 font-medium px-2 py-2 transition-all duration-300 text-sm"
                  >
                    <LogIn size={18} />
                    <span>Sign In</span>
                  </Link>
              )}
             
              <Link 
                to="/portal" 
                state={{ tab: 'wallet' }}
                className="bg-gradient-to-r from-church-600 to-church-500 text-white px-5 py-2 rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 text-sm shadow-church-200/50 shadow-md"
              >
                Give Online
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4 lg:hidden">
            <ThemeSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 absolute w-full shadow-xl animate-fade-in-up h-[calc(100vh-80px)] overflow-y-auto">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all ${
                  isActive(link.path)
                    ? 'text-church-700 bg-church-50 shadow-sm border border-church-100'
                    : 'text-gray-600 hover:text-church-600 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-gray-100 my-4"></div>
            {user ? (
                 <>
                    <Link
                        to="/portal"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-church-600 bg-church-50"
                    >
                        <UserCircle size={20} />
                        Member Portal
                    </Link>
                    {isAdmin && (
                        <Link
                            to="/admin"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-white bg-church-800 mt-2"
                        >
                            <LayoutDashboard size={20} />
                            Admin Dashboard
                        </Link>
                    )}
                 </>
            ) : (
                <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-gray-600 hover:bg-gray-50"
                  >
                    <LogIn size={20} />
                    Sign In
                  </Link>
            )}
           
            <div className="pt-2">
              <Link 
                to="/portal" 
                state={{ tab: 'wallet' }}
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-church-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-church-700 shadow-lg shadow-church-200/50"
              >
                Give Online
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
