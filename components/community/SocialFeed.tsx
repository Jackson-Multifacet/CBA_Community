import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Heart, MessageSquare, Share2, Send, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { Post } from '../../types';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../../src/config';

const SocialFeed: React.FC = () => {
  const { posts, addPost, likePost, addComment } = useData();
  const { user } = useAuth();
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newPostContent.trim() && !selectedImage) || !user) return;
    
    setIsPosting(true);
    let imageUrl = '';

    if (selectedImage) {
      const uploadData = new FormData();
      uploadData.append('file', selectedImage);
      uploadData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      uploadData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: uploadData,
        });
        if (res.ok) {
          const data = await res.json();
          imageUrl = data.secure_url;
        }
      } catch (err) {
        console.error("Image upload failed", err);
      }
    }

    await addPost({
      content: newPostContent,
      authorId: user.id,
      authorName: `${user.firstName} ${user.lastName}`,
      authorAvatar: user.avatarUrl,
      ...(imageUrl && { imageUrl })
    } as Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments' | 'likedBy'>);

    setNewPostContent('');
    setSelectedImage(null);
    setImagePreview(null);
    setIsPosting(false);
  };

  const handleCommentSubmit = async (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!newCommentText.trim() || !user) return;

    await addComment(postId, {
      authorName: `${user.firstName} ${user.lastName}`,
      text: newCommentText
    });
    setNewCommentText('');
  };

  const handleShare = (post: Post) => {
    if (navigator.share) {
      navigator.share({
        title: `Post by ${post.authorName}`,
        text: post.content,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/community/post/${post.id}`);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Create Post */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-gray-100">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            <img src={user?.avatarUrl} alt="User" className="w-full h-full object-cover" />
          </div>
          <form onSubmit={handlePostSubmit} className="flex-1">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Share something with the community..."
              className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-church-500 min-h-[100px] resize-none mb-3"
            />
            
            {imagePreview && (
              <div className="relative mb-3 inline-block">
                <img src={imagePreview} alt="Preview" className="h-32 w-auto rounded-lg object-cover" />
                <button 
                  type="button" 
                  onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                  className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-1 hover:bg-gray-700"
                >
                  <X size={12} />
                </button>
              </div>
            )}

            <div className="flex justify-between items-center">
              <label className="cursor-pointer text-gray-500 hover:text-church-600 transition p-2 rounded-full hover:bg-gray-100">
                <ImageIcon size={20} />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
              </label>
              <button 
                type="submit" 
                disabled={(!newPostContent.trim() && !selectedImage) || isPosting}
                className="bg-church-600 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-church-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isPosting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} 
                {isPosting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                <img src={post.authorAvatar} alt={post.authorName} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">{post.authorName}</h3>
                <p className="text-xs text-gray-500">{new Date(post.timestamp).toLocaleString()}</p>
              </div>
            </div>
            
            <div className="px-4 pb-2">
              <p className="text-gray-800 leading-relaxed">{post.content}</p>
            </div>

            {post.imageUrl && (
              <div className="mt-3">
                <img src={post.imageUrl} alt="Post content" className="w-full h-auto object-cover max-h-96" />
              </div>
            )}

            <div className="p-4 border-t border-gray-50 flex items-center justify-between mt-2">
              <div className="flex gap-6">
                <button 
                  onClick={() => user && likePost(post.id, user.id)}
                  className={`flex items-center gap-2 text-sm font-bold transition ${post.likedBy.includes(user?.id || '') ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                >
                  <Heart size={18} fill={post.likedBy.includes(user?.id || '') ? "currentColor" : "none"} />
                  {post.likes}
                </button>
                <button 
                  onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                  className="flex items-center gap-2 text-gray-500 hover:text-church-600 text-sm font-bold transition"
                >
                  <MessageSquare size={18} />
                  {post.comments}
                </button>
              </div>
              <button onClick={() => handleShare(post)} className="text-gray-400 hover:text-church-600 transition">
                <Share2 size={18} />
              </button>
            </div>

            {/* Comments Section */}
            {activeCommentPostId === post.id && (
              <div className="bg-gray-50 p-4 border-t border-gray-100">
                <div className="space-y-4 mb-4">
                  {post.commentList?.map((comment: any) => (
                    <div key={comment.id} className="flex gap-2">
                      <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm text-sm flex-1">
                        <span className="font-bold text-gray-900 block text-xs mb-1">{comment.authorName}</span>
                        {comment.text}
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={(e) => handleCommentSubmit(e, post.id)} className="flex gap-2">
                  <input 
                    type="text" 
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Write a comment..." 
                    className="flex-1 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-church-500 text-sm"
                  />
                  <button 
                    type="submit" 
                    disabled={!newCommentText.trim()}
                    className="bg-church-600 text-white p-2 rounded-full hover:bg-church-700 transition disabled:opacity-50"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialFeed;
