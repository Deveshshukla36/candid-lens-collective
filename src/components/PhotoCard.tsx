import { useState } from 'react';
import { PhotoData } from '@/context/PhotoContext';
import PhotoModal from './PhotoModal';

interface PhotoCardProps {
  photo: PhotoData;
}

const PhotoCard = ({ photo }: PhotoCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div 
        className="aspect-square cursor-pointer group overflow-hidden bg-gray-100"
        onClick={() => setIsModalOpen(true)}
      >
        <img 
          src={photo.url} 
          alt={photo.title}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          loading="lazy"
        />
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