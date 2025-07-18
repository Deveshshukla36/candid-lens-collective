
import { useState } from 'react';
import { TrendingUp, Crown, Flame } from 'lucide-react';
import Navigation from '@/components/Navigation';
import PhotoCard from '@/components/PhotoCard';
import { usePhotos } from '@/context/PhotoContext';
import fujiSky from '@/assets/fuji-sky.jpg';

const Trending = () => {
  const { photos } = usePhotos();
  const [timeframe, setTimeframe] = useState('week');

  // Sort photos by likes (trending algorithm simulation)
  const trendingPhotos = [...photos].sort((a, b) => b.likes - a.likes);
  const topPhoto = trendingPhotos[0];
  const otherTrending = trendingPhotos.slice(1);

  return (
    <div className="min-h-screen relative">
      {/* Same sky background as main page */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${fujiSky})`,
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-blue-900/40"></div>
      </div>
      
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="font-rough text-3xl md:text-4xl mb-4 flex items-center justify-center gap-4 text-white drop-shadow-lg">
            <TrendingUp className="text-blue-200" size={40} />
            <span>Trending</span>
          </h1>
          <p className="text-lg text-blue-100 drop-shadow-lg">
            Discover the most loved photos in the community
          </p>
        </div>
        
        <div className="flex justify-center mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-lg">
            {['day', 'week', 'month'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  timeframe === period
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                    : 'text-blue-700 hover:text-blue-900'
                }`}
              >
                This {period}
              </button>
            ))}
          </div>
        </div>
        
        {topPhoto && (
          <div className="mb-12">
            <div className="text-center mb-6">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full shadow-lg">
                <Crown size={20} />
                <span className="font-medium">Photo of the {timeframe}</span>
              </div>
            </div>
            <div className="max-w-2xl mx-auto">
              <PhotoCard photo={topPhoto} />
            </div>
          </div>
        )}
        
        <div className="mb-6">
          <h2 className="font-rough text-2xl flex items-center gap-2 mb-4 text-white drop-shadow-lg">
            <Flame className="text-blue-200" size={24} />
            <span>Hot Right Now</span>
          </h2>
        </div>
        
        {otherTrending.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-blue-100 text-lg drop-shadow-lg">No trending photos yet. Be the first to upload!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherTrending.map(photo => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trending;
