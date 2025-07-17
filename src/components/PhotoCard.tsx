
import { Heart, Camera, Image, FileType, Filter, Calendar, User } from 'lucide-react';
import { PhotoData, usePhotos } from '@/context/PhotoContext';

interface PhotoCardProps {
  photo: PhotoData;
  showActions?: boolean;
}

const PhotoCard = ({ photo, showActions = true }: PhotoCardProps) => {
  const { toggleLike } = usePhotos();

  const handleLike = () => {
    toggleLike(photo.id);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative overflow-hidden">
        <img 
          src={photo.url} 
          alt={photo.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-rough text-xl text-gray-900">{photo.title}</h3>
          {showActions && (
            <button 
              onClick={handleLike}
              className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-200 transform hover:scale-105 ${
                photo.isLiked 
                  ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Heart 
                size={16} 
                className={photo.isLiked ? 'fill-current' : ''} 
              />
              <span className="text-sm font-medium">{photo.likes}</span>
            </button>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Camera size={14} />
              <span>{photo.camera}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Image size={14} />
              <span>{photo.pixels}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FileType size={14} />
              <span>{photo.format}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Filter size={14} />
              <span>{photo.filter}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <User size={14} />
              <span>{photo.uploadedBy}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar size={14} />
              <span>{photo.uploadDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;
