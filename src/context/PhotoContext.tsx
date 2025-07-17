
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
}

interface PhotoContextType {
  photos: PhotoData[];
  addPhoto: (photo: Omit<PhotoData, 'id' | 'likes' | 'isLiked' | 'uploadDate'>) => void;
  toggleLike: (id: string) => void;
  deletePhoto: (id: string) => void;
  updatePhoto: (id: string, updates: Partial<PhotoData>) => void;
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
  const [photos, setPhotos] = useState<PhotoData[]>([
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
      uploadDate: '2024-01-15'
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
      uploadDate: '2024-01-14'
    }
  ]);

  const addPhoto = (photoData: Omit<PhotoData, 'id' | 'likes' | 'isLiked' | 'uploadDate'>) => {
    const newPhoto: PhotoData = {
      ...photoData,
      id: Date.now().toString(),
      likes: 0,
      isLiked: false,
      uploadDate: new Date().toISOString().split('T')[0]
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

  return (
    <PhotoContext.Provider value={{ photos, addPhoto, toggleLike, deletePhoto, updatePhoto }}>
      {children}
    </PhotoContext.Provider>
  );
};
