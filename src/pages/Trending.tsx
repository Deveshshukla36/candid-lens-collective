
import { useState } from 'react';
import { TrendingUp, Crown, Flame } from 'lucide-react';
import Navigation from '@/components/Navigation';
import PhotoCard from '@/components/PhotoCard';
import { usePhotos } from '@/context/PhotoContext';

const Trending = () => {
  const { photos } = usePhotos();
  const [timeframe, setTimeframe] = useState('week');

  // Sort photos by likes (trending algorithm simulation)
  const trendingPhotos = [...photos].sort((a, b) => b.likes - a.likes);
  const topPhoto = trendingPhotos[0];
  const otherTrending = trendingPhotos.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="font-rough text-4xl md:text-6xl mb-4 flex items-center justify-center gap-4">
            <TrendingUp className="text-pink-500" size={48} />
            <span className="lovable-gradient">Trending</span>
          </h1>
          <p className="text-xl text-gray-600">
            Discover the most loved photos in the community
          </p>
        </div>
        
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            {['day', 'week', 'month'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  timeframe === period
                    ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
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
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full">
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
          <h2 className="font-rough text-2xl flex items-center gap-2 mb-4">
            <Flame className="text-orange-500" size={24} />
            <span>Hot Right Now</span>
          </h2>
        </div>
        
        {otherTrending.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No trending photos yet. Be the first to upload!</p>
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
