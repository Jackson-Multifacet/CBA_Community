
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Sermon, Event, Article, GalleryItem, Book } from '../types';
import { 
    Plus, Edit2, Trash2, X, Save, LayoutDashboard, Eye, Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MediaUpload from '../components/MediaUpload';

type ContentType = 'sermons' | 'events' | 'articles' | 'gallery' | 'books';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
      sermons, addSermon, updateSermon, deleteSermon,
      events, addEvent, updateEvent, deleteEvent,
      articles, addArticle, updateArticle, deleteArticle,
      galleryItems, addGalleryItem, deleteGalleryItem,
      books, addBook, updateBook, deleteBook
  } = useData();

  const [activeTab, setActiveTab] = useState<ContentType>('sermons');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  
  // State to track uploads
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [uploadedResourceUrl, setUploadedResourceUrl] = useState('');

  // Redirect if not authorized
  if (!user || (user.role !== 'Pastor' && user.role !== 'Leader' && user.role !== 'Admin' as any)) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
              <p className="text-gray-500 mb-4">You do not have permission to view this area.</p>
              <button onClick={() => navigate('/portal')} className="text-church-600 hover:underline">Return to Portal</button>
          </div>
      );
  }

  const handleEdit = (item: any) => {
      setEditingItem(item);
      setUploadedImageUrl(item.imageUrl || item.url || '');
      setUploadedResourceUrl(item.downloadUrl || '');
      setIsModalOpen(true);
  };

  const handleAddNew = () => {
      setEditingItem(null);
      setUploadedImageUrl('');
      setUploadedResourceUrl('');
      setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
      if(!window.confirm("Are you sure you want to delete this item?")) return;
      if (activeTab === 'sermons') deleteSermon(id);
      if (activeTab === 'events') deleteEvent(id);
      if (activeTab === 'articles') deleteArticle(id);
      if (activeTab === 'gallery') deleteGalleryItem(id);
      if (activeTab === 'books') deleteBook(id);
  };

  const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const data: any = Object.fromEntries(formData.entries());

      // Basic ID generation if new
      if (!editingItem) {
          data.id = `${activeTab.charAt(0)}${Date.now()}`;
      } else {
          data.id = editingItem.id;
      }

      if (activeTab === 'sermons') {
          data.tags = (data.tags as string).split(',').map(s => s.trim());
          if(editingItem) updateSermon(data as Sermon);
          else addSermon(data as Sermon);
      } else if (activeTab === 'events') {
          data.featured = (form.elements.namedItem('featured') as HTMLInputElement)?.checked; 
          if(editingItem) updateEvent(data as Event);
          else addEvent(data as Event);
      } else if (activeTab === 'articles') {
          data.imageUrl = uploadedImageUrl; // Use state from uploader
          if(editingItem) updateArticle(data as Article);
          else addArticle(data as Article);
      } else if (activeTab === 'gallery') {
          data.url = uploadedImageUrl; // Use state from uploader
          if(editingItem) {
             // In a real DB we would update, but context helpers simulate by replacing
             deleteGalleryItem(editingItem.id); 
             addGalleryItem(data as GalleryItem);
          } else {
             addGalleryItem(data as GalleryItem);
          }
      } else if (activeTab === 'books') {
          data.price = parseFloat(data.price);
          data.imageUrl = uploadedImageUrl; // Cover
          data.downloadUrl = uploadedResourceUrl; // PDF
          if(editingItem) updateBook(data as Book);
          else addBook(data as Book);
      }

      setIsModalOpen(false);
  };

  const renderForm = () => {
      if (activeTab === 'sermons') {
          const item: Partial<Sermon> = editingItem || {};
          return (
              <>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                          <input name="title" defaultValue={item.title} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-church-500" />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Preacher</label>
                          <input name="preacher" defaultValue={item.preacher} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-church-500" />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
                          <input name="date" type="text" placeholder="Oct 24, 2023" defaultValue={item.date} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-church-500" />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Passage</label>
                          <input name="passage" defaultValue={item.passage} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-church-500" />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                          <select name="category" defaultValue={item.category || 'Full Service'} className="w-full p-2 border rounded-lg">
                              <option value="Full Service">Full Service</option>
                              <option value="Nugget">Nugget</option>
                              <option value="Series">Series</option>
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Duration</label>
                          <input name="duration" placeholder="e.g. 55:00" defaultValue={item.duration} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-church-500" />
                      </div>
                      <div className="col-span-2">
                          <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                          <textarea name="description" rows={3} defaultValue={item.description} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-church-500" />
                      </div>
                      <div className="col-span-2">
                          <label className="block text-sm font-bold text-gray-700 mb-1">Tags (comma separated)</label>
                          <input name="tags" defaultValue={item.tags?.join(', ')} placeholder="Faith, Love, Hope" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-church-500" />
                      </div>
                      {/* Note: Sermons usually use YouTube links, but you could add a thumbnail uploader here if desired */}
                  </div>
              </>
          );
      }
      if (activeTab === 'events') {
          const item: Partial<Event> = editingItem || {};
          return (
              <>
                  <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                          <label className="block text-sm font-bold text-gray-700 mb-1">Event Title</label>
                          <input name="title" defaultValue={item.title} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-church-500" />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
                          <input name="date" placeholder="e.g. Nov 28, 2023" defaultValue={item.date} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-church-500" />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Time</label>
                          <input name="time" placeholder="e.g. 6:00 PM" defaultValue={item.time} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-church-500" />
                      </div>
                      <div className="col-span-2">
                          <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
                          <input name="location" defaultValue={item.location} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-church-500" />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                          <select name="category" defaultValue={item.category || 'Community'} className="w-full p-2 border rounded-lg">
                              <option value="Worship">Worship</option>
                              <option value="Community">Community</option>
                              <option value="Outreach">Outreach</option>
                              <option value="Youth">Youth</option>
                              <option value="Program">Program</option>
                          </select>
                      </div>
                       <div className="flex items-center mt-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" name="featured" defaultChecked={item.featured} className="w-5 h-5 text-church-600 rounded" />
                              <span className="font-bold text-gray-700">Feature on Homepage</span>
                          </label>
                      </div>
                      <div className="col-span-2">
                          <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                          <textarea name="description" rows={3} defaultValue={item.description} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-church-500" />
                      </div>
                  </div>
              </>
          );
      }
      if (activeTab === 'articles') {
          const item: Partial<Article> = editingItem || {};
          return (
              <>
                  <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                          <label className="block text-sm font-bold text-gray-700 mb-1">Article Title</label>
                          <input name="title" defaultValue={item.title} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-church-500" />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Author</label>
                          <input name="author" defaultValue={item.author} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-church-500" />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                          <input name="category" defaultValue={item.category} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-church-500" />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
                          <input name="date" defaultValue={item.date} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-church-500" />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Read Time</label>
                          <input name="readTime" defaultValue={item.readTime} placeholder="e.g. 5 min" required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-church-500" />
                      </div>
                      <div className="col-span-2">
                          <MediaUpload 
                            label="Cover Image"
                            initialUrl={item.imageUrl}
                            onUploadComplete={setUploadedImageUrl}
                          />
                          {/* Hidden input to ensure HTML5 validation works if field is required, though logic is handled in handleSave */}
                          <input type="hidden" name="imageUrl" value={uploadedImageUrl} required />
                      </div>
                      <div className="col-span-2">
                          <label className="block text-sm font-bold text-gray-700 mb-1">Content (HTML Supported)</label>
                          <textarea name="content" rows={8} defaultValue={item.content} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-church-500 font-mono text-sm" />
                          <p className="text-xs text-gray-400 mt-1">Use &lt;p&gt;, &lt;h3&gt;, &lt;ul&gt; tags for formatting.</p>
                      </div>
                  </div>
              </>
          );
      }
      if (activeTab === 'gallery') {
          const item: Partial<GalleryItem> = editingItem || {};
          return (
              <>
                  <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                          <label className="block text-sm font-bold text-gray-700 mb-1">Title / Caption</label>
                          <input name="title" defaultValue={item.title} placeholder="e.g. Sunday Worship Highlights" required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-church-500" />
                      </div>
                      
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Media Type</label>
                          <select name="type" defaultValue={item.type || 'image'} className="w-full p-2 border rounded-lg">
                              <option value="image">Image</option>
                              <option value="video">Video</option>
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Display Category</label>
                          <select name="category" defaultValue={item.category || 'Service'} className="w-full p-2 border rounded-lg">
                              <option value="Story">Story (Circle - 24h)</option>
                              <option value="Reel">Reel (Vertical Video)</option>
                              <option value="Service">Service Photo</option>
                              <option value="Event">Event Photo</option>
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Date Captured</label>
                          <input name="date" defaultValue={item.date || new Date().toISOString().split('T')[0]} placeholder="YYYY-MM-DD" required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-church-500" />
                      </div>
                      <div className="col-span-2">
                          <MediaUpload 
                            label="Upload Media"
                            initialUrl={item.url}
                            onUploadComplete={setUploadedImageUrl}
                            accept="image/*,video/*"
                            type="auto" // Cloudinary auto-detect
                          />
                          <input type="hidden" name="url" value={uploadedImageUrl} required />
                      </div>
                  </div>
              </>
          );
      }
      if (activeTab === 'books') {
          const item: Partial<Book> = editingItem || {};
          return (
              <>
                  <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                          <label className="block text-sm font-bold text-gray-700 mb-1">Book Title</label>
                          <input name="title" defaultValue={item.title} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-church-500" />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Author</label>
                          <input name="author" defaultValue={item.author} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-church-500" />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                          <input name="category" defaultValue={item.category} placeholder="e.g. Prayer, Faith" required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-church-500" />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Price ($)</label>
                          <input name="price" type="number" step="0.01" defaultValue={item.price} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-church-500" />
                      </div>
                      <div className="col-span-2">
                           <MediaUpload 
                            label="Cover Image"
                            initialUrl={item.imageUrl}
                            onUploadComplete={setUploadedImageUrl}
                          />
                          <input type="hidden" name="imageUrl" value={uploadedImageUrl} required />
                      </div>
                      <div className="col-span-2">
                          <MediaUpload 
                            label="Digital File (PDF/Epub)"
                            initialUrl={item.downloadUrl}
                            onUploadComplete={setUploadedResourceUrl}
                            accept="application/pdf"
                            type="raw" // Cloudinary 'raw' for documents
                          />
                          <input type="hidden" name="downloadUrl" value={uploadedResourceUrl} required />
                      </div>
                      <div className="col-span-2">
                          <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                          <textarea name="description" rows={3} defaultValue={item.description} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-church-500" />
                      </div>
                  </div>
              </>
          );
      }
  };

  const getList = () => {
      switch(activeTab) {
          case 'sermons': return sermons;
          case 'events': return events;
          case 'articles': return articles;
          case 'gallery': return galleryItems;
          case 'books': return books;
          default: return [];
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-20">
       <div className="max-w-7xl mx-auto px-4">
           
           <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
               <div>
                   <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-2">
                       <LayoutDashboard className="text-church-600" /> Admin Dashboard
                   </h1>
                   <p className="text-gray-500">Manage church content and database.</p>
               </div>
               <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-100 overflow-x-auto">
                   {['sermons', 'events', 'articles', 'gallery', 'books'].map((tab) => (
                       <button 
                        key={tab}
                        onClick={() => setActiveTab(tab as ContentType)} 
                        className={`px-4 py-2 rounded-md font-bold text-sm transition capitalize whitespace-nowrap ${activeTab === tab ? 'bg-church-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                       >
                           {tab}
                       </button>
                   ))}
               </div>
           </div>

           {/* Content List */}
           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                   <h2 className="text-lg font-bold text-gray-800 capitalize">{activeTab} Database</h2>
                   <button 
                    onClick={handleAddNew}
                    className="flex items-center gap-2 bg-church-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-church-700 transition"
                   >
                       <Plus size={16} /> Add New
                   </button>
               </div>
               
               <div className="overflow-x-auto">
                   <table className="w-full text-left">
                       <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold">
                           <tr>
                               <th className="px-6 py-4">Title</th>
                               <th className="px-6 py-4">Details</th>
                               <th className="px-6 py-4">Category</th>
                               <th className="px-6 py-4 text-right">Actions</th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100">
                           {getList().map((item: any) => (
                               <tr key={item.id} className="hover:bg-gray-50 transition">
                                   <td className="px-6 py-4 font-medium text-gray-900">
                                       <div className="flex items-center gap-3">
                                           {item.imageUrl && activeTab === 'books' && (
                                               <img src={item.imageUrl} alt="" className="w-8 h-12 object-cover rounded shadow-sm" />
                                           )}
                                           {item.title}
                                       </div>
                                   </td>
                                   <td className="px-6 py-4 text-gray-500 text-sm">
                                       {activeTab === 'books' ? `$${item.price.toFixed(2)}` : item.date}
                                   </td>
                                   <td className="px-6 py-4">
                                       <span className="bg-church-50 text-church-600 px-2 py-1 rounded text-xs font-bold uppercase">
                                           {item.category}
                                       </span>
                                   </td>
                                   <td className="px-6 py-4 text-right flex justify-end gap-2">
                                       <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit2 size={16} /></button>
                                       <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={16} /></button>
                                   </td>
                               </tr>
                           ))}
                           {getList().length === 0 && (
                               <tr>
                                   <td colSpan={4} className="px-6 py-8 text-center text-gray-400">No items found. Add one to get started.</td>
                               </tr>
                           )}
                       </tbody>
                   </table>
               </div>
           </div>

       </div>

       {/* Edit/Create Modal */}
       {isModalOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
               <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
                   <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                       <h3 className="text-xl font-bold text-gray-900">{editingItem ? 'Edit' : 'Add New'} {activeTab}</h3>
                       <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                   </div>
                   
                   <div className="p-6 overflow-y-auto">
                       <form id="contentForm" onSubmit={handleSave} className="space-y-4">
                           {renderForm()}
                       </form>
                   </div>

                   <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                       <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-lg font-bold text-gray-600 hover:bg-gray-200 transition">Cancel</button>
                       <button type="submit" form="contentForm" className="px-6 py-2 rounded-lg font-bold bg-church-600 text-white hover:bg-church-700 transition flex items-center gap-2">
                           <Save size={18} /> Save to Database
                       </button>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};

export default AdminDashboard;
