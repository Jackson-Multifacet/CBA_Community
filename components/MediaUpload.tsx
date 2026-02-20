import React, { useState, useRef } from 'react';
import { UploadCloud, X, Loader2, Image as ImageIcon, FileText, CheckCircle } from 'lucide-react';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../src/config';

interface MediaUploadProps {
  label: string;
  initialUrl?: string;
  onUploadComplete: (url: string) => void;
  accept?: string; // e.g. "image/*", "video/*", "application/pdf"
  type?: 'image' | 'video' | 'raw' | 'auto'; // Cloudinary resource type
}

const MediaUpload: React.FC<MediaUploadProps> = ({ 
  label, 
  initialUrl, 
  onUploadComplete, 
  accept = "image/*",
  type = 'image'
}) => {
  const [preview, setPreview] = useState<string | null>(initialUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError(null);

    // Create local preview immediately
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET); 
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${type}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      const secureUrl = data.secure_url;
      
      setPreview(secureUrl);
      onUploadComplete(secureUrl);
    } catch (err) {
      console.error(err);
      setError('Failed to upload. Please try again.');
      setPreview(initialUrl || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    setPreview(null);
    onUploadComplete('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const shouldRenderVideo = type === 'video' || (type === 'auto' && preview && (preview.match(/\.(mp4|webm|ogg|mov)$/i) || preview.startsWith('blob:')));

  return (
    <div className="mb-4">
      <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
      
      {!preview ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${isUploading ? 'bg-gray-50 border-gray-300' : 'border-gray-300 hover:border-church-500 hover:bg-church-50'}`}
        >
          {isUploading ? (
            <Loader2 className="animate-spin text-church-600 mb-2" size={32} />
          ) : (
            <UploadCloud className="text-gray-400 mb-2" size={32} />
          )}
          <p className="text-sm font-medium text-gray-600">
            {isUploading ? 'Uploading...' : 'Click to upload or drag & drop'}
          </p>
          <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-wider">
            {accept === 'application/pdf' ? 'PDF Documents' : 'JPG, PNG, MP4'}
          </p>
        </div>
      ) : (
        <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
           {/* Preview Logic based on file type */}
           {accept === 'application/pdf' ? (
             <div className="flex items-center gap-4 p-4">
               <div className="bg-red-100 p-3 rounded-lg text-red-600">
                 <FileText size={24} />
               </div>
               <div className="flex-1 overflow-hidden">
                 <p className="text-sm font-bold text-gray-800 truncate">Document Uploaded</p>
                 <a href={preview} target="_blank" rel="noreferrer" className="text-xs text-church-600 hover:underline">View File</a>
               </div>
               <div className="text-green-500">
                 <CheckCircle size={20} />
               </div>
             </div>
           ) : (
             <div className="relative aspect-video bg-black/5">
                {shouldRenderVideo ? (
                  <video src={preview} className="w-full h-full object-contain" controls />
                ) : (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                )}
             </div>
           )}

           <button 
             onClick={handleRemove}
             className="absolute top-2 right-2 bg-white text-red-500 p-1.5 rounded-full shadow-md hover:bg-red-50 transition z-10"
             title="Remove file"
           >
             <X size={16} />
           </button>
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

      <input 
        type="hidden" 
        name="mediaUrl" 
      />
      
      <input 
        ref={fileInputRef}
        type="file" 
        accept={accept}
        onChange={handleFileChange}
        className="hidden" 
      />
    </div>
  );
};

export default MediaUpload;