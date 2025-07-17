
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import PhotoCard from '@/components/PhotoCard';
import UploadModal from '@/components/UploadModal';
import { usePhotos } from '@/context/PhotoContext';
import fujiSky from '@/assets/fuji-sky.jpg';

const Index = () => {
  const { photos } = usePhotos();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div className="min-h-screen relative">
      {/* Scrolling Sky Background */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${fujiSky})`,
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-blue-900/40"></div>
      </div>
      
      <Navigation onUploadClick={() => setIsUploadOpen(true)} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="text-center mb-12">
          <h1 className="font-rough text-5xl md:text-7xl mb-6 text-white drop-shadow-lg">
            Share Your Vision
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto drop-shadow-lg">
            Upload and discover high-quality photography with detailed camera information
          </p>
        </div>
        
        {photos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-blue-100 text-lg">No photos found. Upload your first photo!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
            {photos.map(photo => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>
        )}
      </div>
      
      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
      />
    </div>
  );
};

export default Index;
