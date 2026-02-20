
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, Map as MapIcon, List } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { generatePrayerResponse } from '../services/geminiService';

// Fix for Leaflet default icon issues
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

const branches = [
  {
    id: 1,
    name: "National Headquarter",
    parish: "Jesus Sanctuary",
    address: "1, Oluwakemi Street, Off Ado Road, Lekki, Lagos",
    coords: [6.4698, 3.5852] as [number, number],
  },
  {
    id: 2,
    name: "Ikorodu Branch",
    parish: "House Of David Parish",
    address: "Jck Hotels, 2 Yomi Ogunsanya street Behind AP Bus Stop Off Gberigbe Road, Ikorodu, Lagos",
    coords: [6.6194, 3.5105] as [number, number],
  },
  {
    id: 3,
    name: "Abak Branch",
    parish: "Amazing Grace Parish",
    address: "22b Ebom Avenue, Abak, Akwa Ibom State",
    coords: [4.9833, 7.7833] as [number, number],
  },
  {
    id: 4,
    name: "Isheri Branch",
    parish: "Unlimited Favour Parish",
    address: "51, Liadi Disu Street, Isheri Oshun, Alimosho, Lagos",
    coords: [6.5447, 3.2687] as [number, number],
  }
];

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    type: 'general', // general or prayer
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponseMessage(null);

    // If it's a prayer request, generate an AI response immediately
    if (formData.type === 'prayer') {
      const prayer = await generatePrayerResponse(formData.message, formData.name);
      setResponseMessage(prayer);
    } else {
      // Simulate form submission
      setTimeout(() => {
        setResponseMessage("Thank you for contacting us. We will get back to you shortly.");
      }, 1000);
    }
    
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-church-900 py-16 text-center text-white">
        <h1 className="text-4xl font-serif font-bold mb-4">Get in Touch</h1>
        <p className="text-church-200 text-lg max-w-2xl mx-auto px-4">
          Whether you have a question, need directions, or want to submit a prayer request, we are here for you.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Church Office</h2>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-church-50 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-church-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Church Office</h3>
                  <p className="text-gray-600 mt-1">18 Moloney Street<br />Lagos Island, Lagos</p>
                  <a href="#" className="text-church-600 text-sm font-medium mt-2 inline-block hover:underline">Get Directions</a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-church-50 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-church-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Phone</h3>
                  <p className="text-gray-600 mt-1">08057797482<br/>08035230642</p>
                  <p className="text-sm text-gray-500 mt-1">Mon-Fri, 9am - 5pm</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-church-50 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-church-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600 mt-1">goodeypeace@yahoo.com</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-gold-50 border border-gold-200 rounded-xl">
              <h3 className="font-serif font-bold text-church-800 text-lg mb-2">Need Prayer?</h3>
              <p className="text-church-700 mb-4">
                Our prayer team gathers every Tuesday night. Select "Prayer Request" in the form, and we will pray for you by name. 
                Our digital assistant will also provide an immediate prayer for you.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
            
            {responseMessage ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center animate-fade-in">
                <h3 className="text-green-800 font-bold text-lg mb-2">Received</h3>
                <p className="text-green-700 italic">"{responseMessage}"</p>
                <button 
                  onClick={() => { setResponseMessage(null); setFormData(prev => ({...prev, message: ''})); }}
                  className="mt-6 text-sm text-green-800 font-semibold hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-church-500 focus:ring-church-500 border p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-church-500 focus:ring-church-500 border p-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-church-500 focus:ring-church-500 border p-2"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="prayer">Prayer Request</option>
                    <option value="pastoral">Pastoral Counseling</option>
                    <option value="events">Events</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-church-500 focus:ring-church-500 border p-2"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-church-600 text-white py-3 px-4 rounded-md font-medium hover:bg-church-700 transition flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : <Send className="h-5 w-5" />}
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <h2 className="text-3xl font-serif font-bold text-gray-900">Our Branches</h2>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${viewMode === 'list' ? 'bg-white shadow-sm text-church-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <List className="h-4 w-4" />
              <span className="text-sm font-medium">List View</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${viewMode === 'map' ? 'bg-white shadow-sm text-church-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <MapIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Map View</span>
            </button>
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {branches.map((branch) => (
              <div key={branch.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="bg-church-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-church-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{branch.name}</h3>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Christ Believers Assembly</p>
                <p className="text-sm text-church-600 font-medium mb-2">{branch.parish}</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {branch.address}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[500px] rounded-2xl overflow-hidden shadow-lg border border-gray-200 relative z-10">
            <MapContainer center={[6.5244, 3.3792]} zoom={7} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {branches.map((branch) => (
                <Marker key={branch.id} position={branch.coords}>
                  <Popup>
                    <div className="p-1">
                      <h3 className="font-bold text-gray-900">{branch.name}</h3>
                      <p className="text-xs text-church-600 font-semibold mb-1">{branch.parish}</p>
                      <p className="text-xs text-gray-600 leading-tight">{branch.address}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
