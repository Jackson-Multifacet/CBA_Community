
import React from 'react';
import { Church, Facebook, Instagram, Youtube, MapPin, Phone, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-church-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Church className="h-8 w-8 text-gold-500" />
              <span className="font-serif font-bold text-xl">CBA</span>
            </div>
            <p className="text-church-200 text-sm leading-relaxed mb-6">
              A community of believers dedicated to spreading the love of Christ, serving our neighbors, and growing in faith together.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-church-300 hover:text-white transition"><Facebook size={20} /></a>
              <a href="#" className="text-church-300 hover:text-white transition"><Instagram size={20} /></a>
              <a href="#" className="text-church-300 hover:text-white transition"><Youtube size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-serif font-semibold mb-4 text-gold-500">Ministries</h3>
            <ul className="space-y-2 text-church-200 text-sm">
              <li><a href="#" className="hover:text-white transition">Kids For Christ</a></li>
              <li><a href="#" className="hover:text-white transition">Teen for Christ</a></li>
              <li><a href="#" className="hover:text-white transition">Impact Makers</a></li>
              <li><a href="#" className="hover:text-white transition">Virtuous Women</a></li>
              <li><a href="#" className="hover:text-white transition">Men of Honour</a></li>
              <li><a href="#" className="hover:text-white transition">Outreach (Project 1000)</a></li>
            </ul>
          </div>

          {/* Service Times */}
          <div>
            <h3 className="text-lg font-serif font-semibold mb-4 text-gold-500">Service Times</h3>
            <ul className="space-y-3 text-church-200 text-sm">
              <li className="flex justify-between border-b border-church-700 pb-2">
                <span>Sunday Service</span>
                <span className="font-semibold text-white">8:00 AM</span>
              </li>
              <li className="flex justify-between border-b border-church-700 pb-2">
                <span>Bible Study (Wed)</span>
                <span className="font-semibold text-white">6:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-church-700 pb-2">
                <span>Feast of Plenty (Fri)</span>
                <span className="font-semibold text-white">6:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-serif font-semibold mb-4 text-gold-500">Visit Us</h3>
            <ul className="space-y-4 text-church-200 text-sm">
              <li className="flex gap-3">
                <MapPin className="h-5 w-5 text-church-400 flex-shrink-0" />
                <span>18 Moloney Street,<br />Lagos Island, Lagos</span>
              </li>
              <li className="flex gap-3">
                <Phone className="h-5 w-5 text-church-400 flex-shrink-0" />
                <span>08057797482, 08035230642</span>
              </li>
              <li className="flex gap-3">
                <Mail className="h-5 w-5 text-church-400 flex-shrink-0" />
                <span>goodeypeace@yahoo.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-church-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-church-400">
          <p>&copy; {new Date().getFullYear()} Christ Believers Assembly. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
