import React, { useState, useRef, useEffect } from 'react';
import { Palette, Sun, Moon, Leaf, CloudMoon } from 'lucide-react';
import { useTheme, Theme } from '../context/ThemeContext';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themes: { id: Theme; name: string; icon: React.ReactNode; color: string }[] = [
    { id: 'grace', name: 'Grace (Light)', icon: <Sun size={16} />, color: 'bg-blue-500' },
    { id: 'eden', name: 'Eden (Nature)', icon: <Leaf size={16} />, color: 'bg-green-500' },
    { id: 'midnight', name: 'Midnight (Dark)', icon: <Moon size={16} />, color: 'bg-slate-800' },
    { id: 'vespers', name: 'Vespers (Purple)', icon: <CloudMoon size={16} />, color: 'bg-purple-800' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-church-600 transition-colors"
        aria-label="Change Theme"
      >
        <Palette size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-fade-in origin-top-right">
          <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Select Theme
          </div>
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTheme(t.id);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                theme === t.id ? 'text-church-600 font-bold bg-gray-50' : 'text-gray-700'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${t.color}`}></div>
              <span className="flex-1">{t.name}</span>
              {t.icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;