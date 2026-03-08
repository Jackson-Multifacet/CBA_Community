import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Send, User, Edit2, Trash2 } from 'lucide-react';
import { Member, DirectMessage } from '../../types';

interface ChatSystemProps {
  initialMember?: Member | null;
}

const ChatSystem: React.FC<ChatSystemProps> = ({ initialMember }) => {
  const { members, directMessages, sendDirectMessage, updateDirectMessage, deleteDirectMessage } = useData();
  const { user } = useAuth();
  const [selectedMember, setSelectedMember] = useState<Member | null>(initialMember || null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // Update selected member when prop changes
  useEffect(() => {
    if (initialMember) {
      setSelectedMember(initialMember);
    }
  }, [initialMember]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [directMessages, selectedMember]);

  // Filter conversations (unique users who have messaged or been messaged)
  const conversations = members.filter(m => 
    m.id !== user?.id && 
    (directMessages.some(msg => (msg.senderId === m.id && msg.receiverId === user?.id) || (msg.senderId === user?.id && msg.receiverId === m.id)) || m.id === initialMember?.id)
  );

  // Get messages for selected conversation
  const currentMessages = directMessages.filter(msg => 
    (msg.senderId === user?.id && msg.receiverId === selectedMember?.id) || 
    (msg.senderId === selectedMember?.id && msg.receiverId === user?.id)
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !selectedMember) return;

    const msg: DirectMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      receiverId: selectedMember.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false
    };

    await sendDirectMessage(msg);
    setNewMessage('');
  };

  return (
    <div className="flex h-[calc(100vh-200px)] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <p>No conversations yet.</p>
              <button className="mt-4 text-church-600 font-bold text-sm hover:underline">Start a chat</button>
            </div>
          ) : (
            conversations.map(member => (
              <div 
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition ${selectedMember?.id === member.id ? 'bg-church-50 border-l-4 border-church-600' : ''}`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                    <img src={member.avatarUrl} alt={member.firstName} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-sm truncate">{member.firstName} {member.lastName}</h4>
                  <p className="text-xs text-gray-500 truncate">Click to view messages</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedMember ? (
          <>
            {/* Header */}
            <div className="p-4 bg-white border-b border-gray-100 flex justify-between items-center shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                  <img src={selectedMember.avatarUrl} alt={selectedMember.firstName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{selectedMember.firstName} {selectedMember.lastName}</h3>
                  <span className="text-xs text-green-500 font-medium flex items-center gap-1">● Online</span>
                </div>
              </div>
              <div className="flex gap-4 text-gray-400">
                {/* Dummy call tools removed per request */}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentMessages.map(msg => {
                const isMe = msg.senderId === user?.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group mb-2`}>
                    {isMe && !editingMessageId && (
                       <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 mr-2 transition-opacity">
                         <button onClick={() => { setEditingMessageId(msg.id); setEditContent(msg.content); }} className="text-gray-400 hover:text-church-600" title="Edit message"><Edit2 size={14} /></button>
                         <button onClick={() => { if(window.confirm('Delete this message?')) deleteDirectMessage(msg.id) }} className="text-gray-400 hover:text-red-500" title="Delete message"><Trash2 size={14} /></button>
                       </div>
                    )}
                    
                    {editingMessageId === msg.id ? (
                      <div className="flex flex-col items-end max-w-[70%] w-full">
                         <input type="text" value={editContent} onChange={e => setEditContent(e.target.value)} className="w-full p-2 border border-church-200 rounded-lg text-sm mb-1 outline-none focus:ring-2 focus:ring-church-500" />
                         <div className="flex gap-2">
                           <button onClick={() => setEditingMessageId(null)} className="text-xs text-gray-400 hover:text-gray-600 font-bold transition">Cancel</button>
                           <button onClick={() => { updateDirectMessage(msg.id, editContent); setEditingMessageId(null); }} className="text-xs bg-church-600 text-white px-3 py-1 rounded-full font-bold hover:bg-church-700 transition">Save</button>
                         </div>
                      </div>
                    ) : (
                      <div className={`max-w-[70%] rounded-2xl p-3 shadow-sm ${isMe ? 'bg-church-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'}`}>
                        <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                        <span className={`text-[10px] block mt-1 text-right ${isMe ? 'text-church-200' : 'text-gray-400'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..." 
                  className="flex-1 p-3 bg-gray-100 rounded-full border-none focus:ring-2 focus:ring-church-500 outline-none"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-church-600 text-white p-3 rounded-full hover:bg-church-700 transition disabled:opacity-50 shadow-md"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <User size={40} className="text-gray-400" />
            </div>
            <p className="text-lg font-medium">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSystem;
