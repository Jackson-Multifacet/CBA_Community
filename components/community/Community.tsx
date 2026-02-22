import React, { useState } from 'react';
import { Users, MessageSquare, Rss } from 'lucide-react';
import SocialFeed from './SocialFeed';
import MemberDirectory from './MemberDirectory';
import ChatSystem from './ChatSystem';
import { Member } from '../../types';

const Community: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'members' | 'messages'>('feed');
  const [selectedMemberForChat, setSelectedMemberForChat] = useState<Member | null>(null);

  const handleMessageMember = (member: Member) => {
    setSelectedMemberForChat(member);
    setActiveTab('messages');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-gray-900 font-serif">Community</h1>
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setActiveTab('feed')}
                className={`px-4 py-2 rounded-md text-sm font-bold transition flex items-center gap-2 ${activeTab === 'feed' ? 'bg-white text-church-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Rss size={16} /> Feed
              </button>
              <button 
                onClick={() => setActiveTab('members')}
                className={`px-4 py-2 rounded-md text-sm font-bold transition flex items-center gap-2 ${activeTab === 'members' ? 'bg-white text-church-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Users size={16} /> Members
              </button>
              <button 
                onClick={() => setActiveTab('messages')}
                className={`px-4 py-2 rounded-md text-sm font-bold transition flex items-center gap-2 ${activeTab === 'messages' ? 'bg-white text-church-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <MessageSquare size={16} /> Messages
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'feed' && <SocialFeed />}
        {activeTab === 'members' && <MemberDirectory onMessage={handleMessageMember} />}
        {activeTab === 'messages' && <ChatSystem initialMember={selectedMemberForChat} />}
      </div>
    </div>
  );
};

export default Community;
