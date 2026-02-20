import React from 'react';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const BibleInstitute: React.FC = () => {
  return (
    <div className="min-h-screen bg-church-900 flex flex-col items-center justify-center relative overflow-hidden px-4">
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-church-600 rounded-full blur-[150px] opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-600 rounded-full blur-[150px] opacity-20"></div>

      <div className="relative z-10 text-center animate-fade-in-up">
        <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-2xl animate-float">
           <GraduationCap size={48} className="text-gold-400" />
        </div>

        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 tracking-tight">
          Believers Bible <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-white">Institute</span>
        </h1>

        <p className="text-church-200 text-xl max-w-2xl mx-auto mb-12 font-light">
          An accredited college for theological excellence is on the horizon. 
          Prepare to deepen your understanding of the Word.
        </p>

        <div className="inline-block relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-gold-500 to-church-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
          <div className="relative px-12 py-4 bg-church-950 rounded-full leading-none flex items-center">
            <span className="text-2xl font-bold text-white tracking-widest uppercase">
              Hello, We Are Coming Soon
            </span>
          </div>
        </div>

        <div className="mt-16">
          <Link to="/portal" className="text-church-300 hover:text-white flex items-center justify-center gap-2 transition-colors">
            <ArrowLeft size={20} /> Back to Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BibleInstitute;