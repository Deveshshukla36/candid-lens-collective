import { useState } from 'react';
import { PhotoData } from '@/context/PhotoContext';
import { usePhotos } from '@/context/PhotoContext';
import { Heart, Camera, Eye, Download } from 'lucide-react';
import PhotoModal from '@/components/PhotoModal';

interface PhotoCardProps {
  photo: PhotoData;
  showActions?: boolean;
}

const PhotoCard = ({ photo, showActions = true }: PhotoCardProps) => {
  const { toggleLike } = usePhotos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleLike = () => {
    toggleLike(photo.id);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDownloading(true);
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${photo.title || 'photo'}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={photo.url} 
            alt={photo.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Eye className="text-white" size={20} />
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 text-blue-900">{photo.title}</h3>
          
          <div className="grid grid-cols-2 gap-2 text-sm text-blue-700 mb-3">
            <div className="flex items-center space-x-1">
              <Camera size={12} />
              <span className="truncate">{photo.camera}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="truncate">{photo.pixels}</span>
            </div>
            <div className="text-xs text-blue-600">
              {photo.format} • {photo.filter}
            </div>
            <div className="text-xs text-blue-600">
              by {photo.uploadedBy}
            </div>
          </div>
        </div>
        
        {showActions && (
          <div className="p-4 border-t bg-blue-50/30">
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all duration-200 ${
                  photo.isLiked 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-200'
                }`}
              >
                <Heart size={16} className={photo.isLiked ? 'fill-current' : ''} />
                <span className="text-sm font-medium">{photo.likes}</span>
              </button>
              
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white text-blue-600 hover:bg-blue-50 border border-blue-200 transition-all duration-200 disabled:opacity-50"
              >
                <Download size={16} />
                <span className="text-sm font-medium">
                  {isDownloading ? 'Downloading...' : 'Download'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
      
      <PhotoModal 
        photo={photo}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default PhotoCard;