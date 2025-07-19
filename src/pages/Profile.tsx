import { useState } from 'react';
import { usePhotos } from '@/context/PhotoContext';
import PhotoCard from '@/components/PhotoCard';
import UploadModal from '@/components/UploadModal';
import { Button } from '@/components/ui/button';
import { Upload, Calendar, Camera, Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { photos } = usePhotos();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // In a real app, this would be filtered by the current user's uploads
  const userPhotos = photos; // For now, showing all photos as user's photos
  
  const totalLikes = userPhotos.reduce((sum, photo) => sum + photo.likes, 0);
  
  const getDateRange = () => {
    if (userPhotos.length === 0) return '';
    const dates = userPhotos.map(p => new Date(p.uploadDate));
    const earliest = new Date(Math.min(...dates.map(d => d.getTime())));
    const latest = new Date(Math.max(...dates.map(d => d.getTime())));
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });
    };
    
    return `${formatDate(latest)} – ${formatDate(earliest)}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                MY PHOTOS
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Camera className="w-4 h-4" />
                  <span>{userPhotos.length} Photos</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{totalLikes} Likes</span>
                </div>
                {userPhotos.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{getDateRange()}</span>
                  </div>
                )}
              </div>
            </div>
            <Button 
              onClick={() => setIsUploadOpen(true)}
              size="sm"
              className="bg-black hover:bg-gray-800 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {userPhotos.length === 0 ? (
          <div className="text-center py-20">
            <Camera className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-2">You haven't uploaded any photos yet</p>
            <p className="text-gray-400 mb-6">Start building your photography portfolio</p>
            <Button 
              onClick={() => setIsUploadOpen(true)}
              className="bg-black hover:bg-gray-800 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload your first photo
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
            {userPhotos.map(photo => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>
        )}
      </main>
      
      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
      />
    </div>
  );
};

export default Profile;