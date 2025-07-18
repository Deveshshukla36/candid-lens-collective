import { useState } from 'react';
import { X, Download, Heart, Camera, Eye, Calendar, User } from 'lucide-react';
import { PhotoData } from '@/context/PhotoContext';
import { usePhotos } from '@/context/PhotoContext';
import { Button } from '@/components/ui/button';

interface PhotoModalProps {
  photo: PhotoData;
  isOpen: boolean;
  onClose: () => void;
}

const PhotoModal = ({ photo, isOpen, onClose }: PhotoModalProps) => {
  const { toggleLike } = usePhotos();
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
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

  const handleLike = () => {
    toggleLike(photo.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative max-w-6xl max-h-[90vh] w-full mx-4 bg-white rounded-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-500/10 to-white">
          <h2 className="text-xl font-semibold text-blue-900 truncate">{photo.title}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-blue-700 hover:bg-blue-100"
          >
            <X size={20} />
          </Button>
        </div>
        
        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-120px)]">
          {/* Image */}
          <div className="flex-1 flex items-center justify-center bg-blue-50/30 p-4">
            <img
              src={photo.url}
              alt={photo.title}
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
            />
          </div>
          
          {/* Info Panel */}
          <div className="lg:w-80 bg-white border-l border-blue-100 flex flex-col">
            {/* Action Buttons */}
            <div className="p-4 border-b border-blue-100 bg-blue-50/20">
              <div className="flex gap-2">
                <Button
                  onClick={handleLike}
                  variant={photo.isLiked ? "default" : "outline"}
                  className={`flex-1 ${photo.isLiked 
                    ? "bg-blue-500 hover:bg-blue-600 text-white" 
                    : "border-blue-200 text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  <Heart size={16} className={photo.isLiked ? "fill-current" : ""} />
                  {photo.likes}
                </Button>
                <Button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Download size={16} />
                  {isDownloading ? 'Downloading...' : 'Download'}
                </Button>
              </div>
            </div>
            
            {/* Photo Details */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-blue-800">
                  <Camera size={16} />
                  <span className="font-medium">Camera Info</span>
                </div>
                <div className="text-sm text-blue-700 bg-blue-50/50 p-3 rounded-lg">
                  <p><strong>Camera:</strong> {photo.camera}</p>
                  <p><strong>Resolution:</strong> {photo.pixels}</p>
                  <p><strong>Format:</strong> {photo.format}</p>
                  <p><strong>Frame Size:</strong> {photo.frameSize}</p>
                  {photo.filter && <p><strong>Filter:</strong> {photo.filter}</p>}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-blue-800">
                  <Eye size={16} />
                  <span className="font-medium">Photo Stats</span>
                </div>
                <div className="text-sm text-blue-700 bg-blue-50/50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span>Likes</span>
                    <span className="font-semibold">{photo.likes}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-blue-800">
                  <User size={16} />
                  <span className="font-medium">Upload Info</span>
                </div>
                <div className="text-sm text-blue-700 bg-blue-50/50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span>Uploaded by</span>
                    <span className="font-semibold">{photo.uploadedBy}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Calendar size={14} />
                    <span>{new Date(photo.uploadDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;