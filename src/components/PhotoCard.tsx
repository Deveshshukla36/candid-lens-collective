import { useState, useRef } from 'react';
import { PhotoData, usePhotos } from '@/context/PhotoContext';
import { useUser } from '@/context/UserContext';
import PhotoModal from './PhotoModal';
import { Heart, CheckCircle } from 'lucide-react';

interface PhotoCardProps {
  photo: PhotoData;
  showUserInfo?: boolean;
}

const PhotoCard = ({ photo, showUserInfo = false }: PhotoCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toggleLike } = usePhotos();
  const { currentUser } = useUser();
  const lastTapRef = useRef<number>(0);

  const handleDoubleTap = (e: React.MouseEvent) => {
    const now = Date.now();
    const timeDiff = now - lastTapRef.current;
    
    if (timeDiff < 300 && timeDiff > 0) {
      e.stopPropagation();
      toggleLike(photo.id);
    } else {
      setTimeout(() => {
        if (Date.now() - lastTapRef.current >= 300) {
          setIsModalOpen(true);
        }
      }, 300);
    }
    lastTapRef.current = now;
  };

  const renderUserInfo = () => {
    if (!showUserInfo) return null;
    
    const isAdmin = photo.uploadedBy === 'Devesh';
    
    return (
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-white">
            <span className="text-sm font-medium">@{photo.uploadedBy}</span>
            {isAdmin && (
              <CheckCircle className="w-4 h-4 text-gray-400" />
            )}
          </div>
          <div className="flex items-center space-x-1 text-white">
            <Heart className={`w-4 h-4 ${photo.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            <span className="text-sm">{photo.likes}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div 
        className="aspect-square cursor-pointer group overflow-hidden bg-gray-100 relative"
        onClick={handleDoubleTap}
      >
        <img 
          src={photo.url} 
          alt={photo.title}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          loading="lazy"
        />
        {renderUserInfo()}
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