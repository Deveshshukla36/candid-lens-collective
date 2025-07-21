
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface PhotoData {
  id: string;
  url: string;
  title: string;
  camera: string;
  pixels: string;
  frameSize: string;
  format: string;
  filter: string;
  likes: number;
  isLiked: boolean;
  uploadedBy: string;
  uploadDate: string;
  isGlobal?: boolean;
  groupId?: string;
}

interface PhotoContextType {
  photos: PhotoData[];
  addPhoto: (photo: Omit<PhotoData, 'id' | 'likes' | 'isLiked' | 'uploadDate'>) => void;
  toggleLike: (id: string) => void;
  deletePhoto: (id: string) => void;
  updatePhoto: (id: string, updates: Partial<PhotoData>) => void;
  getGlobalPhotos: () => PhotoData[];
  getTrendingPhotos: () => PhotoData[];
  getUserPhotos: (username: string) => PhotoData[];
  getGroupPhotos: (groupId: string) => PhotoData[];
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export const usePhotos = () => {
  const context = useContext(PhotoContext);
  if (!context) {
    throw new Error('usePhotos must be used within a PhotoProvider');
  }
  return context;
};

export const PhotoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [photos, setPhotos] = useState<PhotoData[]>(() => {
    const savedPhotos = localStorage.getItem('candid-lens-photos');
    return savedPhotos ? JSON.parse(savedPhotos) : [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop',
      title: 'Urban Portrait',
      camera: 'Canon EOS R5',
      pixels: '8256x5504',
      frameSize: '45.7 MP',
      format: 'RAW + JPEG',
      filter: 'Natural Color',
      likes: 24,
      isLiked: false,
      uploadedBy: 'photographer_one',
      uploadDate: '2024-01-15',
      isGlobal: true
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop',
      title: 'Tech Workspace',
      camera: 'Sony A7R IV',
      pixels: '6000x4000',
      frameSize: '61.0 MP',
      format: 'RAW',
      filter: 'High Contrast',
      likes: 18,
      isLiked: false,
      uploadedBy: 'tech_lover',
      uploadDate: '2024-01-14',
      isGlobal: true
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=800&h=600&fit=crop',
      title: 'Starry Night',
      camera: 'Nikon D850',
      pixels: '8256x5504',
      frameSize: '45.7 MP',
      format: 'RAW',
      filter: 'Night Mode',
      likes: 42,
      isLiked: false,
      uploadedBy: 'astro_photographer',
      uploadDate: '2024-01-13',
      isGlobal: true
    },
    {
      id: '4',
      url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop',
      title: 'Mountain Summit',
      camera: 'Canon EOS R6',
      pixels: '5472x3648',
      frameSize: '20.1 MP',
      format: 'RAW + JPEG',
      filter: 'Landscape',
      likes: 36,
      isLiked: false,
      uploadedBy: 'mountain_climber',
      uploadDate: '2024-01-12',
      isGlobal: true
    },
    {
      id: '5',
      url: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=800&h=600&fit=crop',
      title: 'River Valley',
      camera: 'Sony A7 III',
      pixels: '6000x4000',
      frameSize: '24.2 MP',
      format: 'RAW',
      filter: 'Vivid Color',
      likes: 28,
      isLiked: false,
      uploadedBy: 'nature_lover',
      uploadDate: '2024-01-11',
      isGlobal: true
    },
    {
      id: '6',
      url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&h=600&fit=crop',
      title: 'Rocky Mountain Landscape',
      camera: 'Fujifilm X-T4',
      pixels: '6240x4160',
      frameSize: '26.1 MP',
      format: 'RAW',
      filter: 'Classic Chrome',
      likes: 31,
      isLiked: false,
      uploadedBy: 'fuji_enthusiast',
      uploadDate: '2024-01-10',
      isGlobal: true
    },
    {
      id: '7',
      url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop',
      title: 'Ocean Sunset',
      camera: 'Canon EOS 5D Mark IV',
      pixels: '6720x4480',
      frameSize: '30.4 MP',
      format: 'RAW + JPEG',
      filter: 'Warm Tone',
      likes: 45,
      isLiked: false,
      uploadedBy: 'sunset_chaser',
      uploadDate: '2024-01-09',
      isGlobal: true
    },
    {
      id: '8',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      title: 'Fuji Film Sky',
      camera: 'Fujifilm X100V',
      pixels: '6000x4000',
      frameSize: '26.1 MP',
      format: 'JPEG',
      filter: 'Classic Neg',
      likes: 52,
      isLiked: false,
      uploadedBy: 'film_aesthetic',
      uploadDate: '2024-01-08',
      isGlobal: true
    }
  ];
  });

  // Save photos to localStorage whenever photos change
  React.useEffect(() => {
    localStorage.setItem('candid-lens-photos', JSON.stringify(photos));
  }, [photos]);

  const addPhoto = (photoData: Omit<PhotoData, 'id' | 'likes' | 'isLiked' | 'uploadDate'>) => {
    const newPhoto: PhotoData = {
      ...photoData,
      id: Date.now().toString(),
      likes: 0,
      isLiked: false,
      uploadDate: new Date().toISOString().split('T')[0],
      isGlobal: photoData.isGlobal ?? true
    };
    setPhotos(prev => [newPhoto, ...prev]);
  };

  const toggleLike = (id: string) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === id 
        ? { 
            ...photo, 
            isLiked: !photo.isLiked,
            likes: photo.isLiked ? photo.likes - 1 : photo.likes + 1
          }
        : photo
    ));
  };

  const deletePhoto = (id: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
  };

  const updatePhoto = (id: string, updates: Partial<PhotoData>) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === id ? { ...photo, ...updates } : photo
    ));
  };

  const getGlobalPhotos = () => {
    return photos.filter(photo => photo.isGlobal);
  };

  const getTrendingPhotos = () => {
    const globalPhotos = photos.filter(photo => photo.isGlobal);
    return globalPhotos.sort((a, b) => {
      // Admin photos (Devesh) always come first
      const aIsAdmin = a.uploadedBy === 'Devesh';
      const bIsAdmin = b.uploadedBy === 'Devesh';
      
      if (aIsAdmin && !bIsAdmin) return -1;
      if (!aIsAdmin && bIsAdmin) return 1;
      
      // Then sort by likes (highest first)
      return b.likes - a.likes;
    });
  };

  const getUserPhotos = (username: string) => {
    return photos.filter(photo => photo.uploadedBy === username);
  };

  const getGroupPhotos = (groupId: string) => {
    return photos.filter(photo => photo.groupId === groupId);
  };

  return (
    <PhotoContext.Provider value={{ 
      photos, 
      addPhoto, 
      toggleLike, 
      deletePhoto, 
      updatePhoto,
      getGlobalPhotos,
      getTrendingPhotos,
      getUserPhotos,
      getGroupPhotos
    }}>
      {children}
    </PhotoContext.Provider>
  );
};
