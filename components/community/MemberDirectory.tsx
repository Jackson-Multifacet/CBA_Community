import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Search, UserPlus, MessageCircle } from 'lucide-react';
import { Member } from '../../types';

interface MemberDirectoryProps {
  onMessage: (member: Member) => void;
}

const MemberDirectory: React.FC<MemberDirectoryProps> = ({ onMessage }) => {
  const { members } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = members.filter(m => 
    m.id !== user?.id && // Don't show current user
    (m.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
     m.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-gray-100 sticky top-20 z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search members..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-church-500 outline-none"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map(member => (
          <div key={member.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-md transition animate-fade-in-up">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-4 border-4 border-white shadow-sm">
              <img src={member.avatarUrl} alt={`${member.firstName} ${member.lastName}`} className="w-full h-full object-cover" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">{member.firstName} {member.lastName}</h3>
            <p className="text-church-500 text-sm font-medium mb-4">{member.role}</p>
            
            <div className="flex gap-2 w-full mt-auto">
              <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl font-bold text-sm hover:bg-gray-200 transition flex items-center justify-center gap-2">
                <UserPlus size={16} /> Connect
              </button>
              <button 
                onClick={() => onMessage(member)}
                className="flex-1 bg-church-600 text-white py-2 rounded-xl font-bold text-sm hover:bg-church-700 transition flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} /> Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberDirectory;
