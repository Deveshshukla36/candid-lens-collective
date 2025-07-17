
import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import Navigation from '@/components/Navigation';
import PhotoCard from '@/components/PhotoCard';
import UploadModal from '@/components/UploadModal';
import { usePhotos } from '@/context/PhotoContext';

const Index = () => {
  const { photos } = usePhotos();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPhotos = photos.filter(photo =>
    photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    photo.camera.toLowerCase().includes(searchTerm.toLowerCase()) ||
    photo.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="font-rough text-4xl md:text-6xl mb-4">
            <span className="lovable-gradient">Share Your Vision</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload and discover high-quality photography with detailed camera information
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search photos, cameras, or photographers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="bg-gradient-to-r from-pink-500 to-violet-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Upload Photo</span>
          </button>
        </div>
        
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No photos found. Upload your first photo!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map(photo => (
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
