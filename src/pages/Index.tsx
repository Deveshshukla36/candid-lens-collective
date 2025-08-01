
import { useState, useEffect } from 'react';
import { usePhotos } from '@/context/PhotoContext';
import { useUser } from '@/context/UserContext';
import PhotoCard from '@/components/PhotoCard';
import UploadModal from '@/components/UploadModal';
import UserSetup from '@/components/UserSetup';
import { Button } from '@/components/ui/button';
import { Upload, Calendar, Camera, Users, User, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';

const Index = () => {
  const { getGlobalPhotos } = usePhotos();
  const { currentUser } = useUser();
  const globalPhotos = getGlobalPhotos();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isUserSetupOpen, setIsUserSetupOpen] = useState(false);

  useEffect(() => {
    // Check if user exists in localStorage, if not show setup
    const savedUser = localStorage.getItem('candid-lens-user');
    if (!savedUser && !currentUser) {
      setIsUserSetupOpen(true);
    }
  }, [currentUser]);

  const getDateRange = () => {
    if (globalPhotos.length === 0) return '';
    const dates = globalPhotos.map(p => new Date(p.uploadDate));
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 sm:space-x-6">
              <h1 className="text-lg sm:text-xl font-light tracking-tight text-foreground">
                CandidLens
              </h1>
              <div className="flex items-center space-x-2 sm:space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Camera className="w-4 h-4" />
                  <span className="hidden sm:inline">{globalPhotos.length} Photos</span>
                  <span className="sm:hidden">{globalPhotos.length}</span>
                </div>
                {globalPhotos.length > 0 && (
                  <div className="hidden sm:flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{getDateRange()}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                onClick={() => setIsUploadOpen(true)}
                size="sm"
                className="clean-button"
              >
                <Upload className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Upload</span>
              </Button>
            </div>
          </div>
          
          {/* Welcome message for mobile */}
          {currentUser && (
            <div className="mt-2 text-sm text-muted-foreground sm:hidden">
              Welcome, {currentUser.username}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {globalPhotos.length === 0 ? (
          <div className="text-center py-20">
            <Camera className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-lg mb-6">No global photos uploaded yet</p>
            <Button 
              onClick={() => setIsUploadOpen(true)}
              className="clean-button"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload your first photo
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
            {globalPhotos.map(photo => (
              <PhotoCard key={photo.id} photo={photo} showUserInfo={true} />
            ))}
          </div>
        )}
      </main>
      
      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
      />
      
      <UserSetup 
        isOpen={isUserSetupOpen} 
        onClose={() => setIsUserSetupOpen(false)} 
      />
      
      <Navigation />
    </div>
  );
};

export default Index;
