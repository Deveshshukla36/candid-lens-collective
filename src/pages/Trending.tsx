
import { useState } from 'react';
import { usePhotos } from '@/context/PhotoContext';
import PhotoCard from '@/components/PhotoCard';
import UploadModal from '@/components/UploadModal';
import { Button } from '@/components/ui/button';
import { Upload, Calendar, Camera, TrendingUp, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';

const Trending = () => {
  const { getTrendingPhotos } = usePhotos();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  
  // Get trending photos (global photos sorted by likes)
  const trendingPhotos = getTrendingPhotos();
  
  const getDateRange = () => {
    if (trendingPhotos.length === 0) return '';
    const dates = trendingPhotos.map(p => new Date(p.uploadDate));
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 sm:space-x-6">
              <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Link>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-gray-900" />
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                  TRENDING
                </h1>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Camera className="w-4 h-4" />
                  <span className="hidden sm:inline">{trendingPhotos.length} Photos</span>
                  <span className="sm:hidden">{trendingPhotos.length}</span>
                </div>
                {trendingPhotos.length > 0 && (
                  <div className="hidden sm:flex items-center space-x-1">
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
              <Upload className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Upload</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {trendingPhotos.length === 0 ? (
          <div className="text-center py-20">
            <TrendingUp className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-6">No trending photos yet</p>
            <Button 
              onClick={() => setIsUploadOpen(true)}
              className="bg-black hover:bg-gray-800 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload a photo
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
            {trendingPhotos.map(photo => (
              <PhotoCard key={photo.id} photo={photo} showUserInfo={true} />
            ))}
          </div>
        )}
      </main>
      
      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
      />
      
      <Navigation />
    </div>
  );
};

export default Trending;
