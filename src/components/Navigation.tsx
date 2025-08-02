import { Link, useLocation } from 'react-router-dom';
import { Camera, TrendingUp, Users, Globe, User } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Camera, label: 'Photos' },
    { path: '/trending', icon: TrendingUp, label: 'Trending' },
    { path: '/global', icon: Globe, label: 'Global' },
    { path: '/groups', icon: Users, label: 'Groups' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200/50 z-50 animate-slide-up">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-around py-2">
          {navItems.map(({ path, icon: Icon, label }, index) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 relative ${
                  isActive 
                    ? 'text-black' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`relative ${isActive ? 'animate-pulse-soft' : ''}`}>
                  <Icon className={`w-6 h-6 transition-all duration-200 ${
                    isActive ? 'stroke-2' : 'stroke-1 hover:stroke-2'
                  }`} />
                  {isActive && (
                    <div className="absolute -inset-1 bg-black/5 rounded-full animate-scale-in" />
                  )}
                </div>
                <span className={`text-xs mt-1 font-medium transition-all duration-200 ${
                  isActive ? 'font-semibold' : ''
                }`}>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;