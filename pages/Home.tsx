
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Video, MapPin, Heart, Sparkles } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[700px] flex items-center justify-center text-center text-white overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-church-900/40 to-church-900/80 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 animate-scale-in" 
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1920&q=80")',
            animationDuration: '10s' 
          }}
        />
        
        <div className="relative z-20 max-w-4xl mx-auto px-4">
          <div className="animate-fade-in-up">
            <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 text-white border border-white/20 text-sm font-semibold tracking-widest mb-6 backdrop-blur-md shadow-lg">
              WELCOME HOME
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight animate-fade-in-up delay-100 drop-shadow-lg">
            Belong. Believe. <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-white">Become.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 mb-10 max-w-2xl mx-auto font-light animate-fade-in-up delay-200 leading-relaxed">
            Join Christ Believers Assembly in worship, fellowship, and service. There is a place for you here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
            <Link to="/about" className="bg-gold-500 text-church-900 px-8 py-4 rounded-full font-bold hover:bg-gold-600 transition-all duration-300 hover:scale-105 shadow-lg shadow-gold-500/20">
              Plan Your Visit
            </Link>
            <Link to="/sermons" className="bg-white/10 border border-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all duration-300 hover:scale-105">
              Watch Sermons
            </Link>
          </div>
        </div>
      </section>

      {/* Service Times & Location Strip */}
      <section className="relative -mt-16 z-30 px-4 mb-20">
        <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="flex flex-col items-center px-4 group cursor-default">
              <div className="bg-church-50 p-3 rounded-full mb-3 group-hover:bg-church-100 transition duration-300 group-hover:scale-110">
                <Calendar className="h-6 w-6 text-church-600" />
              </div>
              <h3 className="font-serif text-lg font-bold mb-1 text-gray-900">Service Times</h3>
              <p className="text-gray-500 text-sm">Sunday Service: 8:00 AM</p>
              <p className="text-gray-500 text-sm">Wednesdays: 6:00 PM</p>
              <p className="text-gray-500 text-sm">Fridays: 6:00 PM</p>
            </div>
            <div className="flex flex-col items-center px-4 pt-6 md:pt-0 group cursor-default">
              <div className="bg-church-50 p-3 rounded-full mb-3 group-hover:bg-church-100 transition duration-300 group-hover:scale-110">
                <MapPin className="h-6 w-6 text-church-600" />
              </div>
              <h3 className="font-serif text-lg font-bold mb-1 text-gray-900">Location</h3>
              <p className="text-gray-500 text-sm">18 Moloney Street</p>
              <p className="text-gray-500 text-sm">Lagos Island, Lagos</p>
            </div>
            <div className="flex flex-col items-center px-4 pt-6 md:pt-0 group cursor-default">
               <div className="bg-church-50 p-3 rounded-full mb-3 group-hover:bg-church-100 transition duration-300 group-hover:scale-110">
                <Video className="h-6 w-6 text-church-600" />
              </div>
              <h3 className="font-serif text-lg font-bold mb-1 text-gray-900">Online Campus</h3>
              <p className="text-gray-500 text-sm">Live streaming available</p>
              <p className="text-gray-500 text-sm">Every Sunday at 8:00 AM</p>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-gold-500 to-church-600 rounded-2xl opacity-20 group-hover:opacity-30 blur-lg transition duration-500"></div>
            <img 
              src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80" 
              alt="Congregation worshipping" 
              className="relative rounded-2xl shadow-2xl transform transition duration-500 group-hover:-translate-y-2 object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="md:w-1/2">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-px w-8 bg-gold-500"></span>
              <h2 className="text-gold-600 font-bold tracking-widest uppercase text-sm">Who We Are</h2>
            </div>
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6 leading-tight">A Community Rooted in Love</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              At Christ Believers Assembly, we believe that the church is not a building, but a family. 
              We are dedicated to teaching the uncompromised Word of God, fostering authentic community, 
              and empowering believers to live out their purpose.
            </p>
            <Link to="/about" className="inline-flex items-center text-church-600 font-bold hover:text-church-800 transition group">
              Meet Our Leadership <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Sermon */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Latest Sermon</h2>
              <p className="text-gray-600 mt-2">Catch up on the latest message from this Sunday.</p>
            </div>
            <Link to="/sermons" className="hidden md:inline-flex items-center text-church-600 font-semibold hover:text-church-800">
              View All Archives <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden shadow-xl flex flex-col md:flex-row group hover:shadow-2xl transition-all duration-500">
            <div className="md:w-2/5 h-64 md:h-auto bg-gray-200 relative overflow-hidden">
               <img src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=600&q=80" alt="Sermon thumbnail" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110" referrerPolicy="no-referrer"/>
               <div className="absolute inset-0 bg-church-900/30 group-hover:bg-church-900/40 transition duration-300"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-md rounded-full p-4 transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition duration-500">
                    <Video className="text-white h-8 w-8" />
                  </div>
               </div>
            </div>
            <div className="p-8 md:w-3/5 flex flex-col justify-center bg-white/50 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                 <span className="bg-church-100 text-church-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Faith Series</span>
                 <span className="text-gray-500 text-sm">October 24, 2023</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-church-600 transition">Walking on Water: Faith in the Storm</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                When the winds of life pick up, where is your focus? Join Pastor Michael as we explore Peter's journey and what it means to keep our eyes on Jesus.
              </p>
              <div className="flex gap-4">
                <button className="bg-church-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-church-700 transition shadow-md shadow-church-200/50">
                  Watch Now
                </button>
                <button className="border border-church-200 text-church-700 px-6 py-2.5 rounded-full font-medium hover:bg-church-50 transition">
                  Read Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action: Prayer/Giving */}
      <section className="py-24 bg-church-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-church-700 rounded-full blur-[100px] opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-gold-600 rounded-full blur-[100px] opacity-20"></div>
        
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <div className="bg-white/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-md border border-white/10 animate-float">
             <Heart className="h-10 w-10 text-gold-500" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">How Can We Pray For You?</h2>
          <p className="text-xl text-church-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            We believe in the power of prayer. Our team meets weekly to pray over every request submitted. 
            You are not alone in your journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
             <Link to="/contact" className="bg-gold-500 text-church-900 px-8 py-3.5 rounded-full font-bold hover:bg-gold-400 transition transform hover:-translate-y-1 hover:shadow-xl shadow-lg shadow-gold-500/20">
               Submit Prayer Request
             </Link>
             <Link to="/contact" className="bg-transparent border border-white/30 text-white px-8 py-3.5 rounded-full font-bold hover:bg-white/10 transition backdrop-blur-sm">
               Contact Us
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
