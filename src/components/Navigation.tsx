
import { Link, useLocation } from 'react-router-dom';
import { Home, TrendingUp, User, Upload } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="font-rough text-2xl">
            <span className="lovable-gradient">PhotoShare</span>
          </Link>
          
          <div className="flex space-x-8">
            <Link 
              to="/" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive('/') 
                  ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Home size={20} />
              <span className="font-medium">Gallery</span>
            </Link>
            
            <Link 
              to="/trending" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive('/trending') 
                  ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <TrendingUp size={20} />
              <span className="font-medium">Trending</span>
            </Link>
            
            <Link 
              to="/profile" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive('/profile') 
                  ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <User size={20} />
              <span className="font-medium">Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
