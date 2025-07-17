
import { Link, useLocation } from 'react-router-dom';
import { Home, TrendingUp, User, Plus } from 'lucide-react';

const Navigation = ({ onUploadClick }: { onUploadClick?: () => void }) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="font-rough text-2xl">
            <span className="text-white">PhotoShare</span>
          </Link>
          
          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive('/') 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Home size={20} />
              <span className="font-medium">Gallery</span>
            </Link>
            
            <Link 
              to="/trending" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive('/trending') 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <TrendingUp size={20} />
              <span className="font-medium">Trending</span>
            </Link>
            
            <Link 
              to="/profile" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive('/profile') 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <User size={20} />
              <span className="font-medium">Profile</span>
            </Link>
            
            {onUploadClick && (
              <button
                onClick={onUploadClick}
                className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all duration-200"
              >
                <Plus size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
